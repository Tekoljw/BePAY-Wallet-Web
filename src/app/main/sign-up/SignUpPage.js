import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LoginSidebarContent from '../login/LoginSidebarContent';
import {
    sendSms,
    sendEmail,
    signUp,
    emailSignUp
} from '../../store/user/userThunk';

import { selectConfig } from "../../store/config";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { getUrlParam } from "../../util/tools/function";
import Select from "@mui/material/Select";
import phoneCode from "../../../phone/phoneCode";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete/Autocomplete";
import MobileDetect from 'mobile-detect';
import clsx from 'clsx';
import loginWays from "../login/loginWays";
import { useTranslation } from "react-i18next";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { showMessage } from 'app/store/fuse/messageSlice';
import countryLang from "../../json/country";

/**
 * Form Validation Schema
 */

const defaultValues = {
    nationCode: '',
    phone: '',
    email: '',
    smsCode: '',
    password: '',
    passwordConfirm: '',
    acceptTermsConditions: true,
    agentId: ''
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function ClassicSignUpPage() {
    const { pathname } = useLocation();
    const { t } = useTranslation('mainPage');
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const config = useSelector(selectConfig);

    const [logo, setLogo] = useState("wallet/assets/images/logo/logo.png");

    const schema = yup.object().shape({
        // email: yup.string().email('You must enter a valid email').required('You must enter a email'),
        // nationCode: yup.string().required('You must enter your nationCode'),
        // phone: yup.string().required('You must enter a phone'),
        smsCode: yup.string().required('You must enter a Code'),
        password: yup
            .string()
            .required('Please enter your password.')
            // .min(6, 'Password is too short - should be 6 chars minimum.')
            .max(16, 'Password is too long - should be 16 chars maximum.'),
        passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
        acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
    });
    const agentId = getUrlParam('agentId');
    if (agentId) {
        defaultValues.agentId = agentId
    }
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const countryLangChange = (lang) => {
        const tempLang = [];
        Object.keys(countryLang).map((item) => {
            if (countryLang[item].langCode == lang) {
                tempLang.push(item)
            }
        })
        if (tempLang.length > 0) {
            return tempLang[0];
        } else {
            return Object.keys(countryLang)[0];
        }
    };

    const { isValid, dirtyFields, errors } = formState;
    const [tmpPhoneCode, setTmpPhoneCode] = useState('');
    const ranges = [t('signIn_5'), t('signIn_4')];
    const [tabValue, setTabValue] = useState(0);

    const dispatch = useDispatch();

    const [openChangeNetwork, setOpenChangeNetwork] = useState(false);

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


    useEffect(() => {
        if (config) {
            let openAppId = window.sessionStorage.getItem('openAppId')
            if (openAppId) {
                setLogo(`${config.staticSourceUrl}/${openAppId}.png`)
            }
        }
    }, [config]);

    const [selected, setSelected] = useState('');

    const handleChange = (event) => {
        control._formValues.nationCode = event.target.value;
        setSelected(event.target.value);
    };

    async function sendCode() {
        setSelectedCountryCode(control._formValues.nationCode);
        let sendRes = {};
        if (tabValue === 1) {
            const data = {
                codeType: 1,
                nationCode: control._formValues.nationCode,
                phone: control._formValues.phone,
                lang: countryLangChange(window.localStorage.getItem('lang')),
            };
            sendRes = await dispatch(sendSms(data));
        } else {
            const data = {
                codeType: 1,
                email: control._formValues.email,
            };
            sendRes = await dispatch(sendEmail(data));
        }

        if (sendRes?.payload) {
            setTime(60)
        }
    }

    async function onSubmit() {
        // // 密码必须为6-18位数，且包含大小写字母和特殊符号
        // let regu = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!~@#$%^&*,\.])[0-9a-zA-Z!~@#$%^&*,\\.]{6,18}$/;
        // var re = new RegExp(regu);
        // if (!re.test(control._formValues.password)) {
        //     dispatch(showMessage({ message: t('errorMsg_3'), code: 3 }));
        //     return
        // }

        if (tabValue === 1) {
            await dispatch(signUp(control._formValues));
        } else {
            await dispatch(emailSignUp(control._formValues));
        }
    }

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0"
            style={{
                background: "#0F172A"
            }}
        >
            <Paper
                className={clsx("w-full sm:w-auto min-h-full sm:min-h-auto rounded-0  sm:rounded-2xl sm:shadow flex", !isMobileMedia && 'login-right-side')}
                style={{
                    maxWidth: '65rem',
                    background: "#0E1421",
                    padding: "8rem 1.5rem 0rem 1.5rem"
                }}
            >
                <div className="w-full  mx-auto " style={{ minWidth: "310px" }}>
                    <img className="logWidth" style={{ marginBottom: '1rem' }} src={logo} alt="logo" />

                    {/* <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                        Sign up
                    </Typography> */}
                    <div className="flex items-baseline  font-medium">
                        <Typography>{t('signUp_2')}</Typography>
                        <Link className="ml-4" to="/login">
                            {t('signIn_1')}
                        </Link>
                    </div>

                    <Tabs
                        component={motion.div}
                        value={tabValue}
                        onChange={(ev, value) => setTabValue(value)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons={false}
                        className="min-h-32"
                        style={{ padding: '0 0', margin: '1rem 0px 1.5rem', borderColor: 'transparent', backgroundColor: '#181f2b', width: '144px', borderRadius: '20px', height: '3.2rem' }}
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    sx={{ bgcolor: 'text.disabled' }}
                                    className="w-full h-full rounded-full huaKuaBgColor1 "
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
                                className="text-14 font-semibold min-h-32 min-w-72 px-8 txtColorTitle zindex opacity-100"
                                disableRipple
                                key={key}
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '3.2rem'
                                }}
                            />
                        ))}
                    </Tabs>

                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-8"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {tabValue === 1 && <>
                            {/*<Controller*/}
                            {/*    name="nationCode"*/}
                            {/*    control={control}*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <TextField*/}
                            {/*            {...field}*/}
                            {/*            className="mb-24"*/}
                            {/*            label="nationCode"*/}
                            {/*            autoFocus*/}
                            {/*            type="number"*/}
                            {/*            error={!!errors.nationCode}*/}
                            {/*            helperText={errors?.nationCode?.message}*/}
                            {/*            variant="outlined"*/}
                            {/*            required*/}
                            {/*            fullWidth*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*/>*/}
                            <Controller
                                name="nationCode"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        // disablePortal
                                        className="mb-24"
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
                                            if (option) {
                                                control._formValues.nationCode = option.phone_code
                                            }
                                        }}
                                        getOptionLabel={(option) => { return control._formValues.nationCode }}
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
                                                label={t('signIn_6')}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'nationCode', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="outlined" className="mb-24">
                                        <InputLabel
                                            style={{
                                                color: !!errors.phone && '#f44336'
                                            }}
                                        >{t('signIn_4')}</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            label={t('signIn_4')}
                                            type="number"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            error={!!errors.phone}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {time <= 0 && <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={sendCode}
                                                        className='txtSend'
                                                        // onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        sx={{
                                                            fontSize: '1.4rem',
                                                            borderRadius: '5px'
                                                        }}
                                                    >
                                                        {t('forgot_3')}
                                                    </IconButton>}

                                                    {time > 0 &&
                                                        <div>
                                                            {time} s
                                                        </div>
                                                    }
                                                </InputAdornment>
                                            }
                                        />
                                        {!!errors.phone &&
                                            <div
                                                style={{
                                                    fontSize: '1.2rem',
                                                    color: '#f44336',
                                                    fontWeight: 400,
                                                    lineHeight: 1.66,
                                                    textAlign: 'left',
                                                    marginTop: '3px',
                                                    marginRight: '14px',
                                                    marginBottom: 0,
                                                    marginLeft: '14px',
                                                }}
                                            >
                                                {errors?.phone?.message}
                                            </div>
                                        }
                                    </FormControl>
                                )}
                            />
                        </>}

                        {tabValue === 0 && <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <FormControl variant="outlined" className="mb-24">
                                    <InputLabel
                                        style={{
                                            color: !!errors.email && '#f44336'
                                        }}
                                    >{t('signIn_5')}*</InputLabel>
                                    <OutlinedInput
                                        {...field}
                                        label={t('signIn_5')}
                                        type="text"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        error={!!errors.email}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {time <= 0 && <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={sendCode}
                                                    className='txtSend'
                                                    // onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{
                                                        fontSize: '1.4rem',
                                                        borderRadius: '5px'
                                                    }}
                                                >
                                                    Send
                                                </IconButton>}

                                                {time > 0 &&
                                                    <div>
                                                        {time} s
                                                    </div>
                                                }
                                            </InputAdornment>
                                        }
                                    />
                                    {!!errors.email &&
                                        <div
                                            style={{
                                                fontSize: '1.2rem',
                                                color: '#f44336',
                                                fontWeight: 400,
                                                lineHeight: 1.66,
                                                textAlign: 'left',
                                                marginTop: '3px',
                                                marginRight: '14px',
                                                marginBottom: 0,
                                                marginLeft: '14px',
                                            }}
                                        >
                                            {errors?.email?.message}
                                        </div>
                                    }
                                </FormControl>
                            )}
                        />}


                        <Controller
                            name="smsCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={t('signIn_7')}
                                    type="number"
                                    error={!!errors.smsCode}
                                    helperText={errors?.smsCode?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={t('signIn_9')}
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors?.password?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="passwordConfirm"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={t('signUp_3')}
                                    type="password"
                                    error={!!errors.passwordConfirm}
                                    helperText={errors?.passwordConfirm?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="acceptTermsConditions"
                            control={control}
                            render={({ field }) => (
                                <FormControl className="items-center noMargin" error={!!errors.acceptTermsConditions}>
                                    <FormControlLabel
                                        label={t('signUp_4')}
                                        control={<Checkbox size="small" checked={!errors.acceptTermsConditions} {...field} />}
                                    />
                                    <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                        <div className="flex mt-4 flex-col sm:flex-row items-center justify-center sm:justify-center">
                            {/*<Controller*/}
                            {/*    name="remember"*/}
                            {/*    control={control}*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <FormControl>*/}
                            {/*            <FormControlLabel*/}
                            {/*                label="Remember me"*/}
                            {/*                control={<Checkbox size="small" {...field} />}*/}
                            {/*            />*/}
                            {/*        </FormControl>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            <a className="text-md font-medium cursor-pointer" onClick={() => { setOpenChangeNetwork(true) }}>
                                {t('signUp_6')}
                            </a>
                        </div>
                        <Button
                            variant="contained"
                            color="secondary"
                            className=" w-full mt-16 "
                            aria-label="Register"
                            // disabled={_.isEmpty(dirtyFields) || !isValid}
                            disabled={
                                _.isEmpty(dirtyFields) ||
                                !isValid ||
                                (selectedCountryCode !== "" && selectedCountryCode !== control._formValues.nationCode)
                            }
                            type="submit"
                            size="large"
                        >
                            {t('signUp_5')}
                        </Button>
                    </form>
                </div>
                {/*切换网路*/}
                <BootstrapDialog
                    onClose={() => { setOpenChangeNetwork(false) }}
                    aria-labelledby="customized-dialog-title"
                    open={openChangeNetwork}
                    className="dialog-container zheZhaoQuChu"
                >
                    <DialogContent dividers className='netWorkDi2'>
                        <div className='dialog-box '>
                            <Typography id="customized-dialog-title" className="text-24 px-16 dialog-title-text netWorkTxtWh">&nbsp;
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => { setOpenChangeNetwork(false) }} alt="close icon" />
                            </Typography>
                            <Box className="dialog-content dialog-content-select-network-height">
                                <Box
                                    className="dialog-content-inner"
                                >
                                    <div className="text-14 font-medium border-r-5 " style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#1e293b', color: '#94a3b8' }}>
                                        Privacy Policy
                                        <br />
                                        <br />&nbsp;&nbsp;At Funibet, your privacy is important to us. This Privacy Policy describes the personal data that Funibet(collectively referred to as "the Company," “we," "our," and "us") processes. This Privacy Policy also explains how we process personal data and for what purposes.
                                        <br /> <br />Who we are <br />
                                        <br />&nbsp;&nbsp;We provide websites ("Sites") where visitors and other members of our community ("Visitors") may learn about our offerings, view Site materials, and/or access our platform ("Platform") and related services ("Services") that enable (i) businesses, including current and prospective customers (collectively "Customers") to solicit feedback ("Tests") on any brand, design, content, or current or potential offering and (ii) individuals taking part in such Tests ("Contributors") to perform and record Tests. In connection with the Site, Platform, and Services, Funibet may collect, record, and analyze information about Visitors, including its Customers and Contributors, which may include individually identifiable information that would allow Funibet to determine the actual identity of or contact information of a specific individual, billing information, account settings, and other data ("Personal Data").
                                        <br />Who is my data controller?<br />
                                        <br />&nbsp;&nbsp;Certain data protection and privacy laws, such as the GDPR, differentiate between "controllers" and "processors" of personal information. A "controller" decides why and how to process personal information. A "processor" processes personal information on behalf of a controller based on the controller's instructions.
                                        <br />&nbsp;&nbsp;For Visitors, the Company is the controller, to the extent that we collect or you provide your Personal Data.
                                        <br />&nbsp;&nbsp;For Contributors, the Company is the controller of the personal information collected from you by the Company, except for the information collected by our Customers through a Test.
                                        <br />&nbsp;&nbsp;For Customers, you are the controller of the data collected as part of a test you create using our Platform or Services, except for the IP addresses used to access  the Platform, which we control.
                                        <br />
                                        <br />How we collect and use your data
                                        <br />
                                        <br />How we collect Personal Data depends on how and why you use our Sites, our Platform, and/or our Services.<br /><br />
                                        &nbsp;&nbsp;We collect Personal Data directly when you submit it to us, as a Visitor, Contributor, or Customer, as well as indirectly, such as through the use of automated technologies or from third parties. To help keep our databases current and to provide you the most relevant content and experiences, we may combine information provided by you with information from third-party sources, in accordance with applicable laws. For example, the size, industry, and other information about the company you work for (where you have provided company name) may be obtained from sources including professional networking sites and information service providers. We provide more information about how we collect Personal Data below.
                                        <br />
                                        <br />Funibet uses your Personal Data for certain legitimate business purposes, including the following:
                                        <br />
                                        &nbsp;&nbsp;to provide you access to and use of the Platform and Services, including registering as a Customer or a Contributor,
                                        <br />&nbsp;&nbsp;to deliver  the Platform and Services to our Customers
                                        <br />&nbsp;&nbsp;deliver Recordings containing Contributor Personal Data to our Customers,
                                        <br />&nbsp;&nbsp;to improve and enhance your experience with the Platform and Services, including the content and general administration of the Platform and Services,
                                        <br />&nbsp;&nbsp;to retain records as may be required for tax, legal, and financial purposes,
                                        <br />&nbsp;&nbsp;to understand how you access, use and interact with the Services in order to provide technical functionality, develop new products and services, and analyze your use of the Services,
                                        <br />&nbsp;&nbsp;to communicate with you,
                                        <br />&nbsp;&nbsp;to provide you with customer support in connection with your use of the Services,
                                        <br />&nbsp;&nbsp;to detect fraud, illegal activities, or security breaches,
                                        <br />&nbsp;&nbsp;to receive and make payments, and
                                        <br />&nbsp;&nbsp;to provide information to regulatory bodies when legally required.
                                        <br />&nbsp;&nbsp;In the sections below, we are more specific about the purposes for which we use each category of data.
                                        <br />
                                        <br />Data provided by or collected from our Visitors ("Visitor Data")
                                        <br />
                                        <br />&nbsp;&nbsp;When Visitors use or browse one of our Sites, we collect their IP addresses and usage information such as page views, clicks, and browser type.
                                        <br />&nbsp;&nbsp;If a Visitor submits a request for a trial on our Site, chats with us for support, requests to watch a webinar, subscribes to our blog or other news, submits a request through our Contact Us form, or requests to download a whitepaper or other content, we may also collect the Visitor’s: name, title, email, phone number, company name, country and IP address.
                                        <br />&nbsp;&nbsp;We use this Visitor Data to provide the Visitor with the information or materials requested, including marketing materials, newsletters and other related content, perform analytics on how the Site, Platform, and Services are used, improve the use of the Site, Platform, or Services, and for other legitimate business purposes.
                                        <br />
                                        <br />Data provided by or collected from our Contributors ("Contributor Data")
                                        <br />
                                        <br />Account Data <br />
                                        <br />&nbsp;&nbsp;When a Contributor creates an account with Funibet, we will collect the Contributor’s name, username, and password, zip code, and email address.
                                        <br />&nbsp;&nbsp;We may also ask each Contributor to provide us with additional information necessary or helpful for Funibet to be able to determine which Tests are best directed to that Contributor. Examples of information we may collect are: birth year; gender; household income range; country; web expertise; presence of children (including gender and birth years); employment status, industry; company size; job role seniority; gaming genres; web browsers; social networks; languages spoken; race, ethnicity, sexual orientation, and other sensitive personal data, which may be provided on a voluntary basis and only collected as permitted by applicable law; devices owned (e.g. computer, smartphone, tablet); and computer operating system.
                                        <br />&nbsp;&nbsp;Funibet uses Contributor Data to provide and improve its Services, pay Contributors, provide information on how to use our Platform and Services to our Contributors, and for other legitimate business purposes.
                                        <br />
                                        <br />Recordings
                                        <br />
                                        <br />&nbsp;&nbsp;As a Contributor takes part in a Test, we make a recording of the Contributor’s activities, which may include recordings of the Contributor’s voice, screen content, face recordings, screen recordings, browser content, screen interactions including mouse movement and clicking, text input, device configurations, and any background audio or video content.  ("Recordings").  Any personal or health information that appears on a Contributor's screen, or that is mentioned in the audio, may be captured in the Recording. If one of our Customers requests sensitive data from a Contributor as part of a test, we require the 	Customer to add a notification before the test begins of the specific sensitive data to be requested.  The Contributor will then have the opportunity to continue with the test or decline it.
                                        <br />&nbsp;&nbsp;Intellectual property rights in the Recordings, which may include Personal Data and face Recordings, are assigned by Contributors to Funibet under the terms of the Contributor Terms of Service in consideration for Contributors’ use of the Platform and Services. Recordings are owned by and controlled by the Customer or Funibet, as applicable.
                                        <br />&nbsp;&nbsp;Funibet uses Recordings to provide Services to Customers, to market its products and services, to protect against fraudulent or illegal activity, to improve the Funibet Platform and Services and for other legitimate business purposes.
                                        <br />
                                        <br />Data provided by our Customers ("Customer Data")
                                        <br />
                                        <br />&nbsp;&nbsp;During a Customer’s use of the Platform and Services, Customer’s employees are asked to provide information such as name and contact information, including email address, address, telephone, or other relevant Personal Data.
                                        <br />&nbsp;&nbsp;Customer Data is used by Funibet to identify each Customer and provide them with access to the Platform and Services, to bill Customers, and to meet Funibet’s contractual obligations. We also use Customer Data to improve our Platform and Services and to provide Customers with notices about improvements and best practices in using the Platform and Services, as well as other legitimate business purposes.
                                        <br />
                                        <br />Personal Data Collected Indirectly
                                        <br />
                                        <br />Tracking Data, IP Addresses and Device Fingerprints
                                        <br />
                                        <br />&nbsp;&nbsp;Funibet tracks whether a Visitor lands on the Funibet Sites from an external source (such as a link on another website or in an email), as well as IP addresses from which the site is accessed and information about the computing device (fingerprint) used to access the Sites. Funibet uses this information to improve the Site, Platform, and Services, as well as to prevent fraud and secure information.
                                        <br />
                                        <br />Information from Third Parties
                                        <br />
                                        <br />&nbsp;&nbsp;Funibet collects Personal Data and other data from third parties that provide us with lists of potential Customers and their contact information, if such potential Customers give permission to those third parties to share their information with us. Funibet uses this information for its own marketing purposes.
                                        <br />
                                        <br />Cookies
                                        <br />
                                        <br />&nbsp;&nbsp;We use cookies and other technologies to track the use of our websites and apps.
                                        <br />
                                        <br />"Do Not Track"
                                        <br />
                                        <br />&nbsp;&nbsp;Funibet’s Site, Platform, and Services may not respond to Do Not Track ("DNT") signals.
                                        <br />
                                        <br />We collect data when you communicate with us
                                        <br />
                                        <br />&nbsp;&nbsp;If you communicate with us directly, we will collect any Personal Data contained in such communications.
                                        <br />
                                        <br />Legal Obligations and Security
                                        <br />
                                        <br />&nbsp;&nbsp;We will preserve or disclose your Personal Data in limited circumstances (other than as set forth in this Privacy Policy), including: (i) with your consent; (ii) when we have a good faith belief it is required by law, such as pursuant to a subpoena, warrant, or other judicial or administrative order (as further explained below); (iii) to protect the safety of any person; to protect the safety or security of our Services or to prevent spam, abuse, or other malicious activity of actors with respect to the Services; or (iv) to protect our rights or property or the rights or property of those who use the Services.
                                        <br />&nbsp;&nbsp;If we are required to disclose Personal Data by law, such as pursuant to a subpoena, warrant, or other judicial or administrative order, our policy is to respond to legal mandates that are properly issued.
                                        <br />&nbsp;&nbsp;Note that if we receive information that provides us with a good faith belief that there is an exigent emergency involving the danger of death or serious physical injury to a person, we may provide information to law enforcement trying to prevent or mitigate the danger (if we have it), to be determined on a case-by-case basis.
                                        <br />
                                        <br />How we store your data
                                        <br />Retention
                                        <br />
                                        <br />&nbsp;&nbsp;We retain your Personal Data in accordance with your instructions, including those in the applicable terms of service accepted by you and any terms governing your use of the Platform and Services. We may also retain your Personal Data where we have an ongoing legitimate business purpose for doing so. We must retain information when it is needed for the establishment, exercise or defense of legal claims (also known as a "litigation hold"). In this case, we retain the information as long as needed for exercising respective potential legal claims.
                                        <br />&nbsp;&nbsp;We use the following criteria to determine our retention periods: the amount, nature and sensitivity of your information, the reasons for which we collect and process your Personal Data, the length of time we have an ongoing relationship with you and provide you with access to our Services, and applicable legal requirements.
                                        <br />
                                        <br />Deletion
                                        <br />
                                        <br />&nbsp;&nbsp;Funibet will delete Personal Data upon request, unless deletion is prohibited by law. At Funibet’s option, we may delete Personal Data one year after our business relationship ends, subject to our document retention policies and practices. When we have no ongoing legitimate business purpose to process your Personal Data, we may either delete or anonymize it. Deletion may not be possible if your Personal Data was anonymized. In that case, the anonymized data will not be able to be combined with other data to identify you.
                                        <br />&nbsp;&nbsp;If you ask Funibet to delete specific Personal Data of yours, and we are the data controller, we will honor your request by deleting or anonymizing the data unless deleting that information prevents us from carrying out necessary business functions, such as delivering and billing for our services, calculating taxes, or conducting required audits and fulfilling contractual obligations to our Customers, Contributors or others.
                                        <br />
                                        <br />Security
                                        <br />
                                        <br />&nbsp;&nbsp;We cannot guarantee, ensure or warrant the security of any information transmitted to the Company. All transmissions of information are done at the sender’s own risk. Once we are in possession of information, we will make reasonable efforts to ensure the security of the information within our systems.
                                        <br />&nbsp;&nbsp;Funibet has adopted physical, technological, and administrative procedures designed to safeguard and secure the information we process. By using this Site, Platform or Services or by providing Personal Data to us, you agree that we can communicate with you electronically regarding security, privacy, and administrative issues relating to your use of this Site, Platform or Services.
                                        <br />
                                        <br />Acceptance
                                        <br />
                                        <br />&nbsp;&nbsp;You agree that you have carefully read this document and agree to its contents. If you choose not to agree with this Privacy Policy, then you should refrain from using the Site, Services, and Platform.
                                        <br />&nbsp;&nbsp;Funibet reserves the right to change our Privacy Policy from time to time. If we make material changes to this Privacy Policy, we will provide notice to you of these changes, which may be by email to you, by posting a notice of such changes on our apps and websites, or by other means consistent with applicable law. Unless your express consent is required by law, your continued use of the Funibet Site, Platform, and Services after having been notified of any such a revised Privacy Policy indicates acceptance of the revised Privacy Policy.
                                    </div>
                                </Box>
                            </Box>
                        </div>
                    </DialogContent>
                </BootstrapDialog>

                {
                    !isMobileMedia &&
                    <div className='login-right-content'>
                        {/* <div className='login-right-content-title font-furore text-20'>
                            <span className="color-16c2a3">
                                Web 3.0
                            </span> {t('signUp_1')}
                        </div> */}

                        <div className='login-right-btns'>
                            <LoginSidebarContent
                                tab={pathname.substring(pathname.lastIndexOf('\/') + 1, pathname.length) || 'wallet'}
                                background='#0F172A'
                            // setTab={setTab}
                            // setIsLoading={setIsLoading}
                            />
                        </div>

                    </div>
                }
            </Paper>
        </div>
    );
}

export default ClassicSignUpPage;
