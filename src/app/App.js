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
import {selectUserData, updateLoginState} from "./store/user";
import {getUrlParam, getUserLoginState} from "./util/tools/function";
import { getKycInfo } from "app/store/payment/paymentThunk";
import { changeLanguage } from "./store/i18nSlice";
import userLoginType from "./define/userLoginType";
import {checkLoginState} from "app/store/user/userThunk";
import {requestUserLoginData} from "./util/tools/loginFunction";
import userLoginState from "./define/userLoginState";
import ReloginDialog from './components/ReloginDialog';
import {useTranslation} from "react-i18next";
import {showMessage} from "app/store/fuse/messageSlice";

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
    const { t } = useTranslation('mainPage');
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
    const [openLoginWindow, setOpenLoginWindow] = useState(false);
    const lang = currentLanguage.id === getUrlParam('lang') ? currentLanguage.id : getUrlParam('lang');
    const userData = useSelector(selectUserData);
    const loginState = userData.loginState;
    const userRequestError = userData.userRequestError;

    useEffect(() => {

        dispatch(getNetworks());
        dispatch(getConfig());

        //清除登录状态
        dispatch(updateLoginState(userLoginState.USER_LOGIN_STATE_UN));

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
        switch (accessType){
            case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP:{ //telegramWebApp
                window.sessionStorage.setItem('loginType', userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP);
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
        const sessionLoginState = getUserLoginState();
        if(loginState === sessionLoginState){ //已经进行过登录流程了
            switch (loginState){
                case userLoginState.USER_LOGIN_STATE_SUCCESS:{
                    setOpenLoginWindow(false);
                    break;
                }
                case userLoginState.USER_LOGIN_STATE_FAILURE:{
                    setOpenLoginWindow(false);
                    break;
                }
                case userLoginState.USER_LOGIN_STATE_VERIFY_ERROR:{
                    setOpenLoginWindow(true);
                    break;
                }
            }
        }
    }, [loginState]);

    //总的错误提示显示
    useEffect(() => {
        if(userRequestError && userRequestError !== ""){
            console.log("app show request server error", "request server_error");
            const parts = userRequestError.split('-')
            if(parts.length > 1){
                const errno = parts[0];
                const error_tips_code = 'server_error_' + errno;
                console.log(error_tips_code, "show request server_error code");
                dispatch(showMessage({ message: t(error_tips_code), code: 2 }));;
            }
        }
    }, [userRequestError]);

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
                <ReloginDialog openLoginWindow={ openLoginWindow } closeLoginWindow={()=>{
                    setOpenLoginWindow(false)
                }} >
                </ReloginDialog>
            </FuseTheme>
        </CacheProvider>
    );
};

export default withAppProviders(App)();
