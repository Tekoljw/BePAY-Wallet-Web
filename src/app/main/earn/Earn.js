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
    


    useEffect(() => {
        setPhoneTab('card');
    }, []);

    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgets);

    useEffect(() => {
        dispatch(getWidgets());
    }, [dispatch]);

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
                    <div className='text-16'>新手福利</div>
                    <div className='newBlocak'>
                        <div className='flex mt-12'>
                            <div className='qianDaoSty flex justify-between px-10' onClick={() => {
                                setOpenCheckIn(true)
                            }}>
                                <div className='mt-6'>
                                    <div>Check In</div>
                                    <div style={{ color: "#9a9a9a" }}>bonus</div>
                                </div>
                                <img src="wallet/assets/images/earn/qianDao.png" />
                            </div>

                            <div className='zhuanPanSty flex justify-between px-10' onClick={() => {
                                setOpenSpin(true)
                            }}>
                                <div className='mt-6'>
                                    <div>Spin</div>
                                    <div style={{ color: "#9a9a9a" }}>bonus</div>
                                </div>
                                <div className='' style={{ position: "relative", width: "5.2rem", height: "5.2rem" }}>
                                    <img className='zhuanPanDongHua0' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan3.png" />
                                    <img className='zhuanPanDongHua' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan2.png" />
                                    <img className='zhuanPanDongHua0' style={{ position: "absolute" }} src="wallet/assets/images/earn/zhuanPan1.png" />
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-16 justify-center'>
                            <img className='naoZhongImg' src="wallet/assets/images/earn/naoZhong.png" />  <div className='naoZhongZi ml-10'>活动结束</div> <div className='ml-10 naoZhongZi' >23:48:36</div>
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
                    <div className='text-16'>活期利息</div>

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
                                {/* <motion.div variants={item} className="sm:col-span-2 lg:col-span-3">
                                    <VisitorsOverviewWidget />
                                </motion.div> */}

                                <motion.div variants={item} className="">
                                    <ImpressionsWidget />
                                </motion.div>

                                {/* <motion.div variants={item} className="sm:col-span-2 lg:col-span-1 ">
                                    <VisitsWidget />
                                </motion.div> */}
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
                    <div className='text-16'>百万空投</div>
                    <div className='lanDi mt-16'>
                        <img className='logoCC' src="wallet/assets/images/earn/logo1.png" />
                        <div className='flex mt-16  justify-between'>
                            <div className='lanDiZi pb-10 pb-10'>
                                <div><span style={{ color: "#A4A4A4" }}>瓜分</span><span style={{ marginLeft: "10px", color: "#FFC600", fontWeight: "bold", fontSize: "29px" }}>1000,000,000</span></div>
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
                    <div className='text-16'>合约交易挖矿</div>
                    <div className='huangDi mt-16'>
                        <div className='flex justify-between pt-4'>
                            <div className='huangDiZi '>
                                <img className='logoCC2 mb-4' src="wallet/assets/images/earn/logo2.png" />
                                <div style={{ display: "inline-block" }}>
                                    <div className='tuoYuanDi'>
                                        <div className='' style={{ marginLeft: "10px", color: "#ffffff", fontSize: "20px", display: "inline-block" }}>交易合约</div>
                                        <div className='' style={{ marginRight: "10px", color: "#8200d4", fontSize: "20px", display: "inline-block" }}>送现货</div>
                                    </div>
                                </div>
                                <div><span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>所有交易手续费</span><span style={{ color: "#FFC600", fontWeight: "bold", fontSize: "29px" }}>100%</span>
                                    <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>补偿</span></div>
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
                    <div className='text-16'>邀请奖励</div>
                    <div className='lvEarnDi mt-16'>
                        <div className='flex justify-start pt-4'>
                            <img className='liBaoDiImg' src="wallet/assets/images/earn/giftIcon.png" />
                            <div className='yaoQingZiDi'>
                                <div className='yaoQingZiDi2'>邀请好友加入</div>
                            </div>
                            <div style={{ fontSize: "20px", color: "#00FF96", fontWeight: "bold" }}>获得现金奖励！</div>
                        </div>

                        <div className='flex justify-between mt-20'>
                            <div className='' style={{ width: "25%" }}>
                                <div className='yaoQingEarnZi' style={{ textAlign: "left" }}>500.00</div>
                                <div className='earnHuiZi' style={{ textAlign: "left" }}>总收益</div>
                                <div className='earnHuiZi' style={{ textAlign: "left" }}>USDT</div>
                            </div>

                            <div className='' style={{ width: "25%", color: "#FF9000" }}>
                                <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>30.00</div>
                                <div className='earnHuiZi' style={{ textAlign: "center" }}>今日收益</div>
                                <div className='earnHuiZi' style={{ textAlign: "center" }}>USDT</div>
                            </div>

                            <div className='' style={{ width: "25%", color: "#02A7F0" }}>
                                <div className='yaoQingEarnZi' style={{ textAlign: "center" }}>200.00</div>
                                <div className='earnHuiZi' style={{ textAlign: "center" }}>总收益</div>
                                <div className='earnHuiZi' style={{ textAlign: "center" }}>BFT</div>
                            </div>

                            <div className='' style={{ width: "25%", color: "#00FF47" }}>
                                <div className='yaoQingEarnZi' style={{ textAlign: "right" }}>100.00</div>
                                <div className='earnHuiZi' style={{ textAlign: "right" }}>今日收益</div>
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
                            CheckIn
                            {/* {t("home_CheckinBouns")} */}
                        </span>
                    </Typography>
                    <motion.div variants={container} initial="hidden" animate="show">
                        <motion.div
                            variants={item}
                            className="text-16  text-align checkInTxtmtMiaoShu"
                        >
                            Check in every week accumulatively and get corresponding rewards.
                            {/* {t("home_Checkineveryweek")} */}
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
                                        3Day
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
                                        5Day
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
                                        7Day
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
                                    Sunday
                                    {/* {t("home_Sunday")} */}
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
                                    Monday
                                    {/* {t("home_Monday")} */}
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
                                    Tuesday
                                    {/* {t("home_Tuesday")} */}
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
                                    Wednesday
                                    {/* {t("home_Wednesday")} */}
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
                                    Thursday
                                    {/* {t("home_Thursday")} */}
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
                                    Friday
                                    {/* {t("home_Friday")} */}
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
                                    Saturday
                                    {/* {t("home_Saturday")} */}
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


        </div>
    )
}

export default withReducer('analyticsDashboardApp', reducer)(Earn);
