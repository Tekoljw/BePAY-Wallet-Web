import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { showMessage } from 'app/store/fuse/messageSlice';
import history from '@history';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from "@mui/material";
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HomeSidebarContent from "../home/HomeSidebarContent";
import MobileDetect from 'mobile-detect';

import { uploadStorage } from "../../store/tools/toolThunk";
import { getKycInfo, updateKycInfo, submitKycInfo } from "app/store/payment/paymentThunk";
import { selectConfig } from "../../store/config";
import { selectUserData } from "../../store/user";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { sendEmail, sendSms, bindPhone, bindEmail } from "../../store/user/userThunk";
import phoneCode from "../../../phone/phoneCode";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import clsx from 'clsx';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Hidden from "@mui/material/Hidden";
import { useTranslation } from "react-i18next";

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

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {},
    '& .FusePageCarded-sidebar': {},
    '& .FusePageCarded-leftSidebar': {},
}));


function Kyc(props) {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const user = useSelector(selectUserData);
    const kycInfo = config.kycInfo || {};
    const [pageState, setPageState] = useState(0);
    let baseImgUrl = "";
    if (config.system.cdnUrl) {
        baseImgUrl = config.system.cdnUrl.substr(0, config.system.cdnUrl.length - 1);
    }
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

    useEffect(() => {
        setPageState(1);

        if (kycInfo.init) {
            if (!kycInfo.havePhone()) {
                setPageState(2);
                setTabValue(1);
                return
            }

            if (!kycInfo.haveEmail()) {
                setPageState(1);
                return
            }

            setPageState(0);
        }
    }, [kycInfo]);

    const [inputVal, setInputVal] = useState({
        email: '',
        phoneCountry: '',
        phoneNumber: '',
        firstName: '',
        middleName: '',
        lastName: '',
        birthDate: '',
        country: '',
        state: '',
        city: '',
        address: '',
        addressTwo: '',
        zipcode: '',
        idNo: '',
        idType: '',
        idFrontUrl: '',
        idBackUrl: '',
        selfPhotoUrl: '',
        proofOfAddressUrl: '',
        usSsn: '',
    });

    const [approveData, setApproveData] = useState({
        nationCode: '',
        phone: '',
        email: '',
        password: '',
        code: ''
    });

    const [tmpPhoneCode, setTmpPhoneCode] = useState('');

    const ranges = ['Email', 'Phone'];

    const [tabValue, setTabValue] = useState(pageState === 0 ? 0 : pageState - 1);

    const [time, setTime] = useState(null);
    const timeRef = useRef();
    //倒计时
    useEffect(() => {
        if (time && time !== 0)
            timeRef.current = setTimeout(() => {
                setTime(time => time - 1)
            }, 1000);

        return () => {
            clearTimeout(timeRef.current)
        }
    }, [time]);

    async function sendCode(type) {
        let sendRes = {};
        if (type === 'phone') {
            const data = {
                codeType: 5,
                nationCode: inputVal.nationCode,
                phone: approveData.phone,
                password: approveData.password,
            };
            sendRes = await dispatch(sendSms(data));
        } else {
            const data = {
                codeType: 10,
                email: approveData.email,
            };
            sendRes = await dispatch(sendEmail(data));
        }

        if (sendRes?.payload) {
            setTime(60)
        }
    }

    const onSubmitPhone = async () => {
        let result = await dispatch(bindPhone({
            nationCode: inputVal.nationCode,
            phone: approveData.phone,
            smsCode: approveData.code,
        }));
        if (result.payload) {
            setTimeout(() => {
                location.reload();
            }, 1000)
        }
    };

    const onSubmitEmail = async () => {
        let result = await dispatch(bindEmail({
            email: approveData.email,
            smsCode: approveData.code,
            password: approveData.password,
        }));
        if (result.payload) {
            setTimeout(() => {
                location.reload();
            }, 1000)
        }
    };

    const handleApproveData = (prop) => (event) => {
        setApproveData({ ...approveData, [prop]: event.target.value });
    };
    const handleChangeApproveDataVal = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };

    const [keyName, setKeyName] = useState('');

    const handleChangeInputVal = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };

    const handleChangeDate = (prop) => (newValue) => {
        if (prop === 'birthDate' && typeof newValue === "object") {
            newValue = getymd(newValue)
        }
        setInputVal({ ...inputVal, [prop]: newValue });
    };

    /**
     * js将字符串转成日期格式，返回年月日
     * @param dateStr 日期字符串
     */
    const getymd = (dateStr) => {
        var d = new Date(dateStr);
        var resDate = d.getFullYear() + '-' + (String(d.getMonth() + 1).padStart(2, '0')) + '-' + String(d.getDate()).padStart(2, '0');
        return resDate;
    }

    const uploadChange = async (file) => {
        const uploadRes = await dispatch(uploadStorage({
            file: file
        }));
        setInputVal({ ...inputVal, [keyName]: uploadRes.payload.url });
    };

    const isNeedAudit = () => {
        if (kycInfo) {
            return kycInfo.isNeedAudit();
        }

        return true;
    };

    const refreshKycInfo = () => {
        dispatch(getKycInfo()).then((value) => {
            if (!isNeedAudit() || !value.payload) return;
            let resultData = value.payload.data;

            if (!resultData || Object.entries(resultData).length < 1) return;

            let copyData = {};

            Object.keys(inputVal).map((prop, index) => {
                copyData[prop] = resultData[prop];
            });

            setInputVal(copyData);
        });
    };

    const isAlreadySumbit = () => {
        if (kycInfo) {
            return kycInfo.isAlreadySumbit();
        }

        return false;
    };


    console.log(inputVal, 'inputval......')
    const isCanSave = (bShowMsg) => {
        if (isAlreadySumbit()) return false;
        // if (typeof inputVal.birthDate === 'object') {
        //     handleChangeDate('birthDate', inputVal.birthDate);
        // }

        // 格式验证
        if (inputVal.birthDate != '') {
            if (! /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(inputVal.birthDate)) {
                if (bShowMsg) {
                    dispatch(showMessage({ message: t('error_6'), code: 2 }));
                }

                return false;
            }
        }

        return true;
    };

    const isCanSumbit = (bShowMsg) => {
        if (isAlreadySumbit()) return false;
        if (!isCanSave(bShowMsg)) return false;

        let chkKeys = Object.keys(inputVal);
        for (let i = 0; i < chkKeys.length; i++) {
            // 忽略可选字段
            if (chkKeys[i] == "middleName"
                || chkKeys[i] == "addressTwo"
                || chkKeys[i] == "usSsn"
                || chkKeys[i] == "proofOfAddressUrl"
            ) {
                continue;
            }

            if (inputVal[chkKeys[i]] == "") {
                console.log(chkKeys[i])
                return false;
            }
        }

        return true;
    };


    const onSave = () => {
        if (!isCanSave(true)) {
            return;
        }

        dispatch(updateKycInfo(inputVal)).then(
            (value) => {
                if (value.payload) {
                    refreshKycInfo();
                }
            }
        );
    };

    const onSubmit = () => {

        if (!isCanSumbit(true)) {
            return;
        }

        dispatch(submitKycInfo(inputVal)).then(
            (value) => {
                if (value.payload) {
                    refreshKycInfo();
                }
            }
        );

    };

    useEffect(() => {
        refreshKycInfo();

        return () => {
            try {
                window.zE('webWidget', 'hide');
            } catch (e) {
            }
        };
    }, []);

    return (
        <>
            {/* <Root
            header={
                <Hidden smUp={isMobileMedia ? false : true} lgUp={!isMobileMedia ? false : true}>
                    <IconButton
                        onClick={() => {
                            setLeftSidebarOpen(true);
                        }}
                        aria-label="open left sidebar"
                        size="large"
                    >
                        <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
                    </IconButton>
                </Hidden>
            }
            content={
                
            }
            leftSidebarOpen={leftSidebarOpen}
            leftSidebarOnClose={() => {
                setLeftSidebarOpen(false);
            }}
            leftSidebarContent={<HomeSidebarContent tab={'kyc'} />}
            scroll={isMobile ? 'normal' : 'content'}
        /> */}

            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="tongYongChuang "
                    style={{ margin: "0px auto " }}
                >
                    {/* <div style={{ color: '#ffffff', display: 'flex' }} onClick={() => {history.push('/wallet/home');;}} className="items-center my-8">
                        <FuseSvgIcon className="text-48" size={16} color="action">heroicons-outline:chevron-left</FuseSvgIcon>
                        <Typography className="text-16 mx-8">Back</Typography>

                    </div> */}
                    {/* <Typography onClick={() => { history.push('/wallet/home');; }}
                            className={clsx("mt-32 text-20 font-extrabold tracking-tight leading-tight flex items-center justify-content-start back-modal-title cursor-pointer btnColorTitleBig", pageState === 0 && 'kyc-back-modal-title kyc-back-modal-title-bg')}>
                            <img className='back-modal-title-img' src="wallet/assets/images/logo/icon-back.png" alt="back icon" />
                            Back
                        </Typography> */}

                    {/* <div className="flex items-baseline mt-2 font-medium text-14" style={{ marginBottom: '2rem', marginTop: 0 }}>
                        {
                            pageState === 0 ?
                                <Typography>{t('Kyc_34')}
                                    <span className="ml-4 color-16c2a3">
                                        {t('Kyc_35')}
                                    </span>
                                </Typography> :
                                <Typography>{t('kyc_25')}
                                    <span className="ml-4 color-16c2a3">
                                        {t('kyc_26')}
                                    </span>
                                </Typography>
                        }
                    </div> */}

                    {pageState === 0 && <>
                        <Box
                            component={motion.div}
                            variants={item}
                            className="w-full rounded-16 border flex flex-col "
                            sx={{
                                border: 'none'
                            }}
                        >
                            {isNeedAudit() && <>
                                <div className="flex items-center justify-between ">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        Email
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_27')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="Email"
                                            value={inputVal.email}
                                            onChange={handleChangeInputVal('email')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'email',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        PhoneCountry
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_2')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="PhoneCountry"
                                            value={inputVal.phoneCountry}
                                            onChange={handleChangeInputVal('phoneCountry')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'phoneCountry',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        PhoneNumber
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_3')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="PhoneNumber"
                                            value={inputVal.phoneNumber}
                                            onChange={handleChangeInputVal('phoneNumber')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'phoneNumber',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        FirstName
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_4')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="FirstName"
                                            value={inputVal.firstName}
                                            onChange={handleChangeInputVal('firstName')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'firstName',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        MiddleName
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_5')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="MiddleName"
                                            value={inputVal.middleName}
                                            onChange={handleChangeInputVal('middleName')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'middleName',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        LastName
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_6')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="LastName"
                                            value={inputVal.lastName}
                                            onChange={handleChangeInputVal('lastName')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'lastName',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        BirthDate
                                    </Typography> */}
                                    <Stack
                                        sx={{ width: '100%', borderColor: '#94A3B8' }}
                                        spacing={3}
                                        className="mb-24"
                                    >
                                        <MobileDatePicker
                                            label="BirthDate"
                                            inputFormat="yyyy-MM-dd"
                                            value={inputVal.birthDate}
                                            onChange={handleChangeDate('birthDate')}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        Country
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_8')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="Country"
                                            value={inputVal.country}
                                            onChange={handleChangeInputVal('country')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'country',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        State
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_9')} </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="State"
                                            value={inputVal.state}
                                            onChange={handleChangeInputVal('state')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'state',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        City
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_10')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="City"
                                            value={inputVal.city}
                                            onChange={handleChangeInputVal('city')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'city',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        Address
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_11')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="Address"
                                            value={inputVal.address}
                                            onChange={handleChangeInputVal('address')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'address',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        AddressTwo
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_12')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="AddressTwo"
                                            value={inputVal.addressTwo}
                                            onChange={handleChangeInputVal('addressTwo')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'addressTwo',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        Zipcode
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_13')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="Zipcode"
                                            value={inputVal.zipcode}
                                            onChange={handleChangeInputVal('zipcode')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'zipcode',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        IdNo
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_14')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="IdNo"
                                            value={inputVal.idNo}
                                            onChange={handleChangeInputVal('idNo')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'idNo',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        IdType
                                    </Typography> */}

                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                        <InputLabel id="demo-simple-select-label">{t('Kyc_15')}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={inputVal.idType}
                                            label="IdType"
                                            onChange={handleChangeInputVal('idType')}
                                        >
                                            <MenuItem value={'id_card'}>{t('Kyc_36')}</MenuItem>{/*身份证*/}
                                            <MenuItem value={'passport'}>{t('Kyc_37')}</MenuItem>{/*护照*/}
                                            <MenuItem value={'dl'}>{t('Kyc_38')}</MenuItem>{/*驾照*/}
                                            <MenuItem value={'residence_permit'}>{t('Kyc_39')}</MenuItem>{/*居住证*/}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="mb-24">
                                    <Typography className="text-16 upload-title">
                                        {t('kyc_16')}
                                    </Typography>
                                    <div className="flex flex-wrap items-center justify-content-start">
                                        {inputVal.idFrontUrl &&
                                            <div className='kyc-file-box flex items-center justify-center'>
                                                <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.idFrontUrl} alt="" />
                                            </div>
                                        }
                                        <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{ backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => { setKeyName('idFrontUrl') }}
                                            >
                                                <img style={{ display: 'block' }} src='wallet/assets/images/kyc/icon-upload.png' alt="" />
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                            </Box>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-24">
                                    <Typography className="text-16 upload-title">
                                        {t('kyc_17')}
                                    </Typography>
                                    <div className="flex flex-wrap items-center justify-content-start">
                                        {inputVal.idBackUrl &&
                                            <div className='kyc-file-box flex items-center justify-center'>
                                                <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.idBackUrl} alt="" />
                                            </div>
                                        }
                                        <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{ backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => { setKeyName('idBackUrl') }}
                                            >
                                                <img style={{ display: 'block' }} src='wallet/assets/images/kyc/icon-upload.png' alt="" />
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                            </Box>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-24">
                                    <Typography className="text-16 upload-title">
                                        {t('kyc_18')}
                                    </Typography>
                                    <div className="flex flex-wrap items-center justify-content-start">
                                        {inputVal.selfPhotoUrl &&
                                            <div className='kyc-file-box flex items-center justify-center'>
                                                <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.selfPhotoUrl} alt="" />
                                            </div>
                                        }
                                        <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{ backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => { setKeyName('selfPhotoUrl') }}
                                            >
                                                <img style={{ display: 'block' }} src='wallet/assets/images/kyc/icon-upload.png' alt="" />
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                            </Box>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-24">
                                    <Typography className="text-16 upload-title">
                                        {t('kyc_19')}
                                    </Typography>
                                    <div className="flex flex-wrap items-center justify-content-start">
                                        {inputVal.proofOfAddressUrl &&
                                            <div className='kyc-file-box flex items-center justify-center'>
                                                <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.proofOfAddressUrl} alt="" />
                                            </div>
                                        }
                                        <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{ backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => { setKeyName('proofOfAddressUrl') }}
                                            >
                                                <img style={{ display: 'block' }} src='wallet/assets/images/kyc/icon-upload.png' alt="" />
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                            </Box>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-24">
                                    {/* <Typography
                                        style={{
                                            width: "35%",
                                            overflow: "hidden",
                                            wordBreak: "break-all"
                                        }}
                                        className="text-16 mx-12 cursor-pointer"
                                    >
                                        UsSsn
                                    </Typography> */}
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                        <InputLabel id="demo-simple-select-label">{t('kyc_20')}</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            label="UsSsn"
                                            value={inputVal.usSsn}
                                            onChange={handleChangeInputVal('usSsn')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'usSsn',
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                {/*{Object.keys(inputVal).map((key, index) => {*/}
                                {/*    return (*/}
                                {/*        <div className="flex items-center justify-between my-12" key={index}>*/}
                                {/*            <Typography*/}
                                {/*                style={{*/}
                                {/*                    width: "35%",*/}
                                {/*                    overflow: "hidden",*/}
                                {/*                    wordBreak: "break-all"*/}
                                {/*                }}*/}
                                {/*                className="text-16 mx-12 cursor-pointer"*/}
                                {/*            >*/}
                                {/*                {key}*/}
                                {/*            </Typography>*/}
                                {/*            {key.search('Url') === -1 &&*/}
                                {/*            <FormControl sx={{ width: '75%', borderColor: '#94A3B8' }} variant="outlined">*/}
                                {/*                <OutlinedInput*/}
                                {/*                    id="outlined-adornment-address"*/}
                                {/*                    value={inputVal[key]}*/}
                                {/*                    onChange={handleChangeInputVal(key)}*/}
                                {/*                    // endAdornment={<InputAdornment position="end">Max</InputAdornment>}*/}
                                {/*                    aria-describedby="outlined-weight-helper-text"*/}
                                {/*                    inputProps={{*/}
                                {/*                        'aria-label': 'address',*/}
                                {/*                    }}*/}
                                {/*                />*/}
                                {/*            </FormControl>*/}
                                {/*            }*/}
                                {/*            {key.search('Url') !== -1 &&*/}
                                {/*            <Button*/}
                                {/*                className="px-48 text-lg"*/}
                                {/*                color="secondary"*/}
                                {/*                variant="contained"*/}
                                {/*                sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}*/}
                                {/*                style={{borderRaduis: '8px !important', width: "75%" }}*/}
                                {/*                component="label"*/}
                                {/*                onClick={() => {setKeyName(key)}}*/}
                                {/*            >*/}
                                {/*                上传文件*/}
                                {/*                <input*/}
                                {/*                    accept="image/*"*/}
                                {/*                    className="hidden"*/}
                                {/*                    id="button-file"*/}
                                {/*                    type="file"*/}
                                {/*                    onChange={(e) => { uploadChange(e.target.files[0]) }}*/}
                                {/*                />*/}
                                {/*            </Button>*/}

                                {/*            }*/}
                                {/*        </div>*/}
                                {/*    )*/}
                                {/*})}*/}
                                <Button
                                    disabled={!isCanSave()}
                                    className="px-48 text-lg mb-24 btnColorTitleBig button-reset"
                                    color="secondary"
                                    variant="contained"
                                    style={{ marginBottom: '2.4rem' }}
                                    onClick={() => { onSave() }}
                                >
                                    {t('kyc_22')}
                                </Button>

                                <Button
                                    disabled={!isCanSumbit()}
                                    className="px-48 text-lg mb-24 btnColorTitleBig button-reset"
                                    color="secondary"
                                    variant="contained"
                                    style={{ marginBottom: '2.4rem' }}
                                    onClick={() => { onSubmit() }}
                                >
                                    {t('kyc_23')}
                                </Button>
                            </>}

                            {isNeedAudit() === false && <>
                                <Typography className="text-16 cursor-pointer">
                                    {t('Kyc_40')}
                                </Typography>
                            </>}

                        </Box>
                    </>}

                    {
                        (pageState === 1 || pageState === 2) &&
                        <Tabs
                            component={motion.div}
                            value={tabValue}
                            onChange={(ev, value) => {
                                setTabValue(value);
                                setPageState(value + 1)
                            }}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                            scrollButtons={false}
                            className="min-h-32"
                            style={{ padding: '0 0', margin: '1.5rem 0 2.4rem', borderColor: 'transparent', backgroundColor: '#181f2b', width: '144px', borderRadius: '20px', height: '3.2rem' }}
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                            TabIndicatorProps={{
                                children: (
                                    <Box
                                        sx={{ bgcolor: 'text.disabled' }}
                                        className="w-full h-full rounded-full huaKuaBgColor1"
                                    />
                                ),
                            }}
                            sx={{
                                borderBottom: '1px solid #374252',
                                padding: '1rem 1.2rem'
                            }}
                        >
                            {Object.entries(ranges).map(([key, label]) => (
                                <Tab
                                    className="text-14 font-semibold min-h-32 min-w-72 px-8 txtColorTitle zindex opacity-100 "
                                    disableRipple
                                    key={key}
                                    label={label}
                                    sx={{
                                        color: '#FFFFFF', height: '3.2rem'
                                    }}
                                />
                            ))}
                        </Tabs>
                    }

                    {pageState === 1 && <>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                Email
                            </Typography> */}
                            <FormControl variant="outlined" sx={{ width: '100%', borderColor: '#94A3B8' }} className="mb-24">
                                <InputLabel>{t('kyc_27')}</InputLabel>
                                <OutlinedInput
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={approveData.email}
                                    onChange={handleApproveData('email')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {time <= 0 && <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => {
                                                    sendCode('email')
                                                }}
                                                // onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    fontSize: '1.4rem',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                {t('kyc_28')}
                                            </IconButton>}

                                            {time > 0 &&
                                                <div>
                                                    {time} s
                                                </div>
                                            }
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                Code
                            </Typography> */}
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_29')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Email"
                                    value={approveData.code}
                                    onChange={handleApproveData('code')}
                                    // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'email',
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                Password
                            </Typography> */}
                            {user.profile?.sysPass && <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_30')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Password"
                                    value={approveData.password}
                                    onChange={handleApproveData('password')}
                                    // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'email',
                                    }}
                                />
                            </FormControl>}
                        </div>

                        <Button
                            className="px-48 text-lg my-12 btnColorTitleBig mt-24 button-reset"
                            color="secondary"
                            variant="contained"
                            onClick={() => { onSubmitEmail() }}
                        >
                            {t('Kyc_31')}
                        </Button>
                    </>}

                    {pageState === 2 && <>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                NationCode
                            </Typography> */}
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <Autocomplete
                                    // disablePortal
                                    options={phoneCode.list}
                                    autoHighlight
                                    onInputChange={(event, newInputValue) => {
                                        setTmpPhoneCode(newInputValue.replace(/\+/g, ""));
                                    }}
                                    filterOptions={(options) => {
                                        const reg = new RegExp(tmpPhoneCode, 'i');
                                        const array = options.filter((item) => {
                                            return reg.test(item.phone_code) || reg.test(item.local_name)
                                        });
                                        return array;
                                    }}
                                    onChange={(res, option) => {
                                        handleChangeApproveDataVal('nationCode', option.phone_code);
                                        // setApproveData();
                                        // control._formValues.nationCode = option.phone_code
                                    }}
                                    getOptionLabel={(option) => { return inputVal.nationCode }}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                src={`/wallet/assets/images/country/${option.country_code}.png`}
                                                alt=""
                                            />
                                            {option.local_name} ({option.country_code}) +{option.phone_code}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="nationCode"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'nationCode', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                Phone
                            </Typography> */}
                            <FormControl variant="outlined" sx={{ width: '100%', borderColor: '#94A3B8' }} className="mb-24">
                                <InputLabel>{t('Kyc_32')}</InputLabel>
                                <OutlinedInput
                                    label="Phone"
                                    type="number"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={approveData.phone}
                                    onChange={handleApproveData('phone')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {time <= 0 && <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => {
                                                    sendCode('phone')
                                                }}
                                                // onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                sx={{
                                                    fontSize: '1.4rem',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                {t('kyc_28')}
                                            </IconButton>}

                                            {time > 0 &&
                                                <div>
                                                    {time} s
                                                </div>
                                            }
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                        <div className="flex items-center justify-between my-12">
                            {/* <Typography
                                style={{
                                    width: "35%",
                                    overflow: "hidden",
                                    wordBreak: "break-all"
                                }}
                                className="text-16 mx-12 cursor-pointer"
                            >
                                Code
                            </Typography> */}
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_29')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Email"
                                    value={approveData.code}
                                    onChange={handleApproveData('code')}
                                    // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'email',
                                    }}
                                />
                            </FormControl>
                        </div>

                        {user.profile?.sysPass && <div className="flex items-center justify-between my-12">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_30')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Password"
                                    value={approveData.password}
                                    onChange={handleApproveData('password')}
                                    // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'email',
                                    }}
                                />
                            </FormControl>
                        </div>}


                        <Button
                            className="px-48 text-lg my-12 btnColorTitleBig mt-24 button-reset"
                            color="secondary"
                            variant="contained"
                            onClick={() => { onSubmitPhone() }}
                        >
                            {t('Kyc_31')}
                        </Button>
                    </>}
                </motion.div>
            </div>
        </>



    )
}

export default Kyc;
