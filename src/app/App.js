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
import {getThirdPartId, getUrlParam, getUserLoginType} from "./util/tools/function";
import { getKycInfo } from "app/store/payment/paymentThunk";
import { changeLanguage } from "./store/i18nSlice";
import userLoginType from "./define/userLoginType";
import {checkLoginState} from "app/store/user/userThunk";
import {showMessage} from "app/store/fuse/messageSlice";
import {requestUserLoginData} from "./util/tools/loginFunction";
import {sendLogInfo} from "app/store/log/logThunk";

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

    /*dispatch(sendLogInfo({
        logPlatform: accessType,
        logTitle: "react web url href",
        logContent: 'path url :' + window.location.href
    }));*/

    useEffect(() => {

        dispatch(getNetworks());
        dispatch(getConfig());

        /**
         sessionStorage : 数据只存在于当前浏览器标签页。
         */
        if (openAppId) {
            window.sessionStorage.setItem('openAppId', openAppId)
        }
        if (openIndex) {
            window.sessionStorage.setItem('openIndex', openIndex)
        }
        if (thirdPartId) {
            window.sessionStorage.setItem('thirdPartId', thirdPartId)
        }
        if (autoLoginKey) {
            window.sessionStorage.setItem('autoLoginKey', autoLoginKey)
        }else{
            window.sessionStorage.removeItem('autoLoginKey');
        }
        /**
         localStorage : 在同源的所有标签页和窗口之间共享数据。
         */
        if (storageKey) {
            window.localStorage.setItem('storageKey', storageKey)
        }
        /*dispatch(sendLogInfo({
            logPlatform: accessType,
            logTitle: "app accessType",
            logContent: "thirdPartId : " + thirdPartId
        }));*/
        switch (accessType){
            case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP:{ //telegramWebApp
                window.localStorage.setItem('loginType', userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP);
                console.log(accessType, 'app请求checkLoginState,检查登录状态')
                dispatch(checkLoginState({
                    loginType: userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP,
                    autoLoginUserId: thirdPartId,
                    autoLoginKey: autoLoginKey
                }));
                break;
            }
            default:{
                //console.log(1, '设置 loginType');
                window.localStorage.removeItem('loginType');
                requestUserLoginData(dispatch);
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
