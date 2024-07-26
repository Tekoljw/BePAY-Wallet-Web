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
                    <div className='flex mt-12'>
                        <div className='qianDaoSty flex justify-between px-10'>
                            <div className='mt-6'>
                                <div>Check In</div>
                                <div style={{ color: "#9a9a9a" }}>bonus</div>
                            </div>
                            <img src="wallet/assets/images/earn/qianDao.png" />
                        </div>

                        <div className='zhuanPanSty flex justify-between px-10'>
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
        </div>
    )
}

export default withReducer('analyticsDashboardApp', reducer)(Earn);
