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
import Typography from '@mui/material/Typography';
import Spin from "../spin/Spin";
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from "@mui/lab/LoadingButton";

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
    const [openBind, setOpenBind] = useState(false);
    const [openYaoQing, setOpenYaoQing] = useState(false);
    const [inputIDVal, setInputIDVal] = useState(0);
    const handleChangeInputVal2 = (event) => {
        setInputIDVal(event.target.value);
    };

    useEffect(() => {
        setPhoneTab('card');
    }, []);

    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgets);

    useEffect(() => {
        dispatch(getWidgets());
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
        setTimeout(() => {
            document.getElementById('openBind').classList.add('PinMoveAni');
        }, 0);
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


    return (
        <div className=''>
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
                                className="w-full  "
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
                    className='mt-8'
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
                            <div className='huangDiZi '>
                                <img className='logoCC2 mb-4' src="wallet/assets/images/earn/logo2.png" />
                                <div style={{ display: "inline-block" }}>
                                    <div className='tuoYuanDi'>
                                        <div className='' style={{ marginLeft: "10px", color: "#ffffff", fontSize: "20px", display: "inline-block" }}>{t('card_121')}</div>
                                        <div className='' style={{ marginRight: "10px", color: "#8200d4", fontSize: "20px", display: "inline-block" }}>{t('card_122')}</div>
                                    </div>
                                </div>
                                <div><span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>{t('card_123')}</span><span style={{ color: "#FFC600", fontWeight: "bold", fontSize: "29px" }}>100%</span>
                                    <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>{t('card_124')}</span></div>
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
                    <div className='text-16'>{t('card_125')}</div>
                    <div className='lvEarnDi mt-16' onClick={() => {
                        setOpenBind(true)
                        openBindFunc();
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


                <div style={{ marginBottom: "50px" }}></div>

            </div>

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
                    <VisitorsOverviewWidget />
                    <div className='txtBrightness text-16 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_156')}</div>
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
                    <div className='txtBrightness text-16 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_156')}</div>
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
                    <div className='txtBrightness text-16 px-15' style={{ margin: "40px auto 0px auto", width: "100%", height: "46px", lineHeight: "46px", textAlign: "center", backgroundColor: "#0D9488", borderRadius: "999px" }}>{t('card_130')}</div>
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

                    <img className='cardEarnTips mt-28' src="wallet/assets/images/card/card1.png"></img>

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

        </div>
    )
}

export default withReducer('analyticsDashboardApp', reducer)(Earn);
