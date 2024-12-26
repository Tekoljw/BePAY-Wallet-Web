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
import { userProfile } from '../../store/user/userThunk';
import { uploadStorage } from "../../store/tools/toolThunk";
import { getKycInfo, updateKycInfo, submitKycInfo, kycAddress } from "app/store/payment/paymentThunk";
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
import { width } from '@mui/system';

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
    const [tmpPhoneCode, setTmpPhoneCode] = useState('');
    let baseImgUrl = "";
    if (config.system.cdnUrl) {
        baseImgUrl = config.system.cdnUrl.substr(0, config.system.cdnUrl.length - 1);
    }

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
        zipCode: '',
        defaultAddressInfo: '',
        userAddressTwo: {},
        userAddressThree: {},
    });

    //获取示例数据
    const onSubmitKycAddress = async () => {
        await dispatch(kycAddress({
        })).then((res) => {
            let result = res.payload;
            if (result.errno === 0) {
                let resultData = res.payload.data;
                setInputVal({ ...inputVal, country: resultData.country, state: resultData.state, city: resultData.city, address: resultData.street, zipCode: resultData.zip });
                setTimeout(() => {
                    setClickShiLi(true);
                    setCountryInput(true);
                    setCountryInputShow(true);
                    setStateInput(true);
                    setStateInputShow(true);
                    setCityInput(true);
                    setCityInputShow(true);
                    setAddressInput(true);
                    setAddressInputShow(true);
                    setZipCodeInput(true);
                    setZipCodeInputShow(true);
                }, 0);
            }
        });
    };

    const [keyName, setKeyName] = useState('');
    const [idTypeError, setIdTypeError] = useState(false);
    const [idNoError, setIdNoError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [zipcodeError, setZipcodeError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [countryError, setCountryError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [phoneCountryError, setPhoneCountryError] = useState(false);
    const [idFrontUrlError, setIdFrontUrlError] = useState(false);
    const [idBackUrlError, setIdBackUrlError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(true);
    const [clickShiLi, setClickShiLi] = useState(false);
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

    const [stateInput, setStateInput] = useState(false);
    const [stateInputShow, setStateInputShow] = useState(false);
    const stateInputRef = useRef(null);

    const [cityInput, setCityInput] = useState(false);
    const [cityInputShow, setCityInputShow] = useState(false);
    const cityInputRef = useRef(null);

    const [addressInput, setAddressInput] = useState(false);
    const [addressInputShow, setAddressInputShow] = useState(false);
    const addressInputRef = useRef(null);

    const [addressTwoInput, setAddressTwoInput] = useState(false);
    const [addressTwoInputShow, setAddressTwoInputShow] = useState(false);
    const addressTwoInputRef = useRef(null);


    const [zipCodeInput, setZipCodeInput] = useState(false);
    const [zipCodeInputShow, setZipCodeInputShow] = useState(false);
    const zipCodeInputRef = useRef(null);


    const [idNoInput, setIdNoInput] = useState(false);
    const [idNoInputShow, setIdNoInputShow] = useState(false);
    const idNoInputRef = useRef(null);

    const [usSsnInput, setUsSsnInput] = useState(false);
    const [usSsnInputShow, setUsSsnInputShow] = useState(false);
    const usSsnInputRef = useRef(null);
    const [addressKyc, setAddressKyc] = useState(1);

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

        if (copyData.state) {
            setStateInput(true)
            setStateInputShow(true)
        } else {
            setStateInput(false)
            setStateInputShow(false)
        }

        if (copyData.city) {
            setCityInput(true)
            setCityInputShow(true)
        } else {
            setCityInput(false)
            setCityInputShow(false)
        }

        if (copyData.address) {
            setAddressInput(true)
            setAddressInputShow(true)
        } else {
            setAddressInput(false)
            setAddressInputShow(false)
        }

        if (copyData.addressTwo) {
            setAddressTwoInput(true)
            setAddressTwoInputShow(true)
        } else {
            setAddressTwoInput(false)
            setAddressTwoInputShow(false)
        }

        if (copyData.zipCode) {
            setZipCodeInput(true)
            setZipCodeInputShow(true)
        } else {
            setZipCodeInput(false)
            setZipCodeInputShow(false)
        }

        if (copyData.idNo) {
            setIdNoInput(true)
            setIdNoInputShow(true)
        } else {
            setIdNoInput(false)
            setIdNoInputShow(false)
        }

        if (copyData.usSsn) {
            setUsSsnInput(true)
            setUsSsnInputShow(true)
        } else {
            setUsSsnInput(false)
            setUsSsnInputShow(false)
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
        if (inputVal.lastName === '') {
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }
        if (inputVal.country === '') {
            setCountryError(true);
        } else {
            setCountryError(false);
        }
        if (inputVal.state === '') {
            setStateError(true);
        } else {
            setStateError(false);
        }
        if (inputVal.city === '') {
            setCityError(true);
        } else {
            setCityError(false);
        }
        if (inputVal.address === '') {
            setAddressError(true);
        } else {
            setAddressError(false);
        }
        if (inputVal.zipCode === '') {
            setZipcodeError(true);
        } else {
            setZipcodeError(false);
        }
        if (inputVal.idNo === '') {
            setIdNoError(true);
        } else {
            setIdNoError(false);
        }

        showBtnFunc();//显示保存按钮

        if (inputVal.country != '' && inputVal.state != '' && inputVal.city != '' && inputVal.address != '' && inputVal.zipCode != '') {
            setClickShiLi(true);//不显示示例按钮
        } else {
            setClickShiLi(false);
        }
        if (inputVal.country === undefined && inputVal.state === undefined && inputVal.city === undefined && inputVal.address === undefined && inputVal.zipCode === undefined) {
            setClickShiLi(false);//显示示例按钮
        }
        if (inputVal.defaultAddressInfo === 2 || inputVal.defaultAddressInfo === 3) {
            addAddressTwoOrThree()
        }
    }, [inputVal]);


    const addAddressTwoOrThree = () => {
        inputVal.userAddressTwo = {
            country: inputVal.country,
            city: inputVal.city,
            state: inputVal.state,
            address: inputVal.address,
            zipCode: inputVal.zipCode,
        }
    };


    const handleBlur = () => {
        if (inputVal.email === '') {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
        if (inputVal.email) {
            setEmailInputShow(true) // 判断当前输入框是否有笔标
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
            middleNameInputRef.current.blur();// 取消到输入框
        } else {
            setMiddleNameInput(false)
            setMiddleNameInputShow(false)
        }
    };
    const handleBlur6 = () => {
        if (inputVal.lastName === '') {
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }
        if (inputVal.lastName) {
            setLastNameInput(true)
            setLastNameInputShow(true)
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
    };

    const handleBlur9 = () => {
        if (inputVal.state === '') {
            setStateError(true);
        } else {
            setStateError(false);
        }
        if (inputVal.state) {
            setStateInput(true)
            setStateInputShow(true)
            stateInputRef.current.blur();// 取消到输入框
        } else {
            setStateInput(false)
            setStateInputShow(false)
        }
    };

    const handleBlur10 = () => {
        if (inputVal.city === '') {
            setCityError(true);
        } else {
            setCityError(false);
        }

        if (inputVal.city) {
            setCityInput(true)
            setCityInputShow(true)
            cityInputRef.current.blur();// 取消到输入框
        } else {
            setCityInput(false)
            setCityInputShow(false)
        }
    };

    const handleBlur11 = () => {
        if (inputVal.address === '') {
            setAddressError(true);
        } else {
            setAddressError(false);
        }
        if (inputVal.address) {
            setAddressInput(true)
            setAddressInputShow(true)
            addressInputRef.current.blur();// 取消到输入框
        } else {
            setAddressInput(false)
            setAddressInputShow(false)
        }
    };

    const handleBlur12 = () => {
        if (inputVal.addressTwo) {
            setAddressTwoInput(true)
            setAddressTwoInputShow(true)
            addressTwoInputRef.current.blur();// 取消到输入框
        } else {
            setAddressTwoInput(false)
            setAddressTwoInputShow(false)
        }
    };

    const handleBlur13 = () => {

        if (inputVal.zipCode === '') {
            setZipcodeError(true);
        } else {
            setZipcodeError(false);
        }

        if (inputVal.zipCode) {
            setZipCodeInput(true)
            setZipCodeInputShow(true)
            zipCodeInputRef.current.blur();// 取消到输入框
        } else {
            setZipCodeInput(false)
            setZipCodeInputShow(false)
        }
    };

    const handleBlur14 = () => {
        if (inputVal.idNo === '') {
            setIdNoError(true);
        } else {
            setIdNoError(false)
        }
        if (inputVal.idNo) {
            setIdNoInput(true)
            setIdNoInputShow(true)
            idNoInputRef.current.blur();// 取消到输入框
        } else {
            setIdNoInput(false)
            setIdNoInputShow(false)
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

    const handleBlur22 = () => {
        if (inputVal.usSsn) {
            setUsSsnInput(true)
            setUsSsnInputShow(true)
            usSsnInputRef.current.blur();// 取消到输入框
        } else {
            setUsSsnInput(false)
            setUsSsnInputShow(false)
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

    const editState = () => {
        setStateInput(false);  // 取消禁用状态
        setTimeout(() => {
            stateInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editCity = () => {
        setCityInput(false);  // 取消禁用状态
        setTimeout(() => {
            cityInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editAddress = () => {
        setAddressInput(false);  // 取消禁用状态
        setTimeout(() => {
            addressInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editAddressTwo = () => {
        setAddressTwoInput(false);  // 取消禁用状态
        setTimeout(() => {
            addressTwoInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editZipCode = () => {
        setZipCodeInput(false);  // 取消禁用状态
        setTimeout(() => {
            zipCodeInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editIdNo = () => {
        setIdNoInput(false);  // 取消禁用状态
        setTimeout(() => {
            idNoInputRef.current.focus();  // 聚焦到输入框
        }, 0);
    };

    const editUsSsn = () => {
        setUsSsnInput(false);  // 取消禁用状态
        setTimeout(() => {
            usSsnInputRef.current.focus();  // 聚焦到输入框
        }, 0);
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

    const handleChangeInputVal6 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setLastNameError(true);
        } else {
            setLastNameError(false);
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

    const handleChangeInputVal13 = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (event.target.value === '') {
            setZipcodeError(true);
        } else {
            setZipcodeError(false);
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

    const handleChangeInputVal16 = (event) => {
        setAddressKyc(event.target.value);
        if (event.target.value === 1) {
            if (kycInfo) {
                setInputVal(prevState => ({
                    ...prevState,
                    country: kycInfo.country ? kycInfo.country : '',
                    state: kycInfo.state ? kycInfo.state : '',
                    city: kycInfo.city ? kycInfo.city : '',
                    address: kycInfo.address ? kycInfo.address : '',
                    zipCode: kycInfo.zipCode ? kycInfo.zipCode : '',
                    defaultAddressInfo: event.target.value
                }));
            }
            if (inputVal.country != '' && inputVal.state != '' && inputVal.city != '' && inputVal.address != '' && inputVal.zipCode != '') {
                setClickShiLi(true);//显示示例按钮
            } else {
                setClickShiLi(false);
            }
        } else if (event.target.value === 2) {
            if (kycInfo) {
                if (kycInfo.userAddressTwo != null) {
                    setInputVal(prevState => ({
                        ...prevState,
                        country: kycInfo.userAddressTwo.country ? kycInfo.userAddressTwo.country : '',
                        state: kycInfo.userAddressTwo.state ? kycInfo.userAddressTwo.state : '',
                        city: kycInfo.userAddressTwo.city ? kycInfo.userAddressTwo.city : '',
                        address: kycInfo.userAddressTwo.address ? kycInfo.userAddressTwo.address : '',
                        zipCode: kycInfo.userAddressTwo.zipCode ? kycInfo.userAddressTwo.zipCode : '',
                        defaultAddressInfo: event.target.value
                    }));
                    setClickShiLi(true);
                } else {
                    setInputVal(prevState => ({
                        ...prevState,
                        country: '',
                        state: '',
                        city: '',
                        address: '',
                        zipCode: '',
                        defaultAddressInfo: event.target.value
                    }));
                    setClickShiLi(false);
                }
            }
        } else if (event.target.value === 3) {
            if (kycInfo) {
                if (kycInfo.userAddressThree != null) {
                    setInputVal(prevState => ({
                        ...prevState,
                        country: kycInfo.userAddressThree.country ? kycInfo.userAddressThree.country : '',
                        state: kycInfo.userAddressThree.state ? kycInfo.userAddressThree.state : '',
                        city: kycInfo.userAddressThree.city ? kycInfo.userAddressThree.city : '',
                        address: kycInfo.userAddressThree.address ? kycInfo.userAddressThree.address : '',
                        zipCode: kycInfo.userAddressThree.zipCode ? kycInfo.userAddressThree.zipCode : '',
                        defaultAddressInfo: event.target.value
                    }));
                    setClickShiLi(true);
                } else {
                    setInputVal(prevState => ({
                        ...prevState,
                        country: '',
                        state: '',
                        city: '',
                        address: '',
                        zipCode: '',
                        defaultAddressInfo: event.target.value
                    }));
                    setClickShiLi(false);
                }
            }
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

    const isCanSave = (bShowMsg) => {
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

    //上传正面图片
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

    //上传反面图片
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

    //是否显示保存按钮
    const showBtnFunc = () => {
        if (inputVal.email !== '' && inputVal.idNo !== '' && inputVal.address !== '' && inputVal.zipCode !== '' && inputVal.city !== '' && inputVal.state !== '' && inputVal.country !== '' && inputVal.birthDate !== '' && inputVal.firstName !== '' && inputVal.lastName !== '' && inputVal.phoneCountry !== '' && inputVal.phoneNumber !== '' && inputVal.idType !== '' && inputVal.idFrontUrl !== '' && inputVal.idBackUrl !== '') {
            setShowSaveBtn(false)
        } else
            setShowSaveBtn(true)
    };

    //保存信息
    const onSave = () => {
        if (inputVal.email !== undefined && inputVal.idNo !== undefined && inputVal.address !== undefined && inputVal.zipCode !== undefined && inputVal.city !== undefined && inputVal.state !== undefined && inputVal.country !== undefined && inputVal.firstName !== undefined && inputVal.lastName !== undefined && inputVal.phoneCountry !== undefined && inputVal.phoneNumber !== undefined && inputVal.idType !== undefined && inputVal.idFrontUrl !== undefined && inputVal.idBackUrl !== undefined) {
            if (inputVal.email !== '' && inputVal.idNo !== '' && inputVal.address !== '' && inputVal.zipCode !== '' && inputVal.city !== '' && inputVal.state !== '' && inputVal.country !== '' && inputVal.firstName !== '' && inputVal.lastName !== '' && inputVal.phoneCountry !== '' && inputVal.phoneNumber !== '' && inputVal.idType !== '' && inputVal.idFrontUrl !== '' && inputVal.idBackUrl !== '') {
                if (inputVal.defaultAddressInfo == 2) {
                    inputVal.userAddressTwo = JSON.stringify(
                        {
                            country: inputVal.country,
                            city: inputVal.city,
                            state: inputVal.state,
                            address: inputVal.address,
                            zipCode: inputVal.zipCode,
                        }
                    )
                } else if (inputVal.defaultAddressInfo == 3) {
                    inputVal.userAddressThree = JSON.stringify(
                        {
                            country: inputVal.country,
                            city: inputVal.city,
                            state: inputVal.state,
                            address: inputVal.address,
                            zipCode: inputVal.zipCode,
                        }
                    )
                }
                dispatch(updateKycInfo(inputVal)).then(
                    (value) => {
                        if (value.payload) {
                            // refreshKycInfo();
                            dispatch(showMessage({ message: "Success", code: 1 }));
                            props.updatedKycInfo();
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


    //刷新KYC
    const refreshKycInfo = () => {
        dispatch(getKycInfo()).then((value) => {
            let resultData = { ...value.payload.data };
            if (!resultData || Object.entries(resultData).length < 1) return;
            let copyData = {};
            Object.keys(inputVal).map((prop, index) => {
                copyData[prop] = resultData[prop];
            });
            setInputVal(copyData);//重新填充数据
        });
    };

    //KYC数据发生改变后填充数据
    useEffect(() => {
        if (kycInfo.init) {
            let copyData = {};
            Object.keys(inputVal).map((prop, index) => {
                copyData[prop] = kycInfo[prop];
            });
            changeBiState(copyData);
            if (kycInfo.defaultAddressInfo === 1) {
                setAddressKyc(1);
                setInputVal(copyData);
            } else if (kycInfo.defaultAddressInfo === 2) {
                setAddressKyc(2);
                setInputVal(copyData);
                setTimeout(() => {
                    if (kycInfo.userAddressTwo != null) {
                        setInputVal(prevState => ({
                            ...prevState,
                            country: kycInfo.userAddressTwo.country ? kycInfo.userAddressTwo.country : '',
                            state: kycInfo.userAddressTwo.state ? kycInfo.userAddressTwo.state : '',
                            city: kycInfo.userAddressTwo.city ? kycInfo.userAddressTwo.city : '',
                            address: kycInfo.userAddressTwo.address ? kycInfo.userAddressTwo.address : '',
                            zipCode: kycInfo.userAddressTwo.zipCode ? kycInfo.userAddressTwo.zipCode : '',
                            defaultAddressInfo: 2
                        }));
                        setClickShiLi(true);
                    } else {
                        setInputVal({ ...inputVal, country: '', state: '', city: '', address: '', zipCode: '', defaultAddressInfo: 2 });
                        setClickShiLi(false);
                    }
                }, 0);
            } else if (kycInfo.defaultAddressInfo === 3) {
                setAddressKyc(3);
                setInputVal(copyData);
                setTimeout(() => {
                    if (kycInfo.userAddressThree != null) {
                        setInputVal(prevState => ({
                            ...prevState,
                            country: kycInfo.userAddressThree.country ? kycInfo.userAddressThree.country : '',
                            state: kycInfo.userAddressThree.state ? kycInfo.userAddressThree.state : '',
                            city: kycInfo.userAddressThree.city ? kycInfo.userAddressThree.city : '',
                            address: kycInfo.userAddressThree.address ? kycInfo.userAddressThree.address : '',
                            zipCode: kycInfo.userAddressThree.zipCode ? kycInfo.userAddressThree.zipCode : '',
                            defaultAddressInfo: 3
                        }));
                        setClickShiLi(true);
                    } else {
                        setInputVal({ ...inputVal, country: '', state: '', city: '', address: '', zipCode: '', defaultAddressInfo: 3 });
                        setClickShiLi(false);
                    }
                }, 0);
            }
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
                                    inputProps={{ 'aria-label': 'phoneCountry' }}
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
                                <InputLabel id="demo-simple-select-label">{t('kyc_6')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-address"
                                    label="LastName"
                                    value={inputVal.lastName}
                                    onChange={handleChangeInputVal6('lastName')}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'lastName',
                                    }}
                                    onBlur={handleBlur6}
                                    error={lastNameError}
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
                                {lastNameError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>)}
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-between">
                            <Stack
                                sx={{ width: '100%', borderColor: '#94A3B8' }}
                                spacing={3}
                                className="mb-16"
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

                        <div className="flex items-center justify-between mt-8">
                            <div style={{ position: "relative", width: '100%' }}>
                                <div style={{ position: "absolute", width: '100%' }}>
                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} className="mb-24">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={addressKyc}
                                            onChange={handleChangeInputVal16}
                                            className='addressKyc'
                                        >
                                            <MenuItem value={1}>{t('kyc_68')}</MenuItem>
                                            <MenuItem value={2}>{t('kyc_69')}</MenuItem>
                                            <MenuItem value={3}>{t('kyc_70')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div style={{ position: "absolute", right: "0%", marginTop: '5px', marginRight: "36px" }}>
                                    {
                                        !clickShiLi && <IconButton onClick={() => onSubmitKycAddress()}>
                                            <div className='px-8' style={{ backgroundColor: "#374252", minWidth: "50px", color: "#ffffff", fontSize: "12px", lineHeight: "26px", height: "26px", borderRadius: "50px" }}>
                                                {t('kyc_71')}
                                            </div>
                                        </IconButton>
                                    }
                                </div>
                            </div>
                        </div>


                        <div className="mb-24" style={{ marginTop: "76px" }}>
                            <Autocomplete
                                options={phoneCode.list}
                                autoHighlight
                                value={phoneCode.list.find(option => option.country_code === inputVal.country) || null}
                                onInputChange={(event, newInputValue) => {
                                    setTmpPhoneCode(newInputValue.replace(/\+/g, ""));
                                }}
                                filterOptions={(options) => {
                                    const reg = new RegExp(tmpPhoneCode, 'i');
                                    const array = options.filter((item) => {
                                        return reg.test(item.country_code) || reg.test(item.local_name)
                                    });
                                    return array;
                                }}
                                onChange={(event, option) => {
                                    if (option) {
                                        setInputVal(prevState => ({
                                            ...prevState,
                                            country: option.country_code ? option.country_code : '',
                                        }));
                                    }
                                }}
                                error={countryError}
                                onBlur={handleBlur8}
                                getOptionLabel={(option) => option.country_code}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`/wallet/assets/images/country/${option.country_code}.png`}
                                            alt=""
                                        />
                                        <span style={{ color: "#94A3B8" }}>{option.local_name}</span>&nbsp;&nbsp;{option.country_code}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        label={t('kyc_8') + " *"}
                                        {...params}
                                        inputProps={{ ...params.inputProps }}
                                    />
                                )}
                            />
                            {countryError && (<FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' style={{ marginLeft: "14px" }} > {t('kyc_41')}</FormHelperText>)}
                        </div>



                        {/* <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-24">
                                <InputLabel htmlFor="outlined-adornment-country">{t('kyc_8')}*</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-country"
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
                                        <InputAdornment position="end" className='flex justify-end' style={{ width: "160px", }}>
                                            {
                                                !clickShiLi && <IconButton edge="end" onClick={() => onSubmitKycAddress()}>
                                                    <div className='px-5' style={{ backgroundColor: "#374252", minWidth: "50px", color: "#ffffff", fontSize: "12px", lineHeight: "26px", height: "26px", borderRadius: "50px" }}>
                                                        {t('kyc_71')}
                                                    </div>
                                                </IconButton>
                                            }
                                            {
                                                countryInputShow && <IconButton edge="end" onClick={() => editCountry()} style={{ marginLeft: "5px" }}>
                                                    <img src="wallet/assets/images/kyc/bianJiBi.png"
                                                        style={{ width: '24px', height: '24px' }}
                                                    />
                                                </IconButton>
                                            }
                                        </InputAdornment>
                                    }
                                />
                                {countryError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div> */}


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
                                    disabled={stateInput}
                                    inputRef={stateInputRef}
                                    endAdornment={
                                        stateInputShow && <InputAdornment onClick={() => editState()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
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
                                    disabled={cityInput}
                                    inputRef={cityInputRef}
                                    endAdornment={
                                        cityInputShow && <InputAdornment onClick={() => editCity()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {cityError && (
                                    <FormHelperText id="outlined-weight-helper-text" className='redHelpTxt' > {t('kyc_41')}</FormHelperText>
                                )}
                            </FormControl>
                        </div>


                        <div className="flex items-center justify-between">
                            <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-16">
                                <InputLabel id="demo-simple-select-zipCode">{t('kyc_13')} *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-zipCode"
                                    label="zipCode"
                                    value={inputVal.zipCode}
                                    onChange={handleChangeInputVal13('zipCode')}
                                    aria-describedby="outlined-weight-helper-text"
                                    error={zipcodeError}
                                    inputProps={{
                                        'aria-label': 'zipCode',
                                    }}
                                    onBlur={handleBlur13}
                                    disabled={zipCodeInput}
                                    inputRef={zipCodeInputRef}
                                    endAdornment={
                                        zipCodeInputShow && <InputAdornment onClick={() => editZipCode()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
                                />
                                {zipcodeError && (
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
                                    disabled={addressInput}
                                    inputRef={addressInputRef}
                                    endAdornment={
                                        addressInputShow && <InputAdornment onClick={() => editAddress()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
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
                                    onBlur={handleBlur12}
                                    disabled={addressTwoInput}
                                    inputRef={addressTwoInputRef}
                                    endAdornment={
                                        addressTwoInputShow && <InputAdornment onClick={() => editAddressTwo()} position="end">
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
                                    disabled={idNoInput}
                                    inputRef={idNoInputRef}
                                    endAdornment={
                                        idNoInputShow && <InputAdornment onClick={() => editIdNo()} position="end">
                                            {<IconButton edge="end">
                                                <img
                                                    src="wallet/assets/images/kyc/bianJiBi.png"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </IconButton>}
                                        </InputAdornment>
                                    }
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
                                    onBlur={handleBlur22}
                                    disabled={usSsnInput}
                                    inputRef={usSsnInputRef}
                                    endAdornment={
                                        usSsnInputShow && <InputAdornment onClick={() => editUsSsn()} position="end">
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
                                style={{ paddingTop: "2px!important", paddingBottom: "2px!important", fontSize: "20px!important", width: "100%" }}
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
                    <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                        <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                        <div className='TanHaoCardZi '>
                            {t('kyc_26')}
                        </div>
                    </div>

                    <Box
                        className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                        sx={{
                            backgroundColor: "#2C394D",
                            padding: "1.5rem",
                            overflow: "hidden",
                            margin: "0rem auto 0rem auto"
                        }}
                    >
                        <div className="dialog-select-fiat danChuangTxt">
                            {t('kyc_60')}
                        </div>
                    </Box>

                    <div className='flex mt-16 mb-28 px-15 justify-between' >
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
