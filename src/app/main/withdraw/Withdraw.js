import { useState, useEffect, default as React, useRef } from 'react';
import axios from "axios";
import domain from "../../api/Domain";
import TextField from '@mui/material/TextField';
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
import { useNavigate } from 'react-router-dom';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { sendTips, tokenTransfer } from "../../store/user/userThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { selectConfig } from "../../store/config";
import { arrayLookup, getNowTime, getOpenAppId, getOpenAppIndex, setPhoneTab } from "../../util/tools/function";
import { openScan, closeScan } from "../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, cryptoWithdrawFee, getWithdrawHistoryAddress, delWithdrawHistoryAddress, getWithdrawTransferStats, createPin, verifyPin } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import OtpPass from "../otpPass/OtpPass";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getCryptoDisplay } from "../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Fiat from "./components/Fiat";
import Nft from "./components/Nft";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import history from '@history';
import { Controller, useForm } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputLabel from "@mui/material/InputLabel/InputLabel";
import AnimateModal from "../../components/FuniModal";
import Enable2FA from "../2fa/Enable2FA";
import FuseLoading from '@fuse/core/FuseLoading';

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
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
        if (dollarFiatB == dollarFiatA) {
            return -1
        }
        return dollarFiatB - dollarFiatA;
    } else if (isPrioritizedBSecond) {
        // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
        // return 1;
        if (dollarFiatB == dollarFiatA) {
            return -1
        }
        return dollarFiatB - dollarFiatA;
    } else {
        // 如果两个币种都不属于优先展示的币种，则保持原有顺序
        // return 0;
        return dollarFiatB - dollarFiatA;
    }
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};



function Withdraw(props) {
    const navigate = useNavigate()
    const { t } = useTranslation('mainPage');
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const dispatch = useDispatch();
    const [inputVal, setInputVal] = useState({
        address: '',
        amount: '',
        showAmount: 0.00,
    });
    const [withdrawConfig, setWithdrawConfig] = useState({});
    const [walletName, setWalletName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [amountTab, setAmountTab] = useState('HIGHER');
    const [fee, setFee] = useState(0);
    const [TransactionFee, setTransactionFee] = useState(0);
    const [bAppendFee, setBAppendFee] = useState(false);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [openYanZheng, setOpenYanZheng] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(true);
    const [divHeight, setDivHeight] = useState(0);
    const [currRequestId, setCurrRequestId] = useState(0);
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [zhuanQuan, setZhuanQuan] = useState(true);

    const handleChangeInputVal = (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (prop == 'amount' && event.target.value != '' && event.target.value != 0) {
            console.log(networkId, 'networkId')
            evalFee2(networkId, symbol, event.target.value);
        }
    };

    const [showGuangBiao, setShowGuangBiao] = useState(false);

    const changeToBlack = (target) => {
        document.getElementById(target.target.id).classList.add('pinJianPanColor1');
    };

    const changeToWhite = (target) => {
        document.getElementById(target.target.id).classList.remove('pinJianPanColor1');
    };

    const [inputIDVal, setInputIDVal] = useState('');
    const handleChangeInputVal2 = (event) => {
        setInputIDVal(event.target.value);
    };

    const myFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    const getDivHeight = (divName) => {
        setTimeout(() => {
            setDivHeight(document.getElementById(divName).offsetHeight)
        }, 300);
    };


    const changeAddress = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };
    const [historyAddress, setHistoryAddress] = useState([]);
    const [transferState, setTransferState] = useState([]);
    const [googleCode, setGoogleCode] = useState('');
    const [openChangeCurrency, setOpenChangeCurrency] = useState(false);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const [openGoogleCode, setOpenGoogleCode] = useState(false);
    const [openTiBi, setOpenTiBi] = useState(false);
    const [withDrawOrderID, setWithDrawOrderID] = useState('');
    const [openLoad, setOpenLoad] = useState(false);
    const [openPaste, setOpenPaste] = useState(false);
    const walletData = useSelector(selectUserData).wallet;
    const transferStats = useSelector(selectUserData).transferStats;
    const config = useSelector(selectConfig);
    const symbols = config.symbols;
    const mounted = useRef();
    const hasAuthGoogle = useSelector(selectUserData).userInfo?.hasAuthGoogle
    const [smallTabValue, setSmallTabValue] = useState(0);
    const [resetTabValue, setResetTabValue] = useState(0);

    const [openPinWindow, setOpenPinWindow] = useState(false);
    const [movePinWindow, setMovePinWindow] = useState(false);
    const [createPinWindow, setCreatePinWindow] = useState(false);
    const [openPinErr, setOpenPinErr] = useState(false);
    const [openPasteWindow, setOpenPasteWindow] = useState(false);

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

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

    const openGoogleCodeFunc = () => {
        setOpenGoogleCode(true);
        setTimeout(() => {
            document.getElementById('GoogleCodeSty').classList.add('PinMoveAni');
        }, 0);
    };

    const closePinFunc = () => {
        document.getElementById('PINSty').classList.remove('PinMoveAni');
        document.getElementById('PINSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPinWindow(false);
            setOpenSuccess(true);
            setIsLoadingBtn(false);
            setZhuanQuan(true);
        }, 300);
    };

    const closeGoogleCodeFunc = () => {
        document.getElementById('GoogleCodeSty').classList.remove('PinMoveAni');
        document.getElementById('GoogleCodeSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenGoogleCode(false);
        }, 300);
    };

    const closePasteFunc = () => {
        document.getElementById('PasteSty').classList.remove('PinMoveAni');
        document.getElementById('PasteSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPasteWindow(false);
        }, 300);
    };

    const openCreatePinFunc = () => {
        setTimeout(() => {
            document.getElementById('CreateSty').classList.add('PinMoveAni');
        }, 0);
    };

    const closeCreatePinFunc = () => {
        document.getElementById('CreateSty').classList.remove('PinMoveAni');
        document.getElementById('CreateSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setCreatePinWindow(false)
        }, 300);
        setPin('');
    };


    const [time, setTime] = useState(null);

    async function sendCode() {
        const data = {
            codeType: 11,
            email: control._formValues.email,
        };
        const sendRes = await dispatch(sendEmail(data));
        if (sendRes.payload) {
            setTime(60)
        }
    }

    function ismore(inputVal) {
        if (Number(inputVal) > Number(arrayLookup(symbolWallet, 'symbol', symbol, 'balance'))) {

            return true
        } else return false
    }

    const schema = yup.object().shape({
        smsCode: yup.string().required('You must enter a smsCode'),
        password: yup
            .string()
            .required('Please enter your password.')
            // .min(6, 'Password is too short - should be 6 chars minimum.')
            .min(6, t("signUp_8"))
            .max(16, 'Password is too long - should be 16 chars maximum.'),
    });

    const handleSubmit = () => {
        var amount = inputVal.amount;
        var tmpBAppendFee = false;
        if (bAppendFee) {
            amount = inputVal.amount - fee;
        }
        if (fee == 0) {
            tmpBAppendFee = true;
        } else {
            tmpBAppendFee = bAppendFee;
        }

        const rate = arrayLookup(symbols, 'symbol', symbol, 'rate');
        let conversionAmount = rate * amount;

        // if (conversionAmount >= transferState.limitSingle && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setOpenAnimateModal(true);
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        // if (transferState.daily >= transferState.limitDaily && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setOpenAnimateModal(true);
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        // if (transferState.month >= transferState.limitMonth && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setOpenAnimateModal(true);
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        let data = {
            address: inputVal.address,
            amount: amount,
            coinName: symbol,
            checkCode: googleCode,
            networkId: networkId,
            priceLevel: amountTab,
            bAppendFee: tmpBAppendFee,
        };
        setOpenLoad(true);
        dispatch(tokenTransfer(data)).then((res) => {
            setOpenLoad(false);
            let result = res.payload
            setGoogleCode('');
            if( result.errno == -2 ){
                if (!hasAuthGoogle) {
                    setOpenAnimateModal(true);
                    return;
                }
                openGoogleCodeFunc()
                return
            } else{
                if (result) {
                    setOpenTiBi(true);
                    setWithDrawOrderID(result);
                } else {
                    dispatch(showMessage({ message: t('error_10'), code: 2 }));
                }  
            } 

        });
    };

    const handleSendTipsSubmit = () => {
        setIsLoadingBtn(true)
        if (textSelect) {
            setTextSelect(false)
            setShowGuangBiao(false)
        }

        if (inputVal.amount <= 0) {
            return
        }

        if (pin.length < 6) {
            return
        }
        // closePinFunc()
        const rate = arrayLookup(symbols, 'symbol', symbol, 'rate');
        let conversionAmount = rate * inputVal.amount;
        // if (conversionAmount >= transferState.limitSingle && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setTimeout(() => {
        //             setOpenAnimateModal(true);
        //         }, 300)
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        // if (transferState.daily >= transferState.limitDaily && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setTimeout(() => {
        //             setOpenAnimateModal(true);
        //         }, 300)
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        // if (transferState.month >= transferState.limitMonth && googleCode.length < 6) {
        //     if (!hasAuthGoogle) {
        //         setTimeout(() => {
        //             setOpenAnimateModal(true);
        //         }, 300)
        //         return;
        //     }
        //     openGoogleCodeFunc()
        //     return
        // }

        let data = {
            userId: inputIDVal,
            amount: inputVal.amount,
            symbol: symbol,
            checkCode: googleCode
        };

        dispatch(sendTips(data)).then((res) => {
            setIsLoadingBtn(false)
            setGoogleCode('');
            let resData = res.payload;
            if (resData.errno == 0) {
                setCurrRequestId(res.meta.requestId)
                setOpenSuccess(false);
                setTimeout(() => {
                    setZhuanQuan(false);
                }, 1200);
            } else if(resData.errno == -2) {
                if (!hasAuthGoogle) {
                    setTimeout(() => {
                        setOpenAnimateModal(true);
                    }, 300)
                    return;
                }
                openGoogleCodeFunc()
                return
            }else{
                setOpenSuccess(true);
            }
        });
    };

    const handleCopyText = (text) => {
        var input1 = document.createElement('input');
        document.body.appendChild(input1);
        input1.setAttribute('value', text);
        input1.select();
        document.execCommand("copy"); // 执行浏览器复制命令
        navigator.clipboard.writeText(text)
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            document.execCommand('copy');
            document.execCommand('copy');
        }
        document.body.removeChild(input1);
    }
    useEffect(() => {
        if (googleCode.length === 6) {
            setOpenGoogleCode(false);
            if(smallTabValue == 0) {
                handleSubmit();
            }else if(smallTabValue == 1){
                handleSendTipsSubmit();
            }
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

    useEffect(() => {
        setTransferState(transferStats);
    }, [transferStats]);

    const startScanQRCode = () => {
        openScan((result, err) => {
            if (result && result.text && result.text.length > 0) {
                console.log("openScan", result);
                changeAddress('address', result.text);
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

    const evalFee = (coinName, networkId, priceLevel) => {
        let decimals = (arrayLookup(symbols, 'symbol', coinName, 'decimals') || 18) - 4;
        console.log('decimals', decimals)
        dispatch(evalTokenTransferFee({
            coinName: coinName,
            networkId: networkId,
            priceLevel: priceLevel,
            decimals: decimals,
            // setFee: setFee
        })).then((res) => {
            let resData = res.payload;
            if (resData.data == 0) {
                setFee(0);
                return
            }
            let fee = ((resData.data / (new BN(10).pow(new BN(decimals)).toNumber())) / 10000).toFixed(6);
            setFee(fee);
        });
    };

    const evalFee2 = (networkId, coinName, amount) => {
        dispatch(cryptoWithdrawFee({
            networkId: networkId,
            coinName: coinName,
            amount: amount,
        })).then((res) => {
            let resData = res.payload;
            if (resData && resData.data != 0) {
                let TransactionFee = (resData.data).toFixed(2);
                setTransactionFee(TransactionFee);
            } else {
                setTransactionFee(0);
                return
            }

        });
    };

    const del = (item) => {
        dispatch(delWithdrawHistoryAddress(item)).then((res) => {
            dispatch(getWithdrawHistoryAddress()).then((res) => {

                if (res.payload?.data?.length > 0) {
                    setHistoryAddress(res.payload.data);
                } else {
                    setHistoryAddress([])
                }
            });
            // if (res.payload.data.length > 0) {
            // setHistoryAddress(res.payload.data);
            // }
        });
    };
    useEffect(() => {
        setPhoneTab('withdraw');
        dispatch(getWithdrawHistoryAddress()).then((res) => {
            if (res.payload?.data?.length > 0) {
                setHistoryAddress(res.payload.data);
            }
        });
    }, []);

    const fiatData = useSelector(selectUserData).fiat;
    const userData = useSelector(selectUserData);
    const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || 'USD');

    const networks = config.networks;
    const symbolsData = config.symbols;
    const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
    const [networkData, setNetworkData] = useState([]);
    const [networkId, setNetworkId] = useState(0);

    const loginType = window.localStorage.getItem('loginType') ?? userData?.userInfo?.loginType;

    const defaultValues = {
        email: '',
        smsCode: '',
        password: '',
    };

    const symbolsFormatAmount = () => {
        let currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'exchangeRate') || 0;
        let displayData = [];
        cryptoDisplayData?.map((item, index) => {
            displayData.push(item.name);
        });
        symbolsData.map((item, index) => {
            if (displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
                displayData.push(item.symbol);
            }
        });
        let tmpSymbols = [];
        // 美元汇率
        let dollarCurrencyRate = arrayLookup(config.payment.currency, 'currencyCode', 'USD', 'exchangeRate') || 0;
        displayData.forEach((item, index) => {
            var tmpShow = arrayLookup(cryptoDisplayData, 'name', item, 'show');
            if (tmpShow === '') {
                tmpShow = arrayLookup(symbolsData, 'symbol', item, 'userShow');
            }
            if (tmpShow === true && item != 'eBGT') {
                // 兑换成USDT的汇率
                let symbolRate = arrayLookup(symbolsData, 'symbol', item, 'rate') || 0;
                var balance = getUserMoney(item);
                tmpSymbols.push({
                    avatar: arrayLookup(symbolsData, 'symbol', item, 'avatar') || '',
                    symbol: item,
                    balance: balance, // 余额
                    dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
                    currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
                    tradeLock: arrayLookup(walletData.inner, 'symbol', item, 'tradeLock') || 0,
                    withdrawLock: arrayLookup(walletData.inner, 'symbol', item, 'withdrawLock') || 0
                });
            }
        });

        const sortUseLen = (a, b) => {
            return a.networkLen - b.networkLen;
        };

        let tmpNetworks = {};
        tmpSymbols.forEach((item, index) => {
            var tmpNetId = [];
            var tmpNetData = [];
            symbolsData.map((symbolData) => {
                if (tmpNetId.indexOf(symbolData.networkId) === -1 && symbolData.symbol === item.symbol) {
                    tmpNetId.push(symbolData.networkId);
                }
            });

            for (var i = 0; i < tmpNetId.length; i++) {
                if (arrayLookup(networks, 'id', tmpNetId[i], 'symbol')) {
                    tmpNetData.push({
                        id: tmpNetId[i],
                        symbol: arrayLookup(networks, 'id', tmpNetId[i], 'symbol'),
                        avatar: arrayLookup(networks, 'id', tmpNetId[i], 'avatar'),
                        network: arrayLookup(networks, 'id', tmpNetId[i], 'network'),
                        text: 1,
                        desc: 2,
                        networkLen: arrayLookup(networks, 'id', tmpNetId[i], 'network').length || 0,
                    })
                }
            }

            tmpNetData.sort(sortUseLen);
            tmpNetworks[item.symbol] = tmpNetData;
        });
        tmpSymbols.sort(sortUseAge);
        console.log(tmpSymbols);
        setSymbolWallet(tmpSymbols.filter(i => i.symbol !== 'eUSDT'));
        setNetworkData(tmpNetworks);
    };

    const getUserMoney = (symbol) => {
        let arr = userData.wallet.inner || [];
        let balance = arrayLookup(arr, 'symbol', symbol, 'balance') || 0;
        return balance.toFixed(6)
    };

    const tidyWalletData = () => {
        symbolsFormatAmount();
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            tidyWalletData();
        }
    }, [cryptoDisplayData, symbolsData, networks]);

    useEffect(() => {
        // getWalletConfig();
        dispatch(getCryptoDisplay()).then((res) => {
            let result = res.payload;
            setCryptoDisplayData(result?.data);
        });
    }, []);

    useEffect(() => {
        if (networkData[symbol]) {
            setNetworkId(networkData[symbol][0]?.id);
            evalFee(symbol, networkData[symbol][0]?.id, amountTab);
        }
    }, [symbol, amountTab]);

    const [tabValue, setTabValue] = useState(0);
    const [textSelect, setTextSelect] = useState(false);
    const [ranges, setRanges] = useState([
        t('home_deposite_1'), t('home_deposite_2')
        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
    ]);
    const [cryptoSelect, setCryptoSelect] = useState(0);
    const [fiatSelect, setFiatSelect] = useState(1);


    const { control, formState, handleSubmit1, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

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

    const [pin, setPin] = useState('');
    const [hasPin, setHasPin] = useState(false)
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

    // 创建PIN Page
    const openCreatePin = () => {
        setPin('')
        setCreatePinWindow(true)
        openCreatePinFunc()
    }

    // 输入PIN Page
    const openInputPin = () => {
        setPin('')
        setOpenPinWindow(true)
        openPinFunc()
        getDivHeight("pinDivHeight");
    }

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

    const handleDoGoogleCode = (text) => {
        let tmpCode = googleCode
        if (text === -1) {
            tmpCode = tmpCode.slice(0, -1)
        } else {
            tmpCode = tmpCode + text
        }

        setGoogleCode(tmpCode)
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
                        errPin()
                    } else {

                    }
                })
            } else { // 创建pin
                dispatch(createPin({
                    paymentPassword: tmpPin
                })).then((res) => {
                    if (res.payload) {
                        setHasPin(true)
                        closeCreatePinFunc()
                    }
                })
            }
        }
    }

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


    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", width: "100%" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mb-6 mt-12'
                >
                    <Tabs
                        component={motion.div}
                        variants={item}
                        value={tabValue}
                        onChange={(ev, value) => setTabValue(value)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="scrollable"
                        className="tongYongDingBtn"
                        style={{ width: '50%!import' }}
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    sx={{ bgcolor: 'text.disabled' }}
                                    className="w-full h-full rounded-full  huaKuaBgColor0"
                                />
                            ),
                        }}
                        sx={{
                            margin: "1rem 1.2rem",
                        }}
                    >
                        {Object.entries(ranges).map(([key, label]) => (
                            <Tab
                                className="text-14 font-semibold min-h-36 min-w-64 mx4 px-12 opacity1 txtColorTitle zindex"
                                disableRipple
                                key={key}
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '3.6rem', width: '50%'
                                }}
                            />
                        ))}
                    </Tabs>
                </motion.div>


                {tabValue === cryptoSelect && <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{ padding: '0 1.5rem 1.4rem 1.5rem' }}
                    >
                        <Box
                            className="w-full rounded-16 border flex flex-col "
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            {symbolWallet.length > 0 && <StyledAccordionSelect
                                symbol={symbolWallet}
                                currencyCode="USD"
                                setSymbol={setSymbol}
                            />}
                        </Box>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="p-24 mb-24"
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
                            <Typography className="text-16 px-10 my-12" style={{ marginBottom: '0.5rem', marginTop: '10px' }}>{t('home_withdraw_1')}</Typography>
                            <div className="flex px-16" style={{ flexWrap: 'wrap', paddingLeft: '0.7rem', paddingRight: '0.7rem' }}>
                                {networkData[symbol]?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            // className="flex items-center px-8 rounded-8 border"
                                            className={clsx('flex items-center px-8 rounded-8 border cursor-pointer deposite-token', networkId === item.id && 'active-border')}
                                            onClick={() => {
                                                setWalletName(item.network);
                                                setNetworkId(item.id);
                                            }}
                                            style={{
                                                // width: '30%',
                                                margin: '.8rem 1%',
                                                paddingLeft: '0.2rem',
                                                paddingRight: '0.2rem',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <img style={{ width: '2rem', borderRadius: '50%' }} src={item.avatar} alt="" />
                                            <div className="px-12"
                                                style={{
                                                    paddingLeft: '0.4rem', paddingRight: '0.4rem'
                                                }}
                                            >
                                                <Typography className={clsx("text-14 font-medium", networkId === item.id && 'color-ffffff')}>{item.symbol}</Typography>
                                                <Typography className={clsx("text-12 font-medium color-grey", networkId === item.id && 'color-ffffff')}>{item.network}</Typography>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="py-16" style={{ paddingTop: 0 }}>
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
                                    style={{ padding: '0 0', margin: '0.2rem 0rem 1.4rem 1rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
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
                                        padding: '1rem 1rem',
                                    }}
                                >
                                    {Object.entries([t('card_8'), t('card_7')]).map(([key, label]) => (
                                        <Tab
                                            className="text-16 font-semibold min-h-32 min-w-60 mx4 px-12 txtColorTitle opacity-100 zindex"
                                            disableRipple
                                            key={key}
                                            label={label}
                                            sx={{
                                                color: '#FFFFFF', height: '32px', width: 'auto', marginRight: "1rem"
                                            }}
                                        />
                                    ))}
                                </Tabs>

                                {
                                    smallTabValue === 0 && <div className="px-10 ">
                                        <div className="flex items-center justify-between">
                                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputVal.address}
                                                    onChange={handleChangeInputVal('address')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'address',
                                                    }}
                                                />
                                                <div className='flex pasteSty  items-center'>
                                                    <div className='paste-btn' onClick={() => {
                                                        const clipPromise = navigator.clipboard.readText();
                                                        clipPromise.then(clipText => {
                                                            changeAddress('address', clipText)
                                                        })
                                                    }}>{t('home_withdraw_11')}</div>
                                                    <img className='pasteJianTou' src="wallet/assets/images/withdraw/pasteJianTou.png" alt="" onClick={() => {
                                                        setOpenPasteWindow(true)
                                                        openPasteFunc()
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

                                        <Typography className="text-16 cursor-pointer mt-16">
                                            {t('home_withdraw_3')}
                                        </Typography>
                                        <div className="flex items-center py-16 justify-between" style={{}}>
                                            <FormControl sx={{ width: '68%', borderColor: '#94A3B8' }} variant="outlined">
                                                <TextField
                                                    error={ismore(inputVal.amount)}
                                                    helperText={ismore(inputVal.amount) ? t('home_deposite_28') : ''}
                                                    step="0.000001"
                                                    id="outlined-adornment-address send-tips-container-amount"
                                                    value={inputVal.amount}
                                                    onChange={handleChangeInputVal('amount')}
                                                    endAdornment={<InputAdornment position="end">
                                                        <Typography className="text-16 font-medium cursor-pointer color-2DD4BF">
                                                            {t('home_withdraw_5')}
                                                        </Typography>
                                                    </InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'amount',
                                                    }}
                                                    type="number"
                                                    FormHelperTextProps={{ className: "form-helper-text" }}
                                                />
                                            </FormControl>
                                            <div
                                                className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'HIGHER' && 'withdraw-input-item-right-active')}
                                                onClick={() => {
                                                    setAmountTab('HIGHER')
                                                }}
                                            >
                                                {t('home_withdraw_12')}
                                            </div>
                                            <div
                                                className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'LOW' && 'withdraw-input-item-right-active')}
                                                onClick={() => {
                                                    setAmountTab('LOW')
                                                }}
                                            >
                                                {t('home_withdraw_13')}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between my-16" style={{ marginTop: 0 }}>
                                            <Typography className="text-16 cursor-pointer ">
                                                <p style={{ fontSize: '1.3rem' }}> {t('home_withdraw_7')}: {fee}  {symbol}</p>
                                            </Typography>
                                            <Typography
                                                className="text-16 cursor-pointer color-2DD4BF"
                                                onClick={() => {
                                                    if (!bAppendFee) {
                                                        setBAppendFee(true);
                                                        changeAddress('amount', Number(inputVal.amount) + Number(fee));
                                                    } else {
                                                        setBAppendFee(false);
                                                        changeAddress('amount', Number(inputVal.amount) - Number(fee));
                                                    }
                                                    evalFee(symbol, networkId, amountTab)
                                                }}
                                            >
                                                <p style={{ fontSize: '1.3rem' }}>{t('home_withdraw_8')}</p>
                                            </Typography>
                                        </div>

                                        <Box
                                            className="py-8 mb-20"
                                            sx={{
                                                backgroundColor: '#0F172A',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <Typography className="text-14 px-16 ">
                                                <span style={{ color: '#FCE100' }}>⚠</span> {t('home_withdraw_15')}{TransactionFee}  {symbol}{t('home_withdraw_16')}{t('home_withdraw_17')}
                                            </Typography>
                                        </Box>

                                        <LoadingButton
                                            disabled={ismore(inputVal.amount)}
                                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                                            color="secondary"
                                            loading={openLoad}
                                            variant="contained"
                                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                            style={{ width: '100%', height: '4rem', fontSize: "20px", margin: '3rem auto 1rem auto', display: 'block', lineHeight: "inherit", padding: "0px" }}
                                            onClick={() => {
                                                isBindPin()
                                            }}
                                        >
                                            {t('home_withdraw_10')}
                                        </LoadingButton>
                                    </div>
                                }

                                {
                                    smallTabValue === 1 && <div className="px-10 ">
                                        <div className="flex items-center justify-between ">
                                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputIDVal}
                                                    onChange={handleChangeInputVal2}
                                                    aria-describedby="outlined-weight-helper-text"
                                                />
                                                <div className='flex pasteSty  items-center'>
                                                    <div className='paste-btn' onClick={() => {
                                                        const clipPromise = navigator.clipboard.readText();
                                                        clipPromise.then(clipText => {
                                                            setInputIDVal(clipText)
                                                        })
                                                    }}>{t('home_withdraw_11')}</div>
                                                    <img className='pasteJianTou' src="wallet/assets/images/withdraw/pasteJianTou.png" alt="" onClick={() => {
                                                        setOpenPasteWindow(true)
                                                    }} />
                                                </div>
                                            </FormControl>
                                            {
                                                isMobileMedia &&
                                                <img className='shaoMiaoIcon ' src="wallet/assets/images/withdraw/code.png" alt="" onClick={() => {
                                                    setOpenChangeCurrency(true);
                                                }} />
                                            }
                                        </div>

                                        <Typography className="text-16 cursor-pointer mt-16" >
                                            {t('home_withdraw_3')}
                                        </Typography>
                                        <div className="flex items-center justify-between" style={{ paddingTop: "1.6rem", paddingBottom: "0.5rem" }}>
                                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                                <TextField
                                                    error={ismore(inputVal.amount)}
                                                    helperText={ismore(inputVal.amount) ? t('home_deposite_28') : ''}
                                                    step="0.000001"
                                                    id="outlined-adornment-address send-tips-container-amount"
                                                    value={inputVal.amount}
                                                    onChange={handleChangeInputVal('amount')}
                                                    endAdornment={<InputAdornment position="end">
                                                        <Typography className="text-16 font-medium cursor-pointer color-2DD4BF">
                                                            {t('home_withdraw_5')}
                                                        </Typography>
                                                    </InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'amount',
                                                    }}
                                                    type="number"
                                                    FormHelperTextProps={{ className: "form-helper-text" }}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="flex items-center mb-20 justify-content-start " style={{}}>
                                            {/* <Checkbox defaultChecked /> */}
                                            {/* <Typography style={{ fontSize: '1.4rem' }}>
                                                {t('home_sendTips_8')}
                                            </Typography> */}
                                        </div>

                                        <LoadingButton
                                            disabled={openPinWindow}
                                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                                            color="secondary"
                                            loading={openPinWindow}
                                            variant="contained"
                                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                            style={{ width: '100%', height: '4rem', fontSize: "20px", margin: '1.4rem auto 1rem auto', display: 'block', lineHeight: "inherit", padding: "0px" }}
                                            onClick={() => {
                                                isBindPin()
                                            }}
                                        >
                                            {t('home_withdraw_10')}
                                        </LoadingButton>
                                    </div>
                                }

                            </div>

                        </Box>
                    </motion.div>
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
                                <Box
                                    className="dialog-content-inner dialog-content-paste-width border-r-5" style={{ width: "100%" }}
                                >
                                    {
                                        historyAddress.map((item, index) => {
                                            return (
                                                <div className='dialog-item' key={index} style={{ margin: "10px auto" }} >
                                                    <Typography className="text-14 px-16 dialog-withdraw-text"
                                                        onClick={() => {
                                                            setOpenWithdrawLog(false);
                                                            changeAddress('address', item)
                                                        }}
                                                    >
                                                        {item}
                                                    </Typography>
                                                    <IconButton onClick={() => { handleCopyText(item) }}>
                                                        <img src="wallet/assets/images/deposite/copy.png" alt="" />
                                                    </IconButton>
                                                    <IconButton onClick={() => { del(item) }}>
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
                    {/*<BootstrapDialog*/}
                    {/*    onClose={() => { setOpenGoogleCode(false); }}*/}
                    {/*    aria-labelledby="customized-dialog-title"*/}
                    {/*    open={openGoogleCode}*/}
                    {/*>*/}
                    {/*    <DialogContent dividers>*/}
                    {/*        <div className="mt-8">*/}
                    {/*            <Typography className="text-18 px-16 my-12 font-medium">Google Code</Typography>*/}
                    {/*            <OtpPass setGoogleCode={setGoogleCode} />*/}
                    {/*        </div>*/}
                    {/*    </DialogContent>*/}
                    {/*</BootstrapDialog>*/}

                    {/*提虚拟币界面样式*/}
                    <BootstrapDialog
                        onClose={() => { setOpenTiBi(false); }}
                        aria-labelledby="customized-dialog-title"
                        open={openTiBi}
                        className="dialog-container"
                    >
                        <DialogContent dividers >
                            <div className='dialog-box' >
                                <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                    <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                        setOpenTiBi(false)
                                        setOpenLoad(false)
                                    }} alt="close icon" />
                                </Typography>
                            </div>
                            <Box className="dialog-content dialog-content-paste-height " style={{ paddingRight: "0px", height: "580px" }}>
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="dialog-content-inner  border-r-5">
                                    <motion.div variants={item}>
                                        <img style={{ margin: "0 auto", width: "60px", height: "60px", marginTop: "10px" }} src='wallet/assets/images/wallet/naoZhong.png'></img>
                                    </motion.div>
                                    <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "20px", fontSize: "24px" }}>-{inputVal.amount} {symbol}</motion.div>
                                    <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "10px", fontSize: "16px", color: "#ffc600" }}>● {t('home_PendingReview')}</motion.div>
                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                        <div style={{ color: "#888B92" }}>{t('home_NetWork')}</div>
                                        <div>{walletName}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                        <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                                        <div>Crypto</div>
                                    </motion.div>
                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_withdraw_14')}</div>
                                        <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.address}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                                        <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{withDrawOrderID}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_sendTips_5')}</div>
                                        <div>{fee} {symbol}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                                        <div>{getNowTime()}</div>
                                    </motion.div>
                                </motion.div>
                            </Box>
                        </DialogContent>
                    </BootstrapDialog>

                </div>}

                {tabValue === fiatSelect && <Fiat />}

                {/* {tabValue === 2 && <Nft />} */}

                {/*打开粘贴板*/}
                {/* <BootstrapDialog
                    onClose={() => {setOpenPaste(false)}}
                    aria-labelledby="customized-dialog-title"
                    open={openPaste}
                    className="dialog-container"
                >
                    <DialogContent dividers>
                        <div className='dialog-box'>
                            <Typography className="text-24 px-16 font-furore dialog-title-text">Withdraw Address
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {setOpenPaste(false)}} alt="close icon"/>
                            </Typography>

                        </div>
                    </DialogContent>
                </BootstrapDialog> */}

                {/*Select Fiat*/}
                {/* <BootstrapDialog
                    onClose={() => {setOpenPaste(false)}}
                    aria-labelledby="customized-dialog-title"
                    open={openPaste}
                    className="dialog-container"
                >
                    <DialogContent dividers>
                        <div className='dialog-box'>
                            <Typography className="text-24 px-16 font-furore dialog-title-text">Select Fiat
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {setOpenPaste(false)}} alt="close icon"/>
                            </Typography>
                            <Box className="dialog-content dialog-content-select-fiat-height">
                                <Box
                                    className="dialog-content-inner dialog-content-select-fiat-width border-r-5"
                                    sx={{
                                        backgroundColor: '#1e293b',
                                        padding: '1.5rem',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Typography className="text-14 font-medium" style={{marginBottom: '2rem'}}>
                                    Please note that these are currency approximations.
                                    All bets & transactions will be settled in the
                                    cryptoequivalent. For further details feel free to
                                    contact our live support.
                                    </Typography>
                                    <div className='dialog-select-fiat'>
                                        {
                                            [1,1,1,1,1,1,1,1,1,1].map((item, index) => {
                                                return (
                                                    <div className='dialog-select-fiat-item border-r-5 flex items-center justify-start' key={index}>
                                                        <img src="wallet/assets/images/deposite/bnb.png" className='dialog-select-fiat-icon border-r-5' alt=""/>
                                                        <Typography className="text-14">USD</Typography>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Box>
                            </Box>
                        </div>
                    </DialogContent>
                </BootstrapDialog> */}


            </div>

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


            <BootstrapDialog
                onClose={() => {
                    closePinFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openPinWindow}
                className="dialog-container"
            >
                <div id="PINSty" className="PINSty">

                    {openSuccess && <div id='pinDivHeight'>
                        <div className='pinWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_65')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closePinFunc();
                                }} />
                            </div>
                            <div className='PINTitle'>{t('home_wallet_14')}{ smallTabValue == 0 ? t('card_8') : t('card_7')}（ {  smallTabValue == 0 ? inputVal.address : inputIDVal } ）{t('transfer_1')}</div>
                            <div className='flex justify-center' style={{ borderBottom: "1px solid #2C3950", paddingBottom: "3rem" }}>
                                <img className='MoneyWithdraw' src="wallet/assets/images/withdraw/USDT.png"></img>
                                <div className='PINTitle3'>USDT</div>
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
                                {!isLoadingBtn &&
                                    <div id='zhuanZhangWanCheng' className='jianPanBtn3'
                                        onTouchStart={changeToBlack}
                                        onTouchEnd={changeToWhite}
                                        onTouchCancel={changeToWhite}
                                        onClick={() => {
                                            smallTabValue=== 0 ?  handleSubmit() : handleSendTipsSubmit()
                                        }}>{t('card_30')}</div>
                                }
                            </div>
                        </div>
                    </div>}
                    {!openSuccess && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{ height: `${divHeight}px` }}
                    >
                        <div className='dialog-box' >
                            <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                    closePinFunc();
                                }} />
                            </Typography>
                        </div>

                        <div className='daGouDingWei' style={{ position: "relative" }}>
                            <motion.div variants={item} className=' daGouDingWei1' style={{ position: "absolute", width: "100px", height: "100px", paddingTop: "10px" }}>
                                <div className='daGouDingWei1' style={{ position: "absolute" }}>
                                    <img style={{ margin: "0 auto", width: "60px", height: "60px" }} src='wallet/assets/images/wallet/naoZhong2.png'></img>
                                </div>
                                <div className='daGouDingWei1' style={{ marginLeft: "58px", position: "absolute" }}>
                                    {
                                        zhuanQuan && <img className='chuKuanDongHua' style={{ width: "22px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong3.png'></img>
                                    }
                                    {
                                        !zhuanQuan && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong4.png'></img>
                                    }
                                </div>
                            </motion.div>
                        </div>

                        <div style={{ margin: "0 auto", textAlign: "center", marginTop: "84px", height: "23px", fontSize: "16px", color: "#2ECB71" }}>
                            {
                                !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                    ● {t('errorMsg_1')}
                                </motion.div>
                            }
                        </div>

                        <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "8px", fontSize: "24px" }}> -{inputVal.amount} {symbol}</motion.div>
                        <motion.div variants={item} className='mx-20  mt-24' style={{ borderTop: "1px solid #2C3950" }}>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                            <div>{t('home_deposite_1')}</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('card_7')}</div>
                            <div style={{ width: "50%", wordWrap: "break-word", textAlign: "right" }}>{inputIDVal}</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_borrow_18')}</div>
                            <div>0 {symbol} </div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                            <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{currRequestId}</div>
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
                    setCreatePinWindow(true)
                    openCreatePinFunc()
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
                            setOpenYanZheng(true);
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
    )
}

export default Withdraw;
