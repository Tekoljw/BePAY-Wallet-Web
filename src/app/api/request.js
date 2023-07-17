import axios from 'axios'
import history from '@history'

const service = axios.create({
    timeout: 50000, // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (!config.headers['Finger-Nft-Token']) {
            config.headers['Finger-Nft-Token'] = `${window.localStorage.getItem(
                `Authorization-${window.sessionStorage.getItem('openAppId') || 0}-${window.sessionStorage.getItem('openIndex') || 0}`
            ) || ''}`;
        }

        if (!config.headers['Wallet-OpenApp-Id']) {
            config.headers['Wallet-OpenApp-Id'] = `${window.sessionStorage.getItem(
                'openAppId'
            ) || 0}`;
        }

        if (!config.headers['Wallet-OpenApp-Index']) {
            config.headers['Wallet-OpenApp-Index'] = `${window.sessionStorage.getItem(
                'openIndex'
            ) || 0}`;
        }

        return config;
    },
    err => Promise.reject(err)
)


// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.errno === 501) {
            setTimeout(() => {
                var openAppId = window.sessionStorage.getItem('openAppId') || 0;
                var openIndex = window.sessionStorage.getItem('openIndex') || 0;
                localStorage.removeItem(`Authorization-${openAppId}-${openIndex}`);
                if (window.location.pathname !== '/sign-up' && window.location.pathname !== '/login') {
                    history.push("/login" + window.location.search);
                } else if (window.location.pathname === '/login') {
                    console.log(window.location.pathname, 'window.location.pathname')
                }
            }, 500);
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
