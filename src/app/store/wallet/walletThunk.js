import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateFiat, updateCryptoDisplay, updateWalletDisplay } from "../user/index";
import { automaticConnectWeb3 } from "../user/userThunk";
import utils_web3 from "../../util/web3"
import { setTransferStats } from '../user'
import BN from "bn.js";

export const WalletConfigDefineMap = {
    "ETH": {
        network: "Ethereum", walletName: "ETH", protol: "ERC20", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'ETH', 'desc2': 'ETH-2'
    },

    "BSC": {
        network: "BSC", walletName: "BSC", protol: "BEP20", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'BSC', 'desc2': 'BSC-2'
    },

    "BTC": {
        network: "Bitcoin", walletName: "BTC", protol: "BTC", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'This address accepts only BTC, transferring here any other coin or WBTC both TRC-20 and ERC-20 will result in fund loss. Please copy BTC address.', 'desc2': 'The minimum deposit amount 0.00005 BTC, lower amount won\'t be credited or refunded.'
    },

    "USDT_TRC": {
        network: "Tron", walletName: "USDT_TRC", protol: "TRC20", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'USDT_TRC', 'desc2': 'USDT_TRC-2'
    },

    "USDT_ERC": {
        network: "Ethereum", walletName: "ETH", protol: "ERC20", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'USDT_ERC', 'desc2': 'USDT_ERC-2'
    },

    "USDT_BTC": {
        network: "Bitcoin", walletName: "BTC", protol: "BTC", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'USDT_ERC', 'desc2': 'USDT_ERC-2'
    },
    "USDT_TRX": {
        network: "Tron", walletName: "USDT_TRX", protol: "TRC20", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'USDT_TRC', 'desc2': 'USDT_TRC-200'
    },
};

// 获取内部法币记账信息
export const centerGetUserFiat = createAsyncThunk(
    'wallet/centerGetUserFiat',
    async (settings, { dispatch, getState }) => {
        const balanceList = await React.$api("wallet.getUserFiat");
        if (balanceList.errno === 0) {
            dispatch(updateFiat(balanceList));
        } else {
            dispatch(showMessage({ message: t('error_2'), code: 2 }));
        }
    }
);

// 获取提现网络配置
export const getWithDrawConfig = createAsyncThunk(
    'wallet/getWithDrawConfig',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("wallet.getWithDrawConfig");
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);

// 预估gas手续费
export const evalTokenTransferFee = createAsyncThunk(
    'wallet/evalTokenTransferFee',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};
        const decimals = settings.decimals;
        let setFee = settings.setFee;

        let data = {
            coinName: settings.coinName,
            walletName: settings.walletName,
            networkId: settings.networkId,
            priceLevel: settings.priceLevel,        // "HIGHER", "NORMAL", "LOW"
        };


        // React.$api("wallet.evalTokenTransferFee", data).then((resultData) => {
        //     if (resultData.errno === 0) {
        //         let fee = 0;
        //         if (resultData.data != 0) {
        //             fee = ((resultData.data / (new BN(10).pow(new BN(decimals)).toNumber())) / 10000).toFixed(6);
        //         }
        //
        //         if (setFee) {
        //             setFee(fee);
        //         }
        //         return resultData;
        //     }
        // });


        const resultData = await React.$api("wallet.evalTokenTransferFee", data);
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);



//手续费
export const cryptoWithdrawFee = createAsyncThunk(
    'wallet/cryptoWithdrawFee',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        let data = {
            networkId: settings.networkId,
            coinName: settings.coinName,
            amount: settings.amount,
        };
        const resultData = await React.$api("wallet.cryptoWithdrawFee", data);
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);

// 获取钱包地址配置信息
export const getWalletAddressConfig = createAsyncThunk(
    'wallet/getWalletAddressConfig',
    async (settings, { dispatch, getState }) => {
        const resultData = await React.$api("wallet.getWalletAddressConfig");
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);

// 获取钱包地址
export const getWalletAddress = createAsyncThunk(

    'wallet/getWalletAddress',

    async (settings, { dispatch, getState }) => {

        console.log(settings);

        settings = settings || {};
        let data = {
            symbol: settings.symbol,
            networkId: settings.networkId,
            walletName: settings.walletName,
        };

        const resultData = await React.$api("wallet.getWalletAddress", data);
        if (resultData.errno === 0) {
            return resultData;
        }
        dispatch(showMessage({ message: t('error_39'), code: 2 }));
    }
);

// 获取钱包地址
export const getAddressListDesc = createAsyncThunk(
    'wallet/getAddressListDesc',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};
        let data = {
            addressDesc: settings.addressDesc,
            address: settings.address,
            networkId: settings.networkId,
            symbol: settings.symbol,
        };

        const resultData = await React.$api("wallet.addOrQueryAddressDesc", data);
        if (resultData.errno === 0) {
            return resultData.data;
        }
        dispatch(showMessage({ message: t('error_39'), code: 2 }));
    }
);

// 判断是否获取过
export const checkWalletAddress = createAsyncThunk(
    'wallet/checkWalletAddress',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            symbol: settings.symbol,
            networkId: settings.networkId,
            walletName: settings.walletName,
        };

        const resultData = await React.$api("wallet.checkWalletAddress", data);
        if (resultData.errno === 0) {
            return resultData;
        }
        dispatch(showMessage({ message: t('error_40'), code: 2 }));
    }
);


// 获取加密货币显示配置
export const getCryptoDisplay = createAsyncThunk(
    'account/getCryptoDisplay',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getCryptoDisplay");
        if (resultData.errno === 0) {
            // dispatch(updateCryptoDisplay(resultData));
            return resultData;
        }
    }
);

// 设置加密货币显示配置
export const setCryptoDisplay = createAsyncThunk(
    'account/setCryptoDisplay',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        // symbols 格式 { name:"XXX", show: true }
        if (settings.symbols && !Array.isArray(settings.symbols)) {
            settings.symbols = [settings.symbols];
        }

        let data = settings.symbols || [];

        const resultData = await React.$api("account.setCryptoDisplay", data);
        if (resultData.errno === 0) {
            dispatch(updateCryptoDisplay(resultData));
            return resultData;
        }
    }
);

// 获取去中心化加密货币显示配置
export const getWalletDisplay = createAsyncThunk(
    'account/getWalletDisplay',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getWalletDisplay");
        // if (resultData.errno === 0) {
        dispatch(updateWalletDisplay(resultData));
        return resultData;
        // }
    }
);

// 设置去中心化加密货币显示配置
export const setWalletDisplay = createAsyncThunk(
    'account/setWalletDisplay',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        // // symbols 格式 [{ name:"XXX", show: true }]
        if (settings.symbols && !Array.isArray(settings.symbols)) {
            settings.symbols = [settings.symbols];
        }

        let data = settings.symbols || [];

        const resultData = await React.$api("account.setWalletDisplay", data);
        if (resultData.errno === 0) {
            dispatch(updateWalletDisplay(resultData));
            return resultData;
        }
    }
);

// 获取法币显示配置
export const getFiatDisplay = createAsyncThunk(
    'account/getFiatDisplay',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getCurrencyDisplay");
        if (resultData.errno === 0) {
            // dispatch(updateWalletDisplay(resultData));
            return resultData;
        }
    }
);

// 设置法币显示配置
export const setCurrencyDisplay = createAsyncThunk(
    'account/setCurrencyDisplay',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        // // symbols 格式 [{ name:"XXX", show: true }]
        if (settings.symbols && !Array.isArray(settings.symbols)) {
            settings.symbols = [settings.symbols];
        }

        let data = settings.symbols || [];

        const resultData = await React.$api("account.setCurrencyDisplay", data);
        if (resultData.errno === 0) {
            // dispatch(updateWalletDisplay(resultData));
            return resultData;
        }
    }
);

// 获取NFT显示配置
export const getNftDisplay = createAsyncThunk(
    'account/getNftDisplay',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getNftDisplay");
        if (resultData.errno === 0) {
            // dispatch(updateWalletDisplay(resultData));
            return resultData;
        }
    }
);
// 设置法币显示配置
export const setNftDisplay = createAsyncThunk(
    'account/setNftDisplay',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        // // symbols 格式 [{ name:"XXX", show: true }]
        if (settings.symbols && !Array.isArray(settings.symbols)) {
            settings.symbols = [settings.symbols];
        }

        let data = settings.symbols || [];

        const resultData = await React.$api("account.setNftDisplay", data);
        if (resultData.errno === 0) {
            // dispatch(updateWalletDisplay(resultData));
            return resultData;
        }
    }
);


// 获取提现历史地址
export const getWithdrawHistoryAddress = createAsyncThunk(
    'account/getWithdrawHistoryAddress',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getWithdrawHistoryAddress");
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);

// 获取内部转账历史地址
export const getSendTipsHistoryAddress = createAsyncThunk(
    'account/getSendTipsHistoryAddress',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("account.getSendTipsHistoryAddress");
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);
// 删除内部转账历史地址
export const delSendTipsHistoryAddress = createAsyncThunk(
    'account/removeHistoryAddress',
    async (settings, { dispatch, getState }) => {
        // let data = settings.symbols || [];
        const resultData = await React.$api("account.removeHistoryAddress", { address: settings, historyType: 2 });
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);
// 删除体现历史地址
export const delWithdrawHistoryAddress = createAsyncThunk(
    'account/removeHistoryAddress',
    async (settings, { dispatch, getState }) => {
        // let data = settings.symbols || [];
        const resultData = await React.$api("account.removeHistoryAddress", { address: settings, historyType: 1 });
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);
// 获取两部验证配置信息
export const getWithdrawTransferStats = createAsyncThunk(
    'account/getWithdrawTransferStats',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("wallet.getTransferStats");
        if (resultData.errno === 0) {
            dispatch(setTransferStats(resultData.data));
            return resultData;
        }
    }
);

// nft config
export const getNftConfig = createAsyncThunk(
    'nft/getNftConfig',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("nft.config");
        if (resultData.errno === 0) {
            return resultData;
        }
    }
);

// 获取中心钱包nft信息
export const centerGetNftList = createAsyncThunk(
    'nft/centerGetNftList',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("nft.centerGetNftList");
        if (resultData.errno === 0) {
            return resultData.data;
        }
    }
);

// 获取nft提现手续费
export const evalWithdrawFee = createAsyncThunk(
    'nft/evalWithdrawFee',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("nft.evalWithdrawFee", settings);
        if (resultData.errno === 0) {
            return resultData.data;
        }
    }
);

// 热钱包nft提现
export const nftWithdraw = createAsyncThunk(
    'nft/nftWithdraw',
    async (settings, { dispatch, getState }) => {

        const resultData = await React.$api("nft.withdraw", settings);
        if (resultData.errno === 0) {
            return resultData.data;
        } else {
            dispatch(showMessage({ message: t('error_22'), code: 2 }));
        }
    }
);

// 创建PIN
export const createPin = createAsyncThunk(
    'pin/setPaymentPassword',
    async (settings, { dispatch, getState }) => {
        let data = {
            codeType: 12,
            paymentPassword: settings.paymentPassword ?? ''
        }

        const resultData = await React.$api("security.setPaymentPassword", data);
        if (resultData.errno === 0) {
            return true
        } else {
            dispatch(showMessage({ message: t('error_22'), code: 2 }));
        }
    }
);

// 验证PIN
export const verifyPin = createAsyncThunk(
    'pin/verifyPaymentPassword',
    async (settings, { dispatch, getState }) => {
        let data = {
            paymentPassword: settings.paymentPassword ?? ''
        }

        const resultData = await React.$api("security.verifyPaymentPassword", data);
        if (resultData.errno === 0) {
            return resultData.data
        } else {
            return false
        }
    }
);
