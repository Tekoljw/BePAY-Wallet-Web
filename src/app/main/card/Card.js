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
import { arrayLookup, setPhoneTab, getNowTime } from "../../util/tools/function";
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
import Typography from '@mui/material/Typography';
import {
    getKycInfo,
    applyCreditCard,
    creditCardUpdate,
    creditCardCryptoDeposit,
    creditCardCryptoWithdraw,
    getCreditConfig,
    getUserCreditCard
} from "app/store/payment/paymentThunk";
import { createPin, verifyPin } from "app/store/wallet/walletThunk";
import { showMessage } from "app/store/fuse/messageSlice";
import { borderBottom } from '@mui/system';
import Kyc from "../kyc/Kyc";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
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
    const walletData = useSelector(selectUserData).wallet;
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

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    const handleImgClick = (e, action) => {
        e.stopPropagation(); // 阻止事件冒泡
        action(); // 执行传入的动作函数
    };

    const myFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    const FanKa = () => {
        setKaBeiButton(true);
        document.getElementById('responsive-div').classList.add('flipped');
        setTimeout(() => {
            setFanZhuan(true);
        }, 200);
        setTimeout(() => {
            setKaBeiButton2(false);
            document.getElementById('cardIconWTwo').classList.add('alphaCard');
            document.getElementById('zhangDanZiTwo').classList.add('alphaCard');
        }, 400);
    };

    const FanKaBei = () => {
        setKaBeiButton2(true);
        document.getElementById('responsive-div').classList.remove('flipped');
        setTimeout(() => {
            setFanZhuan(false);
        }, 200);
        setTimeout(() => {
            setKaBeiButton(false);
            document.getElementById('cardIconWOne').classList.add('alphaCard');
            document.getElementById('zhangDanZiOne').classList.add('alphaCard');
            document.getElementById('cardNumberOne').classList.add('alphaCard');
        }, 400);
    };

    useEffect(() => {
        setPhoneTab('card');
    }, []);



    const closeRecordFunc = () => {
        document.getElementById('openRecord').classList.remove('PinMoveAni');
        document.getElementById('openRecord').classList.add('PinMoveOut');
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
        document.getElementById('openChangeBi').classList.remove('PinMoveAni');
        document.getElementById('openChangeBi').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenChangeBi(false)
        }, 300);
    };

    const openChangeBiFunc = () => {
        setOpenChangeBi(true);
        setTimeout(() => {
            document.getElementById('openChangeBi').classList.add('PinMoveAni');
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
        document.getElementById(target.target.id).classList.add('pinJianPanColor1');
    };

    const changeToWhite = (target) => {
        document.getElementById(target.target.id).classList.remove('pinJianPanColor1');
    };


    const openKycFunc = () => {
        history.push('/wallet/home/security', { tabValue: 4, resetTabValueParam: 1 })
        // setOpenKyc(true)
        // setTimeout(() => {
        //     document.getElementById('topGo').scrollIntoView({ behavior: 'smooth' });
        // }, 0);
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
        setSymbolList(tmpSymbolWallet2)
    }

    useEffect(() => {
        if (symbols) {
            initSymbol()
        }
    }, [symbols]);




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
        dispatch(getCreditConfig()).then((res) => {
            let result = res.payload
            if (result) {
                let tmpConfig = { 2: [], 3: [] }
                let tmpConfigList = {}
                result.map((item) => {
                    if (item.state === 1) {
                        if (item.creditType === 2) {
                            tmpConfig[2].push(item)
                        } else if (item.creditType === 3) {
                            tmpConfig[3].push(item)
                        }

                        tmpConfigList[item.configId] = item
                    }
                })
                setCardConfig(tmpConfig)
                setCardConfigList(tmpConfigList)
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
            let result = res.payload
            let tmpCardList = { 2: [], 3: [] }
            let tmpCardListObj = {}
            if (result) {
                result.map((item) => {
                    if (item.creditType === 2) {
                        tmpCardList[2].push(item)
                    } else if (item.creditType === 3) {
                        tmpCardList[3].push(item)
                    }
                    tmpCardListObj[item.id] = item
                })
                setCardList(tmpCardList)
                setCardListObj(tmpCardListObj)
                console.log(tmpCardList, "tmpCardList")
                console.log(tmpCardListObj, "tmpCardListObj")
                setTimeout(() => {
                    setTimer(timer + 1)
                }, 1000)
            }
        })
    }

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
        setOpenSuccess(false);
        setZhuanQuan(true);
        dispatch(doFun({
            userCreditId: cardID,
            creditType: cardListObj[cardID].creditType,
            symbol: symbol,
            chain: 'trc',
            amount: transferMoney,
        })).then((res) => {
            setIsLoadingBtn(false)
            let result = res.payload
            setLookDataId(result.mchOrderNo)
            if (result) {
                if (result.status === 'success') {
                    setZhuanQuan(false);
                    setTiJiaoState(1);
                    setUpdateCard(true)
                    setTimer(timer + 1)
                    // closeRecordFunc()
                    // myFunction();
                } else {
                    setZhuanQuan(false);
                    setTiJiaoState(2);
                    dispatch(showMessage({ message: result.msg, code: 2 }));
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

        setTransferMoney(tmpText == 0 ? '' : tmpText);
    }

    useEffect(() => {
        getCardConfig()
        getCardList()
    }, []);

    useEffect(() => {
        if (cardID) {
            let tmpTransferFee = 0
            tmpTransferFee = Number(transferMoney) * Number(cardConfigList[cardConfigID].creditRate) + Number(cardConfigList[cardConfigID].basicFee)
            setTransferFee(tmpTransferFee)
        }
    }, [transferMoney])




    return (
        <div style={{ position: "relative" }}>
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
                        onChange={(ev, value) => setTabValue(value)}
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

                            <div className='cardSelectBg'>
                                <div className='cardSelectBgPadding '>
                                    {!openKyc && <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }} >
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
                                                    className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
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
                                            smallTabValue === 0 && <div style={{ margin: "1.5rem 0rem 6rem 0rem" }}>
                                                {cardList[2].map((cardItem) => {
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
                                                                            <div className={clsx("cardNumber", kaBeiButton && "xiaoShi")}> <span id="cardNumberOne" >{cardItem.userCreditNo}</span> </div>
                                                                            <div className='cardBeiMian'>
                                                                                <div className={clsx("", kaBeiButton && "xiaoShi")}>
                                                                                    {cardItem?.state == 10 && (
                                                                                        <div className='kaBeiZi flex'>
                                                                                            <img id="cardIconWOne"
                                                                                                onClick={(e) => handleImgClick(e, FanKa)}
                                                                                                className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id="zhangDanZiOne" className='zhangDanZi'>{t('card_15')}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className={clsx("", !fanZhuan && "xiaoShi")} >
                                                                        <div className="responsive-div-content card41Bg cardZhiDi flipped2" onClick={() => {
                                                                        }}  >
                                                                            <div className='cardAnQuanMa '>{cardItem.userCreditKey}</div>
                                                                            <div className='cardBeiMian flipped2 '>
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
                                                                    {cardItem?.state == 9 && (
                                                                        <div className='cardErrorBg'>
                                                                            <div className='flex justify-center mt-28' style={{ width: "100%" }}>
                                                                                <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                                                                                <div className='TanHaoCardZi'>
                                                                                    {t('card_178')}
                                                                                </div>
                                                                            </div>
                                                                            <div className='cardErrorZi'>{t('card_179')}</div>
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
                                                                // disabled={cardItem?.state == 9}
                                                                >
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        aria-controls="panel1-content"
                                                                        id="panel1-header"
                                                                        className='gongNengTan2'
                                                                        onClick={() => {
                                                                            // if (cardItem && cardItem.state == 9) return;
                                                                            setCurrUserCardInfo(cardItem);
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
                                                                            <div className='gongNengLanW' onClick={() => {
                                                                                setOpenAnimateModal(true);
                                                                            }} >
                                                                                <img className='gongNengTuBiao' src="wallet/assets/images/menu/guaShi.png"></img>
                                                                                <div className='gongNengZiW mt-4 text-14'>{t('card_31')}</div>
                                                                            </div>
                                                                            <div className='gongNengLanW' onClick={() => {
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

                                                {/*<motion.div variants={item}*/}
                                                {/*    initial="hidden"*/}
                                                {/*    animate="show"*/}
                                                {/*    className='cardJianGe'*/}
                                                {/*>*/}
                                                {/*    <div className="responsive-div">*/}
                                                {/*        <div className="responsive-div-content card5Bg cardZhiDi" >*/}
                                                {/*            <div className='cardNumber'>2489 8794 8894 7845</div>*/}
                                                {/*            <div className='cardBeiMian'>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}

                                                {/*        <div className='cardErrorBg'>*/}

                                                {/*            <div className='flex justify-center mt-16' style={{ width: "100%" }}>*/}
                                                {/*                <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />*/}
                                                {/*                <div className='TanHaoCardZi'>*/}
                                                {/*                    审核失败*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className='cardErrorZi'>您填写的地址有误请重新修改！</div>*/}

                                                {/*            <div className='cardErrorBtn txtColorTitleSmall' onClick={() => {*/}
                                                {/*                changePhoneTab('security');*/}
                                                {/*                history.push('/wallet/home/security', { tabValue: 4 })*/}
                                                {/*            }} >*/}
                                                {/*                重新提交*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}


                                                {/*    <div className='mt-10'>*/}
                                                {/*        <div style={{ position: "relative", height: "1.2rem", width: "100%", margin: "0 auto" }}>*/}
                                                {/*            <div className='borderYuan' style={{ position: "absolute" }}>*/}
                                                {/*                <div className='jinDuDi' ></div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className='borderYuan' style={{ position: "absolute" }}>*/}
                                                {/*                <div className={clsx("jinDuDi1Red")} style={{ width: "25%" }}></div>*/}
                                                {/*            </div>*/}
                                                {/*            <div style={{ position: "absolute", width: "100%", height: "0.6rem" }}>*/}
                                                {/*                <div className='flex justify-between items-center ' style={{ width: "100%", height: "0.6rem", padding: "0rem 0rem" }}>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDianErrorBig'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*        <div style={{ width: "100%", margin: "0rem auto" }}>*/}
                                                {/*            <div className='flex justify-between items-center ' style={{ width: "100%" }}>*/}
                                                {/*                <div className=''>申请</div>*/}
                                                {/*                <div className='jinDuZiError'>审核</div>*/}
                                                {/*                <div className=''>寄送</div>*/}
                                                {/*                <div className=''>激活</div>*/}
                                                {/*                <div className=''>成功</div>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</motion.div>*/}

                                                {/*<motion.div variants={item}*/}
                                                {/*    initial="hidden"*/}
                                                {/*    animate="show"*/}
                                                {/*    className='cardJianGe'*/}
                                                {/*>*/}
                                                {/*    <div className="responsive-div">*/}
                                                {/*        <div className="responsive-div-content card2Bg cardZhiDi" >*/}
                                                {/*            <div className='cardZhuangTaiDi'>*/}
                                                {/*                <div className='cardZhuangTai'>审核中</div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className='cardNumber'>2489 8794 8894 7845</div>*/}
                                                {/*            <div className='cardBeiMian'>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}

                                                {/*    <div className='mt-10'>*/}
                                                {/*        <div style={{ position: "relative", height: "1.2rem", width: "100%", margin: "0 auto" }}>*/}
                                                {/*            <div className='borderYuan' style={{ position: "absolute" }}>*/}
                                                {/*                <div className='jinDuDi' ></div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className='borderYuan' style={{ position: "absolute" }}>*/}
                                                {/*                <div className={clsx("jinDuDi1")} style={{ width: "25%" }}></div>*/}
                                                {/*            </div>*/}
                                                {/*            <div style={{ position: "absolute", width: "100%", height: "0.6rem" }}>*/}
                                                {/*                <div className='flex justify-between items-center ' style={{ width: "100%", height: "0.6rem", padding: "0rem 0rem" }}>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDianBig yuanDianAni'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                    <div className='smallYuanDian'></div>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*        <div style={{ width: "100%", margin: "0rem auto" }}>*/}
                                                {/*            <div className='flex justify-between items-center ' style={{ width: "100%" }}>*/}
                                                {/*                <div className=''>申请</div>*/}
                                                {/*                <div className='jinDuZi'>审核</div>*/}
                                                {/*                <div className=''>寄送</div>*/}
                                                {/*                <div className=''>激活</div>*/}
                                                {/*                <div className=''>成功</div>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</motion.div>*/}

                                                <div className='tianJiaKaPian flex items-center pl-16' onClick={() => {
                                                    setTabValue(1);
                                                }}>
                                                    <img className='cardIconW' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                    <div className='zhangDanZi' >{t('card_25')}</div>
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
                                                                            <div className={clsx("cardNumber", kaBeiButton && "xiaoShi")}> <span id="cardNumberOne" >{cardItem.userCreditNo}</span> </div>
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
                                                className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
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
                                        smallTabValue === 0 && <div>
                                            {cardConfig[2].map((configItem) => {
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
                                                                setCardConfigID(configItem.configId);
                                                                myFunction;
                                                            }}   >
                                                            </div>
                                                        </div>
                                                        <div className='cardNameInFoDi px-12'>

                                                            <div className='flex justify-between'>
                                                                <div className='kaPianInfoLeiXing' onClick={() => {
                                                                }} >VISA Card</div>
                                                                <div className='kaPianInfo' onClick={() => {
                                                                    setOpenXiangQing(true);
                                                                    setCardConfigID(configItem.configId);
                                                                    myFunction;
                                                                }}   >{t('card_11')}</div>
                                                            </div>

                                                            <div className='flex justify-between items-center mt-10'>
                                                                <div className='openingFee' >{t('card_33')} {configItem.applyCreditFee} {configItem.cardSymbol} </div>
                                                                <div className='openCardBtn' onClick={() => {
                                                                    setOpenXiangQing(true);
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
                                                                    setCardConfigID(configItem.configId);
                                                                    myFunction;
                                                                }}   >{t('card_11')}</div>
                                                            </div>

                                                            <div className='flex justify-between items-center mt-10'>
                                                                <div className='openingFee'>{t('card_33')} 1USD</div>

                                                                <div className='openCardBtn' onClick={() => {
                                                                    setOpenXiangQing(true);
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
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>

                    <div className='flex justify-center mt-10'>
                        <motion.div variants={item} className='shenQingCardDi flex items-center'>
                            <img className='shenQingCard' src="wallet/assets/images/card/card1.png"></img>
                        </motion.div>
                    </div>
                    <div className='kaPianQuanYiZi'>{t('card_37')}</div>
                    <motion.div variants={item} className='flex'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_38')}</div>
                                <div className='flex'>
                                    <img className='quanYiIcon' src="wallet/assets/images/card/usd2.png" alt="" /><span className='quanYiZi'>USD</span>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_39')}</div>
                                {cardConfigList[cardConfigID].creditType === 2 && (<div>{t('card_12')}</div>)}
                                {cardConfigList[cardConfigID].creditType === 3 && (<div>{t('card_13')}</div>)}

                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_33')}</div>
                                <div className='flex'>
                                    <div className='quanYiZi quanYiHui mr-10'>100 USD</div><div className='quanYiZi quanYiLv'>{cardConfigList[cardConfigID].applyCreditFee} {cardConfigList[cardConfigID].cardSymbol}</div>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_41')}</div>
                                <div >{t('card_42')}</div>
                            </div>

                            <div className='flex justify-between mt-10 mb-10'>
                                <div className='quanYiHuiZi'>{t('card_43')}</div>
                                <div> 1000,000 USD/<span>{t('card_103')}</span></div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10'>
                                <div className='text-16'>{t('card_44')}</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_104')}</div>
                                <div>0 USD </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_46')}</div>
                                <div>VISA</div>
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
                                <div>{t('card_57')}</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_53')}</div>
                                <div>{t('card_58')}</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>{t('card_54')}</div>
                                <div>{t('card_59')}</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>{t('card_55')}</div>
                                <div>{t('card_60')}</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi2'>{t('card_56')}</div>
                                <div className='langYouZi'>GooglePay/paypal/facebook/Ebay/AliExpress/Walmart/Taobao</div>
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
                                <div className='quanYiHuiZi pb-8'>{t('card_107')}</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-16' style={{ paddingInline: "1.5rem" }} >
                        <LoadingButton
                            disabled={false}
                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                            color="secondary"
                            loading={isLoadingBtn}
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '100%', height: '4rem', fontSize: "18px", margin: '1rem auto 2.8rem', display: 'block', lineHeight: "inherit" }}
                            onClick={() => {
                                // setOpenApplyWindow(true)
                                // openApplyFunc()
                                // setOpenChongZhi(true)
                                // applyCard()
                                openChangeBiFunc()
                                refreshKycInfo()
                            }}
                        >
                            {t('card_36')}
                        </LoadingButton>
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
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                    </div>
                    <Kyc />
                    <div style={{ height: "5rem" }}></div>
                </motion.div>
            </div>}

            <AnimateModal
                className="faBiDiCard tanChuanDiSe"
                open={openAnimateModal}
                onClose={() => setOpenAnimateModal(false)}
            >
                <div className='flex justify-center' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi '>
                        {t('card_31')}
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
                        {t('card_75')}
                    </div>
                </Box>

                <div className='flex mt-12 mb-28 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        onClick={() => {
                            cardUpdate(1);
                        }}
                    >
                        {t('card_31')}
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

                <div className='flex justify-center' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_32')}
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
                        {t('card_108')}
                    </div>
                </Box>

                <div className='flex mt-32 mb-28 px-15 position-re' >

                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn position-ab"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        style={{ bottom: "0%", left: "0%", right: "0%", margin: "0 auto" }}
                        onClick={() => {
                            setOpenCardBtnShow(true);
                            setTimeout(() => {
                                setOpenAnimateHuanKa(false);
                                setOpenCardBtnShow(false);
                                setTabValue(1);
                                setOpenXiangQing(true);
                                myFunction;
                            }, 1500);
                        }}
                    >
                        {t('card_77')}
                    </LoadingButton>

                    <div className=' position-ab xiaHuaXian' style={{ height: "4rem", lineHeight: "4rem", bottom: "0%", right: "4%", }} onClick={() => {
                        setOpenAnimateHuanKa(false);
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
                                    <div className='PINTitleSelectCardZi'> {t('card_26')}</div>
                                    <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                        closeRecordFunc();
                                    }} />
                                </div>

                                <Tabs
                                    value={huaZhuanValue}
                                    onChange={(ev, value) => setHuaZhuanValue(value)}
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
                                    {Object.entries(huaZhuanRanges).map(([key, label]) => (
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
                                        <div className='text-18'>USDT</div>
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
                                    <div style={{ position: "absolute", top: "0%", right: "4%", height: "4.4rem", lineHeight: "4.4rem" }}>Max</div>
                                </div>

                                <div className='flex justify-between mt-16'>
                                    <div className='flex'>
                                        <div className='' style={{ color: "#94A3B8" }}>{t('home_borrow_16')}</div>
                                        <div className='ml-10'>{transferFee.toFixed(2)} USDT</div>
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
                                                handleTransferCrypto()
                                                // setOpenZhiFu(true)
                                            }}>{t('card_30')}
                                        </div>
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
                                tiJiaoState === 1 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                    ● {t('errorMsg_1')}
                                </motion.div>
                            }
                            {
                                tiJiaoState === 2 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", color: "#EE124B" }}>
                                    ● {t('error_36')}
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
                            <div>{transferFee} USDT </div>
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
                                    className="mb-36"
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

                        <Controller
                            name="checkCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    disabled={true}
                                    className="mb-36"
                                    label={t('card_87')}
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
                <div className='flex justify-center' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_61')}
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
                        {t('card_88')}
                    </div>
                </Box>

                <div className='flex mt-12 mb-28 px-15 justify-between' >
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
                <div className='flex justify-center' style={{ width: "100%" }}>
                    <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                    <div className='TanHaoCardZi'>
                        {t('card_61')}
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
                        {t('card_62')}
                    </div>
                </Box>

                <div className='flex mt-12 mb-28 px-15 justify-center' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenChongZhi(false)
                            setOpenXiangQing(false)
                            changePhoneTab('deposite');
                            history.push('/wallet/home/deposite')
                        }}
                    >
                        {t('card_63')}
                    </LoadingButton>
                </div>
            </AnimateModal>



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
                            <div className='flex pb-20'>
                                <div className='text-16 ml-10'>{cardConfigList[cardConfigID]?.applyCreditFee}</div>
                                <div className='text-16'>&nbsp;{cardConfigList[cardConfigID]?.cardSymbol}</div>
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
        </div>
    )
}

export default Card;
