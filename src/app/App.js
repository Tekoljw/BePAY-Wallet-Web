import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {selectCurrentLanguage, selectCurrentLanguageDirection} from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import withAppProviders from './withAppProviders';
import { getNetworks, getConfig } from "app/store/config/configThunk";
import {useEffect, useRef, useState} from "react";
import {selectUserData} from "./store/user";
import {getUrlParam, getUserLoginType} from "./util/tools/function";
import { getKycInfo } from "app/store/payment/paymentThunk";
import { changeLanguage } from "./store/i18nSlice";
import userLoginType from "./define/userLoginType";
import {checkLoginState} from "app/store/user/userThunk";
import {showMessage} from "app/store/fuse/messageSlice";
import {requestUserLoginData} from "./util/tools/loginFunction";

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
    rtl: {
        key: 'muirtl',
        stylisPlugins: [rtlPlugin],
        insertionPoint: document.getElementById('emotion-insertion-point'),
    },
    ltr: {
        key: 'muiltr',
        stylisPlugins: [],
        insertionPoint: document.getElementById('emotion-insertion-point'),
    },
};

const App = () => {
    const dispatch = useDispatch();
    const openAppId = getUrlParam('openAppId') || 0;
    const openIndex = getUrlParam('openIndex') || 0;
    const thirdPartId = getUrlParam('thirdPartId') || 0;
    const autoLoginKey = getUrlParam('autoLoginKey') || 0;
    const accessType = getUrlParam('accessType') || 0;
    const storageKey = getUrlParam('storageKey') || '';
    const langDirection = useSelector(selectCurrentLanguageDirection);
    const currentLanguage = useSelector(selectCurrentLanguage);
    const mainTheme = useSelector(selectMainTheme);
    const token = useSelector(selectUserData).token;
    const lang = currentLanguage.id === getUrlParam('lang') ? currentLanguage.id : getUrlParam('lang');

    //登录方式处理
    const loginTypeHandle = (loginType) =>{
        console.log(loginType, 'app请求的 loginType');
        switch (loginType){
            case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP:{ //telegramWebApp
                console.log(loginType, 'app请求checkLoginState,检查登录状态')
                const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe;
                if(initDataUnsafe && initDataUnsafe.user){
                    let username = initDataUnsafe.user.username;
                    if(!username || username === ''){
                        username = 'beingfi_tg_web_user_name';
                    }
                    dispatch(checkLoginState({
                        username: username,
                        userid: initDataUnsafe.user.id + '',
                    }));
                }else{
                    dispatch(showMessage({ message: "telegram_web_app get info error", code: 2 }));
                }
                break;
            }
            default:{
                console.log(loginType, 'app请求默认方式登录');
                requestUserLoginData(dispatch);
                break;
            }
        }
    }

    useEffect(() => {

        dispatch(getNetworks());
        dispatch(getConfig());

        if (openAppId) {
            window.sessionStorage.setItem('openAppId', openAppId)
        }
        if (openIndex) {
            window.sessionStorage.setItem('openIndex', openIndex)
        }
        if (thirdPartId) {
            window.localStorage.setItem('thirdPartId', thirdPartId)
        }
        if (autoLoginKey) {
            window.localStorage.setItem('autoLoginKey', autoLoginKey)
        }else{
            window.localStorage.removeItem('autoLoginKey');
        }
        if (storageKey) {
            window.localStorage.setItem('storageKey', storageKey)
        }
        switch (accessType){
            case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP:{ //telegramWebApp
                loginTypeHandle(userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP)
                window.localStorage.setItem('loginType', userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP);
                break;
            }
            default:{
                //console.log(1, '设置 loginType');
                window.localStorage.removeItem('loginType');
                loginTypeHandle()
                break;
            }
        }
    }, []);

    useEffect(() => {
        if (lang) {
            dispatch(changeLanguage(lang)).then(r => {
                    console.log("change language success")
                }
            );
        }
    }, [lang]);

    useEffect(() => {
        dispatch(getKycInfo({
            unloginerror: false
        }));
    }, [token]);

    return (
        <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
            <FuseTheme theme={mainTheme} direction={langDirection}>
                {/*<AuthProvider>*/}
                <BrowserRouter
                    basename="/wallet"
                >
                    {/*<FuseAuthorization*/}
                    {/*    userRole={userRole}*/}
                    {/*    loginRedirectUrl={settingsConfig.loginRedirectUrl}*/}
                    {/*>*/}
                        <SnackbarProvider
                            maxSnack={5}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            classes={{
                                containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                            }}
                        >
                            <FuseLayout layouts={themeLayouts} />
                        </SnackbarProvider>
                    {/*</FuseAuthorization>*/}
                </BrowserRouter>
                {/*</AuthProvider>*/}
            </FuseTheme>
        </CacheProvider>
    );
};

export default withAppProviders(App)();
