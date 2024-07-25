import withReducer from 'app/store/withReducer';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from "../../store/user";
import _ from '@lodash';
import { motion } from 'framer-motion';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import VisitorsOverviewWidget from './widgets/VisitorsOverviewWidget';
import ConversionsWidget from './widgets/ConversionsWidget';
import ImpressionsWidget from './widgets/ImpressionsWidget';
import VisitsWidget from './widgets/VisitsWidget';
import '../../../styles/home.css';
import { useTranslation } from "react-i18next";
import { styled } from '@mui/material/styles';
import Dialog from "@mui/material/Dialog/Dialog";


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


function Test() {
    const dispatch = useDispatch();
    const widgets = useSelector(selectWidgets);
    const userData = useSelector(selectUserData);
    const { t } = useTranslation('mainPage');

    useEffect(() => {
        dispatch(getWidgets());
    }, [dispatch]);

    return (

        <div className='' style={{ position: "relative" }}>
            <div style={{ position: "absolute", width: "100%" }}>
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
                                <div><span style={{ color: "#A4A4A4" }}>瓜分</span><span style={{ marginLeft: "10px", color: "#FFC600", fontWeight: "bold", fontSize: "24px" }}>1000,000,000</span></div>
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
                                <div><span style={{ color: "#A4A4A4" }}>瓜分</span><span style={{ marginLeft: "10px", color: "#FFC600", fontWeight: "bold", fontSize: "24px" }}>1000,000,000</span></div>
                                <div><span style={{ color: "#1BB9FF", fontWeight: "bold", fontSize: "24px" }}>BFT</span><span style={{ marginLeft: "10px", color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>BeingFi Token</span></div>
                            </div>
                            <img className='earnYouTu2' src="wallet/assets/images/earn/bi2.png" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>


    );
}

export default withReducer('analyticsDashboardApp', reducer)(Test);
