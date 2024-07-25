import { useState, useEffect, default as React, useRef } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { arrayLookup, setPhoneTab } from "../../util/tools/function";
import Dialog from "@mui/material/Dialog/Dialog";
import { useTranslation } from "react-i18next";


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
                    <div className=''>新手福利</div>
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
                    className='mt-12'
                    style={{ paddingInline: "1.5rem" }}
                >
                    <div className=''>活期利息</div>
                    
                </motion.div>

            </div>
        </div>
    )
}

export default Earn;
