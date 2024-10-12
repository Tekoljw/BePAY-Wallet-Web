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
import { styled, FormHelperText } from "@mui/material";
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HomeSidebarContent from "../home/HomeSidebarContent";
import MobileDetect from 'mobile-detect';
import { getUserData } from "../../store/user/userThunk";
import { uploadStorage } from "../../store/tools/toolThunk";
import { getKycInfo, updateKycInfo, submitKycInfo } from "app/store/payment/paymentThunk";
import { selectConfig } from "../../store/config";
import { selectUserData } from "../../store/user";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { sendEmail, sendSms, bindPhone, bindEmail } from "../../store/user/userThunk";
import phoneCode from "../../../phone/phoneCode";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import AnimateModal from "../../components/FuniModal";
import clsx from 'clsx';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Hidden from "@mui/material/Hidden";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";

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
    const [inputVal, setInputVal] = useState({
        address: '',
        addressTwo: '',
        birthDate: '',
        city: '',
        country: '',
        email: '',
        firstName: '',
        idBackUrl: '',
        idFrontUrl: '',
        idNo: '',
        idType: '',
        lastName: '',
        middleName: '',
        phoneCountry: '',
        phoneNumber: '',
        proofOfAddressUrl: '',
        selfPhotoUrl: '',
        state: '',
        usSsn: '',
        zipcode: '',
    });


    const [approveData, setApproveData] = useState({
        nationCode: user.profile?.nation ?? '',
        phone: user.profile?.phone ?? '',
        email: user.profile?.user?.email ?? '',
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
        await dispatch(bindPhone({
            nationCode: inputVal.nationCode,
            phone: approveData.phone,
            smsCode: approveData.code,
        })).then((res) => {
            let result = res.payload;
            if (result.errno === 0) {
                dispatch(showMessage({ message: 'Success', code: 1 }));
                dispatch(getUserData());
                setTimeout(() => {
                    refreshKycInfo();
                }, 1000)
            } else {
                dispatch(showMessage({ message: result.errmsg, code: 2 }));
            }
        });
    };

    const onSubmitEmail = async () => {
        await dispatch(bindEmail({
            email: approveData.email,
            smsCode: approveData.code,
            password: approveData.password,
        })).then((res) => {
            let result = res.payload;
            if (result.errno === 0) {
                dispatch(showMessage({ message: 'Success', code: 1 }));
                dispatch(getUserData());
                setTimeout(() => {
                    refreshKycInfo();
                }, 1000)
            } else {
                dispatch(showMessage({ message: result.errmsg, code: 2 }));
            }
        });
    };

    const handleApproveData = (prop) => (event) => {
        setApproveData({ ...approveData, [prop]: event.target.value });
    };
    const handleChangeApproveDataVal = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };

    const [keyName, setKeyName] = useState('');
    const [idTypeError, setIdTypeError] = useState(false);
    const [idNoError, setIdNoError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [countryError, setCountryError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [phoneCountryError, setPhoneCountryError] = useState(false);
    const [idFrontUrlError, setIdFrontUrlError] = useState(false);
    const [idBackUrlError, setIdBackUrlError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(true);

    const [emailInput, setEmailInput] = useState(false);
    const [emailInputShow, setEmailInputShow] = useState(false);
    const emailInputRef = useRef(null);  // 用于存储输入框的引用

    const [phoneCountryInput, setPhoneCountryInput] = useState(false);
    const [phoneCountryInputShow, setPhoneCountryInputShow] = useState(false);
    const phoneCountryInputRef = useRef(null);

    const [phoneNumberInput, setPhoneNumberInput] = useState(false);
    const [phoneNumberInputShow, setPhoneNumberInputShow] = useState(false);
    const phoneNumberInputRef = useRef(null);

    const [firstNameInput, setFirstNameInput] = useState(false);
    const [firstNameInputShow, setFirstNameInputShow] = useState(false);
    const firstNameInputRef = useRef(null);

    const [lastNameInput, setLastNameInput] = useState(false);
    const [lastNameInputShow, setLastNameInputShow] = useState(false);
    const lastNameInputRef = useRef(null);

    const [countryInput, setCountryInput] = useState(false);
    const [countryInputShow, setCountryInputShow] = useState(false);
    const countryInputRef = useRef(null);

    const [middleNameInput, setMiddleNameInput] = useState(false);
    const [middleNameInputShow, setMiddleNameInputShow] = useState(false);
    const middleNameInputRef = useRef(null);


    //文凯改
    const changeBiState = (copyData) => {
        if (copyData.email) {
            setEmailInput(true)
            setEmailInputShow(true)
        } else {
            setEmailInput(false)
            setEmailInputShow(false)
        }
        if (copyData.phoneCountry) {
            setPhoneCountryInput(true)
            setPhoneCountryInputShow(true)
        } else {
            setPhoneCountryInput(false)
            setPhoneCountryInputShow(false)
        }
        if (copyData.phoneNumber) {
            setPhoneNumberInput(true)
            setPhoneNumberInputShow(true)
        } else {
            setPhoneNumberInput(false)
            setPhoneNumberInputShow(false)
        }
        if (copyData.firstName) {
            setFirstNameInput(true)
            setFirstNameInputShow(true)
        } else {
            setFirstNameInput(false)
            setFirstNameInputShow(false)
        }
        if (copyData.lastName) {
            setLastNameInput(true)
            setLastNameInputShow(true)
        } else {
            setLastNameInput(false)
            setLastNameInputShow(false)
        }
        if (copyData.country) {
            setCountryInput(true)
            setCountryInputShow(true)
        } else {
            setCountryInput(false)
            setCountryInputShow(false)
        }

        if (copyData.middleName) {
            setMiddleNameInput(true)
            setMiddleNameInputShow(true)
        } else {
            setMiddleNameInput(false)
            setMiddleNameInputShow(false)
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

    useEffect(() => {
        if (inputVal.email === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
        if (inputVal.phoneCountry === '') {
            setPhoneCountryError(true);
        } else {
            setPhoneCountryError(false);
        }
        if (inputVal.phoneNumber === '') {
            setPhoneNumberError(true);
        } else {
            setPhoneNumberError(false);
        }
        if (inputVal.firstName === '') {
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
        if (inputVal.country === '') {
            setCountryError(true);
        } else {
            setCountryError(false);
        }


        showBtnFunc();
    }, [inputVal]);


    const handleBlur = () => {
        if (inputVal.email === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
        if (inputVal.email) {
            setEmailInput(true)
            setEmailInputShow(true)
            setEmailInput(true); // 开启禁用状态
            emailInputRef.current.blur();// 取消到输入框
        } else {
            setEmailInput(false)
            setEmailInputShow(false)
        }
    };


    const handleBlur2 = () => {
        if (inputVal.phoneCountry === '') {
            setPhoneCountryError(true);
        } else {
            setPhoneCountryError(false);
        }
        if (inputVal.phoneCountry) {
            setPhoneCountryInput(true)
            setPhoneCountryInputShow(true)
            setPhoneCountryInput(true);
            phoneCountryInputRef.current.blur();// 取消到输入框
        } else {
            setPhoneCountryInput(false)
            setPhoneCountryInputShow(false)
        }

    };


    const handleBlur3 = () => {
        if (inputVal.phoneNumber === '') {
            setPhoneNumberError(true);
        } else {
            setPhoneNumberError(false);
        }
        if (inputVal.phoneNumber) {
            setPhoneNumberInput(true)
            setPhoneNumberInputShow(true)
            setPhoneNumberInput(true);
            phoneNumberInputRef.current.blur();// 取消到输入框
        } else {
            setPhoneNumberInput(false)
            setPhoneNumberInputShow(false)
        }

    };

    const handleBlur4 = () => {
        if (inputVal.firstName === '') {
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
        if (inputVal.firstName) {
            setFirstNameInput(true)
            setFirstNameInputShow(true)
            setFirstNameInput(true);
            firstNameInputRef.current.blur();// 取消到输入框
        } else {
            setFirstNameInput(false)
            setFirstNameInputShow(false)
        }
    };


    const handleBlur5 = () => {
        if (inputVal.middleName) {
            setMiddleNameInput(true)
            setMiddleNameInputShow(true)
            setMiddleNameInput(true);
            middleNameInputRef.current.blur();// 取消到输入框
        } else {
            setMiddleNameInput(false)
            setMiddleNameInputShow(false)
        }
    };

    const handleBlur6 = () => {
        if (inputVal.lastName) {
            setLastNameInput(true)
            setLastNameInputShow(true)
            setLastNameInput(true);
            lastNameInputRef.current.blur();// 取消到输入框
        } else {
            setLastNameInput(false)
            setLastNameInputShow(false)
        }
    };



    const handleBlur8 = () => {
        if (inputVal.country === '') {
            setCountryError(true);
        } else {
            setCountryError(false);
        }
        if (inputVal.country) {
            setCountryInput(true)
            setCountryInputShow(true)
        } else {
            setCountryInput(false)
            setCountryInputShow(false)
        }
        setCountryInput(true);
        countryInputRef.current.blur();// 取消到输入框
    };

    const handleBlur9 = () => {
        if (inputVal.state === '') {
            setStateError(true);
        } else {
            setStateError(false);
        }
    };

    const handleBlur10 = () => {
        if (inputVal.city === '') {
            setCityError(true);
        } else {
            setCityError(false);
        }
    };

    const handleBlur11 = () => {
        if (inputVal.address === '') {
            setAddressError(true);
        } else {
            setAddressError(false);
        }
    };

    const handleBlur14 = () => {
        if (inputVal.idNo === '') {
            setIdNoError(true);
        } else {
            setIdNoError(false)
        }
    };

    const handleBlur15 = () => {
        if (inputVal.idType === '') {
            setIdTypeError(true);
        } else {
            setIdTypeError(false)
        }
    };

    const handleBlur16 = () => {
        if (inputVal.idFrontUrl === '') {
            setIdFrontUrlError(true);
        } else {
            setIdFrontUrlError(false);
        }
    };

    const handleBlur17 = () => {
        if (inputVal.idBackUrl === '') {
            setIdBackUrlError(true);
        } else {
            setIdBackUrlError(false);
        }
    };


    const editEmail = () => {
        setEmailInput(false);  // 取消禁用状态
        setTimeout(() => {
            emailInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };


    const editPhoneCount = () => {
        setPhoneCountryInput(false);  // 取消禁用状态
        setTimeout(() => {
            phoneCountryInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };


    const editPhoneNumber = () => {
        setPhoneNumberInput(false);  // 取消禁用状态
        setTimeout(() => {
            phoneNumberInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editFirstName = () => {
        setFirstNameInput(false);  // 取消禁用状态
        setTimeout(() => {
            firstNameInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editCountry = () => {
        setCountryInput(false);  // 取消禁用状态
        setTimeout(() => {
            countryInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };


    const editMiddleName = () => {
        setMiddleNameInput(false);  // 取消禁用状态
        setTimeout(() => {
            middleNameInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editLastName = () => {
        setLastNameInput(false);  // 取消禁用状态
        setTimeout(() => {
            lastNameInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };


    const showBtnFunc = () => {
        if (inputVal.email !== '' && inputVal.idNo !== '' && inputVal.address !== '' && inputVal.city !== '' && inputVal.state !== '' && inputVal.country !== '' && inputVal.birthDate !== '' && inputVal.firstName !== '' && inputVal.phoneCountry !== '' && inputVal.phoneNumber !== '' && inputVal.idType !== '' && inputVal.idFrontUrl !== '' && inputVal.idBackUrl !== '') {
            setShowSaveBtn(false)
        } else
            setShowSaveBtn(true)
    };


    const handleChangeInputVal2 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setPhoneCountryError(true);
        } else {
            setPhoneCountryError(false);
        }
    };

    const handleChangeInputVal3 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setPhoneNumberError(true);
        } else {
            setPhoneNumberError(false);
        }
    };

    const handleChangeInputVal4 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
    };

    const handleChangeInputVal8 = (prop) => (event) => {
        if (event.target.value === '') {
            setCountryError(true);
        } else {
            setCountryError(false);
        }
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };


    const handleChangeInputVal9 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setStateError(true);
        } else {
            setStateError(false);
        }
    };

    const handleChangeInputVal10 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setCityError(true);
        } else {
            setCityError(false);
        }
    };


    const handleChangeInputVal11 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setAddressError(true);
        } else {
            setAddressError(false);
        }
    };

    const handleChangeInputVal14 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setIdNoError(true);
        } else {
            setIdNoError(false);
        }
    };

    const handleChangeInputVal15 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setIdTypeError(true);
        } else {
            setIdTypeError(false);
        }
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
        if (uploadRes.payload.url === '') {
            setIdFrontUrlError(true);
        } else {
            setIdFrontUrlError(false);
        }
    };


    const uploadChange2 = async (file) => {
        const uploadRes = await dispatch(uploadStorage({
            file: file
        }));
        setInputVal({ ...inputVal, [keyName]: uploadRes.payload.url });
        if (uploadRes.payload.url === '') {
            setIdBackUrlError(true);
        } else {
            setIdBackUrlError(false);
        }
    };


    //刷新KYC
    const refreshKycInfo = () => {
        dispatch(getKycInfo()).then((value) => {
            let resultData = { ...value.payload.data };
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

    const onSave = () => {
        if (inputVal.email !== undefined && inputVal.idNo !== undefined && inputVal.address !== undefined && inputVal.city !== undefined && inputVal.state !== undefined && inputVal.country !== undefined && inputVal.firstName !== undefined && inputVal.phoneCountry !== undefined && inputVal.phoneNumber !== undefined && inputVal.idType !== undefined && inputVal.idFrontUrl !== undefined && inputVal.idBackUrl !== undefined) {
            if (inputVal.email !== '' && inputVal.idNo !== '' && inputVal.address !== '' && inputVal.city !== '' && inputVal.state !== '' && inputVal.country !== '' && inputVal.firstName !== '' && inputVal.phoneCountry !== '' && inputVal.phoneNumber !== '' && inputVal.idType !== '' && inputVal.idFrontUrl !== '' && inputVal.idBackUrl !== '') {
                dispatch(updateKycInfo(inputVal)).then(
                    (value) => {
                        if (value.payload) {
                            refreshKycInfo();
                            dispatch(showMessage({ message: "Success", code: 1 }));
                        }
                    }
                );
            } else {
                dispatch(showMessage({ message: t('card_222'), code: 2 }));
            }
        } else {
            dispatch(showMessage({ message: t('card_222'), code: 2 }));
        }
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

    useEffect(() => {
        if (user.profile?.nation) {
            handleChangeApproveDataVal('nationCode', user.profile?.nation)
        }
    }, [user.profile]);

    // useEffect(() => {
    //     setPageState(1);
    //     if (kycInfo.init) {
    //         if (!kycInfo.havePhone() && !kycInfo.haveEmail()) {
    //             setOpenAnimateModal(true)
    //         } else {
    //             if (kycInfo.havePhone()) {
    //                 setPageState(2);
    //                 setTabValue(1);
    //             } else if (kycInfo.haveEmail()) {
    //                 setPageState(1);
    //             }
    //         }
    //         setOpenAnimateModal(false)
    //         let copyData = {};
    //         Object.keys(inputVal).map((prop, index) => {
    //             copyData[prop] = kycInfo[prop];
    //         });
    //         setInputVal(copyData);
    //         setPageState(0);
    //     }
    // }, [kycInfo]);

    useEffect(() => {
        if (kycInfo.init) {
            let copyData = {};
            Object.keys(inputVal).map((prop, index) => {
                copyData[prop] = kycInfo[prop];
            });
            setInputVal(copyData);
            changeBiState(copyData);
        }
    }, [kycInfo]);





    return (
        <>
            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="tongYongChuang4"
                    style={{ margin: "20px auto " }}
                >
                    <Box
                        component={motion.div}
                        variants={item}
                        className="w-full rounded-16 border mb-28 flex flex-col "
                        sx={{ border: 'none' }}
                    >
                        <div className="flex items-center justify-between ">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_27')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Email"
                                    value={inputVal.email}
                                    onChange={handleChangeInputVal('email')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ 'aria-label': 'email' }}
                                    error={emailError}
                                    onBlur={handleBlur}
                                    disabled={emailInput}
                                    inputRef={emailInputRef}
                                    endAdornment={
                                        emailInputShow && <InputAdornment onClick={() => editEmail()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {emailError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_2')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="PhoneCountry"
                                    value={inputVal.phoneCountry}
                                    onChange={handleChangeInputVal2('phoneCountry')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'phoneCountry',
                                    }}
                                    error={phoneCountryError}
                                    onBlur={handleBlur2}
                                    disabled={phoneCountryInput}
                                    inputRef={phoneCountryInputRef}
                                    endAdornment={
                                        phoneCountryInputShow && <InputAdornment onClick={() => editPhoneCount()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {phoneCountryError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_3')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="PhoneNumber"
                                    value={inputVal.phoneNumber}
                                    onChange={handleChangeInputVal3('phoneNumber')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'phoneNumber',
                                    }}
                                    error={phoneNumberError}
                                    onBlur={handleBlur3}
                                    disabled={phoneNumberInput}
                                    inputRef={phoneNumberInputRef}
                                    endAdornment={
                                        phoneNumberInputShow && <InputAdornment onClick={() => editPhoneNumber()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {phoneNumberError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_4')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="FirstName"
                                    value={inputVal.firstName}
                                    onChange={handleChangeInputVal4('firstName')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'firstName',
                                    }}
                                    error={firstNameError}
                                    onBlur={handleBlur4}
                                    disabled={firstNameInput}
                                    inputRef={firstNameInputRef}
                                    endAdornment={
                                        firstNameInputShow && <InputAdornment onClick={() => editFirstName()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {firstNameError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_5')} </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="MiddleName"
                                    value={inputVal.middleName}
                                    onChange={handleChangeInputVal('middleName')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'middleName',
                                    }}
                                    onBlur={handleBlur5}
                                    disabled={middleNameInput}
                                    inputRef={middleNameInputRef}
                                    endAdornment={
                                        middleNameInputShow && <InputAdornment onClick={() => editMiddleName()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_6')} </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="LastName"
                                    value={inputVal.lastName}
                                    onChange={handleChangeInputVal('lastName')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'lastName',
                                    }}
                                    onBlur={handleBlur6}
                                    disabled={lastNameInput}
                                    inputRef={lastNameInputRef}
                                    endAdornment={
                                        lastNameInputShow && <InputAdornment onClick={() => editLastName()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
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
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel htmlFor="outlined-adornment-address">{t('kyc_8')}*</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="country"
                                    value={inputVal.country}
                                    onChange={handleChangeInputVal8('country')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'country',
                                    }}
                                    error={countryError}
                                    onBlur={handleBlur8}
                                    disabled={countryInput}
                                    inputRef={countryInputRef}
                                    endAdornment={
                                        countryInputShow && <InputAdornment onClick={() => editCountry()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {countryError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_9')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="State"
                                    value={inputVal.state}
                                    onChange={handleChangeInputVal9('state')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'state',
                                    }}
                                    error={stateError}
                                    onBlur={handleBlur9}
                                />
                                {stateError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_10')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="City"
                                    value={inputVal.city}
                                    onChange={handleChangeInputVal10('city')}
                                    aria-describedby="outlined-weight-helper-text"
                                    error={cityError}
                                    onBlur={handleBlur10}
                                    inputProps={{
                                        'aria-label': 'city',
                                    }}
                                />
                                {cityError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_11')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Address"
                                    value={inputVal.address}
                                    onChange={handleChangeInputVal11('address')}
                                    aria-describedby="outlined-weight-helper-text"
                                    error={addressError}
                                    onBlur={handleBlur11}
                                    inputProps={{
                                        'aria-label': 'address',
                                    }}
                                />
                                {addressError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_12')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="AddressTwo"
                                    value={inputVal.addressTwo}
                                    onChange={handleChangeInputVal('addressTwo')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'addressTwo',
                                    }}
                                />
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_13')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="Zipcode"
                                    value={inputVal.zipcode}
                                    onChange={handleChangeInputVal('zipcode')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'zipcode',
                                    }}
                                />
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_14')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="IdNo"
                                    value={inputVal.idNo}
                                    onChange={handleChangeInputVal14('idNo')}
                                    error={idNoError}
                                    onBlur={handleBlur14}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'idNo',
                                    }}
                                />
                                {idNoError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel id="demo-simple-select-label">{t('kyc_15')} *</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inputVal.idType}
                                    label="IdType"
                                    onChange={handleChangeInputVal15('idType')}
                                    error={idTypeError}
                                    onBlur={handleBlur15}
                                >
                                    <MenuItem value={'id_card'}>{t('Kyc_36')}</MenuItem>{/*身份证*/}
                                    <MenuItem value={'passport'}>{t('Kyc_37')}</MenuItem>{/*护照*/}
                                    <MenuItem value={'dl'}>{t('Kyc_38')}</MenuItem>{/*驾照*/}
                                    <MenuItem value={'residence_permit'}>{t('Kyc_39')}</MenuItem>{/*居住证*/}
                                </Select>
                                {idTypeError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>


                        <div className="flex items-center justify-between mb-24 ">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                <InputLabel id="demo-simple-select-label">{t('kyc_20')}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="UsSsn"
                                    value={inputVal.usSsn}
                                    onChange={handleChangeInputVal('usSsn')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'usSsn',
                                    }}
                                />
                            </FormControl>
                        </div>

                        <div className="mb-24">
                            <Typography className="text-16 upload-title">
                                {t('kyc_16')}*
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
                                            onBlur={handleBlur16}
                                        />
                                    </Box>
                                </div>
                            </div>
                            {idFrontUrlError && (
                                <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                            )}
                        </div>

                        <div className="mb-24">
                            <Typography className="text-16 upload-title">
                                {t('kyc_17')}*
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
                                            onChange={(e) => { uploadChange2(e.target.files[0]) }}
                                            onBlur={handleBlur17}
                                        />
                                    </Box>
                                </div>
                            </div>
                            {idBackUrlError && (
                                <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                            )}
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

                        <div className='flex justify-between' style={{ height: "70px" }}>
                            <Button
                                disabled={showSaveBtn}
                                className="text-lg btnColorTitleBig button-reset2"
                                color="secondary"
                                variant="contained"
                                style={{ fontSize: "1.6rem", width: "100%" }}
                                onClick={() => { onSave() }}
                            >
                                {t('kyc_22')}
                            </Button>
                        </div>
                    </Box>
                </motion.div>

                <AnimateModal
                    className="faBiDiCard tanChuanDiSe"
                    open={openAnimateModal}
                    onClose={() => setOpenAnimateModal(false)}
                >
                    <div className='flex justify-center' style={{ width: "100%" }}>
                        <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                        <div className='TanHaoCardZi '>
                            {t('kyc_26')}
                        </div>
                    </div>

                    <Box
                        className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard"
                        sx={{
                            backgroundColor: "#2C394D",
                            padding: "1.5rem",
                            overflow: "hidden",
                            margin: "1rem auto 0rem auto"
                        }}
                    >
                        <div className="dialog-select-fiat danChuangTxt">
                            {t('kyc_60')}
                        </div>
                    </Box>

                    <div className='flex mt-12 mb-28 px-15 justify-between' >
                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn"
                            color="secondary"
                            loading={false}
                            variant="contained"
                            onClick={() => {
                                setOpenAnimateModal(false)
                            }}
                        >
                            {t('card_167')}
                        </LoadingButton>


                        <LoadingButton
                            disabled={false}
                            className="boxCardBtn"
                            color="secondary"
                            loading={false}
                            variant="contained"
                            onClick={() => {
                                setOpenAnimateModal(false)
                                props.backCardPage()
                            }}
                        >
                            {t('home_pools_15')}
                        </LoadingButton>
                    </div>
                </AnimateModal>
            </div>
        </>

    )
}

export default Kyc;
