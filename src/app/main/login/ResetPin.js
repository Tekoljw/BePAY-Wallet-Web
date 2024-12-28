import { useState, useEffect, default as React, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { resetPass, editPin } from '../../store/user/userThunk';
import { useTranslation } from "react-i18next";
import { showMessage } from 'app/store/fuse/messageSlice';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import FormControl from '@mui/material/FormControl';
import clsx from 'clsx';
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import phoneCode from "../../../phone/phoneCode";
import { createPin, changePin } from "app/store/wallet/walletThunk";
import history from "../../../@history/@history";
import { sendEmail, sendSms, bindPhone, bindEmail } from "../../store/user/userThunk";
import { styled, FormHelperText } from "@mui/material";
import { selectUserData } from "../../store/user";
import { getIPExtendInfo } from "app/store/config/configThunk";

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const defaultValues = {
    oldPassword: '',
    password: '',
    passwordConfirm: '',
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function ResetPin(props) {
    const resetTabValueParam = props?.resetTabValueParam ?? 0
    const { t } = useTranslation('mainPage');
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const schema = yup.object().shape({
        oldPassword: yup
            .string()
            .required('Please enter your old password.')
            .min(6, t("signUp_8")),
        password: yup
            .string()
            .required('Please enter your new password.')
            .max(16, 'Password is too long - should be 16 chars maximum.')
            .min(6, t("signUp_8")),
        passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });


    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const [tmpPhoneCode, setTmpPhoneCode] = useState('');
    const { isValid, dirtyFields, errors } = formState;
    const [resetTabValue, setResetTabValue] = useState(resetTabValueParam);
    const [selectId, setSelectId] = useState(0);
    const [emailError, setEmailError] = useState(false);
    const [smsError, setSmsError] = useState(false);
    const [newPinError1, setNewPinError1] = useState(false);
    const [newPinError2, setNewPinError2] = useState(false);
    const [submitBtnShow, setSubmitBtnShow] = useState(true);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [smsError2, setSmsError2] = useState(false);
    const [newPinError3, setNewPinError3] = useState(false);
    const [newPinError4, setNewPinError4] = useState(false);
    const userData = useSelector(selectUserData);
    const dispatch = useDispatch();
    const [time, setTime] = useState(null);
    const timeRef = useRef();

    const [tmpCode, setTmpCode] = useState('');
    const [dataPage, setDataPage] = useState(1);
    const [selectPhoneCode, setSelectPhoneCode] = useState([]);
    const [searchPhoneCode, setSearchPhoneCode] = useState([]);

    const pagePhoneCodeList = (page = 1, isSearch = true) => {
        if (page <= dataPage && page !== 1) {
            return
        }
        let tmpSelectData = [];
        let startKey = 0;
        let endKey = page === 1 ? 23 : (page + 1) * 23;
        if (searchPhoneCode.length > 0) {
            tmpSelectData = searchPhoneCode.slice(startKey, endKey)
        } else {
            tmpSelectData = phoneCode.list.slice(startKey, endKey)
        }

        function objHeavy(arr) {
            let arr1 = []; //存id
            let newArr = []; //存新数组
            for (let i in arr) {
                if (arr1.indexOf(arr[i].phone_code) == -1) {
                    arr1.push(arr[i].phone_code);
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        }

        // let tmpSelectPhoneCode = [...selectPhoneCode];
        let tmpSelectPhoneCode = [];
        tmpSelectPhoneCode.push(...tmpSelectData);
        setDataPage(page);
        // setSelectPhoneCode(objHeavy(tmpSelectPhoneCode));
        setSelectPhoneCode(tmpSelectPhoneCode);
        // setTimeout(() => {
        //     document.getElementById("phoneCode-listbox").scrollTop = 30 * (page - 1) * 10;
        // }, 500)
    };

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
        const getPhoneCode = async () => {
            // const service = axios.create({
            //     timeout: 50000, // request timeout
            // });
            // var post = {
            //     url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/getIPExtendInfo`,
            //     method: 'post',
            //     async: true
            // };


            let res = dispatch(getIPExtendInfo()).then((res) => {
                let result = res.payload
                if (result.queryCountry) {
                    let countryText = result.queryCountry;
                    if (countryText) {
                        phoneCode.list.map((item) => {
                            if (item.chinese_name === countryText) {
                                setTmpCode(item.phone_code);
                                return
                            }
                        })
                    }
                }
            });
        };
        getPhoneCode();
    }, []);

    useEffect(() => {
        inputVal2.nationCode = tmpCode;
    }, [tmpCode]);

    useEffect(() => {
        pagePhoneCodeList(1, true);
    }, [tmpPhoneCode]);

    async function sendCode() {
        if (userData?.profile?.user?.bindEmail === true) {
            if (inputVal.email.includes("@") && inputVal.email === userData.profile.user.email) {
                const data = {
                    codeType: 13,
                    email: inputVal.email,
                };
                const sendRes = await dispatch(sendEmail(data));
                if (sendRes.payload) {
                    setTime(60)
                }
            } else {
                dispatch(showMessage({ message: t('kyc_55'), code: 2 }));
            }
        } else {
            dispatch(showMessage({ message: t('Kyc_62'), code: 3 }));
        }
    }

    async function sendPhoneCode() {
        if (userData?.profile?.user?.bindMobile === true) {
            if (inputVal2.nationCode === userData.profile.nation && inputVal2.phone === userData.profile.phone) {
                setSelectedCountryCode(inputVal2.nationCode);
                const data = {
                    codeType: 13,
                    nationCode: inputVal2.nationCode,
                    phone: inputVal2.phone,
                };
                const sendRes = await dispatch(sendSms(data));
                if (sendRes?.payload) {
                    setTime(60)
                }
            } else {
                dispatch(showMessage({ message: t('kyc_72'), code: 2 }));
            }
        } else {
            dispatch(showMessage({ message: t('Kyc_63'), code: 3 }));
        }
    }

    const handlePin = async () => {
        if (resetTabValue === 0) {
            await dispatch(editPin(control._formValues));
        }
    }

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }


    const [inputVal, setInputVal] = useState({
        email: '',
        smsCode: '',
        password: '',
        twoNewPin: '',
        codeType: '',
    });

    const [inputVal2, setInputVal2] = useState({
        phone: '',
        nationCode: '',
        smsCode: '',
        password: '',
        twoNewPin: '',
        codeType: '',
    });

    const [bandData, setBandData] = useState({
        phone: '',
        email: '',
    });


    useEffect(() => {
        if (inputVal.email !== '' && inputVal.smsCode !== '' && inputVal.password !== '' && inputVal.twoNewPin !== '') {
            setSubmitBtnShow(false);
        } else {
            setSubmitBtnShow(true);
        }
        if (inputVal.password !== inputVal.twoNewPin) {
            setNewPinError2(true);
        }
    }, [inputVal]);



    useEffect(() => {
        if (inputVal2.nationCode !== '' && inputVal2.phone !== '' && inputVal2.smsCode !== '' && inputVal2.password !== '' && inputVal2.twoNewPin !== '') {
            setSubmitBtnShow(false);
        } else {
            setSubmitBtnShow(true);
        }
        if (inputVal.password !== inputVal.twoNewPin) {
            setNewPinError2(true);
        }
    }, [inputVal2]);


    const sumbitBtnFunc = () => {
        if (selectId === 0) {
            inputVal.codeType = 13;
            dispatch(changePin(inputVal)).then((res) => {
                let result = res.payload
                if (result) {
                    changePhoneTab('withdraw');
                    history.push('/wallet/home/wallet')
                }
            })
        } else if (selectId === 1) {
            inputVal2.codeType = 13;
            dispatch(changePin(inputVal2)).then((res) => {
                let result = res.payload
                if (result) {
                    changePhoneTab('withdraw');
                    history.push('/wallet/home/wallet')
                }
            })
        }
    };


    const handleBlur = () => {
        if (inputVal.email === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handleBlur2 = () => {
        if (inputVal.sms === '') {
            setSmsError(true);
        } else {
            setSmsError(false);
        }
    };

    const handleBlur3 = () => {
        if (inputVal.newPin === '') {
            setNewPinError1(true);
        } else {
            setNewPinError1(false);
        }
    };

    const handleBlur4 = () => {
        if (inputVal.twoNewPin === '') {
            setNewPinError2(true);
        } else {
            setNewPinError2(false);
        }
    };


    const handleBlur5 = () => {
        if (inputVal2.phone === '') {
            setPhoneNumberError(true);
        } else {
            setPhoneNumberError(false);
        }
    };

    const handleChangeInputVal = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handleChangeInputVal2 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setSmsError(true);
        } else {
            setSmsError(false);
        }
    };

    const handleChangeInputVal3 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setNewPinError1(true);
        } else {
            setNewPinError1(false);
        }
    };

    const handleChangeInputVal4 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));
        if (event.target.value === '') {
            setNewPinError2(true);
        } else {
            setNewPinError2(false);
        }
    };



    const handleChangeInputVal5 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal2((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setPhoneNumberError(true);
        } else {
            setPhoneNumberError(false);
        }
    };


    const handleChangeInputVal6 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal2((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setSmsError2(true);
        } else {
            setSmsError2(false);
        }
    };


    const handleChangeInputVal7 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal2((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setNewPinError3(true);
        } else {
            setNewPinError3(false);
        }
    };


    const handleBlur6 = () => {
        if (inputVal2.smsCode === '') {
            setSmsError2(true);
        } else {
            setSmsError2(false);
        }
    };


    const handleBlur7 = () => {
        if (inputVal2.newPin === '') {
            setNewPinError3(true);
        } else {
            setNewPinError3(false);
        }
    };


    const handleChangeInputVal8 = (prop) => (event) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, ''); // 使用正则表达式，移除所有非数字字符
        setInputVal2((prevState) => ({
            ...prevState,
            [prop]: numericValue
        }));

        if (event.target.value === '') {
            setNewPinError4(true);
        } else {
            setNewPinError4(false);
        }
    };


    const handleBlur8 = () => {
        if (inputVal2.twoNewPin === '') {
            setNewPinError4(true);
        } else {
            setNewPinError4(false);
        }
    };


    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0 "
        >
            <div
                className="tongYongChuang4"
                style={{
                    background: "#1e293b"
                }}
            >
                <div className="w-full">
                    <Tabs
                        component={motion.div}
                        variants={item}
                        value={resetTabValue}
                        onChange={(ev, value) => setResetTabValue(value)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons={false}
                        className="min-h-32"
                        style={{ padding: '0 0', margin: '0rem 0rem 1.5rem 0rem', borderColor: 'transparent', backgroundColor: '#0E1421', width: 'auto', borderRadius: '0px', height: '30px' }}
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    sx={{ bgcolor: 'text.disabled' }}
                                    className="w-full h-full rounded-full pinKuaBgColorCard"
                                />
                            ),
                        }}
                        sx={{
                            padding: '1rem 1rem',
                        }}
                    >
                        {Object.entries([t('kyc_50'), t('kyc_51')]).map(([key, label]) => (
                            <Tab
                                className="text-16 font-semibold min-h-32 min-w-60 mx4 px-12 txtColorTitle opacity-100 zindex"
                                disableRipple
                                key={key}
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '32px', width: 'auto', marginRight: "1rem"
                                }}
                            />
                        ))}
                    </Tabs>
                </div>

                {resetTabValue === 0 &&
                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(handlePin)}
                    >
                        <Controller
                            name="oldPassword"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={t('kyc_54')}
                                    type="password"
                                    error={!!errors.oldPassword}
                                    helperText={errors?.oldPassword?.message}
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
                                    label={t('kyc_52')}
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
                                    label={t('kyc_53')}
                                    type="password"
                                    error={!!errors.passwordConfirm}
                                    helperText={errors?.passwordConfirm?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <div style={{ textAlign: "center" }}>
                            <a className="text-md font-medium" onClick={() => {
                                changePhoneTab('');
                                history.push('/wallet/home/wallet')
                            }}>
                                {t('re_tied_email_4')}
                            </a>
                        </div>

                        <Button
                            variant="contained"
                            color="secondary"
                            className=" w-full mt-24"
                            aria-label="Register"
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            type="submit"
                            size="large"
                            sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
                            onClick={() => {
                                handlePin()
                            }}
                        >
                            {t('kyc_23')}
                        </Button>
                    </form>}

                {resetTabValue === 1 &&
                    <div className=''>
                        <div className="mt-20"> {t('kyc_57')} </div>
                        <div className='mt-10'>
                            <div
                                onClick={() => { setSelectId(0) }}
                                className={clsx('selectPin', selectId === 0 && 'activePinZi')}
                                style={{ marginRight: "2rem" }}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/email.png" alt="" />
                                <div style={{ float: "left" }} className="px-6">{t('signIn_5')}</div>
                            </div>

                            <div
                                onClick={() => { setSelectId(1) }}
                                className={clsx('selectPin', selectId === 1 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/phone.png" alt="" />
                                <div style={{ float: "left" }} className="px-6">{t('kyc_56')}</div>
                            </div>
                        </div>

                        {selectId === 0 &&
                            <div>
                                <div className=''>
                                    <div className="w-full tongYongChuang3 flex justify-content-center ">
                                        <div className="w-full  mx-auto sm:mx-0">
                                            <div className="flex flex-col justify-center w-full mt-32" >

                                                <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                    <InputLabel id="demo-simple-select-label">{t('kyc_27')}</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-address"
                                                        label="email"
                                                        value={inputVal.email}
                                                        onChange={handleChangeInputVal('email')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{ 'aria-label': 'email' }}
                                                        error={emailError}
                                                        onBlur={handleBlur}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                {time <= 0 && <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={sendCode}
                                                                    className='txtSend'
                                                                    edge="end"
                                                                    sx={{
                                                                        fontSize: '1.4rem',
                                                                        borderRadius: '5px'
                                                                    }}
                                                                >
                                                                    {t('forgot_3')}
                                                                </IconButton>}
                                                                {time > 0 && <div> {time}s </div>}
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {emailError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                </FormControl>


                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('signIn_8')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="smsCode"
                                                            value={inputVal.smsCode}
                                                            onChange={handleChangeInputVal2('smsCode')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'smsCode',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={smsError}
                                                            onBlur={handleBlur2}
                                                        />
                                                        {smsError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>


                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('kyc_52')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="password"
                                                            value={inputVal.password}
                                                            onChange={handleChangeInputVal3('password')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            type="password"
                                                            inputProps={{
                                                                'aria-label': 'password',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={newPinError1}
                                                            onBlur={handleBlur3}
                                                        />
                                                        {newPinError1 && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>



                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('kyc_53')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="PIN(Confirm)"
                                                            value={inputVal.twoNewPin}
                                                            onChange={handleChangeInputVal4('twoNewPin')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            type="password"
                                                            inputProps={{
                                                                'aria-label': 'PIN(Confirm)',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={newPinError2}
                                                            onBlur={handleBlur4}
                                                        />
                                                        {newPinError2 && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>



                                                <div style={{ textAlign: "center" }}>
                                                    <a className="text-md font-medium" onClick={() => {
                                                        changePhoneTab('');
                                                        history.push('/wallet/home/wallet')
                                                    }}>
                                                        {t('re_tied_email_4')}
                                                    </a>
                                                </div>

                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className=" w-full mt-24"
                                                    aria-label="Register"
                                                    disabled={submitBtnShow}
                                                    type="submit"
                                                    size="large"
                                                    sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
                                                    onClick={() => {
                                                        sumbitBtnFunc();
                                                    }}
                                                >
                                                    {t('kyc_50')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {selectId === 1 &&
                            <div>
                                <div className=''>
                                    <div
                                        className="w-full tongYongChuang3 flex justify-content-center "
                                    >
                                        <div className="w-full  mx-auto sm:mx-0">

                                            <div className="flex flex-col justify-center w-full mt-32"  >

                                                <Controller
                                                    className='fontStyle'
                                                    name="nationCode"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            id="phoneCode"
                                                            onHighlightChange={(event, option) => {
                                                                if (option?.english_name) {
                                                                    if (selectPhoneCode.length > 0) {
                                                                        var key = selectPhoneCode.findIndex(item => item.english_name === option.english_name);
                                                                        if ((key + 1) % 23 === 0) {
                                                                            var page = ((key + 1) / 23) + 1;
                                                                            pagePhoneCodeList(page, false)
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                            // disablePortal
                                                            className="mb-24"
                                                            // options={phoneCode.list}
                                                            options={selectPhoneCode}
                                                            autoHighlight
                                                            onInputChange={(event, newInputValue) => {
                                                                let tmpPhoneCodeText = newInputValue.replace(/\+/g, "")
                                                                let tmpSearchData = [];
                                                                phoneCode.list.map((item) => {
                                                                    if (item.phone_code.match(tmpPhoneCodeText) || item.country_code.match(tmpPhoneCodeText.toUpperCase()) || item.local_name.match(tmpPhoneCodeText.toUpperCase())) {
                                                                        tmpSearchData.push(item)
                                                                    }
                                                                });
                                                                setTmpPhoneCode(tmpPhoneCodeText);
                                                                setSearchPhoneCode(tmpSearchData);
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
                                                                    inputVal2.nationCode = option.phone_code;
                                                                    setTmpCode(option.phone_code)
                                                                }
                                                            }}
                                                            value={inputVal2.nationCode}
                                                            getOptionLabel={(option) => { return '+' + tmpCode }}
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
                                                                    className='fontStyle'
                                                                    id="test-b"
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

                                                <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                    <InputLabel id="demo-simple-select-label">{t('signIn_4')}</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-address"
                                                        label="phone"
                                                        value={inputVal2.phone}
                                                        onChange={handleChangeInputVal5('phone')}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'phone',
                                                            inputMode: 'numeric',
                                                            pattern: '[0-9]*',
                                                        }}
                                                        error={phoneNumberError}
                                                        onBlur={handleBlur5}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                {time <= 0 && <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={sendPhoneCode}
                                                                    className='txtSend'
                                                                    edge="end"
                                                                    sx={{
                                                                        fontSize: '1.4rem',
                                                                        borderRadius: '5px'
                                                                    }}
                                                                >
                                                                    {t('forgot_3')}
                                                                </IconButton>}
                                                                {time > 0 && <div> {time}s </div>}
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {phoneNumberError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                </FormControl>

                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('signIn_7')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="smsCode"
                                                            value={inputVal2.smsCode}
                                                            onChange={handleChangeInputVal6('smsCode')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            inputProps={{
                                                                'aria-label': 'smsCode',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={smsError2}
                                                            onBlur={handleBlur6}
                                                        />
                                                        {smsError2 && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>


                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('kyc_52')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="password"
                                                            value={inputVal2.password}
                                                            onChange={handleChangeInputVal7('password')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            type="password"
                                                            inputProps={{
                                                                'aria-label': 'password',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={newPinError3}
                                                            onBlur={handleBlur7}
                                                        />
                                                        {newPinError3 && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>


                                                <div className="flex items-center justify-between">
                                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                                        <InputLabel id="demo-simple-select-label">{t('kyc_53')}</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-address"
                                                            label="PIN(Confirm)"
                                                            value={inputVal2.twoNewPin}
                                                            onChange={handleChangeInputVal8('twoNewPin')}
                                                            aria-describedby="outlined-weight-helper-text"
                                                            type="password"
                                                            inputProps={{
                                                                'aria-label': 'PIN(Confirm)',
                                                                inputMode: 'numeric',
                                                                pattern: '[0-9]*',
                                                            }}
                                                            error={newPinError4}
                                                            onBlur={handleBlur8}
                                                        />
                                                        {newPinError4 && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                                                    </FormControl>
                                                </div>



                                                <div style={{ textAlign: "center" }}>
                                                    <a className="text-md font-medium" onClick={() => {
                                                        changePhoneTab('');
                                                        history.push('/wallet/home/wallet')
                                                    }}>
                                                        {t('re_tied_email_4')}
                                                    </a>
                                                </div>

                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className=" w-full mt-24"
                                                    aria-label="Register"
                                                    disabled={submitBtnShow}
                                                    type="submit"
                                                    size="large"
                                                    sx={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important" }}
                                                    onClick={() => {
                                                        sumbitBtnFunc();
                                                    }}
                                                >
                                                    {t('kyc_50')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div style={{ height: "80px" }}></div>
                    </div>
                }
            </div>
        </div>
    );
}

export default ResetPin;
