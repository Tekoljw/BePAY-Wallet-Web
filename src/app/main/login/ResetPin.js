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
import { useDispatch } from 'react-redux';
import { resetPass } from '../../store/user/userThunk';
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

    const { isValid, dirtyFields, errors } = formState;
    const [resetTabValue, setResetTabValue] = useState(resetTabValueParam);
    const [selectId, setSelectId] = useState(0);
    const dispatch = useDispatch();
    const [time, setTime] = useState(null);
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

    async function onSubmit() {
        await dispatch(resetPass(control._formValues));
    }

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0 "
        >
            <div
                className="tongYongChuang"
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
                        {Object.entries(["Edit PIN", 'Forget PIN']).map(([key, label]) => (
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

                {resetTabValue === 0 && <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full mt-32"
                // onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="oldPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Old PIN Code"
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
                                label="New PIN Code"
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
                                label="New PIN Code(Confirm)"
                                type="password"
                                error={!!errors.passwordConfirm}
                                helperText={errors?.passwordConfirm?.message}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        className=" w-full mt-24"
                        aria-label="Register"
                        disabled={_.isEmpty(dirtyFields) || !isValid}
                        type="submit"
                        size="large"
                    >
                        Reset your PIN Code
                    </Button>
                </form>}

                {resetTabValue === 1 &&
                    <div>
                        <div className="mt-20"> Choose verification method</div>
                        <div className='mt-10'>
                            <div
                                onClick={() => { setSelectId(0) }}
                                className={clsx('selectPin', selectId === 0 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/email.png" alt="" />
                                <div style={{ float: "left" }} className="px-6"> Email</div>
                            </div>

                            <div
                                onClick={() => { setSelectId(1) }}
                                className={clsx('selectPin', selectId === 1 && 'activePinZi')}
                            >
                                <img style={{ width: '2rem', borderRadius: '0.5rem', float: "left" }} src="wallet/assets/images/menu/phone.png" alt="" />
                                <div style={{ float: "left" }} className="px-6"> Phone</div>
                            </div>
                        </div>

                        {selectId === 0 &&
                            <div>
                                <div className=''>
                                    <Paper
                                        className="w-full tongYongChuang3 flex justify-content-center "
                                    >
                                        <div className="w-full  mx-auto sm:mx-0">
                                            <form
                                                name="registerForm"
                                                noValidate
                                                className="flex flex-col justify-center w-full mt-32"
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

                                                <div className="py-20">
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
                                                    Reset
                                                </Button>
                                            </form>
                                        </div>
                                    </Paper>
                                </div>
                            </div>
                        }

                        {selectId === 1 &&
                            <div>
                                <div className=''>
                                    <Paper
                                        className="w-full tongYongChuang3 flex justify-content-center "
                                    >
                                        <div className="w-full  mx-auto sm:mx-0">

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
                                                                control._formValues.nationCode = option.phone_code
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
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default ResetPin;
