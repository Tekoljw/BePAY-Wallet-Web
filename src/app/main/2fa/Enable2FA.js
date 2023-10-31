import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import OtpPass from "../otpPass/OtpPass";

import { judgeIosOrAndroid } from "../../util/tools/function";

import '../../../styles/home.css';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import QRCode from 'qrcode.react';
import {
    googleQrText,
    verifyGAuth
} from '../../store/user/userThunk';
import {useTranslation} from "react-i18next";


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

const handleCopyText = (text) => {
    var input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();
    document.execCommand("copy"); // 执行浏览器复制命令
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
}

function Enable2FA() {
    const { t } = useTranslation('mainPage');
    const [googleText, setgoogleText] = useState({});
    const [googleCode, setGoogleCode] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(googleQrText()).then((res) => {
            setgoogleText(res.payload);
        });

    }, []);

    const handleSubmit = () => {
        if (googleCode.length < 6) {
            return
        }
        let data = { checkCode: googleCode };
        dispatch(verifyGAuth(data))
    };

    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="px-24 pb-24"
            >
                {/*1*/}
                <Box
                    className="w-full rounded-16 flex flex-col"
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-20 px-16 font-medium" style={{ marginBottom: '0.9rem', paddingLeft: 0 }}>{t('home_2fa_1')}</Typography>
                </Box>
                <Box
                    className="w-full rounded-16 border flex flex-col color-76819B border-r-5"
                    sx={{
                        backgroundColor: '#1E293B',
                        border: 'none'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-16 px-16 my-24 word-break-all pad-l-r-10 margin-t-b-10 line-height-21 border-r-5" >
                        {t('home_2fa_2')}
                        <a target={"_blank"} style={{ color: '#0D9488', background: "none" }} className="cursor-pointer" onClick={() => {
                            if (judgeIosOrAndroid() == "ios") {
                                window.open("//apps.apple.com/cn/app/google-authenticator/id388497605")
                            } else {
                                window.open("//play.google.com/store/apps/details?id=com.google.android.apps.authenticator2")
                            }
                        }}
                        >{t('home_2fa_3')}</a>
                        {t('home_2fa_4')}
                    </Typography>
                </Box>

                {/*2*/}
                <Box
                    className="w-full rounded-16 flex flex-col margin-t-16"
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-20 px-16 font-medium" style={{ marginBottom: '0.9rem', paddingLeft: 0 }}>{t('home_2fa_5')}</Typography>
                </Box>
                <Box
                    className="w-full rounded-16 border flex flex-col color-76819B border-r-5"
                    sx={{
                        backgroundColor: '#1E293B',
                        border: 'none'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-16 px-16 my-24 word-break-all pad-l-r-10 margin-t-b-10 line-height-21">{t('home_2fa_6')}</Typography>
                    <div className="flex justify-content-center">
                        <QRCode
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                background: '#ffffff',
                                margin: '0.5rem 0'
                            }}
                            value={googleText.qr ? googleText.qr : ''}
                            size={138}
                        />
                    </div>
                    <Typography className="text-16 px-16 my-12 text-center">
                        {t('home_2fa_7')}
                    </Typography>
                    <div className="px-16 mb-12 fa-input-conatiner">
                        <FormControl sx={{ width: '100%' }} variant="outlined">
                            <OutlinedInput
                                disabled={true}
                                id="outlined-adornment-weight"
                                value={googleText.key ? googleText.key : ''}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => {
                                            handleCopyText(googleText.key)
                                        }}
                                        edge="end"
                                    >
                                        <img src="wallet/assets/images/deposite/copy.png" alt="" />
                                    </IconButton>
                                </InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                            />
                        </FormControl>
                    </div>
                    <Typography className="text-16 px-16 my-12 line-height-21" style={{ marginTop: '0' }}>
                        {/* {t('home_2fa_8')} */}
                    </Typography>
                </Box>

                {/*3*/}
                <Box
                    className="w-full rounded-16 flex flex-col margin-t-16"
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-20 px-16 font-medium" style={{ marginBottom: '0.9rem', paddingLeft: 0 }}>{t('home_2fa_9')}</Typography>
                </Box>
                <Box
                    className="w-full rounded-16 border flex flex-col border-r-5"
                    sx={{
                        backgroundColor: '#1E293B',
                        border: 'none'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    <Typography className="text-16 px-16 my-16 font-medium text-center pad-l-r-10 margin-t-b-10" style={{ color: '#94a3b8' }}>{t('home_2fa_10')}</Typography>
                    <OtpPass  googleTextKey={googleText.key} setGoogleCode={setGoogleCode} />
                    <div className="my-16 flex items-center justify-content-center">
                        <Button
                            className="px-48 text-lg btnColorTitleBig"
                            size="large"
                            color="secondary"
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 1rem' }}
                            onClick={() => { handleSubmit() }}
                        >
                            {t('home_2fa_11')}
                        </Button>
                    </div>
                </Box>
            </motion.div>
        </div>
    )
}

export default Enable2FA;
