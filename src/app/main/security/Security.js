import { useState, useEffect, default as React, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { arrayLookup, setPhoneTab, getUserLoginType} from "../../util/tools/function";
import Dialog from "@mui/material/Dialog/Dialog";
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from "react-i18next";
import Enable2FA from "../2fa/Enable2FA";

import RetiedEmail from "../login/RetiedEmail";
import RetiedPhone from "../login/RetiedPhone";
import ResetPass from "../login/ResetPass";
import Kyc from "../kyc/Kyc";
import ResetPin from "../login/ResetPin";
import { useParams } from 'react-router-dom';
import history from "@history";
import {selectCurrentLanguage} from "app/store/i18nSlice";
import userLoginType from "../../define/userLoginType";

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const backCardPageEvt = () => {}

const updatedKycInfoEvt = ()=>{}

function Security(props) {
    const { t } = useTranslation('mainPage');

    const tabValueParam = history.location.state?.tabValue ?? 0
    const resetTabValueParam = history.location.state?.resetTabValueParam ?? 0
    const currentLanguage = useSelector(selectCurrentLanguage);
    const userData = useSelector(selectUserData);
    const [tabValue, setTabValue] = useState(tabValueParam);
    const [ranges, setRanges] = useState([t('menu_12'), t('menu_13'), t('menu_14'), t('menu_15'), t('menu_16'), "PIN"]);
    useEffect(() => {
        setPhoneTab('security');
    }, []);



    const [loadingShow, setLoadingShow] = useState(false);
    useEffect(() => {
        setLoadingShow(false);
        setTimeout(() => {
            setLoadingShow(false);
        }, 500);
    }, []);

    useEffect(() => {
        let langArr = [t('menu_12'), t('menu_13'), t('menu_14'), t('menu_15'), t('menu_16'), "PIN"];
        if(!userData.userInfo.bindEmail) {
            langArr[1] = t('menu_19')
        }
        if(!userData.userInfo.bindMobile) {
            langArr[2] = t('menu_20')
        }
        const loginType = getUserLoginType(userData);
        if (loginType === userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP) {
            langArr = langArr.filter((str, i) => i !== 3);
        }
        setRanges(langArr);
    }, [currentLanguage.id, userData.profile]);


    return (
        <div>
            {
                !loadingShow &&
                <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mb-16 mt-12'
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(ev, value) => setTabValue(value)}
                            textColor="inherit"
                            indicatorColor="secondary"
                            variant="scrollable"
                            scrollButtons={false}
                            className="tongYongDingBtn"
                            style={{ minWidth: '28%!import' }}
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                            TabIndicatorProps={{
                                children: (
                                    <Box
                                        sx={{ bgcolor: 'text.disabled' }}
                                        className="w-full h-full rounded-full  huaKuaBgColor0" />
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
                                    style={{
                                        color: '#FFFFFF', height: '3.6rem', minWidth: '28%'
                                    }}
                                />
                            ))}
                        </Tabs>
                    </motion.div>
                    {tabValue === 0 && <Enable2FA />}
                    {tabValue === 1 && <RetiedEmail />}
                    {tabValue === 2 && <RetiedPhone />}
                    {tabValue === 3 && <ResetPass />}
                    {tabValue === 4 && <Kyc backCardPage={backCardPageEvt} updatedKycInfo={updatedKycInfoEvt}/>}
                    {tabValue === 5 && <ResetPin resetTabValueParam={resetTabValueParam} />}
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
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
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
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Security;
