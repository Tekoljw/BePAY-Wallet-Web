import { useState, useEffect, useMemo, default as React, useRef } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { arrayLookup, setPhoneTab } from "../../util/tools/function";
import Dialog from "@mui/material/Dialog/Dialog";
import { useTranslation } from "react-i18next";
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import Box from '@mui/material/Box';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import VisitorsOverviewWidget from './widgets/VisitorsOverviewWidget';
import { selectConfig } from "../../store/config";
import ConversionsWidget from './widgets/ConversionsWidget';
import ImpressionsWidget from './widgets/ImpressionsWidget';
import VisitsWidget from './widgets/VisitsWidget';
import AnimateModal from "../../components/FuniModal";
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Spin from "../spin/Spin";
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from "@mui/lab/LoadingButton";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControl from '@mui/material/FormControl';
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { height, lineHeight } from '@mui/system';
import clsx from 'clsx';
import { FormHelperText } from '@mui/material';
import { handleCopyText } from "../../util/tools/function";
import { useNavigate } from 'react-router-dom';
import {
    signInActivityConfig,
    signInActivityInfo,
    signIn,
    turnTableActivityConfig,
    turnTableActivityInfo,
    turntable,
    tokenPledgeActivityConfig,
    tokenPledgeActivityInfo,
    pledge,
    beingFiActivityInfo,
    beingFiActivityControl,
    demandInterestActivity,
    swapRewardActivity,
    walletPayRewardActivity,
    getInviteRewardConfig,
    getInviteRewardAllInfo,
    getInviteRewardDetail
} from '../../store/activity/activityThunk';
import format from 'date-fns/format';
import { centerGetTokenBalanceList } from "app/store/user/userThunk";
import { shareURL } from '@telegram-apps/sdk';

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
    hidden: { y: 20 },
    show: { y: 0 },
};

function Earn(props) {
    const { t } = useTranslation('mainPage');
    const navigate = useNavigate()
    const userData = useSelector(selectUserData);
    const [btnLoading, setBtnLoading] = useState(false);
    const [openCheckIn, setOpenCheckIn] = useState(false);
    const [openSpin, setOpenSpin] = useState(false);
    const [openKXian, setOpenKXian] = useState(false);
    const [openKongTou, setOpenKongTou] = useState(false);
    const [openWaKuang, setOpenWaKuang] = useState(false);
    const [openHuanHui, setOpenHuanHui] = useState(false);
    const [openBind, setOpenBind] = useState(false);
    const [openYaoQing, setOpenYaoQing] = useState(false);
    const [openXiangQing, setOpenXiangQing] = useState(false);
    const [openXiangQing2, setOpenXiangQing2] = useState(false);
    const [inputIDVal, setInputIDVal] = useState(0);
    const [divHeight, setDivHeight] = useState(0);
    const [openZhiYa, setOpenZhiYa] = useState(false);
    const [openZhiFu, setOpenZhiFu] = useState(false);
    const [showZhiYa, setShowZhiYa] = useState(true);
    const [showLiShi, setShowLiShi] = useState(false);
    const [showZhiYaInfo, setShowZhiYaInfo] = useState(false);
    const [showZhiYaXinXi, setShowZhiYaXinXi] = useState(false);
    const [canDeposite, setCanDeposite] = useState(true);
    const [openFuLiBao, setOpenFuLiBao] = useState(false);
    const [activityList, setActivityList] = useState([]);
    const [activityInfo, setActivityInfo] = useState({});
    const config = useSelector(selectConfig);
    const [swapData, setSwapData] = useState({});
    const [walletPayRewardData, setWalletPayRewardData] = useState({});
    const [demandInterestActivityData, setDemandInterestActivityData] = useState({});
    const [inviteLevelConfig, setInviteLevelConfig] = useState([]);
    const [inviteLevelNum, setInviteLevelNum] = useState(0);
    const [estimateTokenPledgeAmount, setEstimateTokenPledgeAmount] = useState('0.00');
    const [inviteRewardAllInfo, setInviteRewardAllInfo] = useState([]);
    const [inviteDefferentTypeReward, setInviteDefferentTypeReward] = useState([]);
    const [copyTiShi, setCopyTiShi] = useState(false);
    const [weight, setWeight] = useState(0);
    const [loadingShow, setLoadingShow] = useState(false);
    const textRef = useRef(null);
    const [openSheQu, setOpenSheQu] = useState(false);
    const [fuLiBaoTips, setFuLiBaoTips] = useState(false);
    const [openQuKuan, setOpenQuKuan] = useState(false);
    const [turnTableConfigList, setTurnTableConfigList] = useState([]);
    const [signInConfig, setSignInConfig] = useState([]);
    const [cumulativeConfig, setCumulativeConfig] = useState([]);
    const [currentCumculativeVal, setCurrentCumculativeVal] = useState([]);
    const [signInInfo, setSignInInfo] = useState({});
    const [curDay, setCurDay] = useState(0);
    const [days, setDays] = useState([]);
    const [signInState, setSignInState] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [tokenPledgeActivityConfigList, setTokenPledgeActivityConfigList] = useState([]);
    const [tokenPledgeActivityAllInfo, setTokenPledgeActivityAllInfo] = useState({});
    const [currentTolkenPledgeActivityInfo, setCurrentTolkenPledgeActivityInfo] = useState({});
    const [userPledgeRecordList, setUserPledgeRecordList] = useState([]);
    const [biZhongU, setBiZhongU] = useState("usdt");
    const [biZhongB, setBiZhongB] = useState("bft");
    const [openTianXie, setOpenTianXie] = useState(false);
    const [yaoQingMa, setYaoQingMa] = useState(0);
    const [openYaoQingQuKuan, setOpenYaoQingQuKuan] = useState(false);

    const handleChangeInputVal2 = (event) => {
        setInputIDVal(event.target.value);
    };
    const [symbol, setSymbol] = useState('');
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [symbolList, setSymbolList] = useState([]);
    //activityId:  1:签到, 2:钱包支付分成, 3:活期利息 4:swap兑换分成 5:转盘 6:质押挖矿 7:合约交易 8:复利宝 9:社区活动 10:钱包全球节点

    const handleChangeInputVal = (event) => {
        setYaoQingMa(event.target.value);
    };


    useEffect(() => {
        setPhoneTab('card');
        setLoadingShow(true);
        dispatch(beingFiActivityControl()).then((res) => {
            const result = res.payload
            setLoadingShow(false);
            if (result?.errno === 0) {
                setActivityList(result.data)
            }
        });
        dispatch(beingFiActivityInfo()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setActivityInfo(result.data)
            }
        });
        dispatch(signInActivityConfig()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setSignInConfig(result?.data?.signInConfig || [])
                setCumulativeConfig(result?.data?.cumulativeConfig || [])
            }
        });
        dispatch(turnTableActivityConfig()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setTurnTableConfigList(result.data.list)
            }
        });
        dispatch(tokenPledgeActivityConfig()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setTokenPledgeActivityConfigList(result.data)
            }
        });
    }, []);

    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgets);

    useEffect(() => {
        dispatch(getWidgets()).then(() => {
        });
    }, [dispatch]);


    const openKXianFunc = () => {
        setTimeout(() => {
            document.getElementById('openKXian').classList.add('PinMoveAni');
        }, 0);
    };

    const closesKXianFunc = () => {
        document.getElementById('openKXian').classList.remove('PinMoveAni');
        document.getElementById('openKXian').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenKXian(false)
        }, 300);
    };

    const openSheQuFunc = () => {
        setTimeout(() => {
            document.getElementById('openSheQu').classList.add('PinMoveAni');
            getDivHeight("openSheQuGuiZe");
        }, 0);
    };

    const closeSheQuFunc = () => {
        document.getElementById('openSheQu').classList.remove('PinMoveAni');
        document.getElementById('openSheQu').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenSheQu(false)
        }, 300);
    };


    const openYaoQingQuKuanFunc = () => {
        setOpenYaoQingQuKuan(true)
        setTimeout(() => {
            document.getElementById('openYaoQingQuKuan').classList.add('PinMoveAni');
        }, 0);
    };

    const closeYaoQingQuKuanFunc = () => {
        document.getElementById('openYaoQingQuKuan').classList.remove('PinMoveAni');
        document.getElementById('openYaoQingQuKuan').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenYaoQingQuKuan(false)
        }, 300);
    };

    const openKongTouFunc = () => {
        setTimeout(() => {
            document.getElementById('openKongTou').classList.add('PinMoveAni');
        }, 0);
    };

    const openBindFunc = () => {
        setOpenBind(true)
        setTimeout(() => {
            document.getElementById('openBind').classList.add('PinMoveAni');
        }, 0);
    };

    const openXiangQingFunc = () => {
        setOpenHuanHui(false)
        setOpenZhiFu(false)
        dispatch(getInviteRewardConfig()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setInviteLevelConfig(result.data)
                setInviteLevelNum(result.data ? result.data.length : 0)
                setOpenXiangQing(true)
                setOpenXiangQing2(false)
                setTimeout(() => {
                    document.getElementById('target').scrollIntoView({ behavior: 'smooth' });
                }, 0);
            }
        });
        dispatch(getInviteRewardAllInfo()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setInviteRewardAllInfo(result.data)
            }
        });

        loopCallInviteRewardDetails(1, []);
    }

    const loopCallInviteRewardDetails = (i, temArr) => {
        let index = i;
        dispatch(getInviteRewardDetail({ activityId: index })).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                temArr[index] = result.data;
                if (index < 10) {
                    index += 1
                    loopCallInviteRewardDetails(index, temArr)
                }else{
                    setInviteDefferentTypeReward(temArr);
                    return;
                }
            }
        });
    }

    // 处理手指按下事件
    const handleTouchStart = () => {
        setFuLiBaoTips(true);
    };

    // 处理手指松开事件
    const handleTouchEnd = () => {
        setFuLiBaoTips(false);
    };


    const closesBindFunc = () => {
        document.getElementById('openBind').classList.remove('PinMoveAni');
        document.getElementById('openBind').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenBind(false)
        }, 300);
    };

    const closesKongTouFunc = () => {
        document.getElementById('openKongTou').classList.remove('PinMoveAni');
        document.getElementById('openKongTou').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenKongTou(false)
        }, 300);
    };


    const openQuKuanFunc = () => {
        getDivHeight("openFuLiBao");
        setTimeout(() => {
            setOpenQuKuan(true);
        }, 0);
    };


    const openWaKuangFunc = () => {
        setTimeout(() => {
            document.getElementById('openWaKuang').classList.add('PinMoveAni');
        }, 0);
    };


    const closesWaKuangFunc = () => {
        document.getElementById('openWaKuang').classList.remove('PinMoveAni');
        document.getElementById('openWaKuang').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenWaKuang(false)
        }, 300);
    };

    const openZhiYaFunc = async () => {
        await invokeTokenPledgeActivityInfo()
        setOpenZhiYa(true)
        setShowZhiYa(true);
        setShowLiShi(false);
        setShowZhiYaXinXi(false);
        setShowZhiYaInfo(false);
        setTimeout(() => {
            document.getElementById('openZhiYa').classList.add('PinMoveAni');
        }, 0);
    }

    const invokeTokenPledgeActivityInfo = async () => {
        await dispatch(tokenPledgeActivityInfo()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setTokenPledgeActivityAllInfo(result.data)
                setUserPledgeRecordList(result?.data?.userPledgeRecord || []);
            }
        });
    }


    const closeZhiYaFunc = () => {
        document.getElementById('openZhiYa').classList.remove('PinMoveAni');
        document.getElementById('openZhiYa').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenZhiYa(false)
        }, 300);
    };

    const openHuanHuiFunc = () => {
        dispatch(swapRewardActivity()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setSwapData(result.data)
                setOpenHuanHui(true)
                setTimeout(() => {
                    document.getElementById('openHuanHui').classList.add('PinMoveAni');
                }, 0);
            }
        });
    }

    const closeHuanHuiFunc = () => {
        document.getElementById('openHuanHui').classList.remove('PinMoveAni');
        document.getElementById('openHuanHui').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenHuanHui(false)
        }, 300);
    };

    const openZhiFuFunc = () => {
        dispatch(walletPayRewardActivity()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setWalletPayRewardData(result.data)
                setOpenZhiFu(true)
                setTimeout(() => {
                    document.getElementById('openZhiFu').classList.add('PinMoveAni');
                }, 0);
            }
        });
    }

    const closeZhiFuFunc = () => {
        document.getElementById('openZhiFu').classList.remove('PinMoveAni');
        document.getElementById('openZhiFu').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenZhiFu(false)
        }, 300);
    };


    function ismore(inputVal, MaxVal, MinValue) {
        if (inputVal > MaxVal || inputVal < MinValue) {
            if (inputVal === 0) {
                return false
            } else {
                return true
            }
        } else return false
    }

    const openLiShiFunc = () => {
        getDivHeight("pinDivHeight");
        setShowZhiYa(false);
        setShowLiShi(true);
    };

    const backZhiYaFunc = () => {
        setShowZhiYa(true);
        setShowLiShi(false);
        setShowZhiYaXinXi(false);
        setShowZhiYaInfo(false);
    };

    const openZhiYaXinXi = () => {
        getDivHeight("pinDivHeight");
        setShowZhiYa(false);
        setShowZhiYaXinXi(true);
        setShowZhiYaInfo(true);
    };


    const getDivHeight = (divName) => {
        setDivHeight(document.getElementById(divName).offsetHeight)
    };

    const existCurrentActivity = (id) => {
        return activityList && _.find(activityList, { activityId: id }) && _.find(activityList, { activityId: id }).state === 1
    }

    const openDemandInterestResult = () => {
        dispatch(demandInterestActivity()).then((res) => {
            const result = res.payload
            if (result?.errno === 0) {
                setDemandInterestActivityData(result.data);
                setOpenKXian(true);
                openKXianFunc();
            }
        });
    }

    const openFuLiBaoFunc = () => {
        setOpenFuLiBao(true);
        setTimeout(() => {
            document.getElementById('openFuLiBao').classList.add('PinMoveAni');
        }, 0);
    }

    const closeFuLiBaoFunc = () => {
        document.getElementById('openFuLiBao').classList.remove('PinMoveAni');
        document.getElementById('openFuLiBao').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenFuLiBao(false)
        }, 300);
    };


    const copyTiShiFunc = () => {
        setCopyTiShi(true)
        setTimeout(() => {
            setCopyTiShi(false)
        }, 800);
    }

    const parseJson = (strJson) => {
        if (strJson) {
            return JSON.parse(strJson)
        }
    }

    const startCheckIn = async () => {
        setOpenCheckIn(true)
        await invokeSignInInfo();
    }

    const invokeSignInInfo = async () => {
        await dispatch(signInActivityInfo()).then((res) => {
            const result = res.payload;
            const days = calculateDaysForDisplay(result?.data?.curDay || 0);
            setSignInInfo(result?.data);
            setCurDay(result?.data?.curDay);
            setDays(days)
            setSignInState(result?.data?.signInData ? parseJson(result.data.signInData).signInState : [])
            const tempCumculative = findAndSlice(cumulativeConfig.map((item) => { return item.cumulativeDay }), _.size(result?.data?.signInData ? parseJson(result.data.signInData).signInState : []));
            setCurrentCumculativeVal(tempCumculative);
            const step = retriveCurrentStep(result?.data?.signInData ? parseJson(result.data.signInData).signInState : []);
            setCurrentStep(step);
        })
    }

    const findAndSlice = (arr, val) => {
        // 判断如果 val 大于数组的最后一位
        if (val > arr[arr.length - 1]) {
            // 获取数组中最后一个 3 的倍数索引
            let lastIndex = arr
                .map((_, index) => index) // 获取所有索引
                .filter(index => (index + 1) % 3 === 0) // 只保留 3 的倍数索引
                .pop(); // 获取最后一个 3 的倍数索引

            if (lastIndex !== undefined) {
                return arr.slice(lastIndex, lastIndex + 3); // 截取 3 个值
            }
        } else {
            // 筛选出索引是 3 的倍数的位置
            let indices = arr
                .map((_, index) => index)
                .filter(index => (index) % 3 === 0); // 筛选索引是 3 的倍数的

            // 找到满足条件的位置
            let startIndex = indices.find(index => arr[index] <= val);

            if (startIndex !== undefined) {
                return arr.slice(startIndex, startIndex + 3); // 截取 3 个值
            }
        }

        return "没有满足条件的索引"; // 如果没有找到满足条件的值
    }


    const retriveCurrentStep = (list) => {
        const signedDays = _.size(list);
        if (signedDays === 0) {
            return 0
        } else if (0 < signedDays && signedDays < cumulativeConfig[0]?.cumulativeDay) {
            return 1
        } else if (signedDays === cumulativeConfig[0].cumulativeDay) {
            return 2
        } else if (cumulativeConfig[0].cumulativeDay < signedDays && signedDays < cumulativeConfig[1].cumulativeDay) {
            return 3
        } else if (signedDays === cumulativeConfig[1].cumulativeDay) {
            return 4
        } else if (cumulativeConfig[1].cumulativeDay < signedDays && signedDays < cumulativeConfig[2].cumulativeDay) {
            return 5
        } else if (signedDays === cumulativeConfig[2].cumulativeDay) {
            return 6
        } else {
            return 7
        }

    }

    const handleSignin = async () => {
        await dispatch(signIn()).then((res) => {
            const result = res.payload;
            if (result?.errno === 0) {
                invokeSignInInfo()
            }
        })
    }

    const currenyPaytoken = (currentSymbol, currentBalance) => {
        const symbolRate = _.get(_.find(config.symbols, {symbol: currentSymbol }), 'sellRate', 0);
        return (currentBalance * symbolRate).toFixed(2)
    };

    const handlePledge = async () => {
        setBtnLoading(true);
        let data = {
            configId: currentTolkenPledgeActivityInfo.id,
            pledgeAmount: weight
        }
        await dispatch(pledge(data)).then((res) => {
            setBtnLoading(false);
            const result = res.payload;
            if (result?.errno === 0) {
                invokeTokenPledgeActivityInfo();
                dispatch(centerGetTokenBalanceList({ forceUpdate: true }));
            }
        })
    }

    const calculateDaysForDisplay = (currentDay) => {
        const daysInWeek = 7; // 每周 7 天

        // 计算当前天在表盘的位置 (1~7)，余数为 0 则放在第 7 个位置
        const positionInWeek = currentDay % daysInWeek || daysInWeek;

        const result = [];

        // 补充当前天之前的天数（正序）
        for (let i = positionInWeek - 1; i > 0; i--) {
            result.push(currentDay - i);
        }

        // 加入当前天
        result.push(currentDay);

        // 补充当前天之后的天数（顺序）
        for (let i = 1; i <= daysInWeek - positionInWeek; i++) {
            result.push(currentDay + i);
        }

        return result;
    }

    return (
        <div className=''>
            {
                !loadingShow &&
                <div style={{ width: "100%" }}>
                    {(existCurrentActivity(1) || existCurrentActivity(5)) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-16'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='flex  justify-between'>
                            <div className='text-16' style={{ height: "26px", lineHeight: "26px" }}>{t('card_113')}</div>
                            <div className='px-10' style={{ backgroundColor: "#0D9488", borderRadius: "99px", height: "26px", lineHeight: "26px" }}
                                onClick={() => {
                                    setOpenTianXie(true)
                                }}
                            >{t("earn_2")}</div>
                        </div>

                        <div className='newBlocak'>
                            <div className='flex mt-12'>
                                {existCurrentActivity(1) && <div className='qianDaoSty flex justify-between px-10' onClick={() => {
                                    startCheckIn()
                                }}>
                                    <div className='mt-6'>
                                        <div>{t('card_172')}</div>
                                        <div style={{ color: "#9a9a9a" }}>{t('card_115')}</div>
                                    </div>
                                    <img src="wallet/assets/images/earn/qianDao.png" />
                                </div>
                                }

                                {existCurrentActivity(5) && <div className='zhuanPanSty flex justify-between px-10' onClick={() => {
                                    setOpenSpin(true)
                                }}>
                                    <div className='mt-6'>
                                        <div>{t('card_114')}</div>
                                        <div style={{ color: "#9a9a9a" }}>{t('card_115')}</div>
                                    </div>
                                    <div className='' style={{ position: "relative", width: "5.2rem", height: "5.2rem" }}>
                                        <img className='zhuanPanDongHua0' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan3.png" />
                                        <img className='zhuanPanDongHua' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan2.png" />
                                        <img className='zhuanPanDongHua0' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan1.png" />
                                    </div>
                                </div>
                                }
                            </div>
                            <div className='flex mt-16 justify-center'>
                                <img className='naoZhongImg' src="wallet/assets/images/earn/naoZhong.png" />  <div className='naoZhongZi ml-10'>{t('card_116')}</div> <div className='ml-10 naoZhongZi' >{activityInfo?.limitActivityTime === '0' ? '00:00:00' : activityInfo?.limitActivityTime}</div>
                            </div>
                        </div>
                    </motion.div>
                    }

                    {existCurrentActivity(3) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-16'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>{t('card_117')}</div>
                    </motion.div>
                    }

                    {existCurrentActivity(3) && (
                        <motion.div
                            className="w-full"
                            variants={container}
                            initial="hidden"
                            animate="show"
                            style={{ padding: "1.5rem", backgroundColor: "#0E1421" }}
                        >
                            <motion.div variants={item} className="" onClick={() => {
                                openDemandInterestResult()
                            }}>
                                <ImpressionsWidget activityInfo={activityInfo} biZhong={biZhongU} />
                            </motion.div>
                        </motion.div>
                    )
                    }
                    {/* 
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-10'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>{t('card_118')}</div>
                        <div className='lanDi mt-16' onClick={() => {
                            setOpenKongTou(true)
                            openKongTouFunc();
                            // setOpenYaoQing(true)
                        }}>
                            <img className='logoCC' src="wallet/assets/images/earn/logo1.png" />
                            <div className='flex mt-16  justify-between'>
                                <div className='lanDiZi pb-10 pb-10'>
                                    <div><span style={{ color: "#A4A4A4" }}>{t('card_119')}</span><span style={{ marginLeft: "10px", color: "#FFC600", fontWeight: "bold", fontSize: "29px" }}>1000,000,000</span></div>
                                    <div><span style={{ color: "#1BB9FF", fontWeight: "bold", fontSize: "24px" }}>BFT</span><span style={{ marginLeft: "10px", color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>BeingFi Token</span></div>
                                </div>
                                <img className='earnYouTu ' src="wallet/assets/images/earn/bi1.png" />
                            </div>
                        </div>
                    </motion.div> */}



                    {existCurrentActivity(8) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className=''
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>复利宝</div>
                    </motion.div>
                    }

                    {existCurrentActivity(8) && (
                        <motion.div
                            className="w-full"
                            variants={container}
                            initial="hidden"
                            animate="show"
                            style={{ padding: "1.5rem", backgroundColor: "#0E1421" }}
                        >
                            <motion.div variants={item} className="" onClick={() => {
                                openFuLiBaoFunc();
                            }}>
                                <ImpressionsWidget activityInfo={activityInfo} biZhong={biZhongB} />
                            </motion.div>
                        </motion.div>
                    )
                    }

                    {existCurrentActivity(7) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-20'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>{t('card_120')}</div>
                        <div className='huangDi mt-16' onClick={() => {
                            setOpenWaKuang(true)
                            openWaKuangFunc();
                        }}>
                            <div className='flex justify-between pt-4'>
                                <div className='huangDiZi'>
                                    <img className='logoCC2 mb-4' src="wallet/assets/images/earn/logo2.png" />
                                    <div className='tuoYuanDi'>
                                        <div className='' style={{ color: "#ffffff", textAlign: "center", fontSize: "20px", whiteSpace: 'nowrap', overflow: 'hidden' }}><span style={{ color: "#8100D3" }}>{t('card_122')}</span> </div>
                                    </div>
                                    <div><span style={{ color: "#FFC600", fontWeight: "bold", fontSize: "29px" }}>100% </span><span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>{t('card_123')}</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi2.png" />
                            </div>
                        </div>
                    </motion.div>
                    }

                    {existCurrentActivity(6) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-8'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>质押挖矿</div>
                        <div className='ziDi mt-16' onClick={() => {
                            openZhiYaFunc();
                        }}>
                            <div className='flex justify-between pt-4'>
                                <div className='huangDiZi'>
                                    <div className='tuoYuanDi2'>
                                        <div className='' style={{ textAlign: "center", fontSize: "20px", whiteSpace: 'nowrap', overflow: 'hidden' }}><span style={{ color: "#ffffff" }}>超高的收益</span> </div>
                                    </div>
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>净赚收益，</span><span style={{ color: "#5BEA9C", fontWeight: "bold", fontSize: "29px" }}>{activityInfo?.tokenPledgeShowReward}</span><span style={{ color: "#ffffff", fontSize: "14px" }}> GAS</span></div>
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>质押BFT，年化 </span><span style={{ color: "#ffc600", fontWeight: "bold", fontSize: "29px" }}>{(activityInfo?.tokenPledgeShowYearRate * 100)?.toFixed(3)}%</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi3.png" />
                            </div>
                        </div>
                    </motion.div>
                    }

                    {existCurrentActivity(4) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-20'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>换汇佣金</div>
                        <div className='lvDi mt-16' onClick={() => {
                            openHuanHuiFunc();
                        }}>
                            <div className='flex justify-between pt-4'>
                                <div className='huangDiZi'>
                                    <div className='flex'>
                                        <div className='' style={{ fontSize: "20px", overflow: 'hidden' }}>BeingFi</div>
                                        <img className='swapWH' src="wallet/assets/images/earn/swapImg.png" />
                                        <div className='' style={{ fontSize: "20px", overflow: 'hidden' }}>Swap</div>
                                    </div>
                                    <div><span >换汇风暴，</span><span style={{ color: "#5BEA9C" }}>邀友共赢</span></div>
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>享受佣金 </span><span style={{ color: "#ffc600", fontWeight: "bold", fontSize: "29px" }}>{(activityInfo?.swapRewardRate * 100)?.toFixed(3)} %</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi4.png" />
                            </div>
                        </div>
                    </motion.div>
                    }


                    {!openXiangQing && existCurrentActivity(2) && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-20'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>支付佣金</div>
                        <div className='tianLanDi mt-16' onClick={() => {
                            openZhiFuFunc();
                        }}>
                            <div className='flex justify-between pt-4'>
                                <div className='huangDiZi'>
                                    <div className='flex'>
                                        <img className='mr-10' style={{ width: "26px", height: "26px" }} src="wallet/assets/images/earn/zhiFuImg.png" />
                                        <div className='' style={{ fontSize: "20px", overflow: 'hidden' }}>BeingFi 支付</div>
                                    </div>
                                    <div><span >小费，</span><span style={{ fontSize: "20px", color: "#30F2DD" }}>大收益</span></div>
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>享受佣金 </span><span style={{ color: "#ffc600", fontWeight: "bold", fontSize: "29px" }}>{(activityInfo?.walletPayRate * 100)?.toFixed(3)}%</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi5.png" />
                            </div>
                        </div>
                    </motion.div>
                    }


                    {!openXiangQing && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-20'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16 '>{t('card_125')}</div>
                        <div className='lvEarnDi mt-16' onClick={() => {
                            // openBindFunc();//提示绑定界面
                            openXiangQingFunc();
                        }}>
                            <div className='flex justify-start pt-4'>
                                <img className='liBaoDiImg' src="wallet/assets/images/earn/giftIcon.png" />
                                <div className='yaoQingZiDi'>
                                    <div className='yaoQingZiDi2'>{t('card_126')}</div>
                                </div>
                                <div style={{ fontSize: "20px", color: "#00FF96", fontWeight: "bold" }}>{t('card_127')}</div>
                            </div>

                            <div className='flex justify-between mt-20'>
                                <div className='' style={{ width: "25%" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "left" }}>{Number(activityInfo?.inviteReward?.inviteRewardAllUSDT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardAllUSDT)}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "left" }}>{t('card_128')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "left" }}>USDT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#FF9000" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>{Number(activityInfo?.inviteReward?.inviteRewardTodayUSDT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardTodayUSDT)}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>{t('card_129')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>USDT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#02A7F0" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>{Number(activityInfo?.inviteReward?.inviteRewardAllBFT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardAllBFT)}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>{t('card_128')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>BFT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#00FF47" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "right" }}>{Number(activityInfo?.inviteReward?.inviteRewardTodayBFT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardTodayBFT)}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "right" }}>{t('card_129')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "right" }}>BFT</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    }




                    <AnimateModal
                        className="checkInDi"
                        closeClass="closeBtnCheckIn"
                        open={openCheckIn}
                        onClose={() => setOpenCheckIn(false)}
                    >

                        <Typography className="textAlignRight">
                            <span
                                style={{ display: "block", color: "#FFD569" }}
                                className=" checkInTitleMt  text-align titleTxt"
                            >
                                {t('card_172')}
                            </span>
                        </Typography>


                        <motion.div variants={container} initial="hidden" animate="show">
                            <motion.div
                                variants={item}
                                className="text-16  text-align checkInTxtmtMiaoShu"
                            >
                                {t('card_132')}
                            </motion.div>
                            <motion.div
                                variants={item}
                                style={{
                                    position: "relative",
                                    paddingTop: "15%",
                                    marginLeft: "5%",
                                }}
                            >
                                <div
                                    className="borderRadius "
                                    style={{
                                        width: "90%",
                                        height: "12px",
                                        backgroundColor: "#0F1520",
                                        position: "absolute",
                                    }}
                                >
                                    <div
                                        className="borderRadius"
                                        style={{
                                            width: 14.3 * currentStep + "%",
                                            height: "13px",
                                            backgroundColor: "#EA9B13",
                                            position: "absolute",
                                        }}
                                    >
                                    </div>
                                </div>
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="flex"
                                    style={{ position: "absolute", top: "14%", left: "22%" }}
                                >
                                    <motion.div
                                        variants={item}
                                        className="width-85 align-item text-align"
                                    >
                                        <div className="text-14" style={{ color: "#FFD569" }}>
                                            {cumulativeConfig[0]?.cumulativeDay || 0}{t('card_103')}
                                        </div>
                                        <img
                                            src="wallet/assets/images/earn/jinBi2.png"
                                            style={{ width: "64px" }}
                                        />
                                        <div className="text-14" style={{ color: "#ffffff" }}>
                                            {cumulativeConfig[0]?.rewardValue || 0} U
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        variants={item}
                                        className="width-85 align-item text-align"
                                        style={{ marginLeft: "3%" }}
                                    >
                                        <div className="text-14" style={{ color: "#FFD569" }}>
                                            {cumulativeConfig[1]?.cumulativeDay || 0}{t('card_103')}
                                        </div>
                                        <img
                                            src="wallet/assets/images/earn/jinBi3.png"
                                            style={{ width: "64px" }}
                                        />
                                        <div className="text-14" style={{ color: "#ffffff" }}>
                                            {cumulativeConfig[1]?.rewardValue || 0} U
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        variants={item}
                                        className="width-85 align-item text-align"
                                        style={{ marginLeft: "3%" }}
                                    >
                                        <div className="text-14" style={{ color: "#FFD569" }}>
                                            {cumulativeConfig[2]?.cumulativeDay || 0}{t('card_103')}
                                        </div>
                                        <img
                                            src="wallet/assets/images/earn/jinBi3.png"
                                            style={{ width: "64px" }}
                                        />
                                        <div className="text-14" style={{ color: "#ffffff" }}>
                                            {cumulativeConfig[2]?.rewardValue || 0} U
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                        </motion.div>


                        <div className="flex px-2" style={{ marginTop: "20%" }}>

                            <div
                                className="align-item text-align  btnPointer  mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[0]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong"
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[0]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi1.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[0]?.rewardValue || 0} U
                                </div>
                                {signInState && days[0] && signInState.indexOf(days[0]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[0] === curDay && (!signInState || (days[0] && signInState && signInState.indexOf(days[0]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[0] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                className="align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[1]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong "
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[1]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi1.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[1]?.rewardValue || 0} U
                                </div>
                                {signInState && days[1] && signInState.indexOf(days[1]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[1] === curDay && (!signInState || (days[1] && signInState && signInState.indexOf(days[1]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[1] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                className="align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[2]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong "
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[2]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi2.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[2]?.rewardValue || 0} U
                                </div>
                                {signInState && days[2] && signInState.indexOf(days[2]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[2] === curDay && (!signInState || (days[2] && signInState && signInState.indexOf(days[2]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[2] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                className=" align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[3]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong "
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[3]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi2.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[3]?.rewardValue || 0} U
                                </div>
                                {signInState && days[3] && signInState.indexOf(days[3]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[3] === curDay && (!signInState || (days[3] && signInState && signInState.indexOf(days[3]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[3] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                        </div>

                        <div
                            className="flex px-2 justifyContent"
                            style={{ marginTop: "40%" }}
                        >
                            <div
                                className="align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[4]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong"
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[4]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi3.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[4]?.rewardValue || 0} U
                                </div>
                                {signInState && days[4] && signInState.indexOf(days[4]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[4] === curDay && (!signInState || (days[4] && signInState && signInState.indexOf(days[4]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[4] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                className=" align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[5]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => { }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong "
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[5]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi3.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[5]?.rewardValue || 0} U
                                </div>
                                {signInState && days[5] && signInState.indexOf(days[5]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png"
                                    />
                                )}
                                {(days[5] === curDay && (!signInState || (days[5] && signInState && signInState.indexOf(days[5]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[5] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>

                            <div
                                className=" align-item text-align  btnPointer txtBrightness mx-4"
                                style={{ position: "relative", width: "23%", opacity: Number(days[6]) < Number(curDay) ? 0.4 : 1 }}
                                onClick={() => {

                                }}
                            >
                                <img
                                    className="positionAb"
                                    style={{ top: "0px", left: "0px" }}
                                    src="wallet/assets/images/earn/phoneQianDao1.png"
                                />
                                <div
                                    className="positionAb text-14 marginJuZhong "
                                    style={{
                                        paddingTop: "8%",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    Day {days[6]}
                                </div>
                                <img
                                    className="positionAb marginJuZhong"
                                    style={{ top: "24px", left: "8px", width: "80%" }}
                                    src="wallet/assets/images/earn/jinBi4.png"
                                />
                                <div
                                    className="positionAb text-14"
                                    style={{
                                        top: "92px",
                                        left: "0px",
                                        width: "100%",
                                        color: "#ffffff",
                                    }}
                                >
                                    {signInConfig[6]?.rewardValue || 0} U
                                </div>
                                {signInState && days[6] && signInState.indexOf(days[6]) > -1 && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver1.png "
                                    />
                                )}
                                {(days[6] === curDay && (!signInState || (days[6] && signInState && signInState.indexOf(days[6]) < 0))) && (
                                    <img
                                        className="positionAb"
                                        style={{ top: "0px", left: "0px" }}
                                        src="wallet/assets/images/earn/checkOver_1.png"
                                        onClick={() => {
                                            if (days[6] != curDay) return;
                                            handleSignin()
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                    </AnimateModal>

                    <AnimateModal
                        className="spinDi"
                        closeClass="closeBtnspin"
                        open={openSpin}
                        onClose={() => setOpenSpin(false)}
                    >
                        <Spin turnTableConfigList={turnTableConfigList} />
                    </AnimateModal>

                    <BootstrapDialog
                        onClose={() => setOpenKXian(false)}
                        open={openKXian}
                        closeClass="closeBtnspin"
                    >
                        <div id="openKXian" className="px-15 kXianDi2">
                            <div className='flex mt-10' style={{ justifyContent: "end" }}>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closesKXianFunc();
                                }} ></img>
                            </div>
                            <div className='flex justifyContent'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-18 ml-6' style={{ fontWeight: "600" }} >{t('card_152')} USD</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>{(userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat).toFixed(2) ?? '0.00'}</div>
                            <div className='flex  justify-between mt-12'>
                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{(demandInterestActivityData.demandInterestData && parseJson(demandInterestActivityData?.demandInterestData)?.yd) ? (Number(parseJson(demandInterestActivityData?.demandInterestData)?.yd?.symbol?.USDT) === 0 ? '0.00' : Number(parseJson(demandInterestActivityData.demandInterestData)?.yd?.symbol?.USDT)) : '0.00'}</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_154')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{(demandInterestActivityData.demandInterestData && parseJson(demandInterestActivityData?.demandInterestData)?.all) ? (Number(parseJson(demandInterestActivityData?.demandInterestData)?.all?.symbol?.USDT) === 0 ? '0.00' : Number(parseJson(demandInterestActivityData.demandInterestData)?.all?.symbol?.USDT)) : '0.00'}</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_155')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}> {(demandInterestActivityData?.curDemandInterest / 365 * 100)?.toFixed(3)}%</div>
                                </div>
                            </div>
                            <VisitorsOverviewWidget demandInterestHistory={demandInterestActivityData?.demandInterestHistory} />
                            <div className='txtBrightness text-20 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }} onClick={() => {
                                navigate('/home/deposite');
                            }}>{t('card_156')}</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>

                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openKongTou}
                        onClose={() => setOpenKongTou(false)}
                    >
                        <div id='openKongTou' className="px-15 pt-10 kongTouDi">
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle'>{t('card_157')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closesKongTouFunc();
                                }} ></img>
                            </div>
                            <div className='mt-16' style={{ textAlign: "center" }}>
                                {t('card_158')}<span className='text-20' style={{ color: "#1BB9FF", fontWeight: "700" }}>30%</span>BFT
                            </div>
                            <div className='' style={{ textAlign: "center" }}>
                                {t('card_159')}<span className='text-20' style={{ color: "#00FF96", fontWeight: "700" }} >1%</span>
                            </div>

                            <motion.div variants={item} className="mt-16">
                                <VisitsWidget />
                            </motion.div>

                            <div className='pt-10 pb-12 mt-24' style={{ backgroundColor: "#191A1B", borderRadius: "10px", border: "4px solid #151617" }}>
                                <div className='text-16' style={{ textAlign: "center" }}>{t('card_160')}</div>
                                <div className='text-12 mt-12' style={{ textAlign: "center", color: "#FFC600" }}>{t('card_161')}</div>
                            </div>

                            <div className='flex justifyContent mt-20'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-16 ml-6'>{t('card_152')}USD</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>10000.00</div>
                            <div className='flex  justify-between mt-12'>
                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_154')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_155')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>5.26%</div>
                                </div>
                            </div>
                            <div className='txtBrightness text-20 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_156')}</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>


                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openZhiYa}
                        onClose={() => setOpenZhiYa(false)}
                    >
                        <div id='openZhiYa' className="px-15 pt-10 zhiYaDi">
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                {
                                    showZhiYa && <img src="wallet/assets/images/earn/liShiBtn.png" className='closePinBtn' onClick={() => {
                                        openLiShiFunc();
                                    }} ></img>
                                }

                                {
                                    showLiShi && <img src="wallet/assets/images/earn/liShiBtn2.png" className='closePinBtn' onClick={() => {
                                        backZhiYaFunc();
                                    }} ></img>
                                }

                                {
                                    showZhiYaInfo && <img src="wallet/assets/images/earn/liShiBtn2.png" className='closePinBtn' onClick={() => {
                                        backZhiYaFunc();
                                    }} ></img>
                                }

                                <div className='text-18 kongTouTitle'>质押挖矿</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeZhiYaFunc();
                                }} ></img>
                            </div>
                            {
                                showZhiYa && <motion.div id="pinDivHeight"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className=''>
                                    <motion.div
                                        variants={item}
                                        className='mt-20 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                        质押BFT获得超高收益，每日返利，到期归还质押本金，收益自动结算到复利宝。
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='pt-10 pb-12 mt-20 flex justify-between' style={{ backgroundColor: "#191A1B", borderRadius: "10px", border: "4px solid #151617" }}>
                                        <div style={{ width: "60%" }}>
                                            <div className='text-14 ml-10' style={{ textAlign: "left" }}>质押总资产(BFT)</div>
                                            <div className='text-12 ml-10 mt-12' style={{ textAlign: "left" }}>{ tokenPledgeActivityAllInfo.tokenPledgeRewardData ? parseJson(tokenPledgeActivityAllInfo?.tokenPledgeRewardData)?.all.symbol.BFT : '0.00' } ≈ {tokenPledgeActivityAllInfo.tokenPledgeRewardData ? currenyPaytoken('BFT', Number(parseJson(tokenPledgeActivityAllInfo?.tokenPledgeRewardData)?.all.symbol.BFT)) : '0.00'} USD</div>
                                        </div>
                                        <div style={{ width: "40%" }}>
                                            <div className='text-14 mr-10' style={{ textAlign: "right" }}>质押笔数</div>
                                            <div className='text-12 mr-10 mt-12' style={{ textAlign: "right" }}>{userPledgeRecordList?.length}</div>
                                        </div>
                                    </motion.div>


                                    <motion.div variants={item} className="mt-16">
                                        <VisitsWidget />
                                    </motion.div>

                                    {
                                        tokenPledgeActivityConfigList && tokenPledgeActivityConfigList.map((pledage) => {
                                            return (
                                                <motion.div
                                                    variants={item}
                                                    className='mt-12 spinIconShadow2' style={{ width: "100%", height: "60px", borderRadius: "10px", background: "#1E293B", }}>
                                                    <div className='flex justify-between px-10' onClick={() => {
                                                        setCurrentTolkenPledgeActivityInfo(pledage)
                                                        openZhiYaXinXi();
                                                    }} >
                                                        <div className='' style={{ width: "60%", height: "60px", paddingTop: "10px" }}>
                                                            <div className='text-14'><span style={{ color: "#14C2A3" }}>{(pledage?.yearRate * 100)?.toFixed(3)}%</span> 年利率</div>
                                                            <div style={{ color: "#A4A4A4", fontSize: "12px" }}> ≈ {(pledage?.yearRate * 100 / 365)?.toFixed(3)}% 日利率 </div>
                                                        </div>
                                                        <div className='flex justify-end' style={{ width: "40%" }}>
                                                            <div style={{ height: "60px", lineHeight: "60px", color: "#7D9BB0", fontSize: "14px" }}>{pledage?.pledgeDay}天</div>
                                                            <img style={{ marginTop: "20px", width: "20px", height: "20px" }} src="wallet/assets/images/card/goJianTou.png" ></img>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })
                                    }
                                    <div className='' style={{ height: "30px" }}></div>
                                </motion.div>
                            }
                            {
                                showLiShi &&
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <motion.div
                                        variants={item}
                                        className='mt-12 mb-12' style={{ textAlign: "center", color: "#A4A4A4" }}>BFT质押记录</motion.div>
                                    <div style={{ height: `${divHeight - 24}px`, overflowY: "auto", paddingRight: "2px" }} >
                                        {
                                            userPledgeRecordList && userPledgeRecordList.map((record) => {
                                                return (
                                                    <motion.div
                                                        variants={item}
                                                        className='zhiYaLiShi px-10 py-10'>
                                                        <div className='flex'>
                                                            <img style={{ width: "18px", height: "18px" }} src="wallet/assets/images/earn/naoZhong.png"></img>
                                                            <div className='ml-10 text-12' style={{ color: "#9A9A9A" }}> {format(Number(record?.createTime) * 1000, 'yyyy-MM-dd HH:mm:ss')} </div>
                                                        </div>
                                                        <div className='mt-10 flex justify-between'>
                                                            <div className='text-12'> 总收益</div>
                                                            <div className='text-12'> {record?.curPledgeRewardAmount || '0.00'} {record?.interestSymbol} </div>
                                                        </div>
                                                        <div className='mt-10 flex justify-between'>
                                                            <div className='text-12'> 质押金额</div>
                                                            <div className='text-12'> {record?.pledgeAmount || '0.00'} {record?.interestSymbol} </div>
                                                        </div>
                                                        <div className='mt-10 flex justify-between'>
                                                            <div className='text-12'> 状态</div>
                                                            <div className='text-12'> {(record?.deleted) ? '已结束' : '质押中'} </div>
                                                        </div>
                                                        <div className='mt-10 flex justify-between'>
                                                            <div className='text-12'> 结束日期</div>
                                                            <div className='text-12'> {format(Number(record?.pledgeEndTime) * 1000, 'yyyy-MM-dd HH:mm:ss')} </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })
                                        }
                                    </div>
                                </motion.div>
                            }
                            {
                                showZhiYaXinXi && <div className=''>
                                    <motion.div
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        style={{ height: `${divHeight - 12}px` }} >
                                        <motion.div
                                            variants={item}
                                            className='mt-32'>
                                            <div className='flex justify-between'>
                                                <div className='text-16' style={{ color: "#ffffff" }}> 当前年利率 </div>
                                                <div className='text-16' style={{ color: "#ffffff" }}> {(currentTolkenPledgeActivityInfo?.yearRate * 100)?.toFixed(3)}% </div>
                                            </div>
                                        </motion.div >

                                        <motion.div
                                            variants={item}
                                            className='mt-16'>
                                            <div className='flex justify-between'>
                                                <div className='text-16' style={{ color: "#ffffff" }}> 账户剩余 </div>
                                                <div className='text-16' style={{ color: "#ffffff" }}> {userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance}BFT </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            variants={item}
                                            className='zhiYaLiShi px-16 py-20 mt-20'>
                                            <div>质押数量</div>
                                            <FormControl className="mt-16 mb-4" sx={{ width: '100%' }} variant="outlined">
                                                <OutlinedInput
                                                    type='text'
                                                    disabled={false}
                                                    id="outlined-adornment-weight send-tips-container-amount"
                                                    value={weight || undefined}
                                                    endAdornment={
                                                        <InputAdornment
                                                            position="end"
                                                            onClick={() => {
                                                                setWeight(userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance)
                                                                setEstimateTokenPledgeAmount((userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance) * currentTolkenPledgeActivityInfo?.yearRate / 365 * currentTolkenPledgeActivityInfo?.pledgeDay)
                                                                setCanDeposite(false);
                                                            }}
                                                        >MAX</InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'weight',
                                                        inputMode: 'numeric',
                                                        pattern: '[0-9]*',
                                                    }}
                                                    error={ismore(weight, userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance, currentTolkenPledgeActivityInfo?.pledgeMinAmount)}
                                                    placeholder={currentTolkenPledgeActivityInfo?.pledgeMinAmount + '起投'}
                                                    onChange={(event) => {
                                                        if (event.target.value === '') {
                                                            setWeight('')
                                                            setEstimateTokenPledgeAmount('0.00')
                                                            setCanDeposite(true);
                                                            return
                                                        }
                                                        let numericValue = event.target.value.replace(/[^0-9.]/g, '');
                                                        if (numericValue.startsWith('0') && numericValue.length > 1 && numericValue[1] !== '.') {
                                                            numericValue = numericValue.replace(/^0+/, '');
                                                        }
                                                        if (numericValue > 0) {
                                                            setCanDeposite(false);
                                                        }
                                                        if (numericValue > userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance || numericValue == 0 || numericValue < currentTolkenPledgeActivityInfo?.pledgeMinAmount) {
                                                            setCanDeposite(true);
                                                        }
                                                        setWeight(numericValue);
                                                        setEstimateTokenPledgeAmount(numericValue ? (numericValue * currentTolkenPledgeActivityInfo?.yearRate / 365 * currentTolkenPledgeActivityInfo.pledgeDay) : '0.00')
                                                    }}
                                                />
                                            </FormControl>
                                            {ismore(weight, userData?.wallet?.inner?.find((item) => { return item.symbol === 'BFT' }).balance, currentTolkenPledgeActivityInfo?.pledgeMinAmount) && (
                                                <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt2' > {t('deposite_35')}</FormHelperText>
                                            )}

                                            <div className='mt-12'>
                                                <div>预估收益</div>
                                                <div className='text-18 mt-4' style={{ color: "#14C2A3", fontWeight: "600" }}>{estimateTokenPledgeAmount} BFT</div>
                                            </div>

                                            <div className='flex justify-between mt-20' style={{ textAlign: 'center' }}>
                                                <div className='liXiTimeZi'>
                                                    <div>开始日期</div>
                                                    <div>{format(new Date(), 'yyyy-MM-dd')}</div>
                                                    <div>{format(new Date(), 'yyyy-MM-dd HH:mm:ss').split(' ')[1]}</div>
                                                </div>

                                                <div className='flex align-item' style={{}}>
                                                    <img style={{ width: "22px", height: "22px" }} src="wallet/assets/images/earn/jianTou.png" ></img>
                                                </div>

                                                <div className='liXiTimeZi'>
                                                    <div>计息日期</div>
                                                    <div>{format(new Date().getTime() + Number(currentTolkenPledgeActivityInfo?.pledgeInterestStartTime) * 1000, 'yyyy-MM-dd')}</div>
                                                    <div>{format(new Date().getTime() + Number(currentTolkenPledgeActivityInfo?.pledgeInterestStartTime) * 1000, 'yyyy-MM-dd HH:mm:ss').split(' ')[1]}</div>
                                                </div>

                                                <div className='flex align-item' style={{}}>
                                                    <img style={{ width: "22px", height: "22px" }} src="wallet/assets/images/earn/jianTou.png" ></img>
                                                </div>

                                                <div className='liXiTimeZi'>
                                                    <div style={{ textAlign: "right" }}>结束日期</div>
                                                    <div>{format(new Date().getTime() + Number(currentTolkenPledgeActivityInfo?.pledgeInterestStartTime) * 1000 + currentTolkenPledgeActivityInfo.pledgeDay * 24 * 3600 * 1000, 'yyyy-MM-dd')}</div>
                                                    <div>{format(new Date().getTime() + Number(currentTolkenPledgeActivityInfo?.pledgeInterestStartTime) * 1000 + currentTolkenPledgeActivityInfo.pledgeDay * 24 * 3600 * 1000, 'yyyy-MM-dd HH:mm:ss').split(' ')[1]}</div>
                                                </div>
                                            </div>

                                            <div className='flex justify-center mt-20' style={{ width: "100%" }}>
                                                <LoadingButton className="text-lg btnColorTitleBig inputYaoQingBtan"
                                                    size="large"
                                                    color="secondary"
                                                    variant="contained"
                                                    loading={btnLoading}
                                                    sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
                                                    onClick={() => {
                                                        if (canDeposite) return;
                                                        handlePledge()
                                                    }}
                                                >
                                                    立即质押
                                                </LoadingButton>
                                            </div>

                                            <div className='' style={{ height: "10px" }}> </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            }
                        </div>
                    </BootstrapDialog>

                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openFuLiBao}
                        onClose={() => setOpenFuLiBao(false)}
                    >
                        {
                            !openQuKuan &&
                            <div id='openFuLiBao' className="px-15 pt-10 zhiYaDi">
                                {
                                    fuLiBaoTips && <div className='' style={{ width: "100%", position: "relative", left: "0%", right: "0%", top: "0%", }}>
                                        <div className='spinIconShadow text-12 pb-16' style={{ maxWidth: "50%", borderRadius: "10px", backgroundColor: "#374252", position: "absolute", left: "0%", right: "0%", margin: "0 auto" }}>
                                            <div className='fulibaoTipsZi'> 今日收益：20 BFT  </div>
                                            <div className='fulibaoTipsZi'> 昨日收益：20 BFT  </div>
                                            <div className='fulibaoTipsZi'> 本月收益：20 BFT  </div>
                                        </div>
                                    </div>
                                }

                                <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                    <div className='text-18 kongTouTitle' style={{ paddingLeft: "25px" }}>复利宝</div>
                                    <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                        closeFuLiBaoFunc();
                                    }} ></img>
                                </div>

                                <div className='mt-16 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                    1.复利宝资产收益为质押挖矿利息及全球招募节点收益。
                                </div>
                                <div className='mt-8 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                    2.复利宝资产按1%的年利率计算收益。
                                </div>
                                <div className='mt-8 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                    3.取款后，资产需锁定3天，期间继续计息，3天后到账。
                                </div>

                                <div className='flex  mt-20 justify-center'>
                                    <img onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                        style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/yanJing.png"></img>
                                    <div className='text-14 ml-6' style={{ height: "24px", lineHeight: "24px" }}>总计资产 (BFT)</div>
                                </div>

                                <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>100.00</div>

                                <motion.div id="pinDivHeight"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className=''>

                                    <motion.div variants={item} className="mt-20">
                                        <VisitsWidget />
                                    </motion.div>
                                </motion.div>


                                <div className='flex  justify-between mt-28 mb-20'>
                                    <div>
                                        <div style={{ textAlign: "center" }}>质押收益(BFT)</div>
                                        <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                    </div>

                                    <div>
                                        <div style={{ textAlign: "center" }}>节点收益(BFT)</div>
                                        <div className='mt-4' style={{ textAlign: "center" }}>100.00</div>
                                    </div>

                                    <div>
                                        <div style={{ textAlign: "center" }}>年化</div>
                                        <div className='mt-6' style={{ textAlign: "center" }}>10%</div>
                                    </div>
                                </div>

                                <div className='txtBrightness text-20 px-15' style={{ position: "relative", bottom: "0%", margin: "0%  auto 6.93% auto", left: "0%", right: "0%", width: "99.4%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}
                                    onClick={() => {
                                        openQuKuanFunc();
                                    }}
                                >取款</div>
                            </div>
                        }
                        {
                            openQuKuan &&
                            <div className="px-15 pt-10 zhiYaDi" style={{ height: `${divHeight}px` }}>
                                <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                    <div className='text-18 kongTouTitle' style={{ paddingLeft: "25px" }}>取款</div>
                                    <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                        setOpenQuKuan(false)
                                    }} ></img>
                                </div>
                                <div className='mt-16 text-16' >
                                    选择币种
                                </div>
                                <Box
                                    className="w-full border flex flex-col mt-16 "
                                    sx={{
                                        backgroundColor: '#1E293B!important',
                                        borderRadius: "10px",
                                        border: 'none',
                                        height: "67px",
                                    }}
                                >
                                    <StyledAccordionSelect
                                        symbol={symbolWallet}
                                        currencyCode="USDT"
                                        setSymbol={setSymbol}
                                    />
                                </Box>
                                <div className='mt-16 text-16' >
                                    取款数量
                                </div>
                                <FormControl className="mt-10 mb-4" sx={{ width: '100%' }} variant="outlined">
                                    <OutlinedInput
                                        type='text'
                                        disabled={false}
                                        id="outlined-adornment-weight send-tips-container-amount"
                                        value={weight}
                                        style={{ backgroundColor: "#1E293B", borderRadius: "6px" }}
                                        endAdornment={
                                            <InputAdornment
                                                position="end"
                                                onClick={() => {
                                                    setWeight(0)
                                                    setCanDeposite(false);
                                                }}
                                            >MAX</InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                            'aria-label': 'weight',
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                        }}
                                        error={ismore(weight, 0, 1000)}
                                        onChange={(event) => {
                                            if (event.target.value === '') {
                                                setWeight('')
                                                setCanDeposite(true);
                                                return
                                            }
                                            let numericValue = event.target.value.replace(/[^0-9.]/g, '');
                                            if (numericValue.startsWith('0') && numericValue.length > 1 && numericValue[1] !== '.') {
                                                numericValue = numericValue.replace(/^0+/, '');
                                            }
                                            if (numericValue > 0) {
                                                setCanDeposite(false);
                                            }
                                            if (numericValue > 1000 || numericValue == 0 || numericValue < 0) {
                                                setCanDeposite(true);
                                            }
                                            setWeight(numericValue);
                                        }}
                                    />
                                </FormControl>

                                <div className='flex mt-16 justify-between'>
                                    <div>实际到账</div>
                                    <div>100.00 USDT</div>
                                </div>

                                <div className='flex mt-16 justify-between'>
                                    <div>手续费</div>
                                    <div>10.00 USDT</div>
                                </div>


                                <div className='flex mt-16 justify-between'>
                                    <div>费率</div>
                                    <div>5%</div>
                                </div>

                                <div className='txtBrightness text-20' style={{ position: "fixed", left: "0%", right: "0%", bottom: "3%", margin: "0 auto", width: "92%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}
                                    onClick={() => {
                                    }}
                                >提现</div>
                            </div>
                        }
                    </BootstrapDialog>


                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openYaoQingQuKuan}
                        onClose={() => {
                            closeYaoQingQuKuanFunc()
                        }}
                    >
                        <div id='openYaoQingQuKuan' className="px-15 pt-10 zhiYaDi" style={{ height: "540px" }}>
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle' style={{ paddingLeft: "25px" }}>取款</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeYaoQingQuKuanFunc();
                                }} ></img>
                            </div>
                            <div className='mt-16 text-16' >
                                选择币种
                            </div>
                            <Box
                                className="w-full border flex flex-col mt-16 "
                                sx={{
                                    backgroundColor: '#1E293B!important',
                                    borderRadius: "10px",
                                    border: 'none',
                                    height: "67px",
                                }}
                            >
                                <StyledAccordionSelect
                                    symbol={symbolWallet}
                                    currencyCode="USDT"
                                    setSymbol={setSymbol}
                                />
                            </Box>
                            <div className='mt-16 text-16' >
                                取款数量
                            </div>
                            <FormControl className="mt-10 mb-4" sx={{ width: '100%' }} variant="outlined">
                                <OutlinedInput
                                    type='text'
                                    disabled={false}
                                    id="outlined-adornment-weight send-tips-container-amount"
                                    value={weight}
                                    style={{ backgroundColor: "#1E293B", borderRadius: "6px" }}
                                    endAdornment={
                                        <InputAdornment
                                            position="end"
                                            onClick={() => {
                                                setWeight(0)
                                                setCanDeposite(false);
                                            }}
                                        >MAX</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*',
                                    }}
                                    error={ismore(weight, 0, 1000)}
                                    onChange={(event) => {
                                        if (event.target.value === '') {
                                            setWeight('')
                                            setCanDeposite(true);
                                            return
                                        }
                                        let numericValue = event.target.value.replace(/[^0-9.]/g, '');
                                        if (numericValue.startsWith('0') && numericValue.length > 1 && numericValue[1] !== '.') {
                                            numericValue = numericValue.replace(/^0+/, '');
                                        }
                                        if (numericValue > 0) {
                                            setCanDeposite(false);
                                        }
                                        if (numericValue > 1000 || numericValue == 0 || numericValue < 0) {
                                            setCanDeposite(true);
                                        }
                                        setWeight(numericValue);
                                    }}
                                />
                            </FormControl>

                            <div className='flex mt-16 justify-between'>
                                <div>实际到账</div>
                                <div>100.00 USDT</div>
                            </div>

                            <div className='flex mt-16 justify-between'>
                                <div>手续费</div>
                                <div>10.00 USDT</div>
                            </div>


                            <div className='flex mt-16 justify-between'>
                                <div>费率</div>
                                <div>5%</div>
                            </div>

                            <div className='txtBrightness text-20' style={{ margin: "90px auto 0px auto", width: "92%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}
                                onClick={() => {
                                }}
                            >提现</div>
                        </div>


                    </BootstrapDialog>



                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openWaKuang}
                        onClose={() => setOpenWaKuang(false)}
                    >
                        <div id='openWaKuang' className="px-15 pt-10 waKuangDi">

                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle'>{t('card_120')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closesWaKuangFunc();
                                }} ></img>
                            </div>

                            <div className='mt-20 text-12' style={{ textAlign: "left", color: "#A4A4A4" }}>
                                {t('card_162')}
                            </div>

                            <motion.div variants={item} className="mt-28">
                                <VisitsWidget />
                            </motion.div>


                            <div className='flex  mt-32'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-14 ml-6' style={{ height: "24px", lineHeight: "24px" }}>{t('card_128')}(BFT)</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "left", color: "#00FF96" }}>10000.00 <span style={{ fontSize: "14px", color: "#ffffff" }}> ≈ 1000 USD</span></div>
                            <div className='flex  justify-between mt-20'>
                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_129')}(BFT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}(BFT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_173')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>
                            </div>
                            <div className='txtBrightness text-20 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_130')}</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>

                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openBind}
                        onClose={() => setOpenBind(false)}
                    >
                        <div id='openBind' className="px-15 pt-10 bindDi">
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle'>{t('card_131')}</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closesBindFunc();
                                }} ></img>
                            </div>
                            <div className='mt-28' style={{ textAlign: "center" }}>
                                {t('card_163')}
                            </div>
                            <img className='cardEarnTips' src="wallet/assets/images/card/card1.png"></img>
                            <div className='txtBrightness text-16 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_164')}</div>
                        </div>
                    </BootstrapDialog>

                    <AnimateModal
                        className="yaoQingDi"
                        closeClass="closeBtnspin"
                        open={openYaoQing}
                        onClose={() => setOpenYaoQing(false)}
                    >
                        <div className='flex mt-20' style={{ justifyContent: "space-between", width: "100%" }}>
                            <div className='text-18 yaoQingTitle'>{t('card_165')}</div>
                        </div>
                        <div className='mt-20' style={{ width: "100%", textAlign: "center" }}>
                            {t('card_166')}
                        </div>
                        <OutlinedInput
                            id="outlined-adornment-address send-tips-container-address"
                            value={inputIDVal}
                            onChange={handleChangeInputVal2}
                            aria-describedby="outlined-weight-helper-text"
                            className='inputYaoQing'
                        />
                        <LoadingButton className="text-lg btnColorTitleBig inputYaoQingBtan"
                            size="large"
                            color="secondary"
                            variant="contained"
                            loading={false}
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            onClick={async () => {
                            }}
                        >
                            {t('card_167')}
                        </LoadingButton>
                    </AnimateModal>

                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openHuanHui}
                        onClose={() => setOpenHuanHui(false)}
                    >
                        <div id='openHuanHui' className="px-15 pt-10 waKuangDi">
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle'>换汇业务佣金</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeHuanHuiFunc();
                                }} ></img>
                            </div>

                            <div className='mt-20 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                邀请好友后可获得好友换汇后总金额的{(activityInfo?.swapRewardRate * 100)?.toFixed(3)}%佣金！
                            </div>
                            <div className='flex  mt-32 justify-center'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-14 ml-6' style={{ height: "24px", lineHeight: "24px" }}>换汇总收益(USDT)</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>{ swapData?.totalReward ? Number(parseJson(swapData.totalReward)?.reward?.symbol?.USDT) : '0.00'}</div>
                            <div className='flex  justify-between mt-20'>
                                <div>
                                    <div style={{ textAlign: "center" }}>邀请人数</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{swapData?.inviteUserCount}</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_129')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{ swapData?.todayReward ? Number(parseJson(swapData.todayReward)?.reward?.symbol?.USDT) : '0.00' } USDT</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{ swapData?.yesterdayReward ? Number(parseJson(swapData.yesterdayReward)?.reward?.symbol?.USDT) : '0.00'} USDT</div>
                                </div>

                            </div>
                            <div style={{ height: "40px" }}></div>
                            <div className='txtBrightness text-20 px-15 ' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}
                                onClick={() => { openXiangQingFunc(); }}
                            >邀请好友</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>

                    <BootstrapDialog
                        closeClass="closeBtnspin"
                        open={openZhiFu}
                        onClose={() => setOpenZhiFu(false)}
                    >
                        <div id='openZhiFu' className="px-15 pt-10 waKuangDi">
                            <div className='flex mt-10' style={{ justifyContent: "space-between", width: "100%" }}>
                                <div className='text-18 kongTouTitle'>支付业务佣金</div>
                                <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                    closeZhiFuFunc();
                                }} ></img>
                            </div>

                            <div className='mt-20 text-12' style={{ textAlign: "center", color: "#A4A4A4" }}>
                                邀请好友后可获得好友支付后总金额的{(activityInfo?.walletPayRate * 100)?.toFixed(3)}%佣金！
                            </div>
                            <div className='flex  mt-32 justify-center'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-14 ml-6' style={{ height: "24px", lineHeight: "24px" }}>支付总收益(USDT)</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>{ walletPayRewardData?.totalReward ? Number( parseJson(walletPayRewardData.totalReward)?.reward?.symbol?.USDT): '0.00'} </div>
                            <div className='flex  justify-between mt-20'>
                                <div>
                                    <div style={{ textAlign: "center" }}>邀请人数</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{walletPayRewardData?.inviteUserCount}</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_129')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{ walletPayRewardData?.todayReward ?  Number(parseJson(walletPayRewardData.todayReward)?.reward?.symbol?.USDT) :'0.00'} USDT</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>{ walletPayRewardData?.yesterdayReward ? Number(parseJson(walletPayRewardData.yesterdayReward)?.reward?.symbol?.USDT) : '0.00'} USDT</div>
                                </div>
                            </div>
                            <div style={{ height: "40px" }}></div>
                            <div className='txtBrightness text-20 px-15 ' onClick={() => { openXiangQingFunc(); }}
                                style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>邀请好友</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>

                    <BootstrapDialog
                        onClose={() => {
                            setCopyTiShi(false)
                        }}
                        aria-labelledby="customized-dialog-title "
                        open={copyTiShi}
                        className="dialog-container copyTiShiW"
                    >
                        <div style={{ textAlign: "center", padding: "1rem 1rem 1rem 1rem" }}>
                            {t('card_195')}
                        </div>
                    </BootstrapDialog>

                    <AnimateModal
                        className="faBiDiCard tanChuanDiSe"
                        open={openTianXie}
                        onClose={() => {
                            setYaoQingMa(0)
                            setOpenTianXie(false)
                        }
                        }
                    >
                        <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                            <div className='TanHaoCardZi '>
                                {t("earn_2")}
                            </div>
                        </div>

                        <OutlinedInput
                            id="outlined-adornment-address send-tips-container-address"
                            className='inputYaoQing'
                            value={yaoQingMa || ''}
                            placeholder={t("earn_1")}
                            onChange={handleChangeInputVal}
                        />

                        <div className='flex mt-16 mb-28 px-15 justify-between' >
                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                onClick={() => {

                                }}
                            >
                                {t('kyc_23')}
                            </LoadingButton>

                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                onClick={() => {
                                    setYaoQingMa(0)
                                    setOpenTianXie(false)
                                }}
                            >
                                {t('home_pools_15')}
                            </LoadingButton>
                        </div>
                    </AnimateModal>

                    {openXiangQing && <div id="target" style={{ position: "absolute", width: "100%", zIndex: "998", backgroundColor: "#0E1421", top: "0%", bottom: "0%" }} >
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className='mt-12'
                            style={{ height: "100%", overflowY: "auto" }}
                        >
                            <div className='flex' onClick={() => {
                                setOpenXiangQing(false);
                            }}>
                                <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                            </div>

                            <div style={{ fontSize: "20px", textAlign: "center" }}>邀请好友加入</div>
                            <div className='my-16' style={{ textAlign: "center" }}>● 轻松赚取提成<span style={{ color: '#ffc600', fontSize: "16px" }} >30%</span>，累计<span style={{ color: "#00f0c5" }}>巨额奖励</span>！</div>

                            <div className='flex justify-center mt-10' style={{ paddingInline: "1.5rem" }}>
                                <div style={{ width: "50%" }}>
                                    <div className='flex justify-center mb-10'>
                                        <img className='mt-2' style={{ width: "2.6rem", height: "2.6rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                        <div className='ml-10' style={{ height: "3rem", lineHeight: "3rem", fontSize: "2.8rem" }}>{Number(activityInfo?.inviteReward?.inviteRewardAllUSDT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardAllUSDT)} </div>
                                    </div>
                                    <div className='bianShe1' style={{ borderRadius: "50px", fontSize: "18px", height: "3.6rem", width: "80%", color: "#ffffff", lineHeight: "3.6rem", textAlign: "center" }}
                                        onClick={() => {
                                            openYaoQingQuKuanFunc();
                                        }}
                                    >
                                        取款
                                    </div>
                                </div>

                                <div style={{ width: "50%" }}>
                                    <div className='flex justify-center mb-10'>
                                        <img className='mt-2' style={{ width: "2.6rem", height: "2.6rem" }} src="wallet/assets/images/symbol/bft.png" alt="" />
                                        <div className='ml-10' style={{ height: "3rem", lineHeight: "3rem", fontSize: "2.8rem" }}> {Number(activityInfo?.inviteReward?.inviteRewardAllBFT) === 0 ? '0.00' : Number(activityInfo?.inviteReward?.inviteRewardAllBFT)} </div>
                                    </div>
                                    <div className='bianShe2' style={{ borderRadius: "50px", fontSize: "18px", height: "3.6rem", width: "80%", color: "#ffffff", lineHeight: "3.6rem", textAlign: "center" }}
                                        onClick={() => {
                                            openYaoQingQuKuanFunc();
                                        }}
                                    >
                                        取款
                                    </div>
                                </div>
                            </div>
                            {/* 
                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/card-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>开卡费提成<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>1.0</div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>

                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>6</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>0.5</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>7.5</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>1</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>1</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>0</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>1</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>0</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>间接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>9</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>1</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>10</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>0</div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                </Accordion>
                            </div> */}

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/deposite3-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>活期利益分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：{inviteRewardAllInfo.demandInterestData ? parseJson(inviteRewardAllInfo.demandInterestData).direct : 0}人</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.demandInterestData && parseJson(inviteRewardAllInfo.demandInterestData).reward ? (Number(parseJson(inviteRewardAllInfo.demandInterestData)?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(parseJson(inviteRewardAllInfo.demandInterestData)?.reward?.symbol?.USDT)) : '0.00'}</div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{ (inviteDefferentTypeReward[3]?.today)? parseJson(inviteDefferentTypeReward[3].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[3].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[3].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[3].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{(inviteDefferentTypeReward[3]?.today) ? parseJson(inviteDefferentTypeReward[3].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[3].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[3].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[3]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[3].beforeMonth).direct : 0}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                    <div className='' style={{ height: "6px" }}> </div>
                                </Accordion>
                            </div>

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/icon-pools-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>质押收益分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：{inviteRewardAllInfo.tokenPledgeRewardData ?  parseJson(inviteRewardAllInfo.tokenPledgeRewardData).direct : 0}人</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.tokenPledgeRewardData && parseJson(inviteRewardAllInfo.tokenPledgeRewardData).reward ? (Number(parseJson(inviteRewardAllInfo.tokenPledgeRewardData)?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(inviteRewardAllInfo.tokenPledgeRewardData?.reward?.symbol?.USDT)) : '0.00'}</div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.today)?.reward ? parseJson(inviteDefferentTypeReward[6].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[6].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[6].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[6].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.today)?.direct ? parseJson(inviteDefferentTypeReward[6].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[6].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[6].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[6]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[6].beforeMonth).direct : 0}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                    <div className='' style={{ height: "6px" }}> </div>
                                </Accordion>
                            </div>

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/daE.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>合约挖矿分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：{inviteRewardAllInfo.tokenContractRewardData ? parseJson(inviteRewardAllInfo.tokenContractRewardData).direct : 0}人</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.tokenContractRewardData && parseJson(inviteRewardAllInfo.tokenContractRewardData).reward ? (Number(parseJson(inviteRewardAllInfo.tokenContractRewardData)?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(inviteRewardAllInfo.tokenContractRewardData?.reward?.symbol?.USDT)) : '0.00'}</div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.today)?.reward ? parseJson(inviteDefferentTypeReward[7].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[7].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[7].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[7].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.today)?.direct ? parseJson(inviteDefferentTypeReward[7].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[7].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[7].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[7]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[7].beforeMonth).direct : 0}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                    <div className='' style={{ height: "6px" }}> </div>
                                </Accordion>
                            </div>

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/buyCrypto-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>支付手续费佣金<br /> <p className='fenChengZi2 mt-4'>直接邀请：{inviteRewardAllInfo.payCommissionRewardData ? parseJson(inviteRewardAllInfo.payCommissionRewardData).direct : 0}人</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.payCommissionRewardData && parseJson(inviteRewardAllInfo.payCommissionRewardData).reward ? (Number(parseJson(inviteRewardAllInfo.payCommissionRewardData)?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(inviteRewardAllInfo.payCommissionRewardData?.reward?.symbol?.USDT)) : '0.00'}</div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.today)?.reward ? parseJson(inviteDefferentTypeReward[2].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[2].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[2].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[2].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.today)?.direct ? parseJson(inviteDefferentTypeReward[2].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[2].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[2].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[2]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[2].beforeMonth).direct : 0}</div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                    <div className='' style={{ height: "6px" }}> </div>
                                </Accordion>
                            </div>

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/icon-borrow-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>换汇手续费佣金<br /> <p className='fenChengZi2 mt-4'>直接邀请：{inviteRewardAllInfo.swapRewardData ? parseJson(inviteRewardAllInfo.swapRewardData).direct : 0}人</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.swapRewardData && parseJson(inviteRewardAllInfo.swapRewardData).reward ? (Number(parseJson(inviteRewardAllInfo.swapRewardData)?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(inviteRewardAllInfo.swapRewardData?.reward?.symbol?.USDT)) : '0.00'} </div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>

                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.today)?.reward ? parseJson(inviteDefferentTypeReward[4].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[4].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[4].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[4].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.today)?.direct ? parseJson(inviteDefferentTypeReward[4].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[4].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[4].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[4].beforeMonth).direct : 0}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>
                                    <div className='' style={{ height: "6px" }}> </div>
                                </Accordion>
                            </div>

                            <div className='mt-24' style={{ paddingInline: "1.5rem" }}>
                                <div className='yaoQingTitleZi'>社区大使</div>
                                <div className='mb-16' style={{ paddingInline: "15px", textAlign: "center" }}>●邀请好友，好友再邀请好友，你都能获得奖励</div>

                                <Accordion className='gongNengTan10' style={{ border: "1px solid #374252" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        className='gongNengTan20'
                                    >
                                        <div className='flex justify-between w-full' style={{ height: "40px" }}>
                                            <div className='flex'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/earn/team.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>社区大使佣金<br /> <p className='fenChengZi2 mt-4'>社区人数：0人，当前收益： 40%</p> </div>
                                                </div>
                                            </div>
                                            <div className='flex earnDepositeDi'>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <div style={{}}>{inviteRewardAllInfo.swapRewardData && inviteRewardAllInfo.swapRewardData.reward ? (Number(inviteRewardAllInfo.swapRewardData?.reward?.symbol?.USDT) === 0 ? '0.00' : Number(inviteRewardAllInfo.swapRewardData?.reward?.symbol?.USDT)) : '0.00'} </div>
                                                </div>
                                                <div className='flex  align-item' style={{ height: "100%" }}>
                                                    <img className='ml-10 mr-6' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionSummary>

                                    <div className='earnBg'>
                                        <AccordionDetails >
                                            <div className=''>
                                                <div className='flex' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}></div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>今日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>昨日</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>本月</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>上月</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>提成USDT</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.today)?.reward ? parseJson(inviteDefferentTypeReward[4].today)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.yesterday)?.reward ? parseJson(inviteDefferentTypeReward[4].yesterday)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.curMonth)?.reward ? parseJson(inviteDefferentTypeReward[4].curMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.beforeMonth)?.reward ? parseJson(inviteDefferentTypeReward[4].beforeMonth)?.reward?.symbol?.USDT : '0.00'}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>直接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.today)?.direct ? parseJson(inviteDefferentTypeReward[4].today).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.yesterday)?.direct ? parseJson(inviteDefferentTypeReward[4].yesterday).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.curMonth)?.direct ? parseJson(inviteDefferentTypeReward[4].curMonth).direct : 0}</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>{parseJson(inviteDefferentTypeReward[4]?.beforeMonth)?.direct ? parseJson(inviteDefferentTypeReward[4].beforeMonth).direct : 0}</div>
                                                </div>
                                                <div className='flex mt-4' style={{ width: "100%", height: "" }}>
                                                    <div className='' style={{ width: "30%", textAlign: "left" }}>间接邀请人数</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>10</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>10</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>10</div>
                                                    <div className='' style={{ width: "17.5%", textAlign: "center" }}>10</div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </div>

                                    <div className='' style={{ marginLeft: "3%", width: "94%", height: "1px", borderTop: "1px solid #374252" }}>   </div>


                                    <div className='flex justify-between px-10 mt-10'>
                                        <div>下级收益：<span>50%</span></div>
                                        <div className='xiaHuaXian ' style={{ color: "#00F0C5" }}
                                            onClick={() => {
                                                setOpenXiangQing(false);
                                                setOpenXiangQing2(true);
                                                setTimeout(() => {
                                                    document.getElementById('target2').scrollIntoView({ behavior: 'smooth' });
                                                }, 0);
                                            }}
                                        >规则说明</div>
                                    </div>


                                    <div
                                        className='mt-10 ' style={{ width: "100%", height: "40px" }}>
                                        <div className='flex  px-10'>
                                            <div className='' style={{ width: "100%", height: "40px", }}>
                                                <div className='text-14 flex justify-between px-4' ><div>个人质押/BFT</div><div>800/1000</div></div>
                                                <div className='mt-10 mb-2' style={{ width: "100%", height: "6px", position: "relative", background: "#191A1B", borderRadius: "50px" }}>
                                                    <div style={{ width: "80%", height: "6px", position: "absolute", background: "#0D9488", borderRadius: "50px" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className='mt-10 ' style={{ width: "100%", height: "40px" }}>
                                        <div className='flex  px-10'>
                                            <div className='' style={{ width: "100%", height: "40px", }}>
                                                <div className='text-14 flex justify-between px-4' ><div>社区V5成员</div><div>10/20</div></div>
                                                <div className='mt-10 mb-2' style={{ width: "100%", height: "6px", position: "relative", background: "#191A1B", borderRadius: "50px" }}>
                                                    <div style={{ width: "50%", height: "6px", position: "absolute", background: "#0D9488", borderRadius: "50px" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className='mt-10 ' style={{ width: "100%", height: "40px" }}>
                                        <div className='flex  px-10'>
                                            <div className='' style={{ width: "100%", height: "40px", }}>
                                                <div className='text-14 flex justify-between px-4' ><div>社区总质押</div><div>100000/200000</div></div>
                                                <div className='mt-10 mb-2' style={{ width: "100%", height: "6px", position: "relative", background: "#191A1B", borderRadius: "50px" }}>
                                                    <div style={{ width: "50%", height: "6px", position: "absolute", background: "#0D9488", borderRadius: "50px" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='' style={{ height: "18px" }}> </div>
                                </Accordion>
                            </div>


                            <div className='mt-40 '>


                                <div className='' style={{ fontSize: "20px", textAlign: "center" }} >如何邀请</div>

                                <div className='flex mt-20' style={{ paddingLeft: "15px" }}>
                                    <div className='fangFaBtn'>方法 1</div>
                                    <div className='fangFaBtn2'>分享邀请码 {userData?.userInfo?.uniqueInviteCode}</div>
                                    <img className='ml-10' style={{ width: "20px", height: "20px", marginTop: "3px" }} src="wallet/assets/images/deposite/newCopy2.png" onClick={() => {
                                    }} />
                                </div>

                                <div className='flex mt-20' style={{ paddingLeft: "15px" }}>
                                    <div className='fangFaBtn'>方法 2</div>
                                    <div className='fangFaBtn2'>分享邀请链接</div>
                                    <img className='ml-10' style={{ width: "20px", height: "20px", marginTop: "3px" }} src="wallet/assets/images/deposite/newCopy2.png" onClick={() => {
                                        handleCopyText('https://t.me/beingFiVip_bot?start=' + userData?.userInfo?.address);
                                        copyTiShiFunc();
                                    }} />
                                </div>


                                <div className='flex mt-20' style={{ paddingLeft: "15px" }}>
                                    <div className='fangFaBtn'>方法 3</div>
                                    <div className='fangFaBtn2'>邀请好友进入Telegram官方社群</div>
                                    <img className='ml-10' style={{ width: "20px", height: "20px", marginTop: "3px" }} src="wallet/assets/images/deposite/fenXiang.png" onClick={() => {
                                        shareURL('https://t.me/beingfibank/1');
                                    }} />
                                </div>

                                <div className='' style={{ height: "100px" }}></div>
                            </div>
                        </motion.div>
                    </div>}



                    {openXiangQing2 && <div id="target2" style={{ position: "absolute", width: "100%", zIndex: "998", backgroundColor: "#0E1421", top: "0%", bottom: "0%" }} >
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className='mt-12'
                            style={{ height: "100%", overflowY: "auto" }}
                        >
                            <div className='flex' onClick={() => {
                                openXiangQingFunc();
                            }}>
                                <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                            </div>

                            <div className='text-16 px-16 mt-10'>
                                基础说明
                            </div>
                            <div className='px-16 mt-10'>
                                ● 邀请好友组成社区，成为社区大使，享受专属特权<br />
                                ● 社区大使划分等级，升级需满足相应条件<br />
                                ● 社区共享收益分成，若邀请人出现评级，越级情况触发额外收益分成10%<br />
                            </div>

                            <div className='text-16 px-16 mt-16 mb-20'>等级特权</div>


                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#94A3B8" }}>等级</div>
                                <div style={{ textAlign: "center", color: "#94A3B8" }}>条件</div>
                                <div style={{ textAlign: "right", color: "#94A3B8" }}>特权</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv1</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成10%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv2</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成20%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv3</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成30%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv4</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成40%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv5</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成50%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv6</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成60%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>Lv7</div>
                                <div style={{ textAlign: "center", color: "#ffffff" }}>社区总质押10000U</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成70%</div>
                            </div>

                            <div className='flex justify-between guiZeShuoMing'>
                                <div style={{ textAlign: "left", color: "#ffc600" }}>越级、平级</div>
                                <div style={{ textAlign: "right", color: "#00F0C5" }}>收益分成10%</div>
                            </div>

                        </motion.div>
                    </div>}
                    <div style={{ height: "50px" }}></div>
                </div>
            }
            {
                loadingShow &&
                <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                </div>
            }


        </div>
    )
}

export default withReducer('analyticsDashboardApp', reducer)(React.memo(Earn));
