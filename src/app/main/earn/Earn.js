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
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import VisitorsOverviewWidget from './widgets/VisitorsOverviewWidget';
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
import { lineHeight } from '@mui/system';
import clsx from 'clsx';
import { FormHelperText } from '@mui/material';

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

function Earn(props) {
    const { t } = useTranslation('mainPage');
    const userData = useSelector(selectUserData);
    const [openCheckIn, setOpenCheckIn] = useState(false);
    const [openSpin, setOpenSpin] = useState(false);
    const [openKXian, setOpenKXian] = useState(false);
    const [openKongTou, setOpenKongTou] = useState(false);
    const [openWaKuang, setOpenWaKuang] = useState(false);
    const [openHuanHui, setOpenHuanHui] = useState(false);
    const [openBind, setOpenBind] = useState(false);
    const [openYaoQing, setOpenYaoQing] = useState(false);
    const [openXiangQing, setOpenXiangQing] = useState(false);
    const [inputIDVal, setInputIDVal] = useState(0);
    const [divHeight, setDivHeight] = useState(0);
    const [openZhiYa, setOpenZhiYa] = useState(false);
    const [showZhiYa, setShowZhiYa] = useState(true);
    const [showLiShi, setShowLiShi] = useState(false);
    const [showZhiYaInfo, setShowZhiYaInfo] = useState(false);
    const [showZhiYaXinXi, setShowZhiYaXinXi] = useState(false);
    const [canDeposite, setCanDeposite] = useState(true);
    const [weight, setWeight] = useState('');
    const handleChangeInputVal2 = (event) => {
        setInputIDVal(event.target.value);
    };

    useEffect(() => {
        setPhoneTab('card');
    }, []);

    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgets);

    useEffect(() => {
        setLoadingShow(false);
        dispatch(getWidgets()).then(() => {
            setLoadingShow(false);
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
        setOpenXiangQing(true)
        setTimeout(() => {
            document.getElementById('target').scrollIntoView({ behavior: 'smooth' });
        }, 0);
    }


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

    const openZhiYaFunc = () => {
        setOpenZhiYa(true)
        setShowZhiYa(true);
        setShowLiShi(false);
        setShowZhiYaXinXi(false);
        setShowZhiYaInfo(false);
        setTimeout(() => {
            document.getElementById('openZhiYa').classList.add('PinMoveAni');
        }, 0);
    }

    const closeZhiYaFunc = () => {
        document.getElementById('openZhiYa').classList.remove('PinMoveAni');
        document.getElementById('openZhiYa').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenZhiYa(false)
        }, 300);
    };

    const openHuanHuiFunc = () => {
        setOpenHuanHui(true)
        setTimeout(() => {
            document.getElementById('openHuanHui').classList.add('PinMoveAni');
        }, 0);
    }

    const closeHuanHuiFunc = () => {
        document.getElementById('openHuanHui').classList.remove('PinMoveAni');
        document.getElementById('openHuanHui').classList.add('PinMoveOut');
        setTimeout(() => {
            setOpenHuanHui(false)
        }, 300);
    };


    function ismore(inputVal, MaxVal, MinValue) {
        // if (inputVal > MaxVal || inputVal < MinValue) {
        //     if (inputVal === 0) {
        //         return false
        //     } else {
        //         return true
        //     }
        // } else return false
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

    const [loadingShow, setLoadingShow] = useState(false);
    const textRef = useRef(null);

    return (
        <div className=''>
            {
                !loadingShow &&
                <div style={{ width: "100%" }}>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-12'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>{t('card_113')}</div>
                        <div className='newBlocak'>
                            <div className='flex mt-12'>
                                <div className='qianDaoSty flex justify-between px-10' onClick={() => {
                                    setOpenCheckIn(true)
                                }}>
                                    <div className='mt-6'>
                                        <div>{t('card_172')}</div>
                                        <div style={{ color: "#9a9a9a" }}>{t('card_115')}</div>
                                    </div>
                                    <img src="wallet/assets/images/earn/qianDao.png" />
                                </div>

                                <div className='zhuanPanSty flex justify-between px-10' onClick={() => {
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
                            </div>
                            <div className='flex mt-16 justify-center'>
                                <img className='naoZhongImg' src="wallet/assets/images/earn/naoZhong.png" />  <div className='naoZhongZi ml-10'>{t('card_116')}</div> <div className='ml-10 naoZhongZi' >23:48:36</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-16'
                        style={{ paddingInline: "1.5rem" }}
                    >
                        <div className='text-16'>{t('card_117')}</div>

                    </motion.div>

                    {useMemo(() => {
                        return (
                            !_.isEmpty(widgets) && (
                                <motion.div
                                    className="w-full"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    style={{ padding: "1.5rem", backgroundColor: "#0E1421" }}
                                >
                                    <motion.div variants={item} className="" onClick={() => {
                                        setOpenKXian(true);
                                        openKXianFunc();
                                    }}>
                                        <ImpressionsWidget />
                                    </motion.div>
                                </motion.div>
                            )
                        );
                    }, [widgets])}

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
                    </motion.div>

                    <motion.div
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

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-20'
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
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>净赚收益，</span><span style={{ color: "#5BEA9C", fontWeight: "bold", fontSize: "29px" }}>0 </span><span style={{ color: "#ffffff", fontSize: "14px" }}>GAS</span></div>
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>质押BFT，年化 </span><span style={{ color: "#ffc600", fontWeight: "bold", fontSize: "29px" }}>292%</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi3.png" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
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
                                    <div><span style={{ color: "#FFFFFF", fontSize: "14px" }}>享受佣金 </span><span style={{ color: "#ffc600", fontWeight: "bold", fontSize: "29px" }}>0.1%</span></div>
                                </div>
                                <img className='earnYouTu2 mt-16' src="wallet/assets/images/earn/bi4.png" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
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
                                    <div className='yaoQingEarnZi' style={{ textAlign: "left" }}>500.00</div>
                                    <div className='earnHuiZi' style={{ textAlign: "left" }}>{t('card_128')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "left" }}>USDT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#FF9000" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>30.00</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>{t('card_129')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>USDT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#02A7F0" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>200.00</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>{t('card_128')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "center" }}>BFT</div>
                                </div>

                                <div className='' style={{ width: "25%", color: "#00FF47" }}>
                                    <div className='yaoQingEarnZi' style={{ textAlign: "right" }}>100.00</div>
                                    <div className='earnHuiZi' style={{ textAlign: "right" }}>{t('card_129')}</div>
                                    <div className='earnHuiZi' style={{ textAlign: "right" }}>BFT</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AnimateModal
                        className="checkInDi"
                        closeClass="closeBtnCheckIn"
                        open={openCheckIn}
                        onClose={() => setOpenCheckIn(false)}
                    >
                        <div>
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
                                                width: 14.3 * 1 + "%",
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
                                                3{t('card_103')}
                                            </div>
                                            <img
                                                src="wallet/assets/images/earn/jinBi2.png"
                                                style={{ width: "64px" }}
                                            />
                                            <div className="text-14" style={{ color: "#ffffff" }}>
                                                {100 / 100 || 0}U
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            variants={item}
                                            className="width-85 align-item text-align"
                                            style={{ marginLeft: "3%" }}
                                        >
                                            <div className="text-14" style={{ color: "#FFD569" }}>
                                                5{t('card_103')}
                                            </div>
                                            <img
                                                src="wallet/assets/images/earn/jinBi3.png"
                                                style={{ width: "64px" }}
                                            />
                                            <div className="text-14" style={{ color: "#ffffff" }}>
                                                {200 / 100 || 0}U
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            variants={item}
                                            className="width-85 align-item text-align"
                                            style={{ marginLeft: "3%" }}
                                        >
                                            <div className="text-14" style={{ color: "#FFD569" }}>
                                                7{t('card_103')}
                                            </div>
                                            <img
                                                src="wallet/assets/images/earn/jinBi3.png"
                                                style={{ width: "64px" }}
                                            />
                                            <div className="text-14" style={{ color: "#ffffff" }}>
                                                {200 / 100 || 0}U
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>

                                <div className="flex px-2" style={{ marginTop: "20%" }}>
                                    <motion.div
                                        variants={item}
                                        className="align-item text-align  btnPointer  mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_139')}
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
                                            {200 / 100 || 0}U
                                        </div>
                                        {1 <= 2 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            1 == 0 + 1 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className="align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_133')}
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
                                            {100 / 100 || 0}U
                                        </div>
                                        {2 <= 1 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            2 == 1 + 0 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className="align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_134')}
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
                                            {200 / 100 || 0}U
                                        </div>
                                        {3 <= 2 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            3 == 1 + 1 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className=" align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_135')}
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
                                            {200 / 100 || 0}U
                                        </div>
                                        {4 <= 3 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            4 == 3 + 0 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>
                                </div>

                                <div
                                    className="flex px-2 justifyContent"
                                    style={{ marginTop: "40%" }}
                                >
                                    <motion.div
                                        variants={item}
                                        className=" align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_136')}
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
                                            {100 / 100 || 0}U
                                        </div>
                                        {5 <= 4 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            5 == 3 + 1 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className=" align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_137')}
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
                                            {200 / 100 || 0}U
                                        </div>
                                        {6 <= 4 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png"
                                            />
                                        )}
                                        {!false &&
                                            6 == 4 + 1 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className=" align-item text-align  btnPointer txtBrightness mx-4"
                                        style={{ position: "relative", width: "23%" }}
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
                                            {t('card_137')}
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
                                            {200 / 100 || 0}U
                                        </div>
                                        {7 <= 4 && (
                                            <img
                                                className="positionAb"
                                                style={{ top: "0px", left: "0px" }}
                                                src="wallet/assets/images/earn/checkOver1.png "
                                            />
                                        )}
                                        {!false &&
                                            7 == 4 + 1 && (
                                                <img
                                                    className="positionAb"
                                                    style={{ top: "0px", left: "0px" }}
                                                    src="wallet/assets/images/earn/checkOver_1.png"
                                                    onClick={() => {

                                                    }}
                                                />
                                            )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </AnimateModal>

                    <AnimateModal
                        className="spinDi"
                        closeClass="closeBtnspin"
                        open={openSpin}
                        onClose={() => setOpenSpin(false)}
                    >
                        <Spin />
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
                            <VisitorsOverviewWidget />
                            <div className='txtBrightness text-20 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_156')}</div>
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
                                        质押BFT获得超高收益，每日返利，到期归还质押本金。
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='pt-10 pb-12 mt-20 flex justify-between' style={{ backgroundColor: "#191A1B", borderRadius: "10px", border: "4px solid #151617" }}>
                                        <div style={{ width: "60%" }}>
                                            <div className='text-14 ml-10' style={{ textAlign: "left" }}>质押总资产(BFT)</div>
                                            <div className='text-12 ml-10 mt-12' style={{ textAlign: "left" }}>100.00 ≈ 14.42USD</div>
                                        </div>
                                        <div style={{ width: "40%" }}>
                                            <div className='text-14 mr-10' style={{ textAlign: "right" }}>质押笔数</div>
                                            <div className='text-12 mr-10 mt-12' style={{ textAlign: "right" }}>10</div>
                                        </div>
                                    </motion.div>


                                    <motion.div variants={item} className="mt-16">
                                        <VisitsWidget />
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='mt-12 spinIconShadow2' style={{ width: "100%", height: "60px", borderRadius: "10px", background: "#1E293B", }}>
                                        <div className='flex justify-between px-10' onClick={() => {
                                            openZhiYaXinXi();
                                        }} >
                                            <div className='' style={{ width: "60%", height: "60px", paddingTop: "10px" }}>
                                                <div className='text-14'><span style={{ color: "#14C2A3" }}>182.50%</span> 年利率</div>
                                                <div style={{ color: "#A4A4A4", fontSize: "12px" }}> ≈ 0.50% 日利率 </div>
                                            </div>
                                            <div className='flex justify-end' style={{ width: "40%" }}>
                                                <div style={{ height: "60px", lineHeight: "60px", color: "#7D9BB0", fontSize: "14px" }}>15天</div>
                                                <img style={{ marginTop: "20px", width: "20px", height: "20px" }} src="wallet/assets/images/card/goJianTou.png" ></img>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='mt-12 spinIconShadow2' style={{ width: "100%", height: "60px", borderRadius: "10px", background: "#1E293B", }}>
                                        <div className='flex justify-between px-10' onClick={() => {
                                            openZhiYaXinXi();
                                        }}>
                                            <div className='' style={{ width: "60%", height: "60px", paddingTop: "10px" }}>
                                                <div className='text-14'><span style={{ color: "#14C2A3" }}>182.50%</span> 年利率</div>
                                                <div style={{ color: "#A4A4A4", fontSize: "12px" }}> ≈ 0.50% 日利率 </div>
                                            </div>
                                            <div className='flex justify-end' style={{ width: "40%" }}>
                                                <div style={{ height: "60px", lineHeight: "60px", color: "#7D9BB0", fontSize: "14px" }}>30天</div>
                                                <img style={{ marginTop: "20px", width: "20px", height: "20px" }} src="wallet/assets/images/card/goJianTou.png" ></img>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='mt-12 spinIconShadow2' style={{ width: "100%", height: "60px", borderRadius: "10px", background: "#1E293B", }}>
                                        <div className='flex justify-between px-10' onClick={() => {
                                            openZhiYaXinXi();
                                        }}>
                                            <div className='' style={{ width: "60%", height: "60px", paddingTop: "10px" }}>
                                                <div className='text-14'><span style={{ color: "#14C2A3" }}>182.50%</span> 年利率</div>
                                                <div style={{ color: "#A4A4A4", fontSize: "12px" }}> ≈ 0.50% 日利率 </div>
                                            </div>
                                            <div className='flex justify-end' style={{ width: "40%" }}>
                                                <div style={{ height: "60px", lineHeight: "60px", color: "#7D9BB0", fontSize: "14px" }}>90天</div>
                                                <img style={{ marginTop: "20px", width: "20px", height: "20px" }} src="wallet/assets/images/card/goJianTou.png" ></img>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={item}
                                        className='mt-12 spinIconShadow2' style={{ width: "100%", height: "60px", borderRadius: "10px", background: "#1E293B", }}>
                                        <div className='flex justify-between px-10' onClick={() => {
                                            openZhiYaXinXi();
                                        }}>
                                            <div className='' style={{ width: "60%", height: "60px", paddingTop: "10px" }}>
                                                <div className='text-14'><span style={{ color: "#14C2A3" }}>182.50%</span> 年利率</div>
                                                <div style={{ color: "#A4A4A4", fontSize: "12px" }}> ≈ 0.50% 日利率 </div>
                                            </div>
                                            <div className='flex justify-end' style={{ width: "40%" }}>
                                                <div style={{ height: "60px", lineHeight: "60px", color: "#7D9BB0", fontSize: "14px" }}>180天</div>
                                                <img style={{ marginTop: "20px", width: "20px", height: "20px" }} src="wallet/assets/images/card/goJianTou.png" ></img>
                                            </div>
                                        </div>
                                    </motion.div>
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
                                        <motion.div
                                            variants={item}
                                            className='zhiYaLiShi px-10 py-10'>
                                            <div className='flex'>
                                                <img style={{ width: "18px", height: "18px" }} src="wallet/assets/images/earn/naoZhong.png"></img>
                                                <div className='ml-10 text-12' style={{ color: "#9A9A9A" }}> 2024-11-06 14:34:26 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 总收益</div>
                                                <div className='text-12'> 120 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 质押金额</div>
                                                <div className='text-12'> 300 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 状态</div>
                                                <div className='text-12'> 质押中 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 结束日期</div>
                                                <div className='text-12'> 2024-11-06 14:34:26 </div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            variants={item}
                                            className='zhiYaLiShi px-10 py-10 '>
                                            <div className='flex'>
                                                <img style={{ width: "18px", height: "18px" }} src="wallet/assets/images/earn/naoZhong.png" ></img>
                                                <div className='ml-10 text-12' style={{ color: "#9A9A9A" }}> 2024-11-06 14:34:26 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 总收益</div>
                                                <div className='text-12'> 120 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 质押金额</div>
                                                <div className='text-12'> 300 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 状态</div>
                                                <div className='text-12'> 质押中 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 结束日期</div>
                                                <div className='text-12'> 2024-11-06 14:34:26 </div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            variants={item}
                                            className='zhiYaLiShi px-10 py-10 '>
                                            <div className='flex'>
                                                <img style={{ width: "18px", height: "18px" }} src="wallet/assets/images/earn/naoZhong.png" ></img>
                                                <div className='ml-10 text-12' style={{ color: "#9A9A9A" }}> 2024-11-06 14:34:26 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 总收益</div>
                                                <div className='text-12'> 120 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 质押金额</div>
                                                <div className='text-12'> 300 BFT </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 状态</div>
                                                <div className='text-12'> 质押中 </div>
                                            </div>
                                            <div className='mt-10 flex justify-between'>
                                                <div className='text-12'> 结束日期</div>
                                                <div className='text-12'> 2024-11-06 14:34:26 </div>
                                            </div>
                                        </motion.div>
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
                                                <div className='text-16' style={{ color: "#ffffff" }}> 292.00% </div>
                                            </div>
                                        </motion.div >

                                        <motion.div
                                            variants={item}
                                            className='mt-16'>
                                            <div className='flex justify-between'>
                                                <div className='text-16' style={{ color: "#ffffff" }}> 账户剩余 </div>
                                                <div className='text-16' style={{ color: "#ffffff" }}> 500 BFT</div>
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
                                                                setWeight(10000)
                                                            }}
                                                        >MAX</InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'weight',
                                                        inputMode: 'numeric',
                                                        pattern: '[0-9]*',
                                                    }}
                                                    error={ismore(weight, 10000, 100)}
                                                    placeholder="100起投"
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
                                                        if (numericValue > 10000 || numericValue == 0 || numericValue < 100) {
                                                            setCanDeposite(true);
                                                        }
                                                        setWeight(numericValue);
                                                    }}
                                                />
                                            </FormControl>
                                            {ismore(weight, 10000, 100) && (
                                                <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt2' > {t('deposite_35')}</FormHelperText>
                                            )}

                                            <div className='mt-12'>
                                                <div>预估收益</div>
                                                <div className='text-18 mt-4' style={{ color: "#14C2A3", fontWeight: "600" }}>0 BFT</div>
                                            </div>

                                            <div className='flex justify-between mt-20'>
                                                <div className='liXiTimeZi'>
                                                    <div>开始日期</div>
                                                    <div>2024-08-29</div>
                                                    <div>00:00:00</div>
                                                </div>

                                                <div className='flex align-item' style={{}}>
                                                    <img style={{ width: "22px", height: "22px" }} src="wallet/assets/images/earn/jianTou.png" ></img>
                                                </div>

                                                <div className='liXiTimeZi'>
                                                    <div>计息日期</div>
                                                    <div>2024-08-30</div>
                                                    <div>00:00:00</div>
                                                </div>

                                                <div className='flex align-item' style={{}}>
                                                    <img style={{ width: "22px", height: "22px" }} src="wallet/assets/images/earn/jianTou.png" ></img>
                                                </div>

                                                <div className='liXiTimeZi'>
                                                    <div style={{ textAlign: "right" }}>结束日期</div>
                                                    <div style={{ textAlign: "right" }}>2024-09-15</div>
                                                    <div style={{ textAlign: "right" }}>00:00:00</div>
                                                </div>
                                            </div>

                                            <div className='flex justify-center mt-20' style={{ width: "100%" }}>
                                                <LoadingButton className="text-lg btnColorTitleBig inputYaoQingBtan"
                                                    size="large"
                                                    color="secondary"
                                                    variant="contained"
                                                    loading={false}
                                                    sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
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
                                邀请好友后可获得好友支付后总金额的0.1%佣金！
                            </div>
                            <div className='flex  mt-32 justify-center'>
                                <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/card/usd.png"></img>
                                <div className='text-14 ml-6' style={{ height: "24px", lineHeight: "24px" }}>换汇总收益(USDT)</div>
                            </div>
                            <div className='mt-12 text-32 w-full fontBold' style={{ textAlign: "center", color: "#00FF96" }}>1000.00</div>
                            <div className='flex  justify-between mt-20'>
                                <div>
                                    <div style={{ textAlign: "center" }}>邀请总数</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>3</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_129')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>

                                <div>
                                    <div style={{ textAlign: "center" }}>{t('card_153')}(USDT)</div>
                                    <div className='mt-6' style={{ textAlign: "center" }}>100.00</div>
                                </div>
                            </div>
                            <div style={{ height: "40px" }}></div>
                            <div className='txtBrightness text-20 px-15 ' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>邀请好友</div>
                            <div style={{ height: "20px" }}></div>
                        </div>
                    </BootstrapDialog>



                    {openXiangQing && <div id="target" style={{ position: "absolute", width: "100%", zIndex: "998", backgroundColor: "#0E1421", top: "0%", bottom: "0%" }} >
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className='mt-12'
                        >
                            <div className='flex' onClick={() => {
                                setOpenXiangQing(false);
                            }}>
                                <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                            </div>
                            <div className='yaoQingTitleZi'>邀请码 5358485488</div>
                            <div className='my-16' style={{ textAlign: "center" }}>● 邀请好友加入，获得累计 <span style={{ color: "#00f0c5" }}>巨额奖励</span>！</div>

                            <div className='flex justify-center mt-10' style={{ paddingInline: "1.5rem" }}>
                                <div style={{ width: "50%" }}>
                                    <div className='flex justify-center mb-10'>
                                        <img className='' style={{ width: "3rem", height: "3rem" }} src="wallet/assets/images/symbol/USDT.png" alt="" />
                                        <div className='ml-10' style={{ height: "3rem", lineHeight: "3rem", fontSize: "2.8rem" }}>400.00</div>
                                    </div>
                                    <div className='bianShe1' style={{ borderRadius: "50px", height: "0.8rem", width: "90%" }}></div>
                                </div>

                                <div style={{ width: "50%" }}>
                                    <div className='flex justify-center mb-10'>
                                        <img className='' style={{ width: "3rem", height: "3rem" }} src="wallet/assets/images/symbol/bft.png" alt="" />
                                        <div className='ml-10' style={{ height: "3rem", lineHeight: "3rem", fontSize: "2.8rem" }}>100.00</div>
                                    </div>
                                    <div className='bianShe2' style={{ borderRadius: "50px", height: "0.8rem", width: "90%" }}></div>
                                </div>
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
                                                    <img className='mr-10' style={{ width: "2rem", height: "2rem" }} src="wallet/assets/images/menu/deposite3-active.png" alt="" />
                                                </div>
                                                <div>
                                                    <div className='ml-8 fenChengZi'>活期利益分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
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
                                                    <div className='ml-8 fenChengZi'>质押收益分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
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
                                                    <div className='ml-8 fenChengZi'>合约挖矿分成<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
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
                                                    <div className='ml-8 fenChengZi'>支付手续费佣金<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
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
                                                    <div className='ml-8 fenChengZi'>换汇手续费佣金<br /> <p className='fenChengZi2 mt-4'>直接邀请：1人，间接邀请：9人。</p> </div>
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
                            </div>

                            <div className='mt-40 lvGuangDi'>
                                <div className='yaoQingTitleZi'>奖励规则</div>
                                <div className='mb-16' style={{ paddingInline: "15px", textAlign: "center" }}>●邀请好友，好友再邀请好友，<span style={{ color: '#16C2A3' }}>往下12层</span>你都能获得奖励</div>

                                <div className='flex ' style={{ paddingInline: "15px", height: "40px", lineHeight: "40px" }}>
                                    <div style={{ width: "30%", textAlign: "center", borderBottom: "1px solid #14C2A3" }}>层数</div>
                                    <div style={{ width: "70%", marginLeft: "10px" }}>
                                        <div style={{ width: "100%", textAlign: "right" }}>收益比例</div>
                                        <div className='yaoQingxiaHuaXian' style={{ marginTop: "-1px" }}></div>
                                    </div>
                                </div>


                                <div className='flex mt-2' style={{ paddingInline: "15px", height: "40px", lineHeight: "40px" }}>
                                    <div style={{ width: "30%", textAlign: "center", borderBottom: "1px solid #14C2A3" }}>1</div>
                                    <div style={{ width: "70%", marginLeft: "10px" }}>
                                        <div style={{ width: "100%", textAlign: "right" }}>15%</div>
                                        <div className='yaoQingxiaHuaXian' style={{ marginTop: "-1px" }}></div>
                                    </div>
                                </div>

                                <div className='flex mt-2' style={{ paddingInline: "15px", height: "40px", lineHeight: "40px" }}>
                                    <div style={{ width: "30%", textAlign: "center", borderBottom: "1px solid #14C2A3" }}>2</div>
                                    <div style={{ width: "70%", marginLeft: "10px" }}>
                                        <div style={{ width: "100%", textAlign: "right" }}>7.5%</div>
                                        <div className='yaoQingxiaHuaXian' style={{ marginTop: "-1px" }}></div>
                                    </div>
                                </div>


                                <div className='flex mt-2' style={{ paddingInline: "15px", height: "40px", lineHeight: "40px" }}>
                                    <div style={{ width: "30%", textAlign: "center", borderBottom: "1px solid #14C2A3" }}>3</div>
                                    <div style={{ width: "70%", marginLeft: "10px" }}>
                                        <div style={{ width: "100%", textAlign: "right" }}>3.75%</div>
                                        <div className='yaoQingxiaHuaXian' style={{ marginTop: "-1px" }}></div>
                                    </div>
                                </div>

                                <div className='flex mt-2' style={{ paddingInline: "15px", height: "40px", lineHeight: "40px" }}>
                                    <div style={{ width: "30%", textAlign: "center", borderBottom: "1px solid #14C2A3" }}>4-12</div>
                                    <div style={{ width: "70%", marginLeft: "10px" }}>
                                        <div style={{ width: "100%", textAlign: "right" }}>1%</div>
                                        <div className='yaoQingxiaHuaXian' style={{ marginTop: "-1px" }}></div>
                                    </div>
                                </div>
                                <div className='mt-40'>
                                    <div className='yaoQingTitleZi'>如何邀请</div>
                                    <div className='flex' style={{ paddingLeft: "15px" }}>
                                        <div className='fangFaBtn'>方法 1</div>
                                        <div className='fangFaBtn2'>分享 https://www.beingfi.com</div>
                                        <img className='ml-10' style={{ width: "20px", height: "20px", marginTop: "3px" }} src="wallet/assets/images/deposite/newCopy2.png" />
                                    </div>
                                    <div className='flex mt-20' style={{ paddingLeft: "15px" }}>
                                        <div className='fangFaBtn'>方法 2</div>
                                        <div className='fangFaBtn2'>邀请好友进入Telegram官方社群</div>
                                        <img className='ml-10' style={{ width: "20px", height: "20px", marginTop: "3px" }} src="wallet/assets/images/deposite/fenXiang.png" />
                                    </div>
                                </div>
                                <div className='' style={{ height: "100px" }}></div>
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

export default withReducer('analyticsDashboardApp', reducer)(Earn);
