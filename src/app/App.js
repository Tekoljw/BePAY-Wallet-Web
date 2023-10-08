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
import { selectUser } from 'app/store/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import { getNetworks, getConfig } from "app/store/config/configThunk";
import {useEffect, useRef, useState} from "react";
import {selectUserData} from "./store/user";
import {getUrlParam} from "./util/tools/function";
import { getKycInfo } from "app/store/payment/paymentThunk";
import { changeLanguage } from "./store/i18nSlice";
 
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
    const langDirection = useSelector(selectCurrentLanguageDirection);
    const mainTheme = useSelector(selectMainTheme);
    const token = useSelector(selectUserData).token;
    const userRole = (token.length > 0 ? token : localStorage.getItem(`Authorization-${openAppId}-${openIndex}`)) ? 'home': '';
    const lang = getUrlParam('lang')==='undefined'?'en':getUrlParam('lang');


    useEffect(() => {

        dispatch(changeLanguage(lang));

        dispatch(getNetworks());
        dispatch(getConfig());
        // dispatch(getKycInfo({
        //     unloginerror: false
        // }));
        if (openAppId) {
            window.sessionStorage.setItem('openAppId', openAppId)
        }
        if (openIndex) {
            window.sessionStorage.setItem('openIndex', openIndex)
        }
        if (lang) {
            window.localStorage.setItem('lang', lang)
        }
    }, []);

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
