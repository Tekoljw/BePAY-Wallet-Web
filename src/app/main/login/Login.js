import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import { version } from "@walletconnect/auth-client/package.json";
import AuthClient, { generateNonce } from "@walletconnect/auth-client";
import React, { useCallback } from "react";
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch, useSelector } from 'react-redux';
// import walletConnect from '../../store/walletconnect/walletConnect2';
// import PhantomWalletAdapter from '../../util/web3/phantom.js';
import {
    // doLogin,
    mobileLogin,
    facebookLoginApi,
    telegramLoginApi,
    googleLoginApi
} from '../../store/user/userThunk';
import { selectConfig, setStorageKey } from "../../store/config";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState, useEffect } from "react";
import { arrayLookup, getUrlParam } from "../../util/tools/function";
import phoneCode from '../../../phone/phoneCode';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import MobileDetect from 'mobile-detect';
import clsx from 'clsx';
import loginWays from "./loginWays.json";
import axios from "axios";
import domain from '../../api/Domain';
import { useTranslation } from "react-i18next";
import LoginSidebarContent from './LoginSidebarContent';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { rgbToHex } from '@mui/system';
// import { Core } from "@walletconnect/core";
// import { Web3Wallet } from "@walletconnect/web3wallet";
//check if use phone

import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
import utils from '../../util/tools/utils';


const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {},
    '& .FusePageCarded-sidebar': {},
    '& .FusePageCarded-rightSidebar': {},
}));


function Login() {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();

    const [logo, setLogo] = useState("assets/images/logo/logo.png");
    /**
     * Form Validation Schema
     */
    const schema = yup.object().shape({
        // email: yup.string().email('You must enter a valid email').required('You must enter a email'),
        // nationCode: yup.string().required('You must enter a nationCode'),
        // phone: yup.string().required('You must enter a phone'),
        password: yup
            .string()
            .required('Please enter your password.')
            .min(6, t("signUp_8")),
    });

    const defaultValues = {
        email: '',
        nationCode: '',
        phone: '',
        password: '',
        remember: true,
        agentId: ''
    };


    const [profile, setProfile] = useState([]);
    const clientId = '399356987565-oh5vkr3jl2ckuqlgoacn429eucmmkntd.apps.googleusercontent.com';

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        if (res) {
            setProfile(res.profileObj);
            if (res.tokenId) {
                console.log(res.tokenId, 'res.tokenId')
                dispatch(googleLoginApi({ id_token: res.tokenId}))
            }
        }
    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile(null);
    };




    const agentId = getUrlParam('agentId');
    if (agentId) {
        defaultValues.agentId = agentId
    };
    const { pathname } = useLocation();
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));
    const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);

    const ranges = [t('signIn_4'), t('signIn_5')];
    const [tabValue, setTabValue] = useState(0);
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const [tmpPhoneCode, setTmpPhoneCode] = useState('');
    const { isValid, dirtyFields, errors } = formState;
    const storageKey = getUrlParam('storageKey');
    const [selected, setSelected] = useState('');
    const config = useSelector(selectConfig);
    //以下是walletconnect代码
    // "default"|"qr""
    // console.log(`AuthClient@${version}`);
    const [view, changeView] = useState("default");
    const [client, setClient] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [uri, setUri] = useState("");
    const [address, setAddress] = useState("");

    // const WCLogin = useCallback(async () => {
    //     if (!client) return;
    //     client
    //         .request(result = await walletConnect.acceptSession()
    //                )
    //         .then((result) => {
    //             let uri =result.uri;
    //             if (uri) {
    //                 setUri(uri);
    //                 walletConnect.acceptSession()
    //             }
    //         });
    // }, [client, setUri]);


    const WCLogin = useCallback(async () => {
        const result = await walletConnect.acceptSession();
        setUri(result.uri);
        // if (!client) return;
        // client
        //     .request({
        //         aud: window.location.href,
        //         domain: window.location.hostname.split(".").slice(-2).join("."),
        //         chainId: "eip155:1",
        //         type: "eip4361",
        //         nonce: generateNonce(),
        //         statement: "Sign in with wallet.",
        //     })
        //     .then(({ uri }) => {
        //         walletConnect.acceptSession();
        //         if (uri) {
        //             setUri(uri);
        //         }
        // });
    }, [client, setUri]);
    // useEffect(() => {
    //
    //
    //     AuthClient.init({
    //         relayUrl: "wss://relay.walletconnect.com",
    //         projectId: "035cb2d52902323e520070380ba2aa82",
    //         metadata: {
    //             name: "FuniBox",
    //             description: "funibox",
    //             url: window.location.host,
    //             icons: [],
    //         },
    //     })
    //         .then((authClient) => {
    //             setClient(authClient);
    //             setHasInitialized(true);
    //         })
    //         .catch(console.error);
    // }, []);
    useEffect(() => {
        if (!client) return;
        if (client.on) {
            client.on("auth_response", ({ params }) => {
                // console.log('params......', params)
                // if ("code" in params) {
                //   console.error(params);
                //   return;
                // }
                // if ("error" in params) {
                //   console.error(params.error);
                //   return;
                // }

                // setAddress(params.result.p.iss.split(":")[4]);
            });
        }
    }, [client]);
    useEffect(() => {
        if (uri) changeView("qr");
    }, [uri, changeView]);
    useEffect(() => {
        if (address) changeView("default");
    }, [address, changeView]);

    useEffect(() => {
        if (storageKey) {
            dispatch(setStorageKey({ storageKey: storageKey }));
        }
    }, []);
    useEffect(() => {
        if (config) {
            let openAppId = window.sessionStorage.getItem('openAppId')
            if (openAppId) {
                setLogo(`${config.staticSourceUrl}/${openAppId}.png`)
            }
        }
    }, [config]);

    async function onSubmit() {
        dispatch(mobileLogin(control._formValues));
    }

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

    useEffect(() => {
        const getPhoneCode = async () => {
            const service = axios.create({
                timeout: 50000, // request timeout
            });
            var post = {
                url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/getIPExtendInfo`,
                method: 'post',
                async: true
            };

            let res = await service(post);
            if (res.data.errno === 0) {
                let countryText = res.data.data.queryCountry;
                if (countryText) {
                    phoneCode.list.map((item) => {
                        if (item.chinese_name === countryText) {
                            setTmpCode(item.phone_code);
                            return
                        }
                    })
                }
            }
        };
        getPhoneCode();
    }, []);

    useEffect(() => {
        control._formValues.nationCode = tmpCode;
    }, [tmpCode]);

    useEffect(() => {
        pagePhoneCodeList(1, true);
    }, [tmpPhoneCode]);

    const getFacebookLoginToken = async (params) => {
        dispatch(facebookLoginApi(params));
    };
    function getUserDetail(response) {
        FB.api('/me', function (person) {
            // console.log('Successful me ', person);
            if (person.id) {
                FB.api(`${person.id}?fields=id,name,email`, function (res) {
                    // console.log('Successful USER', res);
                    const params = {
                        userToken: response.authResponse.accessToken,
                        userId: res.id,
                        email: res.email || '',
                        name: res.name || ''
                    }
                    getFacebookLoginToken(params);
                });
            }
        });
    }
    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            console.log("登录成功");
            getUserDetail(response);
            // if (response.authResponse.accessToken) {
            //localStorage.setItem('Authorization', response.authResponse.accessToken);
            // setTimeout(() => {
            //     history.push('/home');
            // }, 1000);
            // }
        } else {
            console.log('登录失败');
        }
    }
    function facebookLogin() {
        console.log(window.parent.FuniBox, 'FuniBox..............')
        FB.login(function (response) {
            statusChangeCallback(response);
        }
        );
    }
    useEffect(() => {
        try {
            // FB.getLoginStatus(function(response) {
            //     statusChangeCallback(response);
            // });
            console.log(11111)
            // utils.appendScript('assets/js/canvas-nest.js');
        } catch (e) {
            console.log(e)
        }

    }, []);

    const loginTelegram = () => {
        //这里唯一要做的就是把你机器人参数传入进去
        window.Telegram.Login.auth({ bot_id: '6180064197', request_access: 'write', embed: 1 }, (data) => {
            console.log(data, '这是回调数据');//这里的data和之前返回的user数据和格式无差异
            if (!data) {
                // fail
                return
            }
            telegramCallbackFn(data);
        });
    };
    const telegramCallbackFn = (data) => {
        dispatch(telegramLoginApi(data))
    };
    const defaultView = () => {

        return (

            <Root
                content={
                    <Paper
                        className={clsx('w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow flex', !isMobileMedia && 'login-right-side')}
                        style={{
                            maxWidth: '65rem',
                            margin: 'auto',
                            background: "#0E1421",
                            paddingTop: '1.2rem',
                        }}
                    >
                        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0 loginMarginZhong ">
                            <img className="logWidth" style={{ marginBottom: '2rem' }} src={logo} alt="logo" />

                            {/* <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                              Sign in
                                </Typography> */}

                            <div className="flex items-baseline mt-2 font-medium">
                                <Typography className='fontStyle'>{t('signIn_2')}</Typography>
                                <Link className="ml-4 fontStyle" to="/sign-up" >
                                    {t('signIn_3')}
                                </Link>
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
                                name="loginForm fontStyle"
                                noValidate
                                className="flex flex-col justify-center w-full mt-8 fontStyle "
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {tabValue === 1 && <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            className="mb-24 fontStyle "
                                            label={t('signIn_5')}
                                            autoFocus
                                            type="email"
                                            error={!!errors.email}
                                            helperText={errors?.email?.message}
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    )}
                                />}

                                {tabValue === 0 && <>
                                    {/*<Controller*/}
                                    {/*    name="nationCode"*/}
                                    {/*    control={control}*/}
                                    {/*    render={({ field }) => (*/}
                                    {/*        <TextField*/}
                                    {/*            {...field}*/}
                                    {/*            className="mb-24"*/}
                                    {/*            label="nationCode"*/}
                                    {/*            autoFocus*/}
                                    {/*            type="text"*/}
                                    {/*            error={!!errors.nationCode}*/}
                                    {/*            helperText={errors?.nationCode?.message}*/}
                                    {/*            variant="outlined"*/}
                                    {/*            required*/}
                                    {/*            fullWidth*/}
                                    {/*        />*/}
                                    {/*    )}*/}
                                    {/*/>*/}

                                    {/*<Controller*/}
                                    {/*    name="nationCode"*/}
                                    {/*    control={control}*/}
                                    {/*    render={({ field }) => (*/}
                                    {/*        <FormControl>*/}
                                    {/*            <InputLabel id="demo-simple-select-label">nationCode*</InputLabel>*/}
                                    {/*            <Select*/}
                                    {/*                label="nationCode*"*/}
                                    {/*                value={selected}*/}
                                    {/*                onChange={handleChange}*/}
                                    {/*                displayEmpty*/}
                                    {/*                inputProps={{ "aria-label": "Without label" }}*/}
                                    {/*                className="MuiSelect-icon mb-24"*/}
                                    {/*                // IconComponent={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}*/}
                                    {/*                MenuProps={{*/}
                                    {/*                    PaperProps: {*/}
                                    {/*                        style: {*/}
                                    {/*                            maxHeight: 300,*/}
                                    {/*                            border: 'none'*/}
                                    {/*                        },*/}
                                    {/*                    },*/}
                                    {/*                }}*/}
                                    {/*            >*/}
                                    {/*                {phoneCode.list.map((row, index) => {*/}
                                    {/*                    return (*/}
                                    {/*                        <MenuItem*/}
                                    {/*                            key={index}*/}
                                    {/*                            value={row.phone_code}*/}
                                    {/*                        >*/}
                                    {/*                            <div className="flex items-center">*/}
                                    {/*                                <img*/}
                                    {/*                                    style={{*/}
                                    {/*                                        width: '25px',*/}
                                    {/*                                        height: '25px'*/}
                                    {/*                                    }}*/}
                                    {/*                                    src={"/assets/images/country/" + row.country_code + ".png"}*/}
                                    {/*                                    alt=""*/}
                                    {/*                                />*/}
                                    {/*                                <div className="ml-4">{row.local_name}</div>*/}
                                    {/*                            </div>*/}
                                    {/*                        </MenuItem>*/}
                                    {/*                    )*/}
                                    {/*                })}*/}
                                    {/*            </Select>*/}
                                    {/*        </FormControl>*/}
                                    {/*    )}*/}
                                    {/*/>*/}

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
                                                    control._formValues.nationCode = option.phone_code;
                                                    setTmpCode(option.phone_code)
                                                }}
                                                value={control._formValues.nationCode}
                                                getOptionLabel={(option) => { return '+' + tmpCode }}
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

                                    <Controller
                                        className='fontStyle'
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                className="mb-24 fontStyle"
                                                label={t('signIn_4')}
                                                type="text"
                                                error={!!errors.phone}
                                                helperText={errors?.phone?.message}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        )}
                                    />

                                </>}

                                <Controller
                                    className='fontStyle'
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
                                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-center">
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

                                    <Link className="text-md font-medium" to="/forgot">
                                        {t('signIn_10')}
                                    </Link>
                                </div>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className=" w-full mt-16 btnColorTitleBig"
                                    aria-label="Sign in"
                                    disabled={_.isEmpty(dirtyFields) || !isValid}
                                    type="submit"
                                    size="large"
                                >
                                    {t('signIn_1')}
                                </Button>

                                <div className="flex items-center mt-32">
                                    <div className="flex-auto mt-px border-t" />
                                    <Typography className="mx-8 fontStyle" color="text.secondary">

                                        {t('signIn_11')}
                                    </Typography>
                                    <div className="flex-auto mt-px border-t" />
                                </div>

                                <div className={clsx("flex items-center mt-32 ", (tabValue === 1) && 'loginMarginB')} style={{ flexWrap: 'wrap' }}>
                                    <Button className='txtColorTitleSmall' style={{ width: '30%', margin: '.5rem 1.5%', backgroundColor: '#1E293B', borderColor: 'transparent', opacity: "0.5" }} variant="outlined"
                                    onClick={() => facebookLogin()}
                                    >
                                        <img style={{ height: '80%' }} src="/assets/images/login/icon-1.png" alt="" />
                                    </Button>
                                    <Button className='txtColorTitleSmall' onClick={() => {
                                        loginTelegram()
                                    }} style={{ width: '30%', margin: '.5rem 1.5%', backgroundColor: '#1E293B', borderColor: 'transparent', opacity: "0.5" }} variant="outlined">
                                        <img style={{ height: '80%' }} src="/assets/images/login/icon-2.png" alt="" />
                                    </Button>
                                    <Button className='txtColorTitleSmall' style={{ width: '30%', margin: '.5rem 1.5%', backgroundColor: '#1E293B', border: "none", opacity: "1" }} variant="outlined">
                                        <GoogleLogin
                                            render={(renderProps) => (
                                                <img
                                                    onClick={renderProps.onClick}
                                                    disabled={renderProps.disabled}
                                                    style={{ height: "80%" }}
                                                    src="/assets/images/login/icon-3.png"
                                                    alt=""
                                                />
                                            )}
                                            clientId={clientId}
                                            buttonText="login"
                                            onSuccess={() => {onSuccess()}}
                                            onFailure={onFailure}
                                            cookiePolicy={"single_host_origin"}
                                            isSignedIn={true}
                                        //   icon={false}
                                        />
                                        {/* <img style={{ height: '80%' }} src="/assets/images/login/icon-3.png" alt="" /> */}
                                    </Button>
                                    {/* {isMobileMedia && <Button className='txtColorTitleSmall' onClick={() => { walletLogin('trustWallet') }} style={{ width: '30%', margin: '.5rem 1.5%', backgroundColor: '#1E293B', borderColor: 'transparent' }} variant="outlined">
                                <img style={{ height: '80%' }} src="/assets/images/login/icon-4.png" alt="" />
                            </Button>} */}
                                </div>
                                {/* //待修改 */}
                                {isMobileMedia && <div className=' font-furore text-20' style={{ flexWrap: 'nowrap', display: 'flex' }}>
                                    <Button className="color-16c2a3  " size="large" onClick={() => { setRightSidebarOpen(true) }} style={{ textDecoration: 'underline', color: '#0D9488', margin: 'auto', marginTop: '2rem', fontWeight: "bold" }} variant="text">
                                        Web3.0   {t('signIn_1')}
                                    </Button>
                                </div>}
                            </form>
                        </div>
                        {
                            !isMobileMedia &&
                            <LoginSidebarContent tab={pathname.substring(pathname.lastIndexOf('\/') + 1, pathname.length) || 'wallet'} />
                        }
                    </Paper>
                }
                //右侧web3栏
                rightSidebarOpen={rightSidebarOpen}
                rightSidebarOnClose={() => {
                    setRightSidebarOpen(false);
                }}
                rightSidebarContent={isMobileMedia && <LoginSidebarContent
                    tab={pathname.substring(pathname.lastIndexOf('\/') + 1, pathname.length) || 'wallet'}
                    background='#0F172A'
                // setTab={setTab}
                // setIsLoading={setIsLoading}
                />}
            />
        )
    }
    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0"
            style={{
                background: "#0F172A",
            }}
        >
            {view === "default" && defaultView()}
            {view === "qr" && <QrView uri={uri} />}

        </div>

    );
}

export default React.memo(Login);

