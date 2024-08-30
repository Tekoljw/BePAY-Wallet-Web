import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import withAppProviders from './withAppProviders';
import { getNetworks, getConfig } from "app/store/config/configThunk";
import {useEffect, useRef, useState} from "react";
import {selectUserData} from "./store/user";
import {getCurrentLanguage, getUrlParam} from "./util/tools/function";
import { getKycInfo } from "app/store/payment/paymentThunk";
import { changeLanguage } from "./store/i18nSlice";
import userType from './define/userType';

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
    const accessType = getUrlParam('accessType') || 0;
    const thirdPartId = getUrlParam('thirdPartId') || 0;
    const autoLoginKey = getUrlParam('autoLoginKey') || 0;
    const accessToken = getUrlParam('accessToken') || '';
    const storageKey = getUrlParam('storageKey') || '';
    const langDirection = useSelector(selectCurrentLanguageDirection);
    const mainTheme = useSelector(selectMainTheme);
    const token = useSelector(selectUserData).token;
    const userRole = (token.length > 0 ? token : localStorage.getItem(`Authorization-${openAppId}-${openIndex}`)) ? 'home': '';
    const lang = getCurrentLanguage() === getUrlParam('lang') ? getCurrentLanguage() : getUrlParam('lang');


    useEffect(() => {

        dispatch(getNetworks());
        dispatch(getConfig());

        if (openAppId) {
            window.sessionStorage.setItem('openAppId', openAppId)
        }
        if (openIndex) {
            window.sessionStorage.setItem('openIndex', openIndex)
        }

        if (storageKey) {
            window.localStorage.setItem('storageKey', storageKey)
        }
        if (accessType) {
            window.localStorage.setItem('accessType', accessType);
            switch (accessType){
                case 1:{ //telegramWebApp
                    window.localStorage.setItem('loginType', "telegram_web_app");
                    window.localStorage.setItem('thirdPartId', thirdPartId)
                    window.localStorage.setItem('autoLoginKey', autoLoginKey)
                    //直接设置已经获取到的访问token
                    if(openAppId && openIndex){
                        localStorage.setItem(`Authorization-${openAppId}-${openIndex}`, accessToken);
                    }
                    break;
                }
                default:{
                    if (thirdPartId) {
                        window.localStorage.setItem('thirdPartId', thirdPartId)
                    }
                    if (autoLoginKey) {
                        window.localStorage.setItem('autoLoginKey', autoLoginKey)
                    }
                    break;
                }
            }
        }
    }, []);

    useEffect(() => {
        if (lang) {
            window.localStorage.setItem('lang', lang)
        }
        dispatch(changeLanguage(lang)).then(r => {
            console.log("change language success")
            }
        );
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
