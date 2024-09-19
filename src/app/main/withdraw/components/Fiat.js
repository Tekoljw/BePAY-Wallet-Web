import { useState, useEffect, default as React, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../../store/user";
import { getListBank } from "../../../store/user/userThunk";
import { makeWithdrawOrder, getFiatFee, payoutBank, payoutPayWays } from "../../../store/payment/paymentThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../../components/StyledAccordionSelect";
import { selectConfig } from "../../../store/config";
import { arrayLookup, getNowTime } from "../../../util/tools/function";
import { openScan, closeScan } from "../../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, getWithdrawHistoryAddress, getWithdrawTransferStats, createPin, verifyPin } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import history from '@history';
import DialogTitle from "@mui/material/DialogTitle";
import Enable2FA from "../../2fa/Enable2FA";
import { getCryptoDisplay, getFiatDisplay } from "../../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import AnimateModal from "../../../components/FuniModal";
import InputLabel from '@mui/material/InputLabel';
import FuseLoading from '@fuse/core/FuseLoading';


const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function Fiat(props) {
    const { fiatVerifiedAuth } = props;
    const { t } = useTranslation('mainPage');
    const [openTiBi, setOpenTiBi] = useState(false);
    const [withdrawOrderID, setWithdrawOrderID] = useState('');
    const [openLoad, setOpenLoad] = useState(false);
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const dispatch = useDispatch();
    const [openPasteWindow, setOpenPasteWindow] = useState(false);
    const [faitSendId, setFaitSendId] = useState('');
    const [inputVal, setInputVal] = useState({
        cardName: '',
        pixId: '',
        cardNo: '',
        amount: '',
        accountNo: '',
        accountName: '',
        bankName: '',
        mobile: '',
        email: '',
        description: '',
        userId: '',
    });


    const handleChangeUserIDVal = (valueNum) => {
        inputVal.userId = valueNum;
    };

    const handleChangeInputVal = (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };
    const changeAllInput = (value) => {
        let tmpInputVal = { ...inputVal, ...value };
        setInputVal(tmpInputVal);
    };
    const [historyAddress, setHistoryAddress] = useState([]);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const config = useSelector(selectConfig);
    const mounted = useRef();
    const [smallTabValue, setSmallTabValue] = useState(0);
    const [accountType, setAccountType] = useState('CPF');
    const [openChangeCurrency, setOpenChangeCurrency] = useState(false);
    const userData = useSelector(selectUserData);
    const loginType = window.localStorage.getItem('loginType') ?? userData?.userInfo?.loginType;
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [openGoogleCode, setOpenGoogleCode] = useState(false);
    const [googleCode, setGoogleCode] = useState('');
    const [openSuccess, setOpenSuccess] = useState(true);

    const startScanQRCode = () => {
        openScan((result, err) => {
            if (result && result.text && result.text.length > 0) {
                console.log("openScan", result);
                handleChangeUserIDVal(result.text)
                closeScan();
                setOpenChangeCurrency(false);
            }

            if (err) {
                console.error(err);
                closeScan();
                setOpenChangeCurrency(false);
            }
        }, false, (err) => {
            console.log(`error错误: ${err}`);
            dispatch(showMessage({ message: t('error_2'), code: 2 }));
            setOpenChangeCurrency(false);
            closeScan();
        });
    };


    const changeToBlack = (target) => {
        document.getElementById(target.target.id).classList.add('pinJianPanColor1');
    };

    const changeToWhite = (target) => {
        document.getElementById(target.target.id).classList.remove('pinJianPanColor1');
    };

    const handleChangeAccountType = (event) => {
        setAccountType(event.target.value);
    };

    const getBankID = (currencyCode) => {
        var result = bankList[currencyCode]?.[bankId]?.bankCode ?? '';

        return result
    }

    const getEntryType = (currencyCode) => {
        var result = payoutList[currencyCode][entryType].wayCode;

        return result
    }

    const openGoogleCodeFunc = () => {
        setOpenGoogleCode(true);
        setTimeout(() => {
            document.getElementById('GoogleCodeSty').classList.add('PinMoveAni');
        }, 0);
    }


    const closeGoogleCodeFunc = () => {
        document.getElementById('GoogleCodeSty').classList.remove('PinMoveAni');
        document.getElementById('GoogleCodeSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenGoogleCode(false);
        }, 300);
    };

    const closeCreatePinFunc = () => {
        document.getElementById('CreateSty').classList.remove('PinMoveAni');
        document.getElementById('CreateSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setCreatePinWindow(false)
        }, 300);
        setPin('');
    };

    const handleSubmit = () => {
        setOpenLoad(true)
        setIsLoadingBtn(true)
        if (smallTabValue === 1) {
            let data = {
                currency: currencyCode,
                transferUserId: inputVal.userId,
                amount: inputVal.amount,
                transferType: 1,
                checkCode: googleCode
            };
            dispatch(makeWithdrawOrder(data)).then((res) => {
                setOpenLoad(false)
                setGoogleCode('');
                setIsLoadingBtn(false)
                let result = res.payload;
                if (result.errno === 0) {
                    if (result?.data && result?.data?.status != 'fail') {
                        setFaitSendId(result?.data?.transactionId)
                        setOpenSuccess(false)
                        setTimeout(() => {
                            setZhuanQuan(false);
                            setTiJiaoState(1);
                        }, 1200);
                    } else {
                        setOpenSuccess(false)
                        setTimeout(() => {
                            setZhuanQuan(false);
                            setTiJiaoState(2);
                        }, 1200);
                    }
                } else if (result.errno === -2) {
                    if (!hasAuthGoogle) {
                        setOpenAnimateModal(true);
                        return;
                    }else{
                        openGoogleCodeFunc()
                        return
                    }
                } else {
                    setOpenSuccess(false)
                    setTimeout(() => {
                        setZhuanQuan(false);
                        setTiJiaoState(2);
                    }, 1200);
                }
            });
        } else {
            let entryType = getEntryType(currencyCode)
            let bankName = ''
            if (entryType === 'MMK_TRANSFER_KBZ') {
                bankName = 'KBZ_Pay'
            } else if (entryType === 'MMK_TRANSFER_WAVEMONEY') {
                bankName = 'WAVE_MONEY'
            }
            let data = {
                currency: currencyCode,
                amount: inputVal.amount,
                entryType: entryType,
                checkCode: googleCode,
                channelExtra: JSON.stringify({
                    accountNo: inputVal.accountNo,
                    accountName: inputVal.accountName,
                    bankcode: getBankID(currencyCode),
                    bankName: bankName,
                    mobile: inputVal.mobile,
                    email: inputVal.email,
                    description: inputVal.description,
                }),
            };
            dispatch(makeWithdrawOrder(data)).then((res) => {
                setGoogleCode('')
                setIsLoadingBtn(false)
                setOpenLoad(false)
                let result = res.payload;
                if (result.errno === 0) {
                    if (result?.data && result?.data?.status != 'fail') {
                        setOpenSuccess(false)
                        setFaitSendId(result.data.transactionId)
                        setTimeout(() => {
                            setZhuanQuan(false);
                            setTiJiaoState(1);
                        }, 1200);
                    } else {
                        setOpenSuccess(false)
                        setTimeout(() => {
                            setZhuanQuan(false);
                            setTiJiaoState(2);
                        }, 1200);
                    }
                } else if (result.errno === -2) {
                    if (!hasAuthGoogle) {
                        setOpenAnimateModal(true);
                        return;
                    }
                    openGoogleCodeFunc()
                    return
                } else {
                    setOpenSuccess(false)
                    setTimeout(() => {
                        setZhuanQuan(false);
                        setTiJiaoState(2);
                    }, 1200);
                }
            });
        }
    };

    useEffect( ()=>{
        if(fiatVerifiedAuth){
            setOpenGoogleCode(true);
        }
    }, [fiatVerifiedAuth])

    useEffect(() => {
        dispatch(getListBank()).then((res) => {
            let result = res.payload;
            if (result) {
                setHistoryAddress(result);
            }
        });
    }, []);

    useEffect(() => {
        if (googleCode.length === 6) {
            setOpenGoogleCode(false);
            handleSubmit();
        }

    }, [googleCode]);

    useEffect(() => {
        if (openChangeCurrency) {
            console.log(openChangeCurrency);
            console.log('startScanQRCode');
            setTimeout(() => {
                startScanQRCode();
            }, 500);
        }
    }, [openChangeCurrency]);

    const fiatData = userData.fiat || [];
    const paymentFiat = config.payment?.currency;
    const [fiatDisplayData, setFiatDisplayData] = useState([]);
    const [fiats, setFiats] = useState([]);
    const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || 'USD');
    const [fee, setFee] = useState(0);
    const [fiatsSelected, setFiatsSelected] = useState(0);
    const [bankId, setBankId] = useState(0);
    const [bankList, setBankList] = useState({});

    const [entryType, setEntryType] = useState(0);
    const [payoutList, setPayoutList] = useState({});
    const [textSelect, setTextSelect] = useState(false);
    const [showGuangBiao, setShowGuangBiao] = useState(false);

    const [transferState, setTransferState] = useState([]);
    const [withDrawOrderID, setWithDrawOrderID] = useState('');
    const [openPaste, setOpenPaste] = useState(false);
    const walletData = useSelector(selectUserData).wallet;
    const transferStats = useSelector(selectUserData).transferStats;
    const symbols = config.symbols;
    const hasAuthGoogle = useSelector(selectUserData).userInfo?.hasAuthGoogle
    const [resetTabValue, setResetTabValue] = useState(0);

    const [openYanZheng, setOpenYanZheng] = useState(false);
    const [openPinWindow, setOpenPinWindow] = useState(false);
    const [movePinWindow, setMovePinWindow] = useState(false);
    const [createPinWindow, setCreatePinWindow] = useState(false);
    const [openPinErr, setOpenPinErr] = useState(false);
    const [inputIDVal, setInputIDVal] = useState('');
    const [divHeight, setDivHeight] = useState(0);
    const [zhuanQuan, setZhuanQuan] = useState(true);
    const [tiJiaoState, setTiJiaoState] = useState(0);
    const [correctPin, setCorrectPin] = useState(false);

    const [tabValue, setTabValue] = useState(0);
    const [ranges, setRanges] = useState([
        t('home_deposite_1'), t('home_deposite_2')
        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
    ]);
    const [cryptoSelect, setCryptoSelect] = useState(0);
    const [fiatSelect, setFiatSelect] = useState(1);


    const [pin, setPin] = useState('');
    const [hasPin, setHasPin] = useState(false)


    const handleChangeInputVal2 = (event) => {
        setInputIDVal(event.target.value);
    };

    const openPinFunc = () => {
        setTimeout(() => {
            document.getElementById('PINSty').classList.add('PinMoveAni');
        }, 0);
    };

    const openPasteFunc = () => {
        setTimeout(() => {
            document.getElementById('PasteSty').classList.add('PinMoveAni');
        }, 0);
    };

    // 判断是否绑定了PIN
    const isBindPin = () => {
        if (hasPin) {
            if (inputVal.amount <= 0) {
                setTextSelect(true)
                setShowGuangBiao(true)
            } else {
                setTextSelect(false)
                setShowGuangBiao(false)
            }
            openInputPin()
            return true
        }
        openCreatePin()
        return false
    }

    const getDivHeight = (divName) => {
        setTimeout(() => {
            setDivHeight(document.getElementById(divName).offsetHeight)
        }, 300);
    };

    // 输入PIN Page
    const openInputPin = () => {
        setPin('')
        setOpenPinWindow(true)
        getDivHeight("pinDivHeight");
        openPinFunc()
    }

    // 创建PIN Page
    const openCreatePin = () => {
        setPin('')
        setCreatePinWindow(true)
        openCreatePinFunc()
    }

    const openCreatePinFunc = () => {
        setTimeout(() => {
            document.getElementById('CreateSty').classList.add('PinMoveAni');
        }, 0);
    };

    // PIN错误 Tips
    const errPin = () => {
        setOpenPinErr(true);
        setOpenPinWindow(false);
    }

    // 修改Amount
    const editAmount = (text) => {
        let tmpText = inputVal.amount.toString()
        if (tmpText == 0) {
            tmpText = ''
        }
        if (text === -1) {
            tmpText = tmpText.slice(0, -1)
        } else if (text === '.') {
            if (!tmpText.includes(text)) {
                tmpText = tmpText + text
            }
        } else {
            tmpText = tmpText + text
        }

        setInputVal({ ...inputVal, amount: tmpText == 0 ? '' : tmpText });
    }
    
    // 输入Pin
    const handleDoPin = (text) => {
        if (textSelect) {
            editAmount(text)
            return
        }
        let tmpPin = pin
        if (text === -1) {
            tmpPin = tmpPin.slice(0, -1)
        } else {
            tmpPin = tmpPin + text
        }

        setPin(tmpPin)
        if (tmpPin.length === 6) {
            if (hasPin) { // 验证pin
                dispatch(verifyPin({
                    paymentPassword: tmpPin
                })).then((res) => {
                    let result = res.payload
                    if (!result.paymentPasswordSuccess) {
                        setCorrectPin(false);
                        errPin()
                    } else {
                        setCorrectPin(true);
                    }
                })
            }
            // } else { // 创建pin
            //     dispatch(createPin({
            //         paymentPassword: tmpPin
            //     })).then((res) => {
            //         if (res.payload) {
            //             setHasPin(true)
            //             closeCreatePinFunc()
            //         }
            //     })
            // }
        }
    }

    const getSettingSymbol = async () => {
        return {}
        var openAppId = getOpenAppId();
        var openIndex = getOpenAppIndex();
        const service = axios.create({
            timeout: 50000, // request timeout
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Finger-Nft-Token": window.localStorage.getItem(`Authorization-${openAppId}-${openIndex}`) || "",
            },
        });
        var post = {
            url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/getUserSetting`,
            method: "post",
            // data: qs.stringify(data),
            async: true,
        };

        let res = await service(post);
        console.log(res, 'res........');
        if (res.data.errno === 0) {
        }

        return res;
    };

    useEffect(() => {
        getSettingSymbol().then((res) => {
            var currencyType = res.data?.data?.setting?.currencyType
            console.log(currencyType);
            if (loginType !== "telegram_web_app") {
                if (currencyType) {
                    if (currencyType == 1) {
                        tmpRanges = [
                            t('home_deposite_1'), t('home_deposite_2')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        console.log('存在.......');
                        var tmpRanges = [
                            t('home_deposite_2'), t('home_deposite_1')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        var tmpCryptoSelect = 1;
                        var tmpFiatSelect = 0;
                    }
                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                }
                else if (userData.profile?.loginType !== "unknown") {
                    var tmpRanges = [
                        t('home_deposite_2'), t('home_deposite_1')
                        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                    ];
                    var tmpCryptoSelect = 1;
                    var tmpFiatSelect = 0;
                    if (userData.profile.wallet?.Crypto < userData.profile.wallet?.Fiat) {
                    } else if (userData.profile.wallet?.Crypto > userData.profile.wallet?.Fiat) {
                        tmpRanges = [
                            t('home_deposite_1'), t('home_deposite_2')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        if (userData.profile?.loginType === "web3_wallet") {
                            tmpRanges = [
                                t('home_deposite_1'), t('home_deposite_2')
                                // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                            ];
                            tmpCryptoSelect = 0;
                            tmpFiatSelect = 1;
                        }
                    }
                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                }
            }
        })

        setHasPin(userData.profile?.user?.hasSetPaymentPassword ?? false)

    }, [userData.profile]);

    // select切换
    const handleChangeFiats = (event) => {
        setFiatsSelected(event.target.value);
        setCurrencyCode(fiats[event.target.value].currencyCode);
    };

    const handleChangeEntryType = (event) => {
        setEntryType(event.target.value);
    };

    const handleChangeBankId = (event) => {
        setBankId(event.target.value);
    };

    const getBankList = () => {
        dispatch(payoutBank()).then((res) => {
            let result = res.payload
            if (result) {
                let tmpBank = {}
                result.map((item) => {
                    if (tmpBank[item.currency]) {
                        tmpBank[item.currency].push(item)
                    } else {
                        tmpBank[item.currency] = [item]
                    }
                })
                setBankList(tmpBank)
            }
        })

        dispatch(payoutPayWays()).then((res) => {
            let result = res.payload
            if (result) {
                let tmpPayout = {}
                result.map((item) => {
                    if (tmpPayout[item.currency]) {
                        tmpPayout[item.currency].push(item)
                    } else {
                        tmpPayout[item.currency] = [item]
                    }
                })
                setPayoutList(tmpPayout)
            }
        })
    }

    //从大到小排列
    // const sortUseAge = (a, b) => {
    //     return b.dollarFiat - a.dollarFiat;
    // };
    const sortUseAge = (a, b) => {
        const prioritizedSymbolsFirst = ['eUSDT', 'USDT', 'BGT', 'eBGT'];
        const prioritizedSymbolsSecond = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'PAX', 'GUSD', 'USDD'];

        // 检查币种是否属于优先展示的币种
        const isPrioritizedAFirst = prioritizedSymbolsFirst.includes(a.symbol);
        const isPrioritizedBFirst = prioritizedSymbolsFirst.includes(b.symbol);
        const isPrioritizedASecond = prioritizedSymbolsSecond.includes(a.symbol);
        const isPrioritizedBSecond = prioritizedSymbolsSecond.includes(b.symbol);

        // 获取币种 a 和币种 b 的 dollarFiat 值
        const dollarFiatA = parseFloat(a.dollarFiat);
        const dollarFiatB = parseFloat(b.dollarFiat);

        if (isPrioritizedAFirst && isPrioritizedBFirst) {
            // 如果两个币种都属于第一组优先展示的币种，则比较它们的 dollarFiat 值进行排序
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedAFirst) {
            // 如果只有 a 是第一组优先展示的币种，则将 a 排在前面
            return -1;
        } else if (isPrioritizedBFirst) {
            // 如果只有 b 是第一组优先展示的币种，则将 b 排在前面
            return 1;
        } else if (isPrioritizedASecond && isPrioritizedBSecond) {
            // 如果两个币种都属于第二组优先展示的币种，则比较它们的 dollarFiat 值进行排序
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedASecond) {
            // 如果只有 a 是第二组优先展示的币种，则将 a 排在前面
            // return -1;
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedBSecond) {
            // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
            // return 1;
            return dollarFiatB - dollarFiatA;
        } else {
            // 如果两个币种都不属于优先展示的币种，则保持原有顺序
            // return 0;
            return dollarFiatB - dollarFiatA;
        }
    };

    const closePinFunc = () => {
        document.getElementById('PINSty').classList.remove('PinMoveAni');
        document.getElementById('PINSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPinWindow(false);
            setOpenSuccess(true);
            setIsLoadingBtn(false);
            setZhuanQuan(true);
            setTiJiaoState(0);
        }, 300);
    };


    const closePasteFunc = () => {
        document.getElementById('PasteSty').classList.remove('PinMoveAni');
        document.getElementById('PasteSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPasteWindow(false);
        }, 300);
    };

    const handleDoGoogleCode = (text) => {
        let tmpCode = googleCode
        if (text === -1) {
            tmpCode = tmpCode.slice(0, -1)
        } else {
            tmpCode = tmpCode + text
        }

        setGoogleCode(tmpCode)
    }


    const fiatsFormatAmount = () => {
        if (fiatData.length === 0 || !paymentFiat) {
            return
        }
        let tmpFiatDisplayData = {};
        let tmpPaymentFiat = {};
        let tmpFiatsData = {};
        let tmpFiats = [];
        let displayFiatData = [];
        if (paymentFiat?.length > 0) {
            paymentFiat.map((item, index) => {
                if (displayFiatData.indexOf(item.currencyCode) === -1 && item.userShow === true) {
                    displayFiatData.push(item.currencyCode);
                }
                tmpPaymentFiat[item.currencyCode] = item
            });
        }
        fiatDisplayData?.map((item, index) => {
            displayFiatData.push(item.name);
            tmpFiatDisplayData[item.name] = item
        });
        fiatData?.map((item, index) => {
            tmpFiatsData[item.currencyCode] = item;
        });

        displayFiatData.forEach((item) => {
            // var tmpShow = arrayLookup(fiatDisplayData, 'name', item, 'show');
            var tmpShow = tmpFiatDisplayData[item]?.show;
            if (tmpShow === '' || tmpShow === null || tmpShow === undefined) {
                // tmpShow = arrayLookup(paymentFiat, 'currencyCode', item, 'userShow');
                tmpShow = tmpPaymentFiat[item]?.userShow;
            }

            if (tmpShow === true && !arrayLookup(tmpFiats, 'currencyCode', item, 'currencyCode')) {
                // let balance = arrayLookup(fiatsData, 'currencyCode', item, 'balance') || 0;
                let balance = tmpFiatsData[item]?.balance || 0;
                tmpFiats.push({
                    avatar: tmpPaymentFiat[item]?.avatar || '',
                    currencyCode: item,
                    balance: balance.toFixed(2),
                    dollarFiat: (balance == 0) ? 0 : balance / tmpPaymentFiat[item]?.exchangeRate
                })
            }
        });

        tmpFiats.sort(sortUseAge);
        setFiats(tmpFiats);
        setCurrencyCode(tmpFiats[0].currencyCode)
    };

    const tidyWalletData = () => {
        fiatsFormatAmount();
    };

    const myFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            tidyWalletData();
        }
    }, [fiatData, fiatDisplayData]);

    useEffect(() => {
        dispatch(getFiatDisplay()).then((res) => {
            let result = res.payload;
            setFiatDisplayData(result?.data);
        });
        getBankList()
    }, []);

    useEffect(() => {
        if (inputVal.amount > 0) {
            dispatch(getFiatFee({
                currency: currencyCode,
                wayCode: '',
                amount: inputVal.amount
            })).then((res) => {
                let result = res.payload;
                setFee(result)
            })
        }

    }, [inputVal.amount, currencyCode])

    const [percentage, setPercentage] = useState('');
    const handleClick = (index) => {
        setPercentage(index)
    };

    return (
        <div>
            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className=""
                    style={{ padding: '0 1.5rem 0 1.5rem', marginBottom: "1.4rem" }}
                >
                    <Box
                        className="w-full rounded-16 border flex flex-col select-fieldset-noborder"
                        sx={{
                            backgroundColor: '#1E293B',
                            border: 'none'
                        }}
                    >
                        <FormControl sx={{
                            m: 1,
                            minWidth: "100%",
                            margin: 0,
                            border: 'none',
                            borderRadius: '8px!important',
                            backgroundColor: '#1E293B!important',
                            '&:before': {
                                display: 'none',
                            },
                            '&:first-of-type': {},
                            '&:last-of-type': {
                                marginBottom: 0,
                            }
                        }}
                        >
                            <Select
                                value={fiatsSelected}
                                onChange={handleChangeFiats}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className="MuiSelect-icon "
                                // IconComponent={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                            border: 'none'
                                        },
                                    },
                                }}
                            >
                                {fiats.length > 0 && fiats.map((row, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={index}
                                        >
                                            <div
                                                className="flex items-center py-2 flex-grow"
                                                style={{ width: '100%' }}
                                            >
                                                <div className="flex items-center">
                                                    <img style={{
                                                        width: '3rem',
                                                        borderRadius: '99px'
                                                    }} src={row.avatar} alt="" />
                                                    <div className="px-12 font-medium">
                                                        <Typography className="text-16 font-medium">{row.currencyCode}</Typography>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <div className="px-12 font-medium" style={{ textAlign: 'right' }}>
                                                        <Typography className="text-16 font-medium">{row.balance}</Typography>

                                                    </div>
                                                </div>
                                            </div>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-24"
                    style={{ padding: '0 1.5rem 0 1.5rem' }}
                >
                    <Box
                        component={motion.div}
                        variants={item}
                        className="w-full rounded-16 border flex flex-col "
                        style={{ borderRadius: '0.5rem' }}
                        sx={{
                            backgroundColor: '#1E293B',
                            border: 'none'
                        }}
                    >
                        <div className="" style={{}}>
                            <div style={{ padding: "0 1rem" }}>

                                <div className='mt-10'>
                                    <Tabs
                                        component={motion.div}
                                        variants={item}
                                        value={smallTabValue}
                                        onChange={(ev, value) => setSmallTabValue(value)}
                                        indicatorColor="secondary"
                                        textColor="inherit"
                                        variant="scrollable"
                                        scrollButtons={false}
                                        className="min-h-32"
                                        style={{ padding: '0rem', margin: '0rem ', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
                                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                        TabIndicatorProps={{
                                            children: (
                                                <Box
                                                    sx={{ bgcolor: 'text.disabled' }}
                                                    className="w-full h-full rounded-full huaKuaBgColorCard"
                                                />
                                            ),
                                        }}
                                        sx={{
                                            padding: '1rem',
                                        }}
                                    >
                                        {Object.entries([t('card_8'), t('card_7')]).map(([key, label]) => (
                                            <Tab
                                                className="text-16 font-semibold min-h-32 min-w-60 mx4 px-12 txtColorTitle opacity-100 zindex biZhongMR"
                                                disableRipple
                                                key={key}
                                                label={label}
                                                sx={{
                                                    color: '#FFFFFF', height: '32px', width: 'auto'
                                                }}
                                            />
                                        ))}
                                    </Tabs>
                                </div>

                                {smallTabValue == 0 &&
                                    <div>
                                        {currencyCode === 'IDR' && <div>
                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_22')}</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.accountNo}
                                                        onChange={handleChangeInputVal('accountNo')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'accountNo',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_23')}</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.accountName}
                                                        onChange={handleChangeInputVal('accountName')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'accountName',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">Mobile</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.mobile}
                                                        onChange={handleChangeInputVal('mobile')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'mobile',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">Email</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.email}
                                                        onChange={handleChangeInputVal('email')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'email',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">Description</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.description}
                                                        onChange={handleChangeInputVal('description')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                        </div>}

                                        {currencyCode === 'MMK' && <div>
                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_22')}</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.accountNo}
                                                        onChange={handleChangeInputVal('accountNo')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'accountNo',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_23')}</Typography>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.accountName}
                                                        onChange={handleChangeInputVal('accountName')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'accountName',
                                                        }}
                                                        placeholder={t('home_withdraw_27')}
                                                    />
                                                </FormControl>

                                                <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                    <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                </div>
                                            </div>
                                        </div>}

                                        {payoutList[currencyCode]?.length > 0 && <>
                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_28')}</Typography>
                                            </div>
                                            <div>
                                                <FormControl sx={{
                                                    m: 1,
                                                    minWidth: "100%",
                                                    margin: 0,
                                                    border: 'none',
                                                    borderRadius: '8px!important',
                                                    backgroundColor: '#1E293B!important',
                                                    '&:before': {
                                                        display: 'none',
                                                    },
                                                    '&:first-of-type': {},
                                                    '&:last-of-type': {
                                                        marginBottom: 0,
                                                    }
                                                }}
                                                >
                                                    <Select
                                                        value={entryType}
                                                        onChange={handleChangeEntryType}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                        className="MuiSelect-icon "
                                                        // IconComponent={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 300,
                                                                    border: 'none'
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {payoutList[currencyCode]?.length > 0 && payoutList[currencyCode].map((row, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={index}
                                                                >
                                                                    <div
                                                                        className="flex items-center py-0 flex-grow"
                                                                        style={{ width: '100%' }}
                                                                    >
                                                                        <Typography className="text-16 font-medium">{row.wayName}</Typography>
                                                                    </div>
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </>}

                                        {bankList[currencyCode]?.length > 0 && <>
                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">{t('home_withdraw_28')}</Typography>
                                            </div>
                                            <div>
                                                <FormControl sx={{
                                                    m: 1,
                                                    minWidth: "100%",
                                                    margin: 0,
                                                    border: 'none',
                                                    borderRadius: '8px!important',
                                                    backgroundColor: '#1E293B!important',
                                                    '&:before': {
                                                        display: 'none',
                                                    },
                                                    '&:first-of-type': {},
                                                    '&:last-of-type': {
                                                        marginBottom: 0,
                                                    }
                                                }}
                                                >
                                                    <Select
                                                        value={bankId}
                                                        onChange={handleChangeBankId}
                                                        displayEmpty
                                                        inputProps={{ "aria-label": "Without label" }}
                                                        className="MuiSelect-icon "
                                                        // IconComponent={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 300,
                                                                    border: 'none'
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {bankList[currencyCode]?.length > 0 && bankList[currencyCode].map((row, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={index}
                                                                >
                                                                    <div
                                                                        className="flex items-center py-0 flex-grow"
                                                                        style={{ width: '100%' }}
                                                                    >
                                                                        <Typography className="text-16 font-medium">{row.bankName}</Typography>
                                                                    </div>
                                                                </MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </>}

                                        {
                                            (currencyCode == "BRL") && <div>
                                                <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                    <Typography className="text-16 ">{t('home_withdraw_27')}</Typography>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-address send-tips-container-address"
                                                            value={inputVal.pixId}
                                                            onChange={handleChangeInputVal('pixId')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'pixId',
                                                            }}
                                                            placeholder={t('home_withdraw_27')}
                                                        />
                                                    </FormControl>

                                                    <div onClick={() => { setOpenWithdrawLog(true) }} className="ml-10 flex items-center justify-content-center cursor-pointer">
                                                        <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                    </div>
                                                </div>

                                                <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                    <Typography className="text-16 ">{t('home_withdraw_28')}</Typography>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <FormControl className='' sx={{ width: isMobileMedia ? '100%' : '89%', borderColor: '#94A3B8', backgroundColor: "#151C2A" }} variant="outlined">
                                                        <InputLabel id="demo-simple-select-label">CPF</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={accountType}
                                                            label="CPF"
                                                            onChange={handleChangeAccountType}
                                                        >
                                                            <MenuItem value={"CPF"}>CPF</MenuItem>
                                                            <MenuItem value={"CNPJ"}>CNPJ</MenuItem>
                                                            <MenuItem value={"PHONE"}>PHONE</MenuItem>
                                                            <MenuItem value={"EMAIL"}>EMAIL</MenuItem>
                                                        </Select>

                                                    </FormControl>
                                                </div>

                                                <div className="flex" style={{ padding: "16px 16px 16px 0px" }} >
                                                    <Typography className="text-16 ">{t('home_withdraw_29')} </Typography>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: isMobileMedia ? '100%' : '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                        <OutlinedInput
                                                            id="outlined-adornment-address send-tips-container-address"
                                                            value={inputVal.cardNo}
                                                            onChange={handleChangeInputVal('cardNo')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'cardNo',
                                                            }}
                                                            placeholder={t('home_withdraw_29')}
                                                        />
                                                        <div className='paste-btn' onClick={() => {

                                                        }}>{t('home_withdraw_11')}</div>
                                                    </FormControl>
                                                    <div onClick={() => { setOpenWithdrawLog(true) }} className="flex ml-10 items-center justify-content-center cursor-pointer">
                                                        <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <Typography className="text-16  mt-16 " style={{ width: "100%", display: "flex", justifyContent: " space-between" }}>
                                            <span>{t('home_withdraw_3')} </span>
                                            <span>
                                                <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 1 && 'colro-12C1A2')} onClick={() => { handleClick(1) }}>25%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 2 && 'colro-12C1A2')} onClick={() => { handleClick(2) }} style={{ marginLeft: "16px" }}>50%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 3 && 'colro-12C1A2')} onClick={() => { handleClick(3) }} style={{ marginLeft: "16px" }}>75%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 4 && 'colro-12C1A2')} onClick={() => { handleClick(4) }} style={{ marginLeft: "16px" }}>100%</span>
                                            </span>
                                        </Typography>

                                        <div className="flex items-center py-16 justify-between" style={{}}>
                                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-amount"
                                                    value={inputVal.amount}
                                                    onChange={handleChangeInputVal('amount')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'amount',
                                                    }}
                                                    type="number"
                                                />
                                            </FormControl>
                                        </div>


                                        <Box
                                            className="py-8"
                                            sx={{
                                                backgroundColor: '#0F172A',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <Typography className="text-14 px-16">
                                                <span style={{ color: '#FCE100' }}>⚠</span>{t('home_withdraw_15')} {fee} {currencyCode} . {t('home_withdraw_16')}. {t('home_withdraw_17')}
                                            </Typography>
                                        </Box>

                                    </div>
                                }

                                {smallTabValue == 1 &&
                                    <div>
                                        <div>
                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">UserId</Typography>
                                            </div>

                                            <div className="flex items-center justify-between ">
                                                <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-address send-tips-container-address"
                                                        value={inputVal.userId}
                                                        onChange={handleChangeInputVal('userId')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                    />
                                                    <div className='flex pasteSty  items-center'>
                                                        <div className='paste-btn' onClick={() => {
                                                            const clipPromise = navigator.clipboard.readText();
                                                            clipPromise.then(clipText => {
                                                                handleChangeUserIDVal(clipText)
                                                            })
                                                        }}>{t('home_withdraw_11')}</div>
                                                        <img className='pasteJianTou' src="wallet/assets/images/withdraw/pasteJianTou.png" alt="" onClick={() => {
                                                            setOpenPasteWindow(true)
                                                        }} />
                                                    </div>
                                                </FormControl>
                                                {
                                                    isMobileMedia &&
                                                    <img className='shaoMiaoIcon' src="wallet/assets/images/withdraw/code.png" alt="" onClick={() => {
                                                        setOpenChangeCurrency(true);
                                                    }} />
                                                }
                                            </div>

                                            <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                                <Typography className="text-16 ">Amount</Typography>
                                            </div>

                                        </div>

                                        <div className="flex items-center justify-between" style={{ padding: "0px 0px 16px 0px" }}>
                                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-amount"
                                                    value={inputVal.amount}
                                                    onChange={handleChangeInputVal('amount')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'amount',
                                                    }}
                                                    type="number"
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                }

                                <div style={{ width: "100%", paddingInline: "1rem" }}>
                                    <LoadingButton
                                        className={clsx('px-48 m-28 btnColorTitleBig loadingBtnSty')}
                                        color="secondary"
                                        loading={openLoad}
                                        variant="contained"
                                        sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                        style={{ width: '100%', height: '4rem', fontSize: "20px", margin: '2.6rem auto 2.6rem auto', display: 'block', lineHeight: "inherit", padding: "0px" }}
                                        onClick={() => {
                                            isBindPin()
                                        }}
                                    >
                                        {t('home_withdraw_10')}
                                    </LoadingButton>
                                </div>
                                <div className='mb-60'></div>
                            </div>
                        </div>
                    </Box>
                </motion.div>

                {openYanZheng && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-12'
                        id="topGo"
                    >
                        <div className='flex mb-10' onClick={() => {
                            setOpenYanZheng(false);
                            myFunction;
                        }}   >
                            <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                        </div>
                        <Enable2FA />
                        <div style={{ height: "5rem" }}></div>
                    </motion.div>
                </div>}

                {/*打开摄像头*/}
                <BootstrapDialog
                    onClose={() => { setOpenChangeCurrency(false); closeScan(); }}
                    aria-labelledby="customized-dialog-title"
                    open={openChangeCurrency}
                    className='scan-dialog-content'
                >
                    {/*<BootstrapDialogTitle id="customized-dialog-title" onClose={() => {setOpenChangeCurrency(false)}}>*/}
                    {/*    Change Currency*/}
                    {/*</BootstrapDialogTitle>*/}
                    <DialogContent dividers>
                        <div className='' style={{ width: '100%', height: '99vh', backgroundColor: '#0F172A' }}>
                            <Typography className="text-18 px-16 my-12 font-medium flex items-center justify-between scan-code-top" style={{ backgroundColor: '#374252' }}>
                                <img className='scan-code-back' src="wallet/assets/images/withdraw/icon-back.png" onClick={() => { setOpenChangeCurrency(false); closeScan(); }} alt="back-button" />
                                <span className='scan-code-title text-18'>Scan Code</span>
                                <img className='scan-code-camera' src="wallet/assets/images/withdraw/scan-code-img.png" alt="back-button" />
                            </Typography>
                            <div id="qrcode_reader" className='qrcode-reader' style={{ width: '300px', minHeight: "200px" }}></div>
                            <div className='scan-code-bottom-tips'>Align the QR code to the scan frame</div>
                        </div>
                    </DialogContent>
                </BootstrapDialog>

                <BootstrapDialog
                    onClose={() => {
                        closePinFunc();
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openPinWindow}
                    className="dialog-container"
                >
                    <div id="PINSty" className="PINSty">
                        {openSuccess &&
                            <div id='pinDivHeight'>
                                <div className='pinWindow'>
                                    <div className='flex'>
                                        <div className='PINTitle2'>{t('card_65')}</div>
                                        <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                            closePinFunc();
                                        }} />
                                    </div>
                                    <div className='PINTitle'>{t('home_wallet_14')}{smallTabValue == 0 ? t('card_8') : t('card_7')}（ {smallTabValue == 0 ? inputVal.address : inputVal.userId} ）{t('transfer_1')}</div>
                                    <div className='flex justify-center' style={{ borderBottom: "1px solid #2C3950", paddingBottom: "3rem" }}>
                                        { fiats && fiats[fiatsSelected] && <img className='MoneyWithdraw' src={ fiats[fiatsSelected].avatar}></img>}
                                        <div className='PINTitle3'>{ currencyCode }</div>
                                        <div className={clsx('PINTitle4  inputNumSty', textSelect && "inputBackDi")} onClick={() => {
                                            setTextSelect(!textSelect)
                                            setShowGuangBiao(true)
                                        }}>
                                            {inputVal.amount} <span className={clsx("", !showGuangBiao ? 'guangBiaoNo' : 'guangBiao')} >︱</span>
                                        </div>
                                    </div>
                                    <div className='flex justify-between mt-10'>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[0] ? '●' : ''}</div></div>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[1] ? '●' : ''}</div></div>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[2] ? '●' : ''}</div></div>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[3] ? '●' : ''}</div></div>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[4] ? '●' : ''}</div></div>
                                        <div className='PinNum'><div style={{ color: "#ffffff" }}>{pin[5] ? '●' : ''}</div></div>
                                    </div>
                                </div>

                                <div className='jianPanSty'>
                                    <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                        <div id="zhuanZhang1" className='jianPanBtn borderRight borderBottom color-box'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => { handleDoPin(1) }}>1</div>
                                        <div id="zhuanZhang2" className='jianPanBtn borderRight borderBottom color-box'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => { handleDoPin(2) }}>2</div>
                                        <div id="zhuanZhang3" className='jianPanBtn borderRight borderBottom'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => { handleDoPin(3) }}>3</div>
                                        <div id="zhuanZhangImg" className='jianPanBtImgDiv flex items-center borderBottom'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => { handleDoPin(-1) }}>
                                            <img className='jianPanBtnImg' src="wallet/assets/images/card/return.png" ></img>
                                        </div>
                                    </div>
                                    <div className='flex' style={{ width: "100%" }}>
                                        <div style={{ width: "75.1%" }}>
                                            <div className='flex'>
                                                <div id="zhuanZhang4" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(4) }}>4</div>
                                                <div id="zhuanZhang5" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(5) }}>5</div>
                                                <div id="zhuanZhang6" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(6) }}>6</div>
                                            </div>
                                            <div className='flex'>
                                                <div id="zhuanZhang7" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(7) }}>7</div>
                                                <div id="zhuanZhang8" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(8) }}>8</div>
                                                <div id="zhuanZhang9" className='jianPanBtn1 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(9) }}>9</div>
                                            </div>
                                            <div className='flex'>
                                                <div id="zhuanZhang0" className='jianPanBtn2 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin(0) }}>0</div>
                                                <div id="zhuanZhangDian" className='jianPanBtn4 borderRight'
                                                    onTouchStart={changeToBlack}
                                                    onTouchEnd={changeToWhite}
                                                    onTouchCancel={changeToWhite}
                                                    onClick={() => { handleDoPin('.') }}>.</div>
                                            </div>
                                        </div>
                                        {isLoadingBtn && <FuseLoading />}
                                        {!isLoadingBtn && <div id='zhuanZhangWanCheng' className='jianPanBtn3'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => {
                                                if(pin && pin.length === 6 && correctPin){
                                                    handleSubmit()
                                                }
                                            }}>{t('card_30')}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {!openSuccess && <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            style={{ height: `${divHeight}px` }}
                        >
                            <div className='dialog-box'>
                                <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                    <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                        closePinFunc();
                                    }} />
                                </Typography>
                            </div>

                            <div className='daGouDingWei' style={{ position: "relative" }}>
                                <motion.div variants={item} className=' daGouDingWei1' style={{ position: "absolute", width: "100px", height: "100px", paddingTop: "10px" }}>
                                    <div className='daGouDingWei1' style={{ position: "absolute" }}>
                                        {
                                            !(tiJiaoState === 2) && <img style={{ margin: "0 auto", width: "60px", height: "60px" }} src='wallet/assets/images/wallet/naoZhong2.png'></img>
                                        }
                                        {
                                            tiJiaoState === 2 && <img style={{ margin: "0 auto", width: "60px", height: "60px" }} src='wallet/assets/images/wallet/naoZhong2_1.png'></img>
                                        }
                                    </div>
                                    <div className='daGouDingWei1' style={{ marginLeft: "58px", position: "absolute" }}>
                                        {
                                            zhuanQuan && <img className='chuKuanDongHua' style={{ width: "22px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong3.png'></img>
                                        }
                                        {
                                            !zhuanQuan && tiJiaoState === 1 && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong4.png'></img>
                                        }
                                        {
                                            !zhuanQuan && tiJiaoState === 2 && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong5.png'></img>
                                        }
                                    </div>
                                </motion.div>
                            </div>

                            <div style={{ margin: "0 auto", textAlign: "center", marginTop: "84px", height: "23px", fontSize: "16px", color: "#2ECB71" }}>
                                {
                                    smallTabValue === 1 && tiJiaoState === 1 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                        ● {t('errorMsg_1')}
                                    </motion.div>
                                }
                                {
                                    smallTabValue === 0 && tiJiaoState === 1 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", color: "#ffc600" }}>
                                        ● {t('home_PendingReview')}
                                    </motion.div>
                                }
                                {
                                    tiJiaoState === 2 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", color: "#EE124B" }}>
                                        ● {t('error_36')}
                                    </motion.div>
                                }
                            </div>
                            <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "8px", fontSize: "24px" }}> -{inputVal.amount} {currencyCode}</motion.div>
                            <motion.div variants={item} className='mx-20  mt-24' style={{ borderTop: "1px solid #2C3950" }}>
                            </motion.div>
                            <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                                <div>{t('home_deposite_2')}</div>
                            </motion.div>
                            {
                                smallTabValue === 1 && <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                    <div style={{ color: "#888B92" }}>{t('card_7')}</div>
                                    <div style={{ width: "50%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.userId}</div>
                                </motion.div>
                            }
                            {
                                smallTabValue === 0 && <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                    <div style={{ color: "#888B92" }}>{t('home_withdraw_22')}</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.accountNo}</div>
                                </motion.div>
                            }

                            <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                <div style={{ color: "#888B92" }}>{t('home_borrow_18')}</div>
                                <div>{smallTabValue === 0 ? fee : 0}  {currencyCode} </div>
                            </motion.div>

                            <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                                <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{faitSendId}</div>
                            </motion.div>
                            <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                                <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                                <div>{getNowTime()}</div>
                            </motion.div>
                        </motion.div>
                        }
                    </div>
                </BootstrapDialog>

                <BootstrapDialog
                    onClose={() => {
                        closeCreatePinFunc();
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={createPinWindow}
                    className="dialog-container"
                >
                    <div id="CreateSty" className="PINSty">
                        <div className='pinWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_68')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeCreatePinFunc();
                                }} />
                            </div>
                            <div className='PINTitle'>{t('card_69')}</div>
                            <div className='flex justify-between mt-32 pt-16 pb-16' style={{ borderTop: "1px solid #2C3950" }}>
                                <div className='PinNum color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}>{pin[0] ?? ''}</div>
                                <div className='PinNum' >{pin[1] ?? ''}</div>
                                <div className='PinNum'>{pin[2] ?? ''}</div>
                                <div className='PinNum'>{pin[3] ?? ''}</div>
                                <div className='PinNum'>{pin[4] ?? ''}</div>
                                <div className='PinNum'>{pin[5] ?? ''}</div>
                            </div>
                        </div>

                        <div className='jianPanSty'>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin1" className='jianPanNumBtn borderRight borderBottom color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(1)
                                    }}
                                >1</div>
                                <div id="createPin2" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(2)
                                    }}
                                >2</div>
                                <div id="createPin3" className='jianPanNumBtn  borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(3)
                                    }}
                                >3</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin4" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(4)
                                    }}
                                >4</div>
                                <div id="createPin5" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(5)
                                    }}
                                >5</div>
                                <div id="createPin6" className='jianPanNumBtn  borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(6)
                                    }}
                                >6</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin7" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(7)
                                    }}
                                >7</div>
                                <div id="createPin8" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(8)
                                    }}
                                >8</div>
                                <div id="createPin9" className='jianPanNumBtn borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(9)
                                    }}
                                >9</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div className='jianPanNumBtn borderRight '></div>
                                <div id="createPin0" className='jianPanNumBtn borderRight color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(0)
                                    }}
                                >0</div>
                                <div id="createPinx" className='jianPanNumBtn flex items-center color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoPin(-1)
                                    }}
                                > <img className='jianPanBtnImg' src="wallet/assets/images/card/return.png" ></img></div>
                            </div>
                        </div>
                    </div>
                </BootstrapDialog>

                {/*打开错误提示*/}
                <BootstrapDialog
                    onClose={() => {
                        setOpenPinErr(false)
                        // setCreatePinWindow(false)
                        // openCreatePinFunc()
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openPinErr}
                    className="dialog-container"
                >
                    <div className='errorPinDi'>
                        <div className='errorPinZi flex items-center  justify-content-center'>{t('card_70')}</div>
                        <div className='errorPinLine'></div>
                        <div className='flex justify-between'>
                            <div className='errorPinBtn errorRightLine' onClick={() => {
                                setOpenPinErr(false)
                                history.push('/wallet/home/security', { tabValue: 5, resetTabValueParam: 1 })
                            }}>{t('card_71')}</div>
                            <div className='errorPinBtn' style={{ color: "#81A39F" }}
                                onClick={() => {
                                    setOpenPinErr(false)
                                    openInputPin()
                                }}
                            >{t('card_72')}</div>
                        </div>
                    </div>
                </BootstrapDialog>

                <BootstrapDialog
                    onClose={() => {
                        closePasteFunc();
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openPasteWindow}
                    className="dialog-container"
                >
                    <div id="PasteSty" className={clsx("PasteSty", !openPasteWindow && 'PinMoveOut', openPasteWindow && 'PinMoveAni')}>
                        <div className='pasteWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_73')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closePasteFunc();
                                }} />
                            </div>
                        </div>

                        <div className='pasteW'>
                            {
                                historyAddress.map((item, index) => {
                                    return (
                                        <div className='pasteDiZhi'>
                                            <div className='flex'>
                                                <img className='bianJiBiImg' src="wallet/assets/images/deposite/bianJiBi.png"></img>
                                                <div className='bianJiBiZi'>{t('card_74')}</div>
                                            </div>
                                            <div className='pasteDi'>{item}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </BootstrapDialog>

                {/*打开历史记录*/}
                <BootstrapDialog
                    onClose={() => { setOpenWithdrawLog(false); }}
                    aria-labelledby="customized-dialog-title"
                    open={openWithdrawLog}
                    className="dialog-container"
                >
                    <DialogContent dividers>
                        <div className='dialog-box'>
                            <Typography id="customized-dialog-title" className="text-24 px-16  dialog-title-text">&nbsp;
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => { setOpenWithdrawLog(false) }} alt="close icon" />
                            </Typography>
                        </div>
                        <Box
                            className="dialog-content dialog-content-paste-height"
                            style={{ padding: "0px" }}
                        >
                            <Box className="dialog-content-inner dialog-content-paste-width border-r-5" style={{ width: "100%" }} >
                                {
                                    historyAddress.map((item, index) => {
                                        return (
                                            <div className='dialog-item' key={item.id} style={{ margin: "10px auto" }}>
                                                <Typography className="text-14 px-16 dialog-withdraw-text"
                                                    onClick={() => {
                                                        setOpenWithdrawLog(false);

                                                        changeAllInput({
                                                            bankName: item.bankName,
                                                            cardName: item.cardName,
                                                            cardNo: item.cardNo,
                                                        });
                                                    }}
                                                >
                                                    {item.cardNo}
                                                </Typography>
                                                <IconButton>
                                                    <img src="wallet/assets/images/deposite/delete.png" alt="" />
                                                </IconButton>
                                            </div>
                                        )
                                    })
                                }
                            </Box>
                        </Box>
                    </DialogContent>
                </BootstrapDialog>

                {/*填写google验证码*/}
                <BootstrapDialog
                    onClose={() => {
                        closeGoogleCodeFunc()
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openGoogleCode}
                    className="dialog-container"
                >
                    <div id="GoogleCodeSty" className="PINSty">
                        <div className='pinWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_180')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeGoogleCodeFunc()
                                }} />
                            </div>
                            <div className='PINTitle'>{t('card_176')}</div>
                            <div className='flex justify-between mt-32 pt-16 pb-16' style={{ borderTop: "1px solid #2C3950" }}>
                                <div className='PinNum color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}>{googleCode[0] ?? ''}</div>
                                <div className='PinNum' >{googleCode[1] ?? ''}</div>
                                <div className='PinNum'>{googleCode[2] ?? ''}</div>
                                <div className='PinNum'>{googleCode[3] ?? ''}</div>
                                <div className='PinNum'>{googleCode[4] ?? ''}</div>
                                <div className='PinNum'>{googleCode[5] ?? ''}</div>
                            </div>
                        </div>

                        <div className='jianPanSty'>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin1" className='jianPanNumBtn borderRight borderBottom color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(1)
                                    }}
                                >1</div>
                                <div id="createPin2" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(2)
                                    }}
                                >2</div>
                                <div id="createPin3" className='jianPanNumBtn  borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(3)
                                    }}
                                >3</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin4" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(4)
                                    }}
                                >4</div>
                                <div id="createPin5" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(5)
                                    }}
                                >5</div>
                                <div id="createPin6" className='jianPanNumBtn  borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(6)
                                    }}
                                >6</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div id="createPin7" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(7)
                                    }}
                                >7</div>
                                <div id="createPin8" className='jianPanNumBtn borderRight borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(8)
                                    }}
                                >8</div>
                                <div id="createPin9" className='jianPanNumBtn borderBottom color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(9)
                                    }}
                                >9</div>
                            </div>
                            <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                <div className='jianPanNumBtn borderRight '></div>
                                <div id="createPin0" className='jianPanNumBtn borderRight color-box' onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(0)
                                    }}
                                >0</div>
                                <div id="createPinx" className='jianPanNumBtn flex items-center color-box'
                                    onTouchStart={changeToBlack}
                                    onTouchEnd={changeToWhite}
                                    onTouchCancel={changeToWhite}
                                    onClick={() => {
                                        handleDoGoogleCode(-1)
                                    }}
                                > <img className='jianPanBtnImg' src="wallet/assets/images/card/return.png" ></img></div>
                            </div>
                        </div>
                    </div>
                </BootstrapDialog>

                <BootstrapDialog
                    onClose={() => {
                        closePasteFunc();
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openPasteWindow}
                    className="dialog-container"
                >
                    <div id="PasteSty" className={clsx("PasteSty", !openPasteWindow && 'PinMoveOut', openPasteWindow && 'PinMoveAni')}>
                        <div className='pasteWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_73')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closePasteFunc();
                                }} />
                            </div>
                        </div>

                        <div className='pasteW'>
                            {
                                historyAddress.map((item, index) => {
                                    return (
                                        <div className='pasteDiZhi'>
                                            <div className='flex'>
                                                <img className='bianJiBiImg' src="wallet/assets/images/deposite/bianJiBi.png"></img>
                                                <div className='bianJiBiZi'>{t('card_74')}</div>
                                            </div>
                                            <div className='pasteDi'>{item}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </BootstrapDialog>

                <AnimateModal
                    className="faBiDiCard tanChuanDiSe"
                    open={openAnimateModal}
                    onClose={() => setOpenAnimateModal(false)}
                >
                    <div className='flex justify-center' style={{ width: "100%" }}>
                        <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                        <div className='TanHaoCardZi '>
                            {t('card_180')}
                        </div>
                    </div>

                    <Box
                        className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard"
                        sx={{
                            backgroundColor: "#2C394D",
                            padding: "1.5rem",
                            overflow: "hidden",
                            margin: "1rem auto 0rem auto"
                        }}
                    >
                        <div className="dialog-select-fiat danChuangTxt">
                            {t('card_181')}
                        </div>
                    </Box>

                    <div className='flex mt-12 mb-28 px-15 justify-between' >
                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn"
                            color="secondary"
                            loading={false}
                            variant="contained"
                            onClick={() => {
                                setOpenAnimateModal(false)
                                setOpenPinWindow(false)
                                props.verifyGoogleCode()
                            }}
                        >
                            {t('card_182')}
                        </LoadingButton>


                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn"
                            color="secondary"
                            loading={false}
                            variant="contained"
                            onClick={() => {
                                setOpenAnimateModal(false)
                            }}
                        >
                            {t('home_pools_15')}
                        </LoadingButton>
                    </div>
                </AnimateModal>

            </div>
        </div >
    )
}

export default Fiat;
