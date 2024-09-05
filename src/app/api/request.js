import axios from 'axios'
import history from '@history'
import {getOpenAppId, getOpenAppIndex, getUserLoginType} from "../util/tools/function";
import {requestUserLoginData} from "../util/tools/loginFunction";
import MobileDetect from 'mobile-detect';
import useThemeMediaQuery from "../../@fuse/hooks/useThemeMediaQuery";
import { isMobile } from "../util/tools/function";
import userLoginType from "../define/userLoginType";

const service = axios.create({
    timeout: 50000, // request timeout
})


// request interceptor
service.interceptors.request.use(
    config => {
        const OpenAppId = getOpenAppId();
        const OpenAppIndex = getOpenAppIndex();
        if (!config.headers['Finger-Nft-Token']) {
            config.headers['Finger-Nft-Token'] = `${window.localStorage.getItem(
                `Authorization-${OpenAppId}-${OpenAppIndex}`
            ) || ''}`;
        }

        if (!config.headers['Wallet-OpenApp-Id'] || config.headers['Wallet-OpenApp-Id'] !== OpenAppId) {
            config.headers['Wallet-OpenApp-Id'] = OpenAppId;
        }

        if (!config.headers['Wallet-OpenApp-Index'] || config.headers['Wallet-OpenApp-Index'] !== OpenAppIndex) {
            config.headers['Wallet-OpenApp-Index'] = OpenAppIndex;
        }
        return config;
    },
    err => Promise.reject(err)
)


// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.errno === 501) { //api 请求返回没有验证登录就跳转登录页面
            const loginType = getUserLoginType();
            if(loginType === userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP){ //其他第三方自动登录成功后，开启请求基础数据
                //第三方自动登录，暂时不做处理
            }else{
                setTimeout(() => {
                    const openAppId = getOpenAppId();
                    const openIndex = getOpenAppIndex();
                    localStorage.removeItem(`Authorization-${openAppId}-${openIndex}`);
                    if (isMobile()) {
                        if (window.location.pathname !== '/wallet/sign-up' && window.location.pathname !== '/wallet/login') {
                            history.push("/wallet/start" + window.location.search);
                        } else if (window.location.pathname === '/wallet/login') {
                            console.log(window.location.pathname, 'window.location.pathname')
                        }
                    } else {
                        if (window.location.pathname !== '/wallet/sign-up' && window.location.pathname !== '/wallet/login') {
                            history.push("/wallet/login" + window.location.search);
                        } else if (window.location.pathname === '/wallet/login') {
                            console.log(window.location.pathname, 'window.location.pathname')
                        }
                    }
                }, 500);
            }
            return res;
        } else {
            return res;
        }
    }, error => {
        return {
            errno: 400,
            errmsg: error.message,
        }
    }
)

export default service
