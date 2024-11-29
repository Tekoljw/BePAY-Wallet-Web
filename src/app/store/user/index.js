import {createSlice} from '@reduxjs/toolkit';
import history from '@history';
import {getOpenAppId, getOpenAppIndex, getUserLoginType} from "../../util/tools/function";
import userLoginType from "../../define/userLoginType";
import userLoginState from "../../define/userLoginState";
import { userProfile, centerGetTokenBalanceList, getListBank } from "../user/userThunk"
import { getCryptoDisplay, centerGetUserFiat, getFiatDisplay, getNftDisplay, getWalletDisplay} from "../wallet/walletThunk"
import { payoutBank, payoutPayWays, getCreditConfig } from "../payment/paymentThunk"
import { getSwapFee } from "../swap/swapThunk"

// state
const initialState = {
    token: '', //网站自己的验证token
    thirdPartToken: '', //给第三方的验证token
    userInfo: {},
    profile: {},
    transferList: {},
    wallet: null,
    fiat: null,
    cryptoDisplay: null,
    fiatDisplay: null,
    nftDisplay: null,
    transferStats: {},
    walletDisplay: null,
    walletLoading: true,
    bankList: null,
    payoutBank: null,
    payoutWays: null,
    swapFee: null,
    creditConfig: null,
    currencyCode: localStorage.getItem('currencyCode') || 'USD',
    loginState: userLoginState.USER_LOGIN_STATE_UN,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateWalletLoading: (state, action)=> {
            let res = action.payload;
            state.walletLoading = res;
        },
        updateUser: (state, action) => {
            // console.log(action,'action.......................................111212121212121212');
            let res = action.payload;
            state.userInfo = res.data.user;
            state.profile = res.data;
            if (res.data.token) {
                state.token = res.data.token;
                state.thirdPartToken = res.data.thirdPartToken;
                const openAppId = getOpenAppId();
                const openIndex = getOpenAppIndex();
                window.localStorage.setItem(`Authorization-${openAppId}-${openIndex}`, res.data.token);

                const loginType = getUserLoginType();
                setTimeout(() => {

                    switch (loginType){
                        case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP:{ //telegramWebApp
                            //不跳转页面
                            break;
                        }
                        default:{
                            if (res?.pathname && res?.pathname !== '/wallet/login'){
                                // dispatch(push(res.pathname))
                                history.push(res.pathname)
                                // history.go(0)
                            }else{
                                history.push(`/wallet/home`);
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
                state.thirdPartToken = res.data.thirdPartToken;
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
        updateFiatDisplay:(state, action) => {
            let res = action.payload;
            state.fiatDisplay = res.data;
        },
        updateNftDisplay:(state, action) => {
            let res = action.payload;
            state.nftDisplay = res.data;
        },
        updateWalletDisplay: (state, action) => {
            let res = action.payload;
            state.walletDisplay = res.data;
        },
        updateCurrency: (state, action) => {
            let res = action.payload;
            state.currencyCode = res;
            localStorage.setItem('currencyCode', res);
        },

        setTransferStats: (state, action) => {
            state.transferStats = action.payload;
        },

        updateLoginState: (state, action) => {
            let res = action.payload;
            window.sessionStorage.setItem('loginState', res);
            state.loginState = res;
        },

        updateBankList: (state, action) => {
            let res = action.payload;
            state.bankList = res;
        },

        updatePayoutBankList: (state, action) => {
            let res = action.payload;
            state.payoutBank = res;
        },

        updatePayoutWays: (state, action) => {
            let res = action.payload;
            state.payoutWays = res;
        },

        updateSwapFee: (state, action) => {
            let res = action.payload;
            state.swapFee = res;
        },

        updateCreditConfig: (state, action) => {
            let res = action.payload;
            state.creditConfig = res;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(userProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(getCryptoDisplay.fulfilled, (state, action) => {
                state.cryptoDisplay = action.payload;
            })
            .addCase(centerGetUserFiat.fulfilled, (state, action) => {
                state.fiat = action.payload;
            })
            .addCase(getFiatDisplay.fulfilled, (state, action) => {
                state.fiatDisplay = action.payload;
            })
            .addCase(getNftDisplay.fulfilled, (state, action) => {
                state.nftDisplay = action.payload;
            })
            .addCase(getWalletDisplay.fulfilled, (state, action) => {
                state.walletDisplay = action.payload;
            })
            .addCase(centerGetTokenBalanceList.fulfilled, (state, action) => {
                debugger;
                state.wallet = action.payload;
            })
            .addCase(getListBank.fulfilled, (state, action) => {
                state.bankList = action.payload;
            })
            .addCase(payoutBank.fulfilled, (state, action) => {
                state.payoutBank = action.payload;
            })
            .addCase(payoutPayWays.fulfilled, (state, action) => {
                state.payoutWays = action.payload;
            })
            .addCase(getSwapFee.fulfilled, (state, action) => {
                state.swapFee = action.payload;
            })
            .addCase(getCreditConfig.fulfilled, (state, action) => {
                state.creditConfig = action.payload;
            })
        },
});

export const { updateWalletLoading, updateUser, updateUserToken, updateTransfer, updateWallet, updateFiat, updateCryptoDisplay, updateFiatDisplay, updateNftDisplay, updateWalletDisplay, updateCurrency, setTransferStats, updateLoginState, updateBankList, updatePayoutBankList, updatePayoutWays, updateSwapFee, updateCreditConfig} = userSlice.actions;

export const selectUserData = ({ user }) => user;

export default userSlice.reducer;
