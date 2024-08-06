import { useState, useEffect, default as React, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { tokenTransfer } from "../../store/user/userThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { selectConfig } from "../../store/config";
import { arrayLookup, setPhoneTab } from "../../util/tools/function";
import { openScan, closeScan } from "../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, getWithdrawHistoryAddress, getWithdrawTransferStats } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import OtpPass from "../otpPass/OtpPass";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getCryptoDisplay } from "../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
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

function Security(props) {
    const { t } = useTranslation('mainPage');

    const tabValueParam = history.location.state?.tabValue ?? 0
    const resetTabValueParam = history.location.state?.resetTabValueParam ?? 0
    const userData = useSelector(selectUserData);
    const [tabValue, setTabValue] = useState(tabValueParam);
    const [ranges, setRanges] = useState([t('menu_12'), t('menu_13'), t('menu_14'), t('menu_15'), t('menu_16'), "PIN"]);
    useEffect(() => {
        setPhoneTab('security');
    }, []);

    return (
        <div>
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
                {tabValue === 4 && <Kyc />}
                {tabValue === 5 && <ResetPin resetTabValueParam={resetTabValueParam} />}
            </div>
        </div>
    )
}

export default Security;
