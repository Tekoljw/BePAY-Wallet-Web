import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import {
    changeEmail, sendEmail
} from '../../store/user/userThunk';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {default as React, useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import history from "../../../@history/@history";

/**
 * Form Validation Schema
 */


const defaultValues = {
    email: '',
    smsCode: '',
    password: '',
};

function RetiedEmail() {
    const { t } = useTranslation('mainPage');
    const schema = yup.object().shape({
        smsCode: yup.string().required('You must enter a smsCode'),
        password: yup
            .string()
            .required('Please enter your password.')
            // .min(6, 'Password is too short - should be 6 chars minimum.')
            .min(6, t("signUp_8"))
            .max(16, 'Password is too long - should be 16 chars maximum.'),
    });
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    const dispatch = useDispatch();

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

    async function sendCode() {
        const data = {
            codeType: 11,
            email: control._formValues.email,
        };
        const sendRes = await dispatch(sendEmail(data));
        if (sendRes.payload) {
            setTime(60)
        }
    }

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    async function onSubmit() {
        await dispatch(changeEmail(control._formValues));
    }

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0 "
        >
            <Paper
                className="w-full tongYongChuang4 flex justify-content-center "
            >
                <div className="w-full  mx-auto sm:mx-0">
                    <div className="flex items-baseline mt-2 font-medium">
                        <Typography>{t('re_tied_email_2')}</Typography>
                        {/*<Link className="ml-4" to="/login">*/}
                        {/*    Sign in*/}
                        {/*</Link>*/}
                    </div>

                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
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
                        />

                        <Controller
                            name="smsCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={t('signIn_8')}
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
                                changePhoneTab('wallet');
                                history.push('/wallet/home')
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
                        >
                            {t('re_tied_email_5')}
                        </Button>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default RetiedEmail;
