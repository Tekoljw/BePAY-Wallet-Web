import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector} from 'react-redux';
import {
    bindPhone,
    changePhone, sendSms, getUserData
} from '../../store/user/userThunk';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {default as React, useEffect, useRef, useState} from "react";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import phoneCode from "../../../phone/phoneCode";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import history from "../../../@history/@history";
import { selectUserData } from "../../store/user";
import { showMessage } from 'app/store/fuse/messageSlice';

/**
 * Form Validation Schema
 */


const defaultValues = {
    nationCode: '',
    phone: '',
    smsCode: '',
    password: ''
};

function RetiedPhone() {
    const { t } = useTranslation('mainPage');
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const schema = yup.object().shape({
        nationCode: yup.string().required('You must enter your nationCode'),
        phone: yup.string().required('You must enter a phone'),
        smsCode: yup.string().required('You must enter a smsCode'),
        password: yup
            .string()
            .required('Please enter your password.')
            .min(6,t("signUp_8"))
            // .min(6, 'Password is too short - should be 6 chars minimum.')
            .max(16, 'Password is too long - should be 16 chars maximum.'),
    });
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    const dispatch = useDispatch();

    const [ tmpPhoneCode, setTmpPhoneCode ] = useState('');
    const userData = useSelector(selectUserData);

    const [time,setTime] = useState(null);
    const timeRef = useRef();
    //倒计时
    useEffect(()=>{
        if(time && time !== 0)
            timeRef.current = setTimeout(() => {
                setTime(time => time - 1)
            },1000);

        return () => {
            clearTimeout(timeRef.current)
        }
    },[time]);

    async function sendCode() {
        setSelectedCountryCode(control._formValues.nationCode);
        const data = {
            codeType: 5,
            nationCode: control._formValues.nationCode,
            phone: control._formValues.phone,
        };
        const sendRes = await dispatch(sendSms(data));
        if (sendRes.payload) {
            setTime(60)
        }
    }

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    async function onSubmit() {
        if(userData && userData.userInfo && userData.userInfo.bindMobile){
            await dispatch(changePhone(control._formValues));
        }else{
            await dispatch(bindPhone(control._formValues)).then((res) => {
                let result = res.payload;
                if (result.errno === 0) {
                    dispatch(showMessage({ message: 'Success', code: 1 }));
                    dispatch(getUserData());
                } else {
                    dispatch(showMessage({ message: result.errmsg, code: 2 }));
                }
            });
        }
    }

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0"
        >
            <Paper
                className="w-full tongYongChuang4 flex justify-content-center"
                style={{
                    background: "#1e293b"
                }}
            >
                <div className="w-full  mx-auto sm:mx-0">
    

                    { userData && userData.userInfo && userData.userInfo.bindMobile &&  <div className="flex items-baseline mt-2 font-medium">
                            <Typography>{t('re_tied_phone_2')}</Typography>
                            {/*<Link className="ml-4" to="/login">*/}
                            {/*    Sign in*/}
                            {/*</Link>*/}
                        </div>
                    }

                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(onSubmit)}
                    >
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
                                    getOptionLabel={(option) => {return control._formValues.nationCode}}
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
                                <FormControl  variant="outlined" className="mb-24">
                                    <InputLabel
                                        style={{
                                            color: !!errors.phone && '#f44336'
                                        }}
                                    >Phone*</InputLabel>
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
                                                {time <=0 && <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={sendCode}
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

                        <div style={{ textAlign: "center"}}>
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
                            // disabled={_.isEmpty(dirtyFields) || !isValid}
                            disabled={
                                _.isEmpty(dirtyFields) ||
                                !isValid ||
                                (selectedCountryCode !== "" && selectedCountryCode !== control._formValues.nationCode)
                              }
                            type="submit"
                            size="large"
                        >
                            {t('re_tied_phone_3')}
                        </Button>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default RetiedPhone;
