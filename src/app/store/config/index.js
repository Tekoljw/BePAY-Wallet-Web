import { createSlice } from '@reduxjs/toolkit';
import React from "react";

const INT_KYC_STATUS_APPROVED = 5;
const INT_KYC_STATUS_SUBMITTED = 6;

// state
const initialState = {
    staticSourceUrl: 'https://static-scource.funibet.com/mechart/logo',
    storageKey: '',
    system: {},
    networks: [],
    phoneCode: '',
    networkInfos: [
        { chainId: 4, chainName: 'ETH Rinkeby', rpcUrl: 'https://rinkeby.infura.io/v3/' },
        { chainId: 1337, chainName: 'Eth Testnet Local', rpcUrl: 'http://15.152.164.27:9082' },
    ],
    currentNetwork: '',
    contactAddress: {},
    symbols: [],
    payment: {},
    nftConfig: {},
    swapConfig: {},
    borrowConfig: {},
    poolType: 1,
    poolConfig: {},
    walletConfig: {
        Metamask: {
            img: 'wallet/assets/images/login/metamask.png'
        },
        Coinbase: {
            img: '/wallet/assets/images/login/icon-right-10.png'
        },
        Walletconnect: {
            img: 'wallet/assets/images/login/icon-right-5.png'
        },
        Atoken: {
            img: 'wallet/assets/images/login/icon-right-11.png'
        },
        TrustWallet: {
            img: 'wallet/assets/images/login/icon-right-12.png'
        }
    },

    kycInfo: {
        isNeedAudit: function () {
            if (this.ldAuditStatus && this.ldAuditStatus == INT_KYC_STATUS_APPROVED) {
                return false;
            }
            return true;
        },

        isAlreadySumbit: function () {
            if (this.ldAuditStatus && this.ldAuditStatus == INT_KYC_STATUS_SUBMITTED) {
                return true;
            }
            return false;
        },

        haveEmail: function () {
            const { user } = React.$store.getState();
            if (this.init && user.profile?.user?.email) {
                return true
            }
            return false
        },

        havePhone: function () {
            const { user } = React.$store.getState();
            // console.log(user.profile?.nation, user.profile?.phone, '111111')
            if (this.init && user.profile?.nation != 0 && user.profile?.phone) {
                return true
            }
            return false
        }
    },
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setStorageKey: (state, action) => {
            let res = action.payload;
            state.storageKey = res.storageKey;
        },
        setConfig: (state, action) => {
            let res = action.payload;
            state.system = res.data;
        },
        setNetworks: (state, action) => {
            let res = action.payload;
            state.networks = res.data;
        },
        setContactAddress: (state, action) => {
            let res = action.payload;

            if (res.errno === 0) {
                state.contactAddress[res.networkId] = res.data;
            }

            return state;
        },
        setSymbols: (state, action) => {
            let res = action.payload;
            state.symbols = res.data;
        },
        setNftConfig: (state, action) => {
            let res = action.payload;
            state.nftConfig = res.data;
        },
        setPaymentConfig: (state, action) => {
            let res = action.payload;
            state.payment = res.data;
        },
        setSwapConfig: (state, action) => {
            let res = action.payload;
            if (res.errno === 0) {
                state.swapConfig = res.data;
            }
        },
        setBorrowConfig: (state, action) => {
            let res = action.payload;
            if (res.errno === 0) {
                if (res.data.length > 0) {
                    let strKey = res.data[0].networkId + "-" + res.data[0].type;
                    state.borrowConfig[strKey] = res.data;
                }
            }
        },
        setPoolConfig: (state, action) => {
            let res = action.payload;
            if (res.errno === 0) {
                if (res.data.config && res.data.config.length > 0) {
                    let strKey = res.data.config[0].networkId + "-" + res.data.config[0].type;
                    state.poolConfig[strKey] = res.data;
                }
            }
        },

        setKycInfo: (state, action) => {
            let res = action.payload;
            if (res.errno === 0) {
                if (res.data) {
                    state.kycInfo = Object.assign(state.kycInfo, res.data);
                } else {
                    state.kycInfo.ldAuditStatus = INT_KYC_STATUS_APPROVED;
                }
                state.kycInfo.init = true
            }
        },

        setPhoneCode: (state, action) => {
            let res = action.payload;
            state.phoneCode = res.phoneCode
        },
    }
});

export const {
    setStorageKey,
    setConfig,
    setNetworks,
    setContactAddress,
    setNftConfig,
    setSwapConfig,
    setBorrowConfig,
    setPoolConfig,
    setSymbols,
    setPaymentConfig,
    setKycInfo,
    setPhoneCode
} = configSlice.actions;

export const selectConfig = ({ config }) => config;

export default configSlice.reducer;
