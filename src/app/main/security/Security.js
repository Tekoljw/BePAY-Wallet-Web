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
import { arrayLookup } from "../../util/tools/function";
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

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function Security(props) {
    const { t } = useTranslation('mainPage');

    const userData = useSelector(selectUserData);
    const [tabValue, setTabValue] = useState(0);
    const [ranges, setRanges] = useState([t('menu_12'), t('menu_13'), t('menu_14'), t('menu_15'), t('menu_16')]);
    useEffect(() => {
    }
    );

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
                        variant="scrollable"
                        scrollButtons
                        className="min-h-40 wallet-show-type wallet-show-type-tab ml-16 mr-12"
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full min-h-32' }}
                        TabIndicatorProps={{
                            children: (
                                <Box className="w-full h-full rounded-full  huaKuaBgColor0" />
                            ),
                        }}
                        sx={{
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': { opacity: 0.3 },
                            },
                        }}
                    >
                        {Object.entries(ranges).map(([key, label]) => (
                            <Tab
                                className="text-14 font-semibold  wallet-tab-item txtColorTitle zindex opacity-100 "
                                disableRipple
                                key={key}
                                label={label}
                                style={{
                                    height: '3.5rem', overflow: "hidden"
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
            </div>
        </div>
    )
}

export default Security;
