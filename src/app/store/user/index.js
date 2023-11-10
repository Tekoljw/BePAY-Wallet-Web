import { createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { useHistory } from 'react-router-dom';
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
                var openAppId = window.sessionStorage.getItem('openAppId') || 0;
                var openIndex = window.sessionStorage.getItem('openIndex') || 0;
                window.localStorage.setItem(`Authorization-${openAppId}-${openIndex}`, res.data.token);


                setTimeout(() => {
                    if (res?.pathname && res?.pathname !== '/wallet/login'){
                        // dispatch(push(res.pathname))
                        history.push(res.pathname)
                        history.go(0)
                    }else{
                        history.push('/wallet/home');;
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
                var openAppId = window.sessionStorage.getItem('openAppId') || 0;
                var openIndex = window.sessionStorage.getItem('openIndex') || 0;
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
