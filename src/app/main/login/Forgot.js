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
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { motion } from "framer-motion";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {
    sendSms,
    forgotPass, sendEmail
} from '../../store/user/userThunk';
import Select from "@mui/material/Select";
import phoneCode from "../../../phone/phoneCode";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete/Autocomplete";
import Box from "@mui/material/Box";
import MobileDetect from 'mobile-detect';
import clsx from 'clsx';
import loginWays from "./loginWays.json";
import { useTranslation } from "react-i18next";
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectConfig } from "app/store/config";
import { useSelector } from "react-redux";
import LoginSidebarContent from './LoginSidebarContent';

/**
 * Form Validation Schema
 */

// var filter = /^(?=.*[0-9\!@#\$%\^&\*])(?=.*[a-zA-Z]).{8,16}$/;
// let blnTest = filter.test('q12345678')

const defaultValues = {
    email: '',
    nationCode: '',
    phone: '',
    smsCode: '',
    password: '',
    passwordConfirm: '',
};

function ForgotPass() {
    const { t } = useTranslation('mainPage');
    const { pathname } = useLocation();
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const schema = yup.object().shape({
        // nationCode: yup.string().required('You must enter your nationCode'),
        // phone: yup.string().required('You must enter a phone'),
        smsCode: yup.string().required(t('signUp_7')),
        password: yup
            .string()
            .required('Please enter your password.')
            .min(6, t("signUp_8"))
            // .min(6, 'Password is too short - should be 6 chars minimum.')
            .max(16, 'Password is too long - should be 16 chars maximum.'),
        passwordConfirm: yup.string().oneOf([yup.ref('password'), null], t('signUp_9')),
    });

    const ranges = [t('signIn_4'), t('signIn_5')];
    const [tabValue, setTabValue] = useState(0);
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const { isValid, dirtyFields, errors } = formState;
    const [tmpPhoneCode, setTmpPhoneCode] = useState('');

    const dispatch = useDispatch();

    const [selected, setSelected] = useState('');
    const [logo, setLogo] = useState("assets/images/logo/logo.png");

    const handleChange = (event) => {
        control._formValues.nationCode = event.target.value;
        setSelected(event.target.value);
    };

    const [time, setTime] = useState(null);
    const timeRef = useRef();
    const config = useSelector(selectConfig);
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

    async function sendCode(isEmail = false) {
        let sendRes;
        if (isEmail) {
            const data = {
                codeType: 2,
                email: control._formValues.email,
            };
            sendRes = await dispatch(sendEmail(data));
        } else {
            const data = {
                codeType: 2,
                nationCode: control._formValues.nationCode,
                phone: control._formValues.phone,
            };
            setSelectedCountryCode(control._formValues.nationCode);
            var nation = control._formValues.nationCode
            sendRes = await dispatch(sendSms(data));

        }

        if (sendRes.payload) {
            setTime(60)
        }

    }

    async function onSubmit() {
        // 密码必须为6-18位数，且包含大小写字母和特殊符号
        let regu = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!~@#$%^&*,\.])[0-9a-zA-Z!~@#$%^&*,\\.]{6,18}$/;
        var re = new RegExp(regu);
        // if (!re.test(control._formValues.password)) {
        //     dispatch(showMessage({ message: t('errorMsg_3'), code: 2 }));
        //     return
        // }
        await dispatch(forgotPass(control._formValues));
    }

    useEffect(() => {
        if (config) {
            let openAppId = window.sessionStorage.getItem('openAppId')
            if (openAppId) {
                setLogo(`${config.staticSourceUrl}/${openAppId}.png`)
            }
        }
    }, [config]);

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0"
            style={{
                // background: "#0F172A"
                background: 'rgb(14, 20, 33)'
            }}
        >
            <Paper
                className={clsx("w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow flex", !isMobileMedia && 'login-right-side')}
                style={{
                    // background: "#0F172A"
                    background: 'rgb(14, 20, 33)'
                }}
            >
                <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
                    <img className="w-160" style={{ marginBottom: '1rem' }} src={logo} />

                    {/* <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                        Forgot password?
                    </Typography> */}
                    <div className="flex items-baseline mt-2 font-medium">
                        <Typography>{t('forgot_2')}</Typography>
                        {/*<Link className="ml-4" to="/login">*/}
                        {/*    Sign in*/}
                        {/*</Link>*/}
                    </div>
                    <Tabs
                        component={motion.div}
                        value={tabValue}
                        onChange={(ev, value) => {
                            setTabValue(value);
                            control._formValues.phone = '';
                            control._formValues.email = '';
                        }}
                        indicatorColor="secondary"
                        textColor="inherit"
                        // variant="scrollable"
                        scrollButtons={false}
                        className="min-h-32 "
                        style={{ padding: '0 0', margin: '1.9rem 0px 2.4rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: '144px', borderRadius: '20px', height: '3.2rem' }}
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full ' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    sx={{ bgcolor: 'text.disabled' }}
                                    className="fontStyle w-full h-full rounded-full huaKuaBgColor1"
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
                                className="fontStyle text-14 font-semibold min-h-32 min-w-72 px-8 txtColorTitle zindex opacity-100"
                                disableRipple
                                key={key}
                                label={label}
                                style={{ opacity: '1!important' }}
                                sx={{
                                    color: '#FFFFFF', height: '3.2rem', opacity: '1'
                                }}
                            />
                        ))}
                    </Tabs>

                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(onSubmit)}
                    >
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

                        {tabValue === 1 && <Controller
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
                                        type="email"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        error={!!errors.email}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {time <= 0 && <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        sendCode(true)
                                                    }}
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

                        {tabValue === 0 && (<>
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
                                            control._formValues.nationCode = option.phone_code
                                        }}
                                        getOptionLabel={(option) => { return control._formValues.nationCode }}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`/assets/images/country/${option.country_code}.png`}
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
                                        >{t('signIn_4')}*</InputLabel>
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
                                                        onClick={() => {sendCode(false)}}
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
                        </>)}


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
                                    label={t('forgot_4')}
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

                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-center">
                            <Link className="text-md font-medium" to="/login">
                                {t('signIn_1')}
                            </Link>
                        </div>

                        <Button
                            variant="contained"
                            color="secondary"
                            className=" w-full mt-24"
                            aria-label="Register"
                            disabled={
                                _.isEmpty(dirtyFields) ||
                                !isValid
                            }
                            type="submit"
                            size="large"
                            
                        >
                            {t('forgot_5')}
                        </Button>
                    </form>
                </div>
                {
                    !isMobileMedia &&
                    <div className='login-right-content'>
                        {/* <div className='login-right-content-title font-furore text-20'>
                            <span className="color-16c2a3">
                                Web 3.0
                            </span> {t('signIn_1')}
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

export default React.memo(ForgotPass);
