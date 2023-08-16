import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';
import { setKycInfo } from "../config/index";

import format from 'date-fns/format';

// action/thunk
// 获取kyc状态
export const getKycInfo = createAsyncThunk(
    '/payment/kycInfo',
    async (settings, { dispatch, getState }) => {
        let unloginerror = settings.unloginerror ?? true;
        const kycData = await React.$api("payment.kycInfo");

        if (kycData.errno === 0) {
            // 直接返回处理
            if (kycData.data && kycData.data.birthDate != undefined) {
                kycData.data.birthDate = format(new Date(kycData.data.birthDate), 'yyyy-MM-dd');
            }
            await dispatch(setKycInfo(kycData));
            return kycData;
        } else {
            if (!unloginerror && kycData.errmsg === 'unlogin') {
                return false
            }
            dispatch(showMessage({ message: kycData.errmsg, code: 2 }));
        }
    }
);


export const updateKycInfo = createAsyncThunk(
    '/payment/kycUpdate',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const { config } = getState();
        const kycInfo = config.kycInfo;

        let data = {
            firstName: settings.firstName == kycInfo.firstName ? undefined : settings.firstName,
            middleName: settings.middleName == kycInfo.middleName ? undefined : settings.middleName,
            lastName: settings.lastName == kycInfo.lastName ? undefined : settings.lastName,
            birthDate: settings.birthDate == kycInfo.birthDate ? undefined : settings.birthDate,
            country: settings.country == kycInfo.country ? undefined : settings.country,
            state: settings.state == kycInfo.state ? undefined : settings.state,
            city: settings.city == kycInfo.city ? undefined : settings.city,
            address: settings.address == kycInfo.address ? undefined : settings.address,
            addressTwo: settings.addressTwo == kycInfo.addressTwo ? undefined : settings.addressTwo,
            zipcode: settings.zipcode == kycInfo.zipcode ? undefined : settings.zipcode,
            idNo: settings.idNo == kycInfo.idNo ? undefined : settings.idNo,
            idType: settings.idType == kycInfo.idType ? undefined : settings.idType,
            idFrontUrl: settings.idFrontUrl == kycInfo.idFrontUrl ? undefined : settings.idFrontUrl,
            idBackUrl: settings.idBackUrl == kycInfo.idBackUrl ? undefined : settings.idBackUrl,
            selfPhotoUrl: settings.selfPhotoUrl == kycInfo.selfPhotoUrl ? undefined : settings.selfPhotoUrl,
            proofOfAddressUrl: settings.proofOfAddressUrl == kycInfo.proofOfAddressUrl ? undefined : settings.proofOfAddressUrl,
            usSsn: settings.usSsn == kycInfo.usSsn ? undefined : settings.usSsn,
        };

        const kycData = await React.$api("payment.kycUpdate", data);

        if (kycData.errno === 0) {
            // 直接返回处理
            dispatch(showMessage({ message: 'saved', code: 1 }));
            return true;
        } else {
            dispatch(showMessage({ message: kycData.errmsg, code: 2 }));
        }

        return false;
    }
);

// 获取kyc状态
export const submitKycInfo = createAsyncThunk(
    '/payment/kycSubmit',
    async (settings, { dispatch, getState }) => {
        const kycData = await React.$api("payment.kycSubmit");

        if (kycData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true;
        } else {
            dispatch(showMessage({ message: kycData.errmsg, code: 2 }));
        }

        return false;
    }
);

// 获取LegendTrading配置参数
export const getLegendTradingConfig = createAsyncThunk(
    '/payment/LegendTrading/config',
    async (settings, { dispatch, getState }) => {
        const configData = await React.$api("payment.LegendTrading.config");
        // 直接返回处理
        return configData;
    }
);

// 获取FaTPay配置参数
export const getFaTPayConfig = createAsyncThunk(
    '/payment/FaTPay/config',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        // let data = {
        //     walletAddress: settings.walletAddress,
        //     walletAddressLocked: settings.walletAddressLocked,
        //     walletAddressHidden: settings.walletAddressHidden,
        //     walletAddressTag: settings.walletAddressTag,
        //     ext: settings.ext,
        // };

        const configData = await React.$api("payment.FaTPay.config", settings);
        // 直接返回处理
        return configData;
    }
);

// 获取LegendTrading的法币支付参数
export const getLegendTradingPaymentOption = createAsyncThunk(
    '/payment/LegendTrading/paymentOption',
    async (settings, { dispatch, getState }) => {
        const paymentOption = await React.$api("payment.LegendTrading.paymentOption");
        // 直接返回处理
        return paymentOption;
    }
);

// 获取LegendTrading的加密货币支付参数
export const getLegendTradingCryptoTarget = createAsyncThunk(
    '/payment/LegendTrading/cryptoTarget',
    async (settings, { dispatch, getState }) => {
        const cryptoTarget = await React.$api("payment.LegendTrading.cryptoTarget");
        // 直接返回处理
        return cryptoTarget;
    }
);

// 获取FaTPay的法币支付参数
export const getFaTPayPaymentOption = createAsyncThunk(
    '/payment/FaTPay/paymentOption',
    async (settings, { dispatch, getState }) => {
        const paymentOption = await React.$api("payment.FaTPay.paymentOption");
        // 直接返回处理
        return paymentOption;
    }
);

// 获取LegendTrading的加密货币支付参数
export const getFaTPayCryptoTarget = createAsyncThunk(
    '/payment/FaTPay/cryptoTarget',
    async (settings, { dispatch, getState }) => {
        const cryptoTarget = await React.$api("payment.FaTPay.cryptoTarget");
        // 直接返回处理
        return cryptoTarget;
    }
);

// 法币提现
export const makeWithdrawOrder = createAsyncThunk(
    'payment/makeWithdrawOrder',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.makeWithdrawOrder", settings);
        console.log(result.errno === 0, 'result')
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
            return false
        }
    }
);

// 法币充值
export const makeOrder = createAsyncThunk(
    'payment/makeOrder',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.makeOrder", settings);
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);
