import { createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { useHistory } from 'react-router-dom';
import {getLoginType, getAutoLoginKey, getOpenAppId, getOpenAppIndex, getThirdPartId} from "../../util/tools/function";
import {showMessage} from "app/store/fuse/messageSlice";
import {checkLoginState} from "app/store/user/userThunk";
import {requestUserLoginData} from "../../util/tools/loginFunction";
import loginType from "../../define/loginType";
// state
const initialState = {
    token: '',
    userInfo: {},
    profile: {},
    transferList: {},
    wallet: {},
    fiat: {},
    cryptoDisplay: [],
    transferStats: {},
    walletDisplay: [],
    currencyCode: localStorage.getItem('currencyCode') || 'USD',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            // console.log(action,'action.......................................111212121212121212');
            let res = action.payload;
            state.userInfo = res.data.user;
            state.profile = res.data;
            if (res.data.token) {
                state.token = res.data.token;
                const openAppId = getOpenAppId();
                const openIndex = getOpenAppIndex();
                window.localStorage.setItem(`Authorization-${openAppId}-${openIndex}`, res.data.token);

                const curLoginType = getLoginType();
                setTimeout(() => {

                    switch (curLoginType){
                        case loginType.LOGIN_TYPE_TELEGRAM_WEB_APP:{
                            //不跳转页面
                            break;
                        }
                        default:{
                            if (res?.pathname && res?.pathname !== '/wallet/login'){
                                // dispatch(push(res.pathname))
                                history.push(res.pathname)
                                // history.go(0)
                            }else{
                                history.push('/wallet/home');
                            }
                            break;
                        }
                    }

                    window.parent.postMessage(JSON.stringify({
                        'action': 'closeIframe',
                    }), '*')
                }, 1000)
            }
        },

        updateUserToken: (state, action) => {
            let res = action.payload;
            if (res.data.token) {
                state.token = res.data.token;
                var openAppId = getOpenAppId();
                var openIndex = getOpenAppIndex();
                localStorage.setItem(`Authorization-${openAppId}-${openIndex}`, res.data.token);
            }
        },

        updateTransfer: (state, action) => {
            let res = action.payload;
            state.transferList = res.data;
        },
        updateWallet: (state, action) => {
            let res = action.payload;
            state.wallet = res.data;
        },
        updateFiat: (state, action) => {
            let res = action.payload;
            state.fiat = res.data;
        },
        updateCryptoDisplay: (state, action) => {
            let res = action.payload;
            state.cryptoDisplay = res.data;
        },
        updateWalletDisplay: (state, action) => {

            let res = action.payload;
            state.walletDisplay = res.payload?.data;
        },
        updateCurrency: (state, action) => {
            let res = action.payload;
            state.currencyCode = res;
            localStorage.setItem('currencyCode', res);
        },

        setTransferStats: (state, action) => {
            let res = action.payload;
            state.transferStats = res;
        },
    },
    extraReducers: {
        // [doLogin.fulfilled]: (state, action) => action.payload,
    }
});

export const { updateUser, updateUserToken, updateTransfer, updateWallet, updateFiat, updateCryptoDisplay, updateWalletDisplay, updateCurrency, setTransferStats } = userSlice.actions;

export const selectUserData = ({ user }) => user;

export default userSlice.reducer;
