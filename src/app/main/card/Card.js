import { useState, useEffect, default as React, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { selectConfig, setSwapConfig } from "../../store/config";
import { arrayLookup, setPhoneTab, getNowTime, getUserLoginType } from "../../util/tools/function";
import Dialog from "@mui/material/Dialog/Dialog";
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from "react-i18next";
import AnimateModal from "../../components/FuniModal";
import LoadingButton from "@mui/lab/LoadingButton";
import FuseLoading from '@fuse/core/FuseLoading';
import history from '@history';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import {
    getKycInfo,
    applyCreditCard,
    creditCardUpdate,
    creditCardCryptoDeposit,
    creditCardCryptoWithdraw,
    getCreditConfig,
    getUserCreditCard,
    exchangeCreditCard,
    getCreditCardBalance
} from "app/store/payment/paymentThunk";
import { createPin, verifyPin } from "app/store/wallet/walletThunk";
import { showMessage } from "app/store/fuse/messageSlice";
import { borderBottom } from '@mui/system';
import Kyc from "../kyc/Kyc";
import InputLabel from '@mui/material/InputLabel';
import _ from 'lodash';
import { selectCurrentLanguage } from "app/store/i18nSlice";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Enable2FA from "../2fa/Enable2FA";
import { centerGetTokenBalanceList, userProfile, sendEmail, sendSms } from "app/store/user/userThunk";
import { centerGetUserFiat } from "app/store/wallet/walletThunk";
import moment from 'moment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import userLoginType from "../../define/userLoginType";
import RetiedEmail from "../login/RetiedEmail";
import RetiedPhone from "../login/RetiedPhone";
import MenuItem from '@mui/material/MenuItem';
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginTop: "2rem",
    border: 'none',
    borderRadius: '8px!important',
    backgroundColor: '#374252!important',
    marginBottom: 24,
    '&:before': {
        display: 'none',
    },
    '&:first-of-type': {},
    '&:last-of-type': {
        marginBottom: 0,
    },
}));

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};



function Card(props) {
    const { t } = useTranslation('mainPage');
    const userData = useSelector(selectUserData);
    const currentLanguage = useSelector(selectCurrentLanguage);
    const [tabValue, setTabValue] = useState(0);
    const [ranges, setRanges] = useState([t('card_2'), t('card_9')]);
    const [huaZhuanRanges, setHuaZhuanRanges] = useState([t('card_170'), t('card_171')]);
    const [smallTabValue, setSmallTabValue] = useState(0);
    const [kaBeiButton, setKaBeiButton] = useState(false);
    const [kaBeiButton2, setKaBeiButton2] = useState(true);
    const [fanZhuan, setFanZhuan] = useState(false);
    const [openXiangQing, setOpenXiangQing] = useState(false);
    const [openKyc, setOpenKyc] = useState(false);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [openCardBtnShow, setOpenCardBtnShow] = useState(false);
    const [openAnimateHuanKa, setOpenAnimateHuanKa] = useState(false);
    const [isOpenEye, setIsOpenEye] = useState(false);
    const [openRecordWindow, setOpenRecordWindow] = useState(false);
    const [openApplyWindow, setOpenApplyWindow] = useState(false);
    const [openPassWordWindow, setOpenPassWordWindow] = useState(false);
    const [openBindWindow, setOpenBindWindow] = useState(false);
    const [openJiHuoWindow, setOpenJiHuoWindow] = useState(false);
    const [applyOver, setApplyOver] = useState(false);
    const [symbol, setSymbol] = useState('');
    const walletData = useSelector(selectUserData).wallet || {};
    const config = useSelector(selectConfig);
    const symbols = config.symbols;
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [cardExpandedStatus, setCardExpandedStatus] = useState(false);
    const [openZhiFu, setOpenZhiFu] = useState(false);
    const [openChongZhi, setOpenChongZhi] = useState(false);
    const [huaZhuanValue, setHuaZhuanValue] = useState(0);
    const [openChangeBi, setOpenChangeBi] = useState(false);
    const [address, setAddress] = useState("");
    const [lookDataId, setLookDataId] = useState("");
    const [openPinWindow, setOpenPinWindow] = useState(false);
    const [movePinWindow, setMovePinWindow] = useState(false);
    const [createPinWindow, setCreatePinWindow] = useState(false);
    const [openPinErr, setOpenPinErr] = useState(false);
    const [openGoogleCode, setOpenGoogleCode] = useState(false);
    const [googleCode, setGoogleCode] = useState('');
    const [textSelect, setTextSelect] = useState(false);
    const [showGuangBiao, setShowGuangBiao] = useState(false);
    const [correctPin, setCorrectPin] = useState(false);
    const hasAuthGoogle = userData.userInfo?.hasAuthGoogle;
    const hasAuthEmail = userData.userInfo?.bindEmail;
    const hasAuthPhone = userData.userInfo?.bindMobile;
    const [twiceVerifyType, setTwiceVerifyType] = useState(0);
    const [typeBinded, setTypeBined] = useState(false);
    const [openYanZheng, setOpenYanZheng] = useState(false);
    const [openGoogleAnimateModal, setOpenGoogleAnimateModal] = useState(false);
    const [maxValue, setMaxValue] = useState(0);
    const [pinForFanKa, setPinForFanKa] = useState(false);
    const [currentCardItem, setCurrentCardItem] = useState(null);
    const [cardHeight, setCardHeight] = useState(0);
    const [cardFlexibleHeight, setCardFlexibleHeight] = useState(false);
    const [openKycAddress, setOpenKycAddress] = useState(false);
    const [openKycAuth, setOpenKycAuth] = useState(false);
    const [addressKyc, setAddressKyc] = useState("location1");

    const divRef = useRef(null);
    const [pin, setPin] = useState('');
    const [hasPin, setHasPin] = useState(false)

    const [openBindEmail, setOpenBindEmail] = useState(false);
    const [openBindPhone, setOpenBindPhone] = useState(false);

    const [swapRate, setSwapRate] = useState(0);
    const [exchangeCreditFee, setExchangeCreditFee] = useState(0);
    const [balanceNotEnough, setBalanceNotEnough] = useState(false);
    const [updatedKycInfoFlag, setUpdatedKycInfoFlag] = useState(false);

    const openPinFunc = () => {
        setTimeout(() => {
            document.getElementById('PINSty').classList.add('PinMoveAni');
        }, 0);
    };

    const openGoogleCodeFunc = () => {
        setOpenGoogleCode(true);
        setTimeout(() => {
            document.getElementById('GoogleCodeSty').classList.add('PinMoveAni');
        }, 0);
    };

    const closePinFunc = () => {
        document.getElementById('PINSty') && document.getElementById('PINSty').classList.remove('PinMoveAni');
        document.getElementById('PINSty') && document.getElementById('PINSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPinWindow(false);
            setOpenSuccess(true);
            setIsLoadingBtn(false);
            setZhuanQuan(true);
            setTiJiaoState(0);
        }, 300);
    };

    const closeGoogleCodeFunc = () => {
        document.getElementById('GoogleCodeSty') && document.getElementById('GoogleCodeSty').classList.remove('PinMoveAni');
        document.getElementById('GoogleCodeSty') && document.getElementById('GoogleCodeSty').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenGoogleCode(false);
        }, 300);
    };

    // 判断是否绑定了PIN
    const isBindPin = () => {
        if (hasPin) {
            if (transferMoney <= 0) {
                setTextSelect(true)
                setShowGuangBiao(true)
            } else {
                setTextSelect(false)
                setShowGuangBiao(false)
            }
            if (huaZhuanValue === 0) {
                if (transferMoney <= symbolWallet[0].balance) {
                    openInputPin()
                } else {
                    setOpenChongZhi(true)
                    setPin('')
                }
            } else if (huaZhuanValue === 1) {
                if (transferMoney <= cardListObj[cardID]?.amount) {
                    openInputPin()
                } else {
                    setOpenChongZhi(true)
                    setPin('')
                }
            }
            return true
        }
        openCreatePin()
        return false
    }

    // 判断是否绑定了PIN
    const checkBindPin = () => {
        if (hasPin) {
            openInputPin()
            return true
        }
        openCreatePin()
        return false
    }

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
        let tmpText = transferMoney.toString()
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

        setTransferMoney(tmpText === 0 ? '' : tmpText);
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
                        setCorrectPin(false);
                        errPin()
                    } else {
                        setCorrectPin(true);
                    }
                })
            } else { // 创建pin
                setOpenPinWindow(false);
                dispatch(createPin({
                    paymentPassword: tmpPin
                })).then((res) => {
                    if (res.payload) {
                        setHasPin(true)
                        closeCreatePinFunc()
                        dispatch(showMessage({ message: 'success', code: 1 }));
                    }
                })
            }
        }
    }

    useEffect(() => {
        getCardConfig()
        getCardList()
        setHasPin(userData.profile?.user?.hasSetPaymentPassword ?? false)
        refreshKycInfo()
    }, [userData.profile]);

    useEffect(() => {
        setRanges([t('card_2'), t('card_9')]);
        setHuaZhuanRanges([t('card_170'), t('card_171')]);
    }, [currentLanguage.id]);

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    const handleImgClick = (e, action, cardItem) => {
        e.stopPropagation(); // 阻止事件冒泡
        action(cardItem); // 执行传入的动作函数
    };

    const myFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    const handleChangeInputVal = (event) => {
        setAddressKyc(event.target.value);
    };




    const FanKa = (cardItem) => {
        const pinObj = window.localStorage.getItem('checkedPin') && JSON.parse(window.localStorage.getItem('checkedPin'))
        if (pinObj && pinObj.checked && pinObj.expired && (pinObj.expired - new Date().getTime() > 0)) {
            const tmpCardList = { 2: [], 3: [] }
            if (smallTabValue === 0) {
                if (cardList[2].length > 0) {
                    cardList[2].forEach((card, i) => {
                        if (cardItem.id === card.id) {
                            const targetCardItem = { ...card, kaBeiButton: true };
                            document.getElementById('responsive-div' + i) && document.getElementById('responsive-div' + i).classList.add('flipped');
                            // await delay(2000);
                            targetCardItem.showFrontCard = true;
                            // setTimeout(() => {
                            //     targetCardItem.showFrontCard = true;
                            // }, 200);
                            // await delay(2000);
                            targetCardItem.kaBeiButton2 = false;
                            document.querySelector(`#responsive-div${i} .card4Bg`).classList.add('alphaCard_1');
                            // document.getElementById('cardIconWTwo'+ i) && document.getElementById('cardIconWTwo'+ i).classList.add('alphaCard');
                            // document.getElementById('zhangDanZiTwo'+ i) && document.getElementById('zhangDanZiTwo'+ i).classList.add('alphaCard');
                            // setTimeout(() => {
                            //     targetCardItem.kaBeiButton2 = true;
                            //     document.getElementById('cardIconWTwo') && document.getElementById('cardIconWTwo').classList.add('alphaCard');
                            //     document.getElementById('zhangDanZiTwo') && document.getElementById('zhangDanZiTwo').classList.add('alphaCard');
                            // }, 400);
                            tmpCardList[2].push(targetCardItem)
                        } else {
                            tmpCardList[2].push(card)
                        }
                    })
                }
            } else if (smallTabValue === 1) {
                // 实体卡暂未处理
                if (cardList[3].length > 0) {
                    cardList[3].forEach((card, i) => {
                        if (cardItem.id === card.id) {
                            tmpCardList[3].push({ ...card, showFrontCard: !cardItem.showFrontCard })
                        } else {
                            tmpCardList[3].push(card)
                        }
                    })
                }
            }
            setCardList(tmpCardList)
        } else {
            setCurrentCardItem(cardItem);
            setPinForFanKa(true)
            checkBindPin()
        }
    };

    const FanKaBei = (cardItem) => {
        const tmpCardList = { 2: [], 3: [] }
        if (smallTabValue === 0) {
            if (cardList[2].length > 0) {
                cardList[2].forEach((card, i) => {
                    if (cardItem.id === card.id) {
                        const targetCardItem = { ...card, kaBeiButton2: true };
                        document.getElementById('responsive-div' + i) && document.getElementById('responsive-div' + i).classList.remove('flipped');
                        // setTimeout(() => {
                        //     targetCardItem.showFrontCard = false;
                        // }, 200);
                        targetCardItem.showFrontCard = false;
                        targetCardItem.kaBeiButton = false;
                        document.querySelector(`#responsive-div${i} .card41Bg`).classList.add('alphaCard_1');
                        // document.getElementById('cardIconWOne'+ i) && document.getElementById('cardIconWOne'+ i).classList.add('alphaCard');
                        // document.getElementById('zhangDanZiOne'+ i) && document.getElementById('zhangDanZiOne'+ i).classList.add('alphaCard');
                        // document.getElementById('cardNumberOne'+ i) && document.getElementById('cardNumberOne'+ i).classList.add('alphaCard');
                        // setTimeout(() => {
                        //     targetCardItem.kaBeiButton = false;
                        //     document.getElementById('cardIconWOne') && document.getElementById('cardIconWOne').classList.add('alphaCard');
                        //     document.getElementById('zhangDanZiOne') && document.getElementById('zhangDanZiOne').classList.add('alphaCard');
                        //     document.getElementById('cardNumberOne') && document.getElementById('cardNumberOne').classList.add('alphaCard');
                        // }, 400);
                        tmpCardList[2].push(targetCardItem)
                    } else {
                        tmpCardList[2].push(card)
                    }
                })
            }
        } else if (smallTabValue === 1) {
            // 实体卡暂未处理
            if (cardList[3].length > 0) {
                cardList[3].forEach((card, i) => {
                    if (cardItem.id === card.id) {
                        tmpCardList[3].push({ ...card, showFrontCard: !cardItem.showFrontCard })
                    } else {
                        tmpCardList[3].push(card)
                    }
                })
            }
        }
        setCardList(tmpCardList)
    };

    useEffect(() => {
        setPhoneTab('card');
        const curLoginType = getUserLoginType(userData);
        if (curLoginType !== userLoginType.USER_LOGIN_TYPE_UNKNOWN) { //登录过以后才会获取余额值
            dispatch(userProfile());
            dispatch(centerGetTokenBalanceList());
            dispatch(centerGetUserFiat());
        }
    }, []);



    const closeRecordFunc = () => {
        document.getElementById('openRecord') && document.getElementById('openRecord').classList.remove('PinMoveAni');
        document.getElementById('openRecord') && document.getElementById('openRecord').classList.add('PinMoveOut');
        setTimeout(() => {
            setTiJiaoState(0);
            setOpenRecordWindow(false);
            setOpenSuccess(true);
            setTransferMoney(0)
            setCardID(0)
        }, 300);
    };


    const closesApplyFunc = () => {
        document.getElementById('openApply').classList.remove('PinMoveAni');
        document.getElementById('openApply').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenApplyWindow(false)
            setApplyOver(false)
        }, 300);
    };

    const closesPassWordFunc = () => {
        document.getElementById('openPassWord').classList.remove('PinMoveAni');
        document.getElementById('openPassWord').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenPassWordWindow(false)
        }, 300);
    };

    const closesBindFunc = () => {
        document.getElementById('openBind').classList.remove('PinMoveAni');
        document.getElementById('openBind').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenBindWindow(false)
        }, 300);
    };

    const closesJiHuoFunc = () => {
        document.getElementById('openJiHuo').classList.remove('PinMoveAni');
        document.getElementById('openJiHuo').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenJiHuoWindow(false)
        }, 300);
    };

    const closeChangeBi = () => {
        document.getElementById('openChangeBi') && document.getElementById('openChangeBi').classList && document.getElementById('openChangeBi').classList.remove('PinMoveAni');
        document.getElementById('openChangeBi') && document.getElementById('openChangeBi').classList && document.getElementById('openChangeBi').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenChangeBi(false)
        }, 300);
    };

    const openChangeBiFunc = () => {
        setOpenChangeBi(true);
        setTimeout(() => {
            document.getElementById('openChangeBi') && document.getElementById('openChangeBi').classList && document.getElementById('openChangeBi').classList.add('PinMoveAni');
        }, 0);
    };

    const openRecordFunc = () => {
        setTimeout(() => {
            document.getElementById('openRecord').classList.add('PinMoveAni');
            getDivHeight("pinDivHeight");
        }, 0);
    };

    const openApplyFunc = () => {
        setTimeout(() => {
            document.getElementById('openApply').classList.add('PinMoveAni');
        }, 0);
        setTimeout(() => {
            setApplyOver(true)
        }, 300);
    };

    const openPassWordFunc = () => {
        setTimeout(() => {
            document.getElementById('openPassWord').classList.add('PinMoveAni');
        }, 0);
    };

    const openBindFunc = () => {
        setTimeout(() => {
            document.getElementById('openBind').classList.add('PinMoveAni');
        }, 0);
    };

    const openJiHuoFunc = () => {
        setTimeout(() => {
            document.getElementById('openJiHuo').classList.add('PinMoveAni');
        }, 0);
    };


    const changeToBlack = (target) => {
        document.getElementById(target.target.id) && document.getElementById(target.target.id).classList && document.getElementById(target.target.id).classList.add('pinJianPanColor1');
    };

    const changeToWhite = (target) => {
        document.getElementById(target.target.id) && document.getElementById(target.target.id).classList && document.getElementById(target.target.id).classList.remove('pinJianPanColor1');
    };


    const openKycFunc = () => {
        // history.push('/wallet/home/security', { tabValue: 4, resetTabValueParam: 1 })
        setOpenKyc(true)
        setTimeout(() => {
            document.getElementById('topGo').scrollIntoView({ behavior: 'smooth' });
        }, 0);
    }

    const defaultValues = {
        oldPassword: '',
        cardNumber: '',
        checkCode: '',
        password: '',
        passwordConfirm: '',
    };


    const getDivHeight = (divName) => {
        setTimeout(() => {
            setDivHeight(document.getElementById(divName).offsetHeight)
        }, 300);
    };

    const getCardHeight = (divName) => {
        setTimeout(() => {
            setDivHeight(document.getElementById(divName).offsetHeight)
        }, 300);
    };


    useEffect(() => {
        window.localStorage.setItem('backBtn', 'card');
        setTimeout(() => {
            document.getElementById("cardHeights") && setCardHeight(document.getElementById("cardHeights").offsetHeight)
        }, 1000);
    }, []);


    const schema = yup.object().shape({
        oldPassword: yup
            .string()
            .required('Please enter your old password.')
            .min(6, t("signUp_8")),
        // .min(6, 'Password is too short - should be 6 chars minimum.'),
        password: yup
            .string()
            .required('Please enter your new password.')
            .max(16, 'Password is too long - should be 16 chars maximum.')
            // .min(6, 'Password is too short - should be 6 chars minimum.'),
            .min(6, t("signUp_8")),
        cardNumber: yup
            .string()
            .required(t("card_100"))
            .min(9, t("card_100")),
        checkCode: yup
            .string()
            .required(t("card_101"))
            .min(6, t("card_101")),

        passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

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


    // 初始化数据
    const initSymbol = () => {
        let tmpSymbol = [];
        let tmpSymbol2 = [];
        let tmpSymbolWallet = [];
        let tmpSymbolWallet2 = [];
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].symbol == 'USDT') {
                if (tmpSymbol.indexOf(symbols[i].symbol) == -1 && symbols[i].symbol != 'eUSDT' && symbols[i].symbol != 'eBGT') {
                    tmpSymbol.push(symbols[i].symbol)
                    tmpSymbolWallet.push({
                        avatar: symbols[i].avatar,
                        balance: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'balance') || 0,
                        symbol: symbols[i].symbol,
                        tradeLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'tradeLock') || 0,
                        withdrawLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'withdrawLock') || 0
                    })
                }
                const tmpSwapRate = arrayLookup(symbols, 'symbol', 'USDT', (huaZhuanValue === 0 ? 'buyRate' : 'sellRate'));
                setSwapRate(tmpSwapRate)
            }

            if (tmpSymbol2.indexOf(symbols[i].symbol) == -1 && symbols[i].symbol != 'eUSDT' && symbols[i].symbol != 'eBGT') {
                tmpSymbol2.push(symbols[i].symbol)
                tmpSymbolWallet2.push({
                    avatar: symbols[i].avatar,
                    balance: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'balance') || 0,
                    symbol: symbols[i].symbol,
                    tradeLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'tradeLock') || 0,
                    withdrawLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'withdrawLock') || 0
                })
            }
        }
        tmpSymbolWallet.sort(sortUseAge)
        tmpSymbolWallet2.sort(sortUseAge)
        setSymbolWallet(tmpSymbolWallet)
        setSymbolList(tmpSymbolWallet)
    }

    useEffect(() => {
        if (symbols) {
            initSymbol()
        }
    }, [symbols, walletData]);




    const refreshKycInfo = () => {
        dispatch(getKycInfo()).then((value) => {
            if (!value.payload) return;
            let tempAddress = value.payload.data.address;
            if (tempAddress) {
                setAddress(tempAddress)
            } else {
                return;
            }
        });
    };


    // !# card逻辑 #!

    const dispatch = useDispatch();
    const [cardConfig, setCardConfig] = useState({ 2: [], 3: [] })
    const [cardConfigList, setCardConfigList] = useState({});
    const [cardConfigID, setCardConfigID] = useState(0);

    const [cardList, setCardList] = useState({ 2: [], 3: [] });
    const [cardListObj, setCardListObj] = useState({});
    const [cardID, setCardID] = useState(0);
    const [transferMoney, setTransferMoney] = useState(0);
    const [transferFee, setTransferFee] = useState(0);
    const [recivedAmount, setRecivedAmount] = useState(0);

    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [symbolList, setSymbolList] = useState([]);
    const [applyFeeSymbol, setApplyFeeSymbol] = useState('USDT');

    const [currUserCardInfo, setCurrUserCardInfo] = useState({});
    const [timer, setTimer] = useState(0);
    const [updateCard, setUpdateCard] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(true);
    const [divHeight, setDivHeight] = useState(0);
    const [zhuanQuan, setZhuanQuan] = useState(true);
    const [tiJiaoState, setTiJiaoState] = useState(0);
    const [cardLanguage, setCardLanguage] = useState([]);

    useEffect(() => {
        if (timer < 5 && updateCard) {
            getCardList();
        } else {
            setUpdateCard(false)
            setTimer(0)
        }
    }, [timer]);


    //获取Config
    const getCardConfig = () => {
        setLoadingShow(false)
        dispatch(getCreditConfig()).then((res) => {
            setLoadingShow(false)
            let result = res.payload
            if (result) {
                let tmpConfig = { 2: [], 3: [] }
                let tmpConfigList = {}
                let tmpLanguageList = []
                result.map((item) => {
                    if (item.state === 1) {
                        if (item.creditType === 2) {
                            tmpConfig[2].push(item)
                            if (item.creditConfigName.includes("线上")) {
                                tmpLanguageList.push(t('card_190'));
                            } else if (item.creditConfigName.includes("购物")) {
                                tmpLanguageList.push(t('card_191'));
                            } else if (item.creditConfigName.includes("消费")) {
                                tmpLanguageList.push(t('card_192'));
                            } else if (item.creditConfigName.includes("投放")) {
                                tmpLanguageList.push(t('card_193'));
                            } else if (item.creditConfigName.includes("采购")) {
                                tmpLanguageList.push(t('card_194'));
                            } else if (item.creditConfigName.includes("苹果")) {
                                tmpLanguageList.push(t('card_251'));
                            }
                        } else if (item.creditType === 3) {
                            tmpConfig[3].push(item)
                            if (item.creditConfigName.includes("线上")) {
                                tmpLanguageList.push(t('card_190'));
                            } else if (item.creditConfigName.includes("购物")) {
                                tmpLanguageList.push(t('card_191'));
                            } else if (item.creditConfigName.includes("消费")) {
                                tmpLanguageList.push(t('card_192'));
                            } else if (item.creditConfigName.includes("投放")) {
                                tmpLanguageList.push(t('card_193'));
                            } else if (item.creditConfigName.includes("采购")) {
                                tmpLanguageList.push(t('card_194'));
                            } else if (item.creditConfigName.includes("苹果")) {
                                tmpLanguageList.push(t('card_251'));
                            }
                        }
                        tmpConfigList[item.configId] = item
                    }
                })
                setCardConfig(tmpConfig)
                setCardConfigList(tmpConfigList)
                setCardLanguage(tmpLanguageList)
            }
        })
    }

    const [clickShenQinCard, setClickShenQinCard] = useState(false);

    const infoShenQinTxt = (type) => {
        if (type?.includes("visa")) {
            if (type?.includes("线上")) {
                return t('card_211')
            }
            if (type?.includes("购物")) {
                return t('card_213')
            }
            if (type?.includes("消费")) {
                return t('card_215')
            }
            if (type?.includes("投放")) {
                return t('card_217')
            }
            if (type?.includes("采购")) {
                return t('card_219')
            }
            if (type?.includes("苹果")) {
                return t('card_255')
            }
        } else if (type?.includes("Master")) {
            if (type?.includes("线上")) {
                return t('card_201')
            }
            if (type?.includes("购物")) {
                return t('card_203')
            }
            if (type?.includes("消费")) {
                return t('card_205')
            }
            if (type?.includes("投放")) {
                return t('card_207')
            }
            if (type?.includes("采购")) {
                return t('card_219')
            }
            if (type?.includes("苹果")) {
                return t('card_255')
            }
        }
        return "";
    }


    const infoShenQinTxt2 = (type) => {
        if (type?.includes("visa")) {
            if (type?.includes("线上")) {
                return t('card_212')
            }
            if (type?.includes("购物")) {
                return t('card_214')
            }
            if (type?.includes("消费")) {
                return t('card_216')
            }
            if (type?.includes("投放")) {
                return t('card_218')
            }
            if (type?.includes("采购")) {
                return t('card_220')
            }
            if (type?.includes("苹果")) {
                return t('card_254')
            }
        } else if (type?.includes("Master")) {
            if (type?.includes("线上")) {
                return t('card_202')
            }
            if (type?.includes("购物")) {
                return t('card_204')
            }
            if (type?.includes("消费")) {
                return t('card_206')
            }
            if (type?.includes("投放")) {
                return t('card_208')
            }
            if (type?.includes("采购")) {
                return t('card_210')
            }
            if (type?.includes("苹果")) {
                return t('card_254')
            }
        }
        return "";
    }
    const exChangeCard = () => {
        setOpenCardBtnShow(true)
        dispatch(exchangeCreditCard({
            creditType: currUserCardInfo.creditType,
            userCreditId: currUserCardInfo.id
        })).then((res) => {
            const result = res.payload;
            if (result.errno === 0) {
                if (result.data.status === 'success') {
                    dispatch(showMessage({ message: result.errmsg, code: 1 }));
                    setUpdateCard(true)
                    setTimer(timer + 1)
                    setOpenCardBtnShow(false)
                    setCurrentCardItem(null);
                    setTabValue(0);
                    closeChangeBi();
                    setOpenAnimateHuanKa(false);
                    setExchangeCreditFee(0);
                    setBalanceNotEnough(false);
                    myFunction();
                } else {
                    dispatch(showMessage({ message: result.data.msg, code: 2 }));
                    setBalanceNotEnough(false);
                    setOpenCardBtnShow(false)
                }
            } else if (result.errno === -1) {
                if (result.errmsg.includes("wallet balance not enough")) {
                    dispatch(showMessage({ message: t('card_61'), code: 2 }));
                } else {
                    dispatch(showMessage({ message: result.errmsg, code: 2 }));
                }
                setBalanceNotEnough(true);
                setOpenCardBtnShow(false)
            } else {
                dispatch(showMessage({ message: result.errmsg, code: 2 }));
                setBalanceNotEnough(false);
                setOpenCardBtnShow(false)
            }
        })
    }
    // 申请卡
    const applyCard = () => {
        setIsLoadingBtn(true)
        dispatch(applyCreditCard({
            creditType: cardConfigList[cardConfigID].creditType,
            quotaAmount: 1,
            applyFeeSymbol: applyFeeSymbol,
            configId: cardConfigList[cardConfigID].configId,
            applyDesc: 'card applyDesc'
        })).then((res) => {
            let result = res.payload
            setUpdateCard(true)
            setTimer(timer + 1)
            setIsLoadingBtn(false)
            setOpenXiangQing(false);
            setClickShenQinCard(false);
            setCurrentCardItem(null);
            setTabValue(0);
            closeChangeBi();
            myFunction();
        })
    }

    //更改卡的状态参数1是冻卡
    const cardUpdate = (cardChangetype) => {
        setOpenCardBtnShow(true);
        dispatch(creditCardUpdate({
            creditType: currUserCardInfo.creditType,
            userCreditId: currUserCardInfo.id,
            updateType: cardChangetype,
        })).then((res) => {
            setOpenAnimateModal(false);
            setOpenCardBtnShow(false);
            // getCardList();
            setUpdateCard(true)
            setTimer(timer + 1)
            myFunction();
        })
    }



    // 获取卡列表
    const getCardList = () => {
        dispatch(getUserCreditCard()).then((res) => {
            setLoadingShow(false)
            let result = res.payload
            let tmpCardList = { 2: [], 3: [] }
            let tmpCardListObj = {}
            if (result) {
                result.map((item) => {
                    if (item.creditType === 2) {
                        tmpCardList[2].push({ ...item, showFrontCard: false, kaBeiButton: false, kaBeiButton2: true })
                    } else if (item.creditType === 3) {
                        tmpCardList[3].push({ ...item, showFrontCard: false, kaBeiButton: false, kaBeiButton2: true })
                    }
                    tmpCardListObj[item.id] = item
                })
                setCardList(tmpCardList)
                setCardListObj(tmpCardListObj)
                setTimeout(() => {
                    setTimer(timer + 1)
                }, 1000)
            }
        })
    }

    useEffect(() => {
        if (googleCode.length === 6) {
            if (huaZhuanValue === 0) {
                doTransferCrypto()
            } else {
                doTransferCrypto(0)
            }
        }

    }, [googleCode]);

    /*
    * 信用卡划转(crypto)
    *
    * oprate 默认1 转入 / 0 转出
    * */
    const doTransferCrypto = (oprate = 1) => {
        setIsLoadingBtn(true)
        let doFun
        if (oprate === 1) {
            doFun = creditCardCryptoDeposit
        } else {
            doFun = creditCardCryptoWithdraw
        }
        if (googleCode.length === 6) {
            setOpenRecordWindow(true)
        }
        setOpenPinWindow(false)
        setOpenSuccess(false);
        setZhuanQuan(true);
        dispatch(doFun({
            userCreditId: cardID,
            creditType: cardListObj[cardID].creditType,
            symbol: symbol,
            chain: 'trc',
            amount: transferMoney,
            checkCode: googleCode,
            codeType: twiceVerifyType === 0 ? 2 : twiceVerifyType === 1 ? 1 : 0
        })).then((res) => {
            setIsLoadingBtn(false)
            let result = res.payload
            setGoogleCode('');
            // setOpenPinWindow(false);
            if (result.errno == -2) {
                setOpenRecordWindow(false)
                setOpenSuccess(true);
                // if (!hasAuthGoogle) {
                //     closePinFunc()
                //     setOpenGoogleAnimateModal(true)
                //     return;
                // }
                setTwiceVerifyType(0);
                setTypeBined(hasAuthEmail ? true : false);
                // if (!hasAuthGoogle) {
                //     closePinFunc()
                //     setOpenAnimateModal(true);
                //     return;
                // }
                openGoogleCodeFunc()
                return
            } else if (result.errno === 0) {
                setLookDataId(result.data && result.data.mchOrderNo)
                if (result.data) {
                    if (result.data.status === 'success') {
                        closeGoogleCodeFunc();
                        setZhuanQuan(false);
                        setTiJiaoState(1);
                        setUpdateCard(true)
                        dispatch(centerGetTokenBalanceList({ forceUpdate: true}));
                        setUpdateCard(true)
                        setTimer(timer + 1)
                        // setOpenSuccess(true);
                        // closeRecordFunc()
                        // myFunction();
                    } else if (result.data.status === 'transferring') {
                        closeGoogleCodeFunc();
                        setZhuanQuan(false);
                        setTiJiaoState(3);
                        setUpdateCard(true)
                        dispatch(centerGetTokenBalanceList({ forceUpdate: true}));
                        setUpdateCard(true)
                        setTimer(timer + 1)
                        // setOpenSuccess(true);
                        // closeRecordFunc()
                        // myFunction();
                    } else {
                        setZhuanQuan(false);
                        setTiJiaoState(2);
                        // setOpenSuccess(true);
                        if (result.data.msg.includes("security code error")) {
                            dispatch(showMessage({ message: t('card_224'), code: 2 }));
                        } else {
                            dispatch(showMessage({ message: result.data.msg, code: 2 }));
                        }

                    }
                }
            } else {
                setZhuanQuan(false);
                // setOpenSuccess(true);
                setTiJiaoState(2);
                if (result.errmsg.includes("security code error")) {
                    dispatch(showMessage({ message: t('card_224'), code: 2 }));
                }
            }
        })
    }


    const handleTransferCrypto = () => {
        if (huaZhuanValue === 0) {
            doTransferCrypto()
        } else {
            doTransferCrypto(0)
        }
    }

    // 输入金额
    const handleDoMoney = (text) => {
        let tmpText = transferMoney.toString()
        if (tmpText == 0 && tmpText[1] !== '.') {
            tmpText = ''
        }
        if (text === -1) {
            tmpText = tmpText.slice(0, -1)
        } else if (text === '.') {
            if (!tmpText.includes(text)) {
                tmpText = tmpText + text
                if (!tmpText.split('.')[0]) {
                    tmpText = '0' + text
                }
            }
        } else {
            tmpText = tmpText + text
        }

        setMaxValue(0)
        setTransferMoney(tmpText === '0' ? '' : tmpText);
    }

    const verifiedVAuthEvt = () => {
        setOpenYanZheng(false);
        setOpenGoogleCode(true);
        dispatch(userProfile({ forceUpdate: true}));
        setTypeBined(true);
    }

    useEffect(() => {
        setLoadingShow(true);
        getCardConfig()
        getCardList()
    }, []);

    useEffect(() => {
        if (cardID) {
            if (huaZhuanValue === 0) {
                //划入
                let tmpTransferFeeIn = 0
                if (transferMoney) {
                    tmpTransferFeeIn = Number(maxValue ? maxValue : transferMoney) * Number(cardConfigList[cardConfigID].creditRate) + Number(cardConfigList[cardConfigID].basicFee)
                }
                setTransferFee(tmpTransferFeeIn)
                setRecivedAmount((transferMoney - tmpTransferFeeIn) * swapRate)
            } else if (huaZhuanValue === 1) {
                //划出
                let tmpTransferFeeOut = 0
                if (transferMoney) {
                    tmpTransferFeeOut = Number(maxValue ? maxValue : transferMoney) / swapRate * Number(cardConfigList[cardConfigID].creditRate) + Number(cardConfigList[cardConfigID].basicFee)
                }
                setTransferFee(tmpTransferFeeOut)
                setRecivedAmount((transferMoney / swapRate - tmpTransferFeeOut))
            }
        }


    }, [transferMoney])

    const setMaxValueClick = () => {
        let balance = 0;
        if (huaZhuanValue === 0) {
            balance = _.get(_.find(symbolList, { 'symbol': symbol }), 'balance', 0)
        } else if (huaZhuanValue === 1) {
            balance = cardListObj[cardID] && cardListObj[cardID].amount && cardListObj[cardID].amount;
        }
        setTransferMoney(balance)
        setMaxValue(balance)
    }

    const backCardPageEvt = () => {
        history.push(`/wallet/home/card`)
        setOpenKyc(false)
    }



    const updatedKycInfoEvt = () => {
        setOpenKyc(false);
        const index = _.findIndex(cardList[2], { id: currentCardItem.id });
        setTimeout(() => {
            document.querySelector(`#responsive-div-accordion${index} .gongNengTan2`).click();
            setCurrentCardItem(currentCardItem)
            setExchangeCreditFee(cardConfigList[currentCardItem.creditConfigId]?.exchangeCreditFee)
            setBalanceNotEnough(false);
            setUpdatedKycInfoFlag(true);
            setOpenAnimateHuanKa(true);
        }, 100)
    }

    const reciveCode = async () => {
        let sendRes = {};
        setTime(60);
        if (twiceVerifyType === 0) {
            const data = {
                codeType: 14,
                email: userData.userInfo.email
            };
            sendRes = await dispatch(sendEmail(data));
        } else {
            const data = {
                codeType: 14,
                nationCode: userData.userInfo.nation,
                phone: userData.userInfo.phone
            };
            sendRes = await dispatch(sendSms(data));
        }
    }

    const bindTwiceVerifyType = () => {
        if (twiceVerifyType === 0) {
            closeGoogleCodeFunc()
            closePinFunc()
            setOpenBindEmail(true)
            return
        } else if (twiceVerifyType === 1) {
            closeGoogleCodeFunc()
            closePinFunc()
            setOpenBindPhone(true)
            return
        } else {
            closeGoogleCodeFunc()
            closePinFunc()
            setOpenGoogleAnimateModal(true)
            return;
        }
    }

    const backPageEvt = () => {
        setOpenBindPhone(false)
        setOpenBindEmail(false);
        dispatch(userProfile({ forceUpdate: true}));
        setTypeBined(true);
        myFunction;
        setOpenGoogleCode(true);
    }

    const timeRef = useRef();
    const [time, setTime] = useState(0);
    //倒计时
    useEffect(() => {
        if (time && time !== 0)
            timeRef.current = setTimeout(() => {
                setTime(time => time - 1)
            }, 1000);
        return () => {
            clearTimeout(timeRef.current)
        }
    }, [time]);

    const toggleExpandCard = (cardItem) => {
        setCurrUserCardInfo(cardItem);
        dispatch(getCreditCardBalance({
            userCreditId: cardItem.id
        })).then((res) => {
            let result = res.payload.balances[0]
            let tmpCardList = { 2: [], 3: [] }
            let cardList2 = []
            let tmpCardListObj = {}
            if (result) {
                cardList[2].forEach((c2) => {
                    if (c2.id === result.userCreditId) {
                        cardList2.push({
                            ...c2,
                            amount: result.balance
                        })
                        tmpCardListObj[c2.id] = { ...c2, amount: result.balance }
                    } else {
                        cardList2.push(c2)
                        tmpCardListObj[c2.id] = c2;
                    }
                })
                tmpCardList[2] = cardList2;
                setCardList(tmpCardList)
                setCardListObj(tmpCardListObj)
            }
        })
    }

    const confirmHeld = (configId) => {
        let index = _.findIndex(cardList[2], { creditConfigId: _.toNumber(configId) });
        return index < 0 ? false : true
    }


    const [loadingShow, setLoadingShow] = useState(false);

    const cardShowStatusFailed = [1, 3, 7]

    return (
        <div style={{ position: "relative" }}>

            {!loadingShow && !openYanZheng &&
                <div style={{ position: "absolute", width: "100%" }}>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-12'
                    >
                        <Tabs
                            component={motion.div}
                            variants={item}
                            value={tabValue}
                            onChange={(ev, value) => {
                                setTabValue(value)
                                setCardFlexibleHeight(false)
                            }
                            }
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                            scrollButtons={false}
                            className="min-h-36 card-show-type card-show-type-tab"
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full min-h-36' }}
                            TabIndicatorProps={{
                                children: (
                                    <Box
                                        className="w-full h-full rounded-full  huaKuaBgColor0"
                                    />
                                ),
                            }}
                            sx={{
                                padding: '1rem 1.2rem',
                                flex: 1,
                            }}
                        >
                            {Object.entries(ranges)?.map(([key, label]) => (
                                <Tab
                                    className="text-16 font-semibold min-w-64  txtColorTitle zindex opacity-100 cardBigBtn"
                                    disableRipple
                                    key={key}
                                    icon={
                                        <img
                                            className="mr-8"
                                            width="22"
                                            src={(() => {
                                                switch (key) {
                                                    case "0":
                                                        return "/wallet/assets/images/menu/myCard.png";
                                                    case "1":
                                                        return "/wallet/assets/images/menu/card-active.png";
                                                }
                                            }
                                            )()}
                                            alt=""
                                        />
                                    }
                                    iconPosition="start"
                                    label={label}
                                    sx={{
                                        color: '#FFFFFF', height: '3.2rem', width: '50%'
                                    }}
                                />
                            ))}
                        </Tabs>
                        {
                            tabValue === 0 &&
                            <div>

                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="pb-12 flex justify-center"
                                >
                                    <div
                                        className="cardSty"
                                        style={{ flexWrap: "warp" }}
                                    >
                                        <div className="flex justify-between" style={{ marginTop: "6.5%" }}>
                                            <div className=" flex px-16 " style={{ width: "70%", height: "3rem" }}>
                                                {
                                                    isOpenEye && <img className="cardImg"
                                                        src="/wallet/assets/images/withdraw/yan2.png"
                                                        onClick={() => {
                                                            setIsOpenEye(!isOpenEye);
                                                        }}></img>
                                                }
                                                {
                                                    !isOpenEye && <img className="cardImg"
                                                        src="/wallet/assets/images/withdraw/yan.png"
                                                        onClick={() => {
                                                            setIsOpenEye(!isOpenEye);
                                                        }}></img>
                                                }
                                                <div className="ml-8 walletBalanceZi" style={{ color: "#84A59F" }} >{t('card_10')}</div>
                                            </div>
                                            <div className="zhangDanXiangQinZi" onClick={() => {
                                                changePhoneTab('record');
                                                history.push('/wallet/home/record')
                                            }} >{t('card_1')}</div>
                                        </div>

                                        <div className=" flex items-conter px-16" style={{ width: "100%", marginTop: "1.5rem", justifyContent: "space-between" }}>
                                            <div className="flex" style={{ width: "70%" }}>
                                                <img className="cardImg mt-3" src="/wallet/assets/images/withdraw/usd.png" onClick={() => {

                                                }}></img>
                                                {
                                                    isOpenEye ? <div className="eyeGongNengZi" style={{ color: "#ffffff" }}>{(userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat).toFixed(2) ?? '0.00'}</div>
                                                        : <div className="eyeGongNengZi2 pt-5" style={{ color: "#ffffff" }}>******</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {
                                    !openBindEmail && !openBindPhone && <div className='cardSelectBg'>
                                        <div className='cardSelectBgPadding '>
                                            {!openKyc && <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }} >
                                                <Tabs
                                                    component={motion.div}
                                                    variants={item}
                                                    value={smallTabValue}
                                                    onChange={(ev, value) => {
                                                        setSmallTabValue(value)
                                                        setCardFlexibleHeight(false)
                                                    }
                                                    }
                                                    indicatorColor="secondary"
                                                    textColor="inherit"
                                                    variant="scrollable"
                                                    scrollButtons={false}
                                                    className="min-h-32"
                                                    style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
                                                    classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                                    TabIndicatorProps={{
                                                        children: (
                                                            <Box
                                                                sx={{ bgcolor: 'text.disabled' }}
                                                                className="w-full h-full rounded-full huaKuaBgColorCard"
                                                            />
                                                        ),
                                                    }}
                                                    sx={{ padding: '1rem 1rem' }}
                                                >
                                                    {Object.entries([t('card_12'), t('card_13')]).map(([key, label]) => (
                                                        <Tab
                                                            className="text-16 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
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
                                                    smallTabValue === 0 &&
                                                    <div style={{ margin: "1.5rem 0rem 6rem 0rem" }}>

                                                        {/* <motion.div className='flex guoDuDongHua2'
                                                            variants={item}
                                                            initial="hidden"
                                                            animate="show"
                                                            style={{ position: "relative", height: cardFlexibleHeight ? `${cardHeight + 100}px` : `${cardHeight}px`, marginBottom: "67px" }}>
                                                            <img id="cardHeights" className='cardShowDi' style={{ position: "absolute", zIndex: "0" }} src='wallet/assets/images/card/card9.png' />
                                                            <div className='wuXianSty' style={{ position: "absolute", zIndex: "9998" }}>
                                                                <Carousel
                                                                    className="container"
                                                                    showArrows={true}
                                                                    showStatus={false}
                                                                    infiniteLoop={true}
                                                                    autoPlay={false}
                                                                    showThumbs={false}
                                                                    style={{ fontSize: "16px" }}
                                                                >
                                                                    <div className='wuXianCard' style={{ background: `url(wallet/assets/images/card/card6.png)`, backgroundSize: "cover", position: "relative" }}>
                                                                        <div className="" style={{ position: "absolute", fontSize: "140%", height: "17%", top: "44.5%", left: "8%", right: "0%", textAlign: "left" }}>100000045152452453</div>
                                                                        <div className="" style={{ position: "absolute", height: "17%", top: "61%", left: "8%" }}> 10/24 </div>
                                                                        <div className='' style={{ position: "absolute", height: "17%", top: "78%", left: "8%" }}>CCV 778</div>
                                                                    </div>

                                                                    <div className='wuXianCard' style={{ background: `url(wallet/assets/images/card/card7.png)`, backgroundSize: "cover", position: "relative" }}>
                                                                        <div className="" style={{ position: "absolute", fontSize: "140%", height: "17%", top: "44.5%", left: "8%", right: "0%", textAlign: "left" }}>300000045152452453</div>
                                                                        <div className="" style={{ position: "absolute", height: "17%", top: "61%", left: "8%" }}> 10/24 </div>
                                                                        <div className='' style={{ position: "absolute", height: "17%", top: "78%", left: "8%" }}>CCV 548</div>
                                                                    </div>

                                                                    <div className='wuXianCard' style={{ background: `url(wallet/assets/images/card/card8.png)`, backgroundSize: "cover", position: "relative" }}>
                                                                        <div className="" style={{ position: "absolute", fontSize: "140%", height: "17%", top: "44.5%", left: "8%", right: "0%", textAlign: "left" }}>400020045152452453</div>
                                                                        <div className="" style={{ position: "absolute", height: "17%", top: "61%", left: "8%" }}> 10/24 </div>
                                                                        <div className='' style={{ position: "absolute", height: "17%", top: "78%", left: "8%" }}>CCV 128</div>
                                                                    </div>
                                                                </Carousel>
                                                            </div>

                                                            <div className='cardGongNengMyDi' style={{ position: "relative", marginTop: `${cardHeight + 9}px` }}>
                                                                <Accordion className='gongNengTan1'>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        aria-controls="panel1-content"
                                                                        id="panel1-header"
                                                                        className='gongNengTan2'
                                                                        style={{ marginTop: "-19px" }}
                                                                        onClick={() => {
                                                                            setCardFlexibleHeight(!cardFlexibleHeight)
                                                                        }}
                                                                    >
                                                                        <div className='flex justify-between w-full'>
                                                                            <div className='flex'>
                                                                                <div className=''>{t('home_record_9')}</div>
                                                                                <div className='ml-8 yuEZi'>0.00</div>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionSummary>

                                                                    <AccordionDetails className='gongNengTan3'>
                                                                        <div className='flex justify-center'>
                                                                            <div className={clsx("gongNengLanW text-14")} onClick={() => {
                                                                            }} >
                                                                                <img className='gongNengTuBiao' src="wallet/assets/images/menu/guaShi.png"></img>
                                                                                <div className='gongNengZiW mt-4 text-14'>
                                                                                    {t('card_244')}
                                                                                </div>
                                                                            </div>

                                                                            <div className='gongNengLanW' onClick={() => {
                                                                                setTabValue(1);
                                                                            }}>
                                                                                <img className='gongNengTuBiao' src="wallet/assets/images/menu/addKaPian.png"></img>
                                                                                <div className='gongNengZiW mt-4 text-14'>{t('card_249')}</div>
                                                                            </div>

                                                                            <div className='gongNengLanW' onClick={() => {
                                                                                setOpenPassWordWindow(true)
                                                                                openPassWordFunc()
                                                                            }}>
                                                                                <img className='gongNengTuBiao' src="wallet/assets/images/menu/miMaGuanLi.png"></img>
                                                                                <div className='gongNengZiW mt-4 text-14'>{t('signIn_9')}</div>
                                                                            </div>

                                                                            <div className="gongNengLanW" onClick={() => {
                                                                                setOpenRecordWindow(true)
                                                                                setTransferFee(0)
                                                                                setRecivedAmount(0)
                                                                                setMaxValue(0)
                                                                                openRecordFunc()
                                                                            }}>
                                                                                <img className='gongNengTuBiao dingYueSty' src="wallet/assets/images/menu/huaZhuan.png"></img>
                                                                                <div className='gongNengZiW mt-4 text-14 dingYueSty'>{t('card_16')}</div>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </div>
                                                        </motion.div> */}



                                                        {cardList[2].map((cardItem, i) => {
                                                            if (cardItem.showState > 8) {
                                                                return (
                                                                    <motion.div
                                                                        key={cardItem.id}
                                                                        variants={item}
                                                                        initial="hidden"
                                                                        animate="show"
                                                                        className='cardJianGe'
                                                                    >
                                                                        <div className='flex justify-center container' style={{ position: "relative" }}>
                                                                            <div className="responsive-div creditcard" id={'responsive-div' + i}>
                                                                                <div className={clsx("", cardItem.showFrontCard && "xiaoShi")}>
                                                                                    <div className="responsive-div-content card4Bg cardZhiDi alphaCard_1" style={{ background: `url(${cardConfigList[cardItem.creditConfigId]?.url})`, backgroundSize: "cover" }} onClick={() => {
                                                                                    }}  >
                                                                                        <div className={clsx("cardNumber", cardItem.kaBeiButton && "xiaoShi")}> <span id={'cardNumberOne' + i} >{cardItem?.userCreditNo?.replace(/(.{4})/g, '$1 ')}</span> </div>
                                                                                        <div className={clsx("cardExpired ", cardItem.kaBeiButton && "xiaoShi")}>
                                                                                            <span id={'cardNumberOne' + i} style={{ paddingTop: "2%" }} >{cardItem?.userCreditEndTime?.split('-')[1]}/{cardItem?.userCreditEndTime?.split('-')[0].slice(-2)}</span>
                                                                                        </div>
                                                                                        <div className='cardBeiMian'>
                                                                                            <div className={clsx("", cardItem.kaBeiButton && "xiaoShi")}>
                                                                                                {cardItem?.state == 10 && (
                                                                                                    <div className='kaBeiZi flex'>
                                                                                                        <img id="cardIconWOne"
                                                                                                            onClick={(e) => handleImgClick(e, FanKa, cardItem)}
                                                                                                            className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id={'zhangDanZiOne' + i} className='zhangDanZi'>{t('card_15')}</span>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className={clsx("", !cardItem.showFrontCard && "xiaoShi")} >
                                                                                    <div className="responsive-div-content card41Bg cardZhiDi flipped2 alphaCard_1" style={{ background: `url(${cardConfigList[cardItem.creditConfigId]?.backUrl})` }} onClick={() => {
                                                                                    }}  >
                                                                                        <div className='cardAnQuanMa '>{cardItem.userCreditKey}</div>
                                                                                        <div className='cardBeiMian flipped2 '>
                                                                                            <div className={clsx("", cardItem.kaBeiButton2 && "xiaoShi")}>
                                                                                                <div className='kaBeiZi flex flipped2'>
                                                                                                    <img id={'cardIconWTwo' + i}
                                                                                                        onClick={(e) => handleImgClick(e, FanKaBei, cardItem)}
                                                                                                        className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id={'zhangDanZiTwo' + i} className='zhangDanZi'>{t('card_14')}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {cardItem?.state == 9 && (
                                                                                    <div className='cardErrorBg'>
                                                                                        <div className={clsx("flex justify-center", (cardItem?.freezeType === 'admin' || cardItem?.freezeType === 'delete') ? 'mt-28' : 'mt-88')} style={{ width: "100%" }}>
                                                                                            <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                                                                                            <div className='TanHaoCardZi'>
                                                                                                {t('card_178')}
                                                                                            </div>
                                                                                        </div>
                                                                                        {(cardItem?.freezeType === 'admin' || cardItem?.freezeType === 'delete') && <div className='cardErrorZi'>{t('card_179')}</div>}
                                                                                        {/* 
                                                                                        <div className='cardErrorBtn txtColorTitleSmall' onClick={() => {
                                                                                            changePhoneTab('security');
                                                                                            history.push('/wallet/home/security', { tabValue: 4 })
                                                                                        }} >
                                                                                            联系客服
                                                                                        </div> */}
                                                                                    </div>
                                                                                )
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                        <div className='cardGongNengMyDi' style={{ position: "relative" }}>
                                                                            <Accordion className='gongNengTan1'
                                                                                id={'responsive-div-accordion' + i}
                                                                            // disabled={cardItem?.state == 9}
                                                                            >
                                                                                <AccordionSummary
                                                                                    expandIcon={<ExpandMoreIcon />}
                                                                                    aria-controls="panel1-content"
                                                                                    id="panel1-header"
                                                                                    className='gongNengTan2'
                                                                                    onClick={() => {
                                                                                        toggleExpandCard(cardItem)
                                                                                        // if (cardItem && cardItem.state == 9) return;
                                                                                    }}
                                                                                >
                                                                                    <div className='flex justify-between w-full'>
                                                                                        <div className='flex'>
                                                                                            <div className=''>{t('home_record_9')}</div>
                                                                                            <div className='ml-8 yuEZi'>${cardItem.amount ?? '0.00'}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </AccordionSummary>

                                                                                <AccordionDetails className='gongNengTan3'>
                                                                                    <div className='flex justify-center'>
                                                                                        <div className={clsx("gongNengLanW text-14", cardItem && (cardItem.freezeType == 'admin' || cardItem.freezeType == 'delete') && "checkIsPhone")} onClick={() => {
                                                                                            if (cardItem.freezeType == 'admin' || cardItem.freezeType == 'delete') return;
                                                                                            setCurrentCardItem(cardItem)
                                                                                            setCurrUserCardInfo(cardItem)
                                                                                            setOpenAnimateModal(true);
                                                                                        }} >
                                                                                            <img className='gongNengTuBiao' src="wallet/assets/images/menu/guaShi.png"></img>
                                                                                            <div className='gongNengZiW mt-4 text-14'>
                                                                                                {cardItem?.state === 9 ? t('card_244') : t('card_31')}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className='gongNengLanW' onClick={() => {
                                                                                            setCurrentCardItem(cardItem)
                                                                                            setExchangeCreditFee(cardConfigList[cardItem.creditConfigId]?.exchangeCreditFee)
                                                                                            setBalanceNotEnough(false);
                                                                                            setUpdatedKycInfoFlag(false);
                                                                                            setOpenAnimateHuanKa(true);
                                                                                        }}>
                                                                                            <img className='gongNengTuBiao' src="wallet/assets/images/menu/gengHuanKaPian.png"></img>
                                                                                            <div className='gongNengZiW mt-4 text-14'>{t('card_32')}</div>
                                                                                        </div>

                                                                                        <div className='gongNengLanW' onClick={() => {
                                                                                            setOpenPassWordWindow(true)
                                                                                            openPassWordFunc()
                                                                                        }}>
                                                                                            <img className='gongNengTuBiao' src="wallet/assets/images/menu/miMaGuanLi.png"></img>
                                                                                            <div className='gongNengZiW mt-4 text-14'>{t('signIn_9')}</div>
                                                                                        </div>

                                                                                        <div className={clsx("gongNengLanW", cardItem && cardItem.state == 9 && "checkIsPhone")} onClick={() => {
                                                                                            // setOpenBindWindow(true)
                                                                                            // openBindFunc()
                                                                                            if (cardItem && cardItem.state == 9) return;
                                                                                            setOpenRecordWindow(true)
                                                                                            setCardID(cardItem.id)
                                                                                            setTransferFee(0)
                                                                                            setRecivedAmount(0)
                                                                                            setMaxValue(0)
                                                                                            setCardConfigID(cardItem.creditConfigId)
                                                                                            openRecordFunc()
                                                                                        }}>
                                                                                            <img className='gongNengTuBiao dingYueSty' src="wallet/assets/images/menu/huaZhuan.png"></img>
                                                                                            <div className='gongNengZiW mt-4 text-14 dingYueSty'>{t('card_16')}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/*
                                                                            <div className='mt-24 flex justify-center'>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/daE.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>大额预约</div>
                                                                                </div>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/bangDing.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>解除订阅</div>
                                                                                </div>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/atm.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>ATM/POS</div>
                                                                                </div>
                                                                            </div> */}

                                                                                </AccordionDetails>
                                                                            </Accordion>
                                                                        </div>
                                                                    </motion.div>
                                                                )
                                                            } else {
                                                                if (cardShowStatusFailed.indexOf(cardItem.showState) > -1) {
                                                                    return (
                                                                        <motion.div variants={item}
                                                                            initial="hidden"
                                                                            animate="show"
                                                                            className='cardJianGe'
                                                                        >
                                                                            <div className="responsive-div">
                                                                                <div className="responsive-div-content card5Bg cardZhiDi" >
                                                                                    <div className='cardNumber'>{cardItem?.userCreditNo?.replace(/(.{4})/g, '$1 ')}</div>
                                                                                    <div className='cardBeiMian'>
                                                                                    </div>
                                                                                </div>

                                                                                <div className='cardErrorBg'>

                                                                                    <div className='flex justify-center mt-16' style={{ width: "100%" }}>
                                                                                        <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                                                                                        <div className='TanHaoCardZi'>
                                                                                            {t('card_17')}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='cardErrorZi'>{t('card_18')}</div>

                                                                                    <div className='twoSamllBtn flex justify-between'>
                                                                                        <div className='cardErrorBtn2 txtColorTitleSmall' >
                                                                                            {t('card_72')}
                                                                                        </div>

                                                                                        <div className='cardErrorBtn2 txtColorTitleSmall'>
                                                                                            {t('card_246')}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>


                                                                            <div className='mt-10'>
                                                                                <div style={{ position: "relative", height: "1.2rem", width: "100%", margin: "0 auto" }}>
                                                                                    <div className='borderYuan' style={{ position: "absolute" }}>
                                                                                        <div className='jinDuDi' ></div>
                                                                                    </div>
                                                                                    <div className='borderYuan' style={{ position: "absolute" }}>
                                                                                        <div className={clsx("jinDuDi1Red")} style={{ width: "25%" }}></div>
                                                                                    </div>
                                                                                    <div style={{ position: "absolute", width: "100%", height: "0.6rem" }}>
                                                                                        <div className='flex justify-between items-center ' style={{ width: "100%", height: "0.6rem", padding: "0rem 0rem" }}>
                                                                                            <div className='smallYuanDian'></div>
                                                                                            <div className='smallYuanDianErrorBig'></div>
                                                                                            <div className='smallYuanDian'></div>
                                                                                            <div className='smallYuanDian'></div>
                                                                                            <div className='smallYuanDian'></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: "100%", margin: "0rem auto" }}>
                                                                                    <div className='flex justify-between items-center ' style={{ width: "100%" }}>
                                                                                        <div className=''>{t('card_20')}</div>
                                                                                        <div className='jinDuZiError'>{t('card_21')}</div>
                                                                                        <div className=''>{t('card_22')}</div>
                                                                                        <div className=''>{t('card_23')}</div>
                                                                                        <div className=''>{t('card_24')}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )
                                                                } else {
                                                                    return (<motion.div variants={cardItem}
                                                                        initial="hidden"
                                                                        animate="show"
                                                                        className='cardJianGe'
                                                                    >
                                                                        <div className="responsive-div">
                                                                            <div className="responsive-div-content card2Bg cardZhiDi" >
                                                                                <div className='cardZhuangTaiDi'>
                                                                                    <div className='cardZhuangTai mt-32'>{cardItem.showState == 0 ? t('card_247') : t('card_248')}</div>
                                                                                </div>
                                                                                <div className='cardNumber'>{cardItem?.userCreditNo?.replace(/(.{4})/g, '$1 ')}</div>
                                                                                <div>
                                                                                    <span style={{ paddingTop: "2%", paddingLeft: "8%" }} >{cardItem?.userCreditEndTime?.split('-')[1]}/{cardItem?.userCreditEndTime?.split('-')[0].slice(-2)}</span>
                                                                                </div>
                                                                                <div className='cardBeiMian'>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className='mt-10'>

                                                                            <div style={{ position: "relative", height: "1.2rem", width: "100%", margin: "0 auto" }}>
                                                                                <div className='borderYuan' style={{ position: "absolute" }}>
                                                                                    <div className='jinDuDi' ></div>
                                                                                </div>

                                                                                <div className='borderYuan' style={{ position: "absolute" }}>
                                                                                    <div className={clsx("jinDuDi1")} style={{ width: "25%" }}></div>
                                                                                </div>

                                                                                <div style={{ position: "absolute", width: "100%", height: "0.6rem" }}>
                                                                                    <div className='flex justify-between items-center ' style={{ width: "100%", height: "0.6rem", padding: "0rem 0rem" }}>
                                                                                        <div className='smallYuanDian'></div>
                                                                                        <div className='smallYuanDianBig yuanDianAni'></div>
                                                                                        <div className='smallYuanDian'></div>
                                                                                        <div className='smallYuanDian'></div>
                                                                                        <div className='smallYuanDian'></div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                            <div style={{ width: "100%", margin: "0rem auto" }}>
                                                                                <div className='flex justify-between items-center ' style={{ width: "100%" }}>
                                                                                    <div className=''>{t('card_20')}</div>
                                                                                    <div className='jinDuZi'>{t('card_21')}</div>
                                                                                    <div className=''>{t('card_22')}</div>
                                                                                    <div className=''>{t('card_23')}</div>
                                                                                    <div className=''>{t('card_24')}</div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </motion.div>)
                                                                }
                                                            }
                                                        })}

                                                        <div className='tianJiaKaPian flex items-center pl-16' onClick={() => {
                                                            setTabValue(1);
                                                        }}>
                                                            <img className='cardIconW ' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                            <div className='zhangDanZi' >{t('card_25')}</div>
                                                        </div>

                                                        <div className='tianJiaKaPian flex items-center  pl-16' style={{ marginTop: "20px" }} onClick={() => {
                                                            setOpenJiHuoWindow(true)
                                                            openJiHuoFunc();
                                                        }}>
                                                            <img className='cardIconW ' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                            <div className='zhangDanZi' >{t('card_252')}</div>
                                                        </div>

                                                        <div>
                                                            <div className='text-16 mt-28 ml-10'> {t('card_225')}</div>
                                                            <StyledAccordion
                                                                component={motion.div}
                                                                variants={item}
                                                                classes={{
                                                                    root: clsx('FaqPage-panel shadow'),
                                                                }}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                                    sx={{ paddingLeft: "10px", paddingRight: "10px" }}
                                                                >
                                                                    <div className="flex items-center py-4 flex-grow" style={{ width: '100%' }}>
                                                                        <FuseSvgIcon className="mr-8">
                                                                            heroicons-outline:information-circle
                                                                        </FuseSvgIcon>
                                                                        {t('card_226')}
                                                                    </div>
                                                                </AccordionSummary>

                                                                <AccordionDetails style={{ paddingInline: "15px" }}>
                                                                    <div>  {t('card_227')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb1.png" />
                                                                    <div className='mt-28'> {t('card_228')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb2.png" />
                                                                    <div className='mt-28'>  {t('card_229')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb3.png" />
                                                                    <div className='mt-28'>  {t('card_230')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb4.png" />
                                                                    <div className='mt-28'>  {t('card_231')} </div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb5.png" />
                                                                    <div className='mt-28'>  {t('card_232')} </div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb5_1.png" />
                                                                    <div className='mt-28'> {t('card_233')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb5_2.png" />
                                                                    <div className='mt-28'>  {t('card_234')} </div>
                                                                    <img className='xszfSty' src="wallet/assets/images/card/zfb5_3.png" />
                                                                    <div className='mt-28'>  {t('card_235')} </div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb6.png" />
                                                                    <div className='mt-28'>  {t('card_236')} </div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb7.png" />
                                                                    <div className='mt-28'>  {t('card_237')} </div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb8.png" />
                                                                    <div className='mt-28'>  {t('card_238')}</div>
                                                                    <img className='xszfSty2' src="wallet/assets/images/card/zfb9.png" />
                                                                </AccordionDetails>
                                                            </StyledAccordion>

                                                            <StyledAccordion
                                                                component={motion.div}
                                                                variants={item}
                                                                classes={{
                                                                    root: clsx('FaqPage-panel shadow'),
                                                                }}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                                    sx={{ paddingLeft: "10px", paddingRight: "10px" }}
                                                                >
                                                                    <div className="flex items-center py-4 flex-grow" style={{ width: '100%' }}>
                                                                        <FuseSvgIcon className="mr-8">
                                                                            heroicons-outline:information-circle
                                                                        </FuseSvgIcon>
                                                                        {t('card_239')}
                                                                    </div>
                                                                </AccordionSummary>

                                                                <AccordionDetails style={{ paddingInline: "15px" }}>
                                                                    <div>
                                                                        <div> {t('card_236_1')}</div>
                                                                        <img className='xszfSty2' src="wallet/assets/images/card/zjz1.png" />
                                                                        <div className='mt-28'> {t('card_240')}</div>
                                                                        <img className='xszfSty2' src="wallet/assets/images/card/zjz2.png" />
                                                                        <div className='mt-28'> {t('card_230_1')} </div>
                                                                        <img className='xszfSty2' src="wallet/assets/images/card/zjz3.png" />
                                                                        <div className='mt-28'> {t('card_241')}</div>
                                                                        <img className='xszfSty' src="wallet/assets/images/card/zjz4.png" />
                                                                        <div className='mt-28'> {t('card_242')} </div>
                                                                        <img className='xszfSty' src="wallet/assets/images/card/zjz5.png" />
                                                                        <div className='mt-28'> {t('card_238_1')}  </div>
                                                                        <img className='xszfSty' src="wallet/assets/images/card/zjz6.png" />
                                                                    </div>
                                                                </AccordionDetails>
                                                            </StyledAccordion>

                                                            {/* <StyledAccordion
                                                                component={motion.div}
                                                                variants={item}
                                                                classes={{
                                                                    root: clsx('FaqPage-panel shadow'),
                                                                }}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                                                    sx={{ paddingLeft: "10px", paddingRight: "10px" }}
                                                                >
                                                                    <div className="flex items-center py-4 flex-grow" style={{ width: '100%' }}>
                                                                        <FuseSvgIcon className="mr-8">
                                                                            heroicons-outline:information-circle
                                                                        </FuseSvgIcon>
                                                                        绑定至手机，线下POS刷卡
                                                                    </div>
                                                                </AccordionSummary>

                                                                <AccordionDetails style={{ paddingInline: "15px" }}>
                                                                    <div>
                                                                        <div> ① 打开iphone钱包，选择添加卡片。 </div>
                                                                        <img className='xxzfSty1' src="wallet/assets/images/card/xxzf1.png" />
                                                                        <div className='mt-28'> ② 选择添加其他卡。 </div>
                                                                        <img className='xxzfSty2' src="wallet/assets/images/card/xxzf2.png" />
                                                                        <div className='mt-28'> ③ 填写卡片的卡号。 </div>
                                                                        <img className='xxzfSty3' src="wallet/assets/images/card/xxzf3.png" />
                                                                        <div className='mt-28'> ④ 填写卡片的姓名、有效年月及安全码。</div>
                                                                        <img className='xxzfSty4' src="wallet/assets/images/card/xxzf4.png" />
                                                                        <div className='mt-28'> ⑤ 绑定成功后即可在线下使用。</div>
                                                                        <img className='xxzfSty4' src="wallet/assets/images/card/xxzf5.jpg" />
                                                                    </div>
                                                                </AccordionDetails>
                                                            </StyledAccordion> */}
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    smallTabValue === 1 && <div>
                                                        {cardList[3].map((cardItem) => {
                                                            return (
                                                                <motion.div
                                                                    key={cardItem.id}
                                                                    variants={item}
                                                                    initial="hidden"
                                                                    animate="show"
                                                                    className='cardJianGe'
                                                                >
                                                                    <div className='flex justify-center container' style={{ position: "relative" }}>
                                                                        <div className="responsive-div creditcard" id="responsive-div">
                                                                            <div className={clsx("", fanZhuan && "xiaoShi")}>
                                                                                <div className="responsive-div-content card4Bg cardZhiDi" onClick={() => {
                                                                                }}  >
                                                                                    <div className={clsx("cardNumber", kaBeiButton && "xiaoShi")}> <span id="cardNumberOne" >{cardItem?.userCreditNo?.replace(/(.{4})/g, '$1 ')}</span> </div>
                                                                                    <div className='cardBeiMian'>
                                                                                        <div className={clsx("", kaBeiButton && "xiaoShi")}>
                                                                                            <div className='kaBeiZi flex'>
                                                                                                <img id="cardIconWOne"
                                                                                                    onClick={(e) => handleImgClick(e, FanKa)}
                                                                                                    className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id="zhangDanZiOne" className='zhangDanZi'>{t('card_15')}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className={clsx("", !fanZhuan && "xiaoShi")} >
                                                                                <div className="responsive-div-content card41Bg cardZhiDi flipped2" onClick={() => {
                                                                                }}  >
                                                                                    <div className='cardBeiMian flipped2'>
                                                                                        <div className={clsx("", kaBeiButton2 && "xiaoShi")}>
                                                                                            <div className='kaBeiZi flex flipped2'>
                                                                                                <img id="cardIconWTwo"
                                                                                                    onClick={(e) => handleImgClick(e, FanKaBei)}
                                                                                                    className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id="zhangDanZiTwo" className='zhangDanZi'>{t('card_14')}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className='cardGongNengMyDi' style={{ position: "relative" }}>
                                                                        <Accordion className='gongNengTan1' >
                                                                            <AccordionSummary
                                                                                expandIcon={<ExpandMoreIcon />}
                                                                                aria-controls="panel1-content"
                                                                                id="panel1-header"
                                                                                className='gongNengTan2'
                                                                            >
                                                                                <div className='flex justify-between w-full'>
                                                                                    <div className='flex'>
                                                                                        <div className=''>{t('home_record_9')}</div>
                                                                                        <div className='ml-8 yuEZi'>$50.00</div>
                                                                                    </div>
                                                                                </div>
                                                                            </AccordionSummary>

                                                                            <AccordionDetails className='gongNengTan3'>
                                                                                <div className='flex justify-center'>
                                                                                    <div className='gongNengLanW' onClick={() => {
                                                                                        setOpenAnimateModal(true);
                                                                                    }} >
                                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/guaShi.png"></img>
                                                                                        <div className='gongNengZiW mt-4 text-14'>{t('card_31')}</div>
                                                                                    </div>
                                                                                    <div className='gongNengLanW' onClick={() => {
                                                                                        setCurrentCardItem(cardItem)
                                                                                        setExchangeCreditFee(cardConfigList[cardItem.creditConfigId]?.exchangeCreditFee)
                                                                                        setBalanceNotEnough(false);
                                                                                        setOpenAnimateHuanKa(true);
                                                                                    }}>
                                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/gengHuanKaPian.png"></img>
                                                                                        <div className='gongNengZiW mt-4 text-14'>{t('card_32')}</div>
                                                                                    </div>

                                                                                    <div className='gongNengLanW' onClick={() => {
                                                                                        setOpenPassWordWindow(true)
                                                                                        openPassWordFunc()
                                                                                    }}>
                                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/miMaGuanLi.png"></img>
                                                                                        <div className='gongNengZiW mt-4 text-14'>{t('signIn_9')}</div>
                                                                                    </div>

                                                                                    <div className='gongNengLanW' onClick={() => {
                                                                                        // setOpenBindWindow(true)
                                                                                        // openBindFunc()
                                                                                        if (cardItem && cardItem.state == 9) return;
                                                                                        setOpenRecordWindow(true)
                                                                                        setCardID(cardItem.id)
                                                                                        setCardConfigID(cardItem.creditConfigId)
                                                                                        openRecordFunc()
                                                                                    }}>
                                                                                        <img className='gongNengTuBiao dingYueSty' src="wallet/assets/images/menu/huaZhuan.png"></img>
                                                                                        <div className='gongNengZiW mt-4 text-14 dingYueSty'>{t('card_16')}</div>
                                                                                    </div>
                                                                                </div>
                                                                                {/*
                                                                            <div className='mt-24 flex justify-center'>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/daE.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>大额预约</div>
                                                                                </div>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/bangDing.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>解除订阅</div>
                                                                                </div>
                                                                                <div className='gongNengLanW'>
                                                                                    <img className='gongNengTuBiao' src="wallet/assets/images/menu/atm.png"></img>
                                                                                    <div className='gongNengZiW mt-4 text-14'>ATM/POS</div>
                                                                                </div>
                                                                            </div> */}

                                                                            </AccordionDetails>
                                                                        </Accordion>
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        })}

                                                        <div className='tianJiaKaPian flex items-center pl-16' onClick={() => {
                                                            setTabValue(1);
                                                        }}>
                                                            <img className='cardIconW' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                            <div className='zhangDanZi' >{t('card_25')}</div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        {
                            tabValue === 1 &&
                            <div className='cardSelectBg '>
                                <div className='cardSelectBgPadding '>
                                    <div style={{ padding: '1.5rem 1.5rem' }} >
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
                                            style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
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
                                            {Object.entries([t('card_12'), t('card_13')]).map(([key, label]) => (
                                                <Tab
                                                    className="text-16 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
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
                                            smallTabValue === 0 && !openXiangQing &&
                                            <div>
                                                {cardConfig[2].map((configItem, index) => {
                                                    return (
                                                        <motion.div
                                                            key={configItem.configId}
                                                            variants={item}
                                                            initial="hidden"
                                                            animate="show"
                                                            className='cardJianGe'
                                                        >
                                                            <div className='cardName '>{cardLanguage[index]}</div>
                                                            <div className="responsive-div">
                                                                <div className="responsive-div-content card1Bg" style={{ background: `url(${configItem?.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => {
                                                                    setOpenXiangQing(true);
                                                                    setClickShenQinCard(true);
                                                                    setCardConfigID(configItem.configId);
                                                                    myFunction;
                                                                }}   >
                                                                </div>
                                                            </div>
                                                            <div className='cardNameInFoDi px-12 '>

                                                                <div className='flex justify-between'>
                                                                    <div className='kaPianInfoLeiXing' onClick={() => {
                                                                    }} >{configItem.cardOrganizations} Card</div>
                                                                    <div className='kaPianInfo' onClick={() => {
                                                                        setOpenXiangQing(true);
                                                                        setClickShenQinCard(true);
                                                                        setCardConfigID(configItem.configId);
                                                                        myFunction;
                                                                    }}   >{t('card_11')}</div>
                                                                </div>

                                                                <div className='flex justify-between items-center mt-10'>
                                                                    <div className='openingFee' >{t('card_33')} {configItem.applyCreditFee} USDT </div>
                                                                    {/* <div className='openingFee' >{t('card_33')} 28 USDT</div> */}
                                                                    <div className='openCardBtn' onClick={() => {
                                                                        setOpenXiangQing(true);
                                                                        setClickShenQinCard(true);
                                                                        setCardConfigID(configItem.configId);
                                                                        myFunction;
                                                                    }}>{confirmHeld(configItem.configId) ? t('card_243') : t('card_35')}</div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        }
                                        {
                                            smallTabValue === 1 && <div>
                                                {cardConfig[3].map((configItem) => {
                                                    return (
                                                        <motion.div
                                                            key={configItem.configId}
                                                            variants={item}
                                                            initial="hidden"
                                                            animate="show"
                                                            className='cardJianGe'
                                                        >
                                                            <div className='cardName'>{configItem.creditConfigName}</div>
                                                            <div className="responsive-div">
                                                                <div className="responsive-div-content card1Bg" onClick={() => {
                                                                    setOpenXiangQing(true);
                                                                    setClickShenQinCard(true);
                                                                    setCardConfigID(configItem.configId);
                                                                    myFunction;
                                                                }}   >
                                                                </div>
                                                            </div>
                                                            <div className='cardNameInFoDi px-12'>
                                                                <div className='flex justify-between'>
                                                                    <div className='kaPianInfoLeiXing' onClick={() => {
                                                                    }} >VISA</div>
                                                                    <div className='kaPianInfo' onClick={() => {
                                                                        setOpenXiangQing(true);
                                                                        setClickShenQinCard(true);
                                                                        setCardConfigID(configItem.configId);
                                                                        myFunction;
                                                                    }}   >{t('card_11')}</div>
                                                                </div>

                                                                <div className='flex justify-between items-center mt-10'>
                                                                    <div className='openingFee'>{t('card_33')} 1USDT</div>

                                                                    <div className='openCardBtn' onClick={() => {
                                                                        setOpenXiangQing(true);
                                                                        setClickShenQinCard(true);
                                                                        setCardConfigID(configItem.configId);
                                                                        myFunction;
                                                                    }}   >{t('card_35')}</div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </motion.div>
                </div>
            }
            {
                loadingShow &&
                <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao3"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao3"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                </div>
            }


            {openXiangQing && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                    id="stickyGo"
                >
                    <div className='flex' onClick={() => {
                        setOpenXiangQing(false);
                        setClickShenQinCard(false);
                        setCurrentCardItem(null);
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>

                    <div className='flex justify-center mt-10'>
                        <motion.div variants={item} className='shenQingCardDi flex items-center'>
                            <img className='shenQingCard'
                                src={cardConfigList[cardConfigID]?.url}></img>
                        </motion.div>
                    </div>
                    <div className='kaPianQuanYiZi'>{t('card_37')}</div>

                    <motion.div variants={item} className='flex'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_38')}</div>
                                <div className='flex'>
                                    <img className='quanYiIcon' src="wallet/assets/images/card/usd2.png" alt="" /><span className='quanYiZi'>USDT</span>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_39')}</div>
                                {cardConfigList[cardConfigID]?.creditType === 2 && (<div>{t('card_12')}</div>)}
                                {cardConfigList[cardConfigID]?.creditType === 3 && (<div>{t('card_13')}</div>)}

                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_33')}</div>
                                <div className='flex'>
                                    <div className='quanYiZi quanYiHui mr-10'>100 USDT</div><div className='quanYiZi quanYiLv'>{cardConfigList[cardConfigID]?.applyCreditFee} USDT</div>
                                    {/* <div className='quanYiZi quanYiHui mr-10'>100 USDT</div><div className='quanYiZi quanYiLv'>28 USDT</div> */}
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_41')}</div>
                                <div >{t('card_42')}</div>
                            </div>

                            <div className='flex justify-between mt-10 mb-10'>
                                <div className='quanYiHuiZi'>{t('card_43')}</div>
                                {/* <div> 1000,000 USD/<span>{t('card_103')}</span></div> */}
                                <div> 1000,000 USDT</div>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10'>
                                <div className='text-16'>{t('card_56')}</div>
                            </div>
                            <div className='pingTai'><span style={{ color: "#19D5B8" }}>{clickShenQinCard && infoShenQinTxt(cardConfigList[cardConfigID]?.creditConfigName)}</span>{clickShenQinCard && infoShenQinTxt2(cardConfigList[cardConfigID]?.creditConfigName)} </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10'>
                                <div className='text-16'>{t('card_44')}</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_104')}</div>
                                {/* <div>{cardConfigList[cardConfigID]?.yearBasicFee} {cardConfigList[cardConfigID]?.cardSymbol} </div> */}
                                <div>28 USDT</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('home_borrow_18')}</div>
                                <div>1.5%</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_200')}</div>
                                <div>10 USDT</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('home_withdraw_5')}</div>
                                <div>10000 USDT</div>
                            </div>


                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_46')}</div>
                                <div>{cardConfigList[cardConfigID]?.cardOrganizations == 'Visa' ? 'VISA' : 'MASTER'}</div>
                            </div>



                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_39')}</div>
                                <div>{t('card_105')}</div>
                            </div>


                            {/*<div className='flex justify-between mt-10 '>*/}
                            {/*    <div className='quanYiHuiZi'>ATM取款</div>*/}
                            {/*    <div>除新加坡与中国大陆外均可</div>*/}
                            {/*</div>*/}

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_52')}</div>
                                <div style={{ textAlign: "end" }}>{t('card_198')}</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_53')}</div>
                                <div style={{ textAlign: "end" }}>{t('card_199')}</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_54')}</div>
                                <div style={{ textAlign: "end" }}>{t('card_59')}</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_55')}</div>
                                <div>{t('card_60')}</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10 flex'>
                                <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                                <div className='text-16'>{t('card_106')}</div>
                            </div>

                            <div className='flex justify-start mt-10'>
                                <div className='quanYiHuiZi pb-8 '>{t('card_107')}</div>
                            </div>
                            {!cardConfigList[cardConfigID]?.creditConfigName.includes("苹果") && <div className=' pb-8 ' style={{ color: "#19D5B8" }}>{t('card_253')}</div>}
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-16' style={{ paddingInline: "1.5rem" }} >
                        {!confirmHeld(cardConfigID) && <LoadingButton
                            disabled={false}
                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                            color="secondary"
                            loading={isLoadingBtn}
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '100%', height: '4rem', fontSize: "20px", margin: '1rem auto 2.8rem', display: 'block', lineHeight: "inherit" }}
                            onClick={() => {
                                // openChangeBiFunc()
                                // refreshKycInfo()
                                if(userData?.profile?.user?.bindKyc) {
                                    setOpenKycAuth(false)
                                    setOpenKycAddress(true)
                                }else{
                                    setOpenKycAddress(false)
                                    setOpenKycAuth(true)
                                }
                            }}
                        >
                            {t('card_36')}
                        </LoadingButton>
                        }
                    </motion.div>
                    <motion.div variants={item} className='flex mt-10 ' style={{ height: "5rem" }}>
                    </motion.div>
                </motion.div>
            </div>}

            {openKyc && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                    id="topGo"
                >
                    <div className='flex mb-10' onClick={() => {
                        setOpenKyc(false);
                        const index = _.findIndex(cardList[2], { id: currentCardItem.id });
                        setTimeout(() => {
                            document.querySelector(`#responsive-div-accordion${index} .gongNengTan2`).click();
                            setCurrentCardItem(currentCardItem)
                            setExchangeCreditFee(cardConfigList[currentCardItem.creditConfigId]?.exchangeCreditFee)
                            setBalanceNotEnough(false);
                            setOpenAnimateHuanKa(true);
                        }, 100)
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>
                    <Kyc backCardPage={backCardPageEvt} updatedKycInfo={updatedKycInfoEvt} />
                    <div style={{ height: "5rem" }}></div>
                </motion.div>
            </div>}


            {openBindEmail && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                    id="topGo"
                >
                    <div className='flex mb-10' onClick={() => {
                        setOpenBindEmail(false);
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>
                    <RetiedEmail backPage={() => backPageEvt()} />
                    <div style={{ height: "5rem" }}></div>
                </motion.div>
            </div>}

            {openBindPhone && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                    id="topGo"
                >
                    <div className='flex mb-10' onClick={() => {
                        setOpenBindPhone(false);
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>
                    <RetiedPhone backPage={() => backPageEvt()} />
                    <div style={{ height: "5rem" }}></div>
                </motion.div>
            </div>}

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openAnimateModal}
                onClose={() => setOpenAnimateModal(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi '>
                        {currUserCardInfo.state === 9 ? t('card_244') : t('card_31')}
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="danChuangTxt ">
                        {currUserCardInfo.state === 9 ? t('card_245') : t('card_75')}
                    </div>
                </Box>

                <div className='flex mt-16 mb-28 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        onClick={() => {
                            currUserCardInfo.state === 9 ? cardUpdate(2) : cardUpdate(1)
                        }}
                    >
                        {currUserCardInfo.state === 9 ? t('card_244') : t('card_31')}
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

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openAnimateHuanKa}
                onClose={() => setOpenAnimateHuanKa(false)}
            >

                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_32')}
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        {t('card_108')}
                    </div>
                </Box>
                <div className={clsx('exchange-credit-fee', balanceNotEnough && 'error-msg-font')}>{t('home_borrow_18')}: {exchangeCreditFee} USDT</div>

                <div className='flex mt-16 mb-20 px-15 position-re' style={{ height: "40px" }} >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn position-ab"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        style={{ bottom: "0%", left: "0%", right: "0%", margin: "0 auto" }}
                        onClick={() => {
                            // setOpenCardBtnShow(true);
                            exChangeCard()
                            // setTimeout(() => {
                            //     setOpenAnimateHuanKa(false);
                            //     setOpenCardBtnShow(false);
                            //     setTabValue(1);
                            //     setOpenXiangQing(true);
                            //     setCardConfigID(currentCardItem.creditConfigId);
                            //     myFunction;
                            // }, 1500);
                        }}
                    >
                        {updatedKycInfoFlag ? t('home_borrow_8') : t('card_77')}
                    </LoadingButton>

                    <div className=' position-ab xiaHuaXian' style={{ height: "4rem", lineHeight: "4rem", bottom: "0%", right: "4%", }} onClick={() => {
                        setOpenAnimateHuanKa(false);
                        setExchangeCreditFee(0);
                        openKycFunc();
                    }}>{t('card_76')}</div>

                </div>

            </AnimateModal>

            <BootstrapDialog
                onClose={() => {
                    closeRecordFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openRecordWindow}
                className="dialog-container"
            >
                <div id="openRecord" className="PINSty">
                    {openSuccess &&
                        <div id='pinDivHeight'>
                            <div className='pinWindow2'>
                                <div className='flex'>
                                    <div className='PINTitleSelectCardZi '> {t('card_16')}</div>
                                    <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                        closeRecordFunc();
                                    }} />
                                </div>

                                <Tabs
                                    value={huaZhuanValue}
                                    onChange={(ev, value) => {
                                        setHuaZhuanValue(value)
                                        setMaxValue(0)
                                        setTransferMoney(0)
                                        setTransferFee(0)
                                        setRecivedAmount(0)
                                        const tmpSwapRate = arrayLookup(symbols, 'symbol', 'USDT', (huaZhuanValue === 0 ? 'sellRate' : 'buyRate'));
                                        setSwapRate(tmpSwapRate)
                                    }}
                                    indicatorColor="secondary"
                                    textColor="inherit"
                                    variant="scrollable"
                                    scrollButtons={false}
                                    className="tongYongDingBtn3"
                                    style={{ width: '50%!import' }}
                                    classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                    TabIndicatorProps={{
                                        children: (
                                            <Box
                                                sx={{ bgcolor: 'text.disabled' }}
                                                className="w-full h-full rounded-full  huaKuaBgColor2"
                                            />
                                        ),
                                    }}
                                    sx={{
                                        margin: "1rem 1.2rem",
                                    }}
                                >
                                    {Object.entries(huaZhuanRanges)?.map(([key, label]) => (
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


                                <div className='flex mt-20 justify-between' style={{ borderBottom: "1px solid #2C3950" }}>
                                    <div className='text-18'>{t('card_27')}</div>
                                    <div className='flex pb-32'>
                                        <div className='text-18'>USD</div>
                                        <div className='text-18 ml-10'>{cardListObj[cardID]?.amount.toFixed(2) ?? '0.00'}</div>
                                    </div>
                                </div>

                                <Box
                                    className="w-full rounded-16 border flex flex-col mt-32"
                                    sx={{
                                        backgroundColor: '#374252!important',
                                        border: 'none'
                                    }}
                                >
                                    {symbolWallet.length > 0 && <StyledAccordionSelect
                                        symbol={symbolWallet}
                                        currencyCode="USD"
                                        setSymbol={setSymbol}
                                        formControlSx={{ backgroundColor: '#374252!important' }}
                                    />}
                                </Box>
                                <div className='flex justify-between mt-12'>
                                    <div className='flex'>
                                        <div className='' style={{ color: "#94A3B8" }}>{t('card_29')}</div>
                                        <div className='ml-10'>${(userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat).toFixed(2) ?? '0.00'}</div>
                                    </div>
                                    {huaZhuanValue == 0 && <div className='' style={{ color: "#2DD4BF", textDecoration: "underline" }} onClick={() => {
                                        changePhoneTab('swap');
                                        history.push('/wallet/home/swap')
                                    }} >{t('menu_5')} USDT</div>}
                                </div>

                                <div className='w-full h-44 mt-24' style={{ position: "relative" }}>
                                    <div className='w-full h-44 border' style={{ borderRadius: "0.5rem", backgroundColor: "#151C2A", position: "absolute", top: "0%", right: "0%" }}>
                                    </div>
                                    <div className='text-16 ' style={{ position: "absolute", top: "0%", left: "4%", width: "82%", height: "4.4rem", lineHeight: "4.4rem" }}>{transferMoney}</div>
                                    <div className='' style={{ position: "absolute", top: "0%", right: "4%", height: "4.4rem", lineHeight: "4.4rem" }} onClick={setMaxValueClick}>Max</div>
                                </div>

                                <div className='flex justify-between mt-16'>
                                    <div className='flex'>
                                        <div className='' style={{ color: "#94A3B8" }}>{t('card_223')}</div>
                                        <div className='ml-10'>{huaZhuanValue === 0 ? (Number(recivedAmount.toFixed(2)) || '0.00') + ' USD' : (Number(recivedAmount.toFixed(6)) || '0.00') + ' USDT'}</div>
                                    </div>
                                </div>
                                <div className='flex justify-between mt-16'>
                                    <div className='flex'>
                                        <div className='' style={{ color: "#94A3B8" }}>{t('home_borrow_16')}</div>
                                        <div className='ml-10'>{Number(transferFee.toFixed(6)) || '0.00'} USDT</div>
                                    </div>
                                </div>
                            </div>
                            <div className='jianPanSty'>
                                <div className='flex' style={{ borderTop: "1px solid #2C3950", borderBottom: "none" }}>
                                    <div id="zhuanZhang1" className='jianPanBtn borderRight borderBottom color-box'
                                        onTouchStart={changeToBlack}
                                        onTouchEnd={changeToWhite}
                                        onTouchCancel={changeToWhite}
                                        onClick={() => { handleDoMoney(1) }}>1</div>
                                    <div id="zhuanZhang2" className='jianPanBtn borderRight borderBottom color-box'
                                        onTouchStart={changeToBlack}
                                        onTouchEnd={changeToWhite}
                                        onTouchCancel={changeToWhite}
                                        onClick={() => { handleDoMoney(2) }}>2</div>
                                    <div id="zhuanZhang3" className='jianPanBtn borderRight borderBottom'
                                        onTouchStart={changeToBlack}
                                        onTouchEnd={changeToWhite}
                                        onTouchCancel={changeToWhite}
                                        onClick={() => { handleDoMoney(3) }}>3</div>
                                    <div id="zhuanZhangImg" className='jianPanBtImgDiv flex items-center borderBottom'
                                        onTouchStart={changeToBlack}
                                        onTouchEnd={changeToWhite}
                                        onTouchCancel={changeToWhite}
                                        onClick={() => { handleDoMoney(-1) }}>
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
                                                onClick={() => { handleDoMoney(4) }}>4</div>
                                            <div id="zhuanZhang5" className='jianPanBtn1 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(5) }}>5</div>
                                            <div id="zhuanZhang6" className='jianPanBtn1 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(6) }}>6</div>
                                        </div>
                                        <div className='flex'>
                                            <div id="zhuanZhang7" className='jianPanBtn1 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(7) }}>7</div>
                                            <div id="zhuanZhang8" className='jianPanBtn1 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(8) }}>8</div>
                                            <div id="zhuanZhang9" className='jianPanBtn1 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(9) }}>9</div>
                                        </div>
                                        <div className='flex'>
                                            <div id="zhuanZhang0" className='jianPanBtn2 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney(0) }}>0</div>
                                            <div id="zhuanZhangDian" className='jianPanBtn4 borderRight'
                                                onTouchStart={changeToBlack}
                                                onTouchEnd={changeToWhite}
                                                onTouchCancel={changeToWhite}
                                                onClick={() => { handleDoMoney('.') }}>.</div>
                                        </div>
                                    </div>
                                    {isLoadingBtn && <FuseLoading />}
                                    {!isLoadingBtn &&
                                        <div id='zhuanZhangWanCheng' className='jianPanBtn3'
                                            onTouchStart={changeToBlack}
                                            onTouchEnd={changeToWhite}
                                            onTouchCancel={changeToWhite}
                                            onClick={() => {
                                                setTiJiaoState(0);
                                                isBindPin()
                                                // handleTransferCrypto()
                                                // setOpenZhiFu(true)
                                            }}>{t('card_30')}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    {!openSuccess && <motion.div
                        id='pinDivHeight'
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{ height: `${divHeight}px` }}
                    >
                        <div className='dialog-box'>
                            <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                    closeRecordFunc();
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
                                        !zhuanQuan && (tiJiaoState === 1 || tiJiaoState === 3) && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong4.png'></img>
                                    }
                                    {
                                        !zhuanQuan && tiJiaoState === 2 && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong5.png'></img>
                                    }
                                </div>
                            </motion.div>
                        </div>

                        <div style={{ margin: "0 auto", textAlign: "center", marginTop: "84px", height: "23px", fontSize: "16px", color: "#2ECB71" }}>
                            {
                                tiJiaoState === 1 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                    ● {t('errorMsg_1')}
                                </motion.div>
                            }
                            {
                                tiJiaoState === 2 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", color: "#EE124B" }}>
                                    ● {t('error_36')}
                                </motion.div>
                            }
                            {
                                tiJiaoState === 3 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                    ● {t('errorMsg_4')}
                                </motion.div>
                            }
                        </div>
                        <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "8px", fontSize: "24px" }}> {transferMoney} USDT</motion.div>
                        <motion.div variants={item} className='mx-20  mt-24' style={{ borderTop: "1px solid #2C3950" }}>
                        </motion.div>
                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                            <div>USDT</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('card_86')}</div>
                            <div style={{ width: "50%", wordWrap: "break-word", textAlign: "right" }}>{currUserCardInfo.userCreditNo}</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('card_39')}</div>
                            <div>{cardConfigList[cardConfigID]?.cardOrganizations}</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('card_183')}</div>
                            <div>{currUserCardInfo.userCreditKey}</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_borrow_18')}</div>
                            <div>{Number(transferFee.toFixed(6)) || '0.00'} USDT</div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('card_223')}</div>
                            <div>{huaZhuanValue === 0 ? (Number(recivedAmount.toFixed(2)) || '0.00') + ' USD' : (Number(recivedAmount.toFixed(6)) || '0.00') + ' USDT'} </div>
                        </motion.div>

                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                            <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{lookDataId}</div>
                        </motion.div>
                        <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                            <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                            <div>{getNowTime()}</div>
                        </motion.div>
                    </motion.div>
                    }
                </div>
            </BootstrapDialog >

            <BootstrapDialog
                onClose={() => {
                    closesApplyFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openApplyWindow}
                className="dialog-container"
            >
                <div id="openApply" className="PINSty">
                    <div className='pinWindow2'>
                        <div className='flex mt-16 justify-center'>
                            <div className='PINTitleSelectCardZi2'>{t('card_24')}</div>
                            <img className='wanChengGou' src="wallet/assets/images/card/wanCheng.png"></img>
                        </div>

                        <div className='flex mt-40 justify-between pb-40' style={{ borderBottom: "1px solid #2C3950" }}>
                            <div className='text-14'>{t('card_78')}</div>
                        </div>

                        <div className='mt-32'>
                            <div className='' style={{ width: "95%", height: "2.2rem", margin: "0.5rem auto" }}>
                                <img className={clsx("fanZhuanCard")} style={{ marginLeft: "30%" }} src="/wallet/assets/images/menu/card-active.png" />
                            </div>
                            <div style={{ position: "relative", height: "1.4rem", width: "90%", margin: "0 auto" }}>
                                <div className='borderYuan' style={{ position: "absolute" }}>
                                    <div className='jinDuDi' ></div>
                                </div>
                                <div className='borderYuan' style={{ position: "absolute" }}>
                                    <div className={clsx("jinDuDi1", applyOver && "jinduDiMove")}></div>
                                </div>
                                <div style={{ position: "absolute", width: "100%", height: "0.6rem" }}>
                                    <div className='flex justify-between items-center ' style={{ width: "100%", height: "0.6rem", padding: "0rem 0rem" }}>
                                        <div className='smallYuanDian'></div>
                                        <div className='smallYuanDian'></div>
                                        <div className='smallYuanDian'></div>
                                        <div className='smallYuanDian'></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: "95%", margin: "0rem auto" }}>
                                <div className='flex justify-between items-center ' style={{ width: "100%" }}>
                                    <div className='jinDuZi'>{t('card_20')}</div>
                                    <div className='jinDuZi'>{t('card_21')}</div>
                                    <div className='jinDuZi'>{t('card_22')}</div>
                                    <div className='jinDuZi'>{t('card_23')}</div>
                                </div>
                            </div>
                        </div>

                        <div className='flex mt-40 justify-between pb-32' >
                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                onClick={() => {
                                    setOpenXiangQing(false)
                                    setClickShenQinCard(false);
                                    closesApplyFunc();
                                    setTabValue(0);
                                    setSmallTabValue(0);
                                }}
                            >
                                {t('card_79')}
                            </LoadingButton>

                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                onClick={() => {
                                    changePhoneTab('');
                                    history.push('/wallet/home/wallet')
                                }}
                            >
                                {t('card_80')}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </BootstrapDialog >

            <BootstrapDialog
                onClose={() => {
                    closesPassWordFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openPassWordWindow}
                className="dialog-container"
            >
                <div id="openPassWord" className="PINSty pb-20">
                    <div className='pinWindow2 '>
                        <div className='flex mb-10'>
                            <div className='PINTitleSelectCardZi'>{t('card_81')}</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closesPassWordFunc();
                            }} />
                        </div>

                        <form
                            name="registerForm"
                            noValidate
                            className="flex flex-col justify-center w-full mt-32"
                        >
                            <Controller
                                name="oldPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-36"
                                        label={t('reset_pass_3')}
                                        type="password"
                                        error={!!errors.oldPassword}
                                        helperText={errors?.oldPassword?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-36"
                                        label={t('reset_pass_4')}
                                        type="password"
                                        error={!!errors.password}
                                        helperText={errors?.password?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="passwordConfirm"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-36"
                                        label={t('reset_pass_5')}
                                        type="password"
                                        error={!!errors.passwordConfirm}
                                        helperText={errors?.passwordConfirm?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />
                        </form>
                        <div className='flex justify-center mt-60' style={{ width: "100%" }}>
                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn3"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
                                onClick={() => {
                                    closesPassWordFunc();
                                }}
                            >
                                {t('kyc_23')}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </BootstrapDialog >

            <BootstrapDialog
                onClose={() => {
                    closesBindFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openBindWindow}
                className="dialog-container"
            >
                <div id="openBind" className="PINSty pb-32">
                    <div className='pinWindow3'>
                        <div className='flex'>
                            <div className='PINTitleSelectCardZi'> {t('card_82')}</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closesBindFunc();
                            }} />
                        </div>

                        <div className='jieChuBind flex justify-between'>
                            <div className='flex'>
                                <img className='payImg' src="wallet/assets/images/card/pay1.png" />
                                <div>
                                    <div>GooglePay</div>
                                    <div>2021/08/25{t('card_84')}</div>
                                </div>
                            </div>
                            <div className='payButtom'>
                                {t('card_83')}
                            </div>
                        </div>

                        <div className='jieChuBind flex justify-between'>
                            <div className='flex'>
                                <img className='payImg' src="wallet/assets/images/card/pay2.png" />
                                <div>
                                    <div>ApplePay</div>
                                    <div>2021/06/12{t('card_84')}</div>
                                </div>
                            </div>
                            <div className='payButtom'>
                                {t('card_83')}
                            </div>
                        </div>

                        <div className='jieChuBind flex justify-between'>
                            <div className='flex'>
                                <img className='payImg' src="wallet/assets/images/card/pay3.png" />
                                <div>
                                    <div>AliPay</div>
                                    <div>2020/08/11{t('card_84')}</div>
                                </div>
                            </div>
                            <div className='payButtom'>
                                {t('card_83')}
                            </div>
                        </div>

                        <div className='jieChuBind flex justify-between'>
                            <div className='flex'>
                                <img className='payImg' src="wallet/assets/images/card/pay4.png" />
                                <div>
                                    <div>WeChat Pay</div>
                                    <div>2022/03/25{t('card_84')}</div>
                                </div>
                            </div>
                            <div className='payButtom'>
                                {t('card_83')}
                            </div>
                        </div>
                    </div>
                </div>
            </BootstrapDialog >

            <BootstrapDialog
                onClose={() => {
                    closesJiHuoFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openJiHuoWindow}
                className="dialog-container"
            >
                <div id="openJiHuo" className="PINSty pb-32">
                    <div className='pinWindow2'>
                        <div className='flex'>
                            <div className='PINTitleSelectCardZi'>{t('card_34')}</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closesJiHuoFunc();
                            }} />
                        </div>

                        <div className='flex mt-40 justify-between pb-32' style={{ borderBottom: "1px solid #2C3950" }}>
                            <div className='text-14'>{t('card_85')}</div>
                        </div>

                        <div className='flex mt-20 justify-between pb-20' >
                            <div className='text-16'>{t('card_86')}</div>
                        </div>

                        <Controller
                            name="cardNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-20"
                                    label={t('card_86')}
                                    type="number"
                                    error={!!errors.cardNumber}
                                    helperText={errors?.cardNumber?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />


                        <div className='flex  justify-between pb-20' >
                            <div className='text-16'>CVV</div>
                        </div>

                        <Controller
                            name="checkCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-36"
                                    label="CCV"
                                    type="number"
                                    error={!!errors.checkCode}
                                    helperText={errors?.checkCode?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn3 mt-48"
                            color="secondary"
                            loading={false}
                            variant="contained"
                            onClick={() => {
                                setOpenJiHuoWindow(false)
                                closesJiHuoFunc();
                            }}
                        >
                            {t('kyc_23')}
                        </LoadingButton>
                    </div>
                </div>
            </BootstrapDialog >

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openZhiFu}
                onClose={() => setOpenZhiFu(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_61')}
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        {t('card_88')}
                    </div>
                </Box>

                <div className='flex mt-16 mb-28 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                            setOpenZhiFu(false)
                        }}
                    >
                        {t('card_89')}
                    </LoadingButton>

                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenZhiFu(false)
                            setOpenRecordWindow(false)
                            changePhoneTab('deposite');
                            history.push('/wallet/home/deposite')
                        }}
                    >
                        {t('card_63')}
                    </LoadingButton>
                </div>
            </AnimateModal>

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openChongZhi}
                onClose={() => setOpenChongZhi(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_61')}
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        {t('card_62')}
                    </div>
                </Box>

                <div className='flex mt-16 mb-28 px-15 justify-center' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenChongZhi(false)
                            setOpenXiangQing(false)
                            setClickShenQinCard(false);
                            changePhoneTab('deposite');
                            history.push('/wallet/home/deposite')
                        }}
                    >
                        {t('card_63')}
                    </LoadingButton>
                </div>
            </AnimateModal>

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
                            <div className='PINTitle2'>{t('kyc_57')}</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closeGoogleCodeFunc()
                            }} />
                        </div>
                        {/* <div className='PINTitle'>{t('card_176')}</div> */}
                        <div className='flex justify-between'>
                            <div
                                onClick={() => { setTwiceVerifyType(0); setTypeBined(hasAuthEmail ? true : false) }}
                                className={clsx('selectPin', twiceVerifyType === 0 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/email.png" alt="" />
                                <div style={{ float: "left" }} className="px-6">{t('signIn_5')} </div>
                            </div>

                            <div
                                onClick={() => { setTwiceVerifyType(1); setTypeBined(hasAuthPhone ? true : false) }}
                                className={clsx('selectPin', twiceVerifyType === 1 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/phone.png" alt="" />
                                <div style={{ float: "left" }} className="px-6">{t('kyc_56')}</div>
                            </div>

                            <div
                                onClick={() => { setTwiceVerifyType(2); setTypeBined(hasAuthGoogle ? true : false) }}
                                className={clsx('selectPin', twiceVerifyType === 2 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/google.png" alt="" />
                                <div style={{ float: "left" }} className="px-6"> Google</div>
                            </div>
                        </div>

                        {typeBinded ? ((twiceVerifyType == 0 || twiceVerifyType == 1) ?
                            (
                                twiceVerifyType === 0 ? <div className='mt-16' style={{ fontSize: "16px", textAlign: "center" }}>
                                    {t('Kyc_67')}<span style={{ color: "#909fb4", padding: '0px 5px' }}>{userData?.userInfo?.email}</span>
                                    {
                                        time <= 0 && <span style={{ color: "#2dd4bf", textDecoration: "underline" }} onClick={() => reciveCode()}>{t('Kyc_65')}</span>
                                    }
                                    {
                                        time > 0 && <span style={{ color: "#2dd4bf", }} >{time}s</span>
                                    }
                                </div> : <div className='mt-16' style={{ fontSize: "16px", textAlign: "center" }}>
                                    {t('Kyc_66')}<span style={{ color: "#909fb4", padding: '0px 5px' }}>{userData?.userInfo?.nation + userData?.userInfo?.phone}</span>
                                    {
                                        time <= 0 && <span style={{ color: "#2dd4bf", textDecoration: "underline" }} onClick={() => reciveCode()}>{t('Kyc_65')}</span>
                                    }
                                    {
                                        time > 0 && <span style={{ color: "#2dd4bf", }} >{time}s</span>
                                    }
                                </div>
                            )
                            : <div className='mt-16' style={{ fontSize: "16px", textAlign: "center" }}> {t('Kyc_60')}</div>)
                            : <div className='mt-16' style={{ fontSize: "16px", textAlign: "center" }}>
                                {twiceVerifyType === 0 ? t('Kyc_62') : twiceVerifyType === 1 ? t('Kyc_63') : t('Kyc_64')}
                                <span style={{ color: "#2dd4bf", textDecoration: "underline", paddingLeft: '5px' }} onClick={() => bindTwiceVerifyType()} >{t('card_167')}</span>
                            </div>
                        }

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

                    <div className={clsx('jianPanSty', typeBinded ? '' : 'disabled_jianPanSty')}>
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
                    <Enable2FA verifiedVAuth={() => verifiedVAuthEvt()} />
                    <div style={{ height: "5rem" }}></div>
                </motion.div>
            </div>}

            {/* pin码界面 */}
            <BootstrapDialog
                onClose={() => {
                    closePinFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openPinWindow}
                className="dialog-container"
            >
                <div id="PINSty" className="PINSty">
                    <div id='pinDivHeight'>
                        <div className='pinWindow'>
                            <div className='flex'>
                                <div className='PINTitle2'>{t('card_196')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closePinFunc();
                                }} />
                            </div>
                            {/* <div className='PINTitle'>{t('home_wallet_14')}{smallTabValue == 0 ? t('card_189') : t('card_7')}（ <span className='quanYiLv'> {smallTabValue == 0 ? inputVal.address : inputIDVal} </span> ） {t('transfer_1')}</div> */}

                            {!pinForFanKa && <div className='flex justify-center' style={{ borderBottom: "1px solid #2C3950", paddingBottom: "3rem" }}>
                                {/* <img className='MoneyWithdraw' style={{ borderRadius: '50%'}} src={ arrayLookup(symbolsData, 'symbol', symbol, 'avatar') || '' }></img> */}
                                {/* <div className='PINTitle3'>{symbol}</div> */}
                                <img className='MoneyWithdraw' src="wallet/assets/images/withdraw/USDT.png" />

                                <div className='flex'>
                                    <div className={clsx('PINTitle4 inputNumSty', textSelect && "inputBackDi")}>{transferMoney} <span className={clsx("", !showGuangBiao ? 'guangBiaoNo' : 'guangBiao')} >︱</span>
                                    </div>
                                    <img src="wallet/assets/images/deposite/bianJiBi.png" className='ml-4 mt-8' style={{ zIndex: "100", marginLeft: textSelect ? "4px" : "-12px", width: "18px", height: "18px" }} onClick={() => {
                                        setTextSelect(!textSelect)
                                        setShowGuangBiao(!textSelect)
                                    }} />
                                </div>
                            </div>
                            }

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
                                            if (pin && pin.length === 6 && correctPin) {
                                                if (pinForFanKa) {
                                                    window.localStorage.setItem('checkedPin', JSON.stringify({
                                                        checked: true,
                                                        expired: moment().add(7, 'days').valueOf()
                                                    }))
                                                    closePinFunc()
                                                    FanKa(currentCardItem)
                                                } else {
                                                    handleTransferCrypto()
                                                }
                                            }
                                        }}>{t('card_30')}</div>
                                }
                            </div>
                        </div>
                    </div>
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
                open={openChangeBi}
                onClose={() => closeChangeBi()}
                aria-labelledby="customized-dialog-title"
                className="dialog-container"
            >
                <div id="openChangeBi" className="PINSty">
                    <div className='pinWindow2'>
                        <div className='flex'>
                            <div className='PINTitleSelectCardZi'>{t('card_109')}</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closeChangeBi();
                            }} />
                        </div>

                        <div className='flex mt-20 justify-between' style={{ borderBottom: "1px solid #2C3950" }}>
                            <div className='text-16'>{t('card_33')}</div>
                            <div className='flex pb-20 '>
                                <div className='text-16 ml-10'>{cardConfigList[cardConfigID]?.applyCreditFee}</div>
                                <div className='text-16'>&nbsp;USDT</div>
                            </div>
                        </div>

                        <div className='mt-24' style={{ color: "#94A3B8" }}>{t('card_110')}</div>

                        <Box
                            className="w-full rounded-16 border flex flex-col mt-24"
                            sx={{
                                backgroundColor: '#374252!important',
                                border: 'none'
                            }}
                        >
                            {symbolList.length > 0 && <StyledAccordionSelect
                                symbol={symbolList}
                                currencyCode="USD"
                                setSymbol={setApplyFeeSymbol}
                                formControlSx={{ backgroundColor: '#374252!important' }}
                            />}
                        </Box>

                        <div className='my-24' style={{ borderBottom: "1px solid #2C3950" }}></div>

                        <div className='flex justify-between mt-12'>
                            <div className='' style={{ color: "#94A3B8" }}>{t('card_174')}</div>
                            <div className='' style={{ color: "#2DD4BF", textDecoration: "underline" }} onClick={() => {
                                setOpenChangeBi(false);
                                openKycFunc();
                            }} >{t('card_112')}</div>
                        </div>
                        <div className='mt-20' style={{ marginBottom: "6rem" }}>{address}</div>
                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn3 mb-12"
                            color="secondary"
                            loading={isLoadingBtn}
                            variant="contained"
                            onClick={() => {
                                applyCard()
                            }}
                        >
                            {t('card_36')}
                        </LoadingButton>

                    </div>

                </div>
            </BootstrapDialog>

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openGoogleAnimateModal}
                onClose={() => setOpenGoogleAnimateModal(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi '>
                        {t('card_180')}
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        {t('card_181')}
                    </div>
                </Box>

                <div className='flex mt-16 mb-28 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenGoogleAnimateModal(false)
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
                            setOpenGoogleAnimateModal(false)
                        }}
                    >
                        {t('home_pools_15')}
                    </LoadingButton>
                </div>
            </AnimateModal>



            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openKycAddress}
                onClose={() => setOpenKycAddress(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi '>
                        提交申请
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1rem 0rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="danChuangTxt ">
                        请确保您的KYC信息正确并选择申请的地址
                    </div>
                </Box>

                <div className="flex items-center justify-between mt-20">
                    <FormControl sx={{ width: '100%', borderColor: '#525A67' }} className="mb-16">
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={addressKyc}
                            onChange={handleChangeInputVal}
                            className='addressKyc'
                            style={{ color: "#909EB0", backgroundColor: "#1E293A" }}
                        >
                            <MenuItem value={'location1'} style={{ color: "#909EB0" }}>地址1：中国，上海</MenuItem>
                            <MenuItem value={'location2'} style={{ color: "#909EB0" }}>地址2：广州</MenuItem>
                            <MenuItem value={'location3'} style={{ color: "#909EB0" }}>地址3：中国，杭州</MenuItem>

                        </Select>
                    </FormControl>
                </div>

                <div className='flex mt-10  justify-center' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        style={{ width: "60%" }}
                        onClick={() => {

                        }}
                    >
                        确定
                    </LoadingButton>
                </div>

                <div className='mt-16 mb-20' style={{ textDecoration: "underline", textAlign: "center" }} onClick={ ()=>{
                    setOpenKycAddress(false)
                    setOpenKyc(true)
                }}>
                    修改KYC信息
                </div>

            </AnimateModal >
            
            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openKycAuth}
                onClose={() => setOpenKycAuth(false)}
            >
                <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi '>
                        KYC认证
                    </div>
                </div>

                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                    sx={{
                        backgroundColor: "#2C394D",
                        padding: "1rem 0rem",
                        overflow: "hidden",
                        margin: "0rem auto 0rem auto"
                    }}
                >
                    <div className="danChuangTxt ">
                       申请卡片前需完成KYC认证
                    </div>
                </Box>

                <div className='flex mt-16 mb-28 justify-center' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        style={{ width: "60%" }}
                        onClick={() => {
                            setOpenKyc(true);
                        }}
                    >
                        确定
                    </LoadingButton>
                </div>

            </AnimateModal >



        </div >
    )
}

export default Card;
