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
        if (settings === undefined) {
            settings = settings || {};
        }

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
            email: settings.email,
            phoneCountry: settings.phoneCountry,
            phoneNumber: settings.phoneNumber,
            firstName: settings.firstName,
            middleName: settings.middleName,
            lastName: settings.lastName,
            birthDate: settings.birthDate,
            country: settings.country,
            state: settings.state,
            city: settings.city,
            address: settings.address,
            addressTwo: settings.addressTwo,
            zipcode: settings.zipcode,
            idNo: settings.idNo,
            idType: settings.idType,
            idFrontUrl: settings.idFrontUrl,
            idBackUrl: settings.idBackUrl,
            selfPhotoUrl: settings.selfPhotoUrl,
            proofOfAddressUrl: settings.proofOfAddressUrl,
            usSsn: settings.usSsn,
        };
        console.log(data, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
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

// 获取StarPay的法币支付参数
export const getStarPayPaymentOption = createAsyncThunk(
    '/payment/StarPay/paymentOption',
    async (settings, { dispatch, getState }) => {
        const paymentOption = await React.$api("payment.StarPay.paymentOption");
        // 直接返回处理
        return paymentOption;
    }
);

// 获取StarPay的加密货币支付参数
export const getStarPayCryptoTarget = createAsyncThunk(
    '/payment/StarPay/cryptoTarget',
    async (settings, { dispatch, getState }) => {
        const cryptoTarget = await React.$api("payment.StarPay.cryptoTarget");
        // 直接返回处理
        return cryptoTarget;
    }
);

export const getStarPayConfig = createAsyncThunk(
    '/payment/StarPay/config',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.StarPay.config", settings);
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
            return false
        }
    }
);

// 法币提现(外部)
export const makeWithdrawOrder = createAsyncThunk(
    'payment/makeWithdrawOrder',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.makeWithdrawOrder", settings);
        return result
    }
);

// 法币提现(内部)
export const fiatSendTips = createAsyncThunk(
    'transfer/fiat/sendTips',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.sendTips", settings);
        return result
    }
);

// 法币提现手续费
export const getFiatFee = createAsyncThunk(
    'payment/getFiatFee',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.fiatWithdrawFee", settings);
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


// 法币提币银行类型
export const payoutBank = createAsyncThunk(
    'payment/payoutBank',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.payoutBank");
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }))
        }
    }
);

// 法币提币出金方式
export const payoutPayWays = createAsyncThunk(
    'payment/payoutPayWays',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.payoutPayWays");
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 信用卡分类
export const getCreditConfig = createAsyncThunk(
    'credit/creditConfig',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.config");
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 申请信用卡
export const applyCreditCard = createAsyncThunk(
    'credit/applyCreditCard',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.applyCreditCard", settings);
        if (result.errno === 0) {
            if (result.data.status === 'success') {
                dispatch(showMessage({ message: result.errmsg, code: 1 }));
            } else {
                dispatch(showMessage({ message: result.data.msg, code: 2 }));
            }
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 更新信用卡状态（删除，更新）
export const creditCardUpdate = createAsyncThunk(
    'credit/creditCardUpdate',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.creditCardUpdate", settings);
        if (result.errno === 0) {
            if(!settings.ignoreMessage){
                if (result.data.status === 'success') {
                    dispatch(showMessage({ message: result.errmsg, code: 1 }));
                } else {
                    dispatch(showMessage({ message: result.data.msg, code: 2 }));
                }
            }
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 换卡
export const exchangeCreditCard = createAsyncThunk(
    '/credit/exchangeCreditCard',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.exchangeCreditCard", settings);
        return result;
        if (result.errno === 0) {
            if(!settings.ignoreMessage){
                if (result.data.status === 'success') {
                    dispatch(showMessage({ message: result.errmsg, code: 1 }));
                } else {
                    dispatch(showMessage({ message: result.data.msg, code: 2 }));
                }
            }
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 获取信用卡余额
export const getCreditCardBalance = createAsyncThunk(
    'credit/queryCreditBalance',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.queryCreditBalance", settings);
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);


// 获取信用卡列表
export const getUserCreditCard = createAsyncThunk(
    'credit/getUserCreditCard',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.getUserCreditCard");
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 信用卡转入（crypto）
export const creditCardCryptoDeposit = createAsyncThunk(
    'credit/creditCardCryptoDeposit',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.creditCardCryptoDeposit", settings);
        return result
        // if (result.errno === 0) {
        //     return result.data
        // } else {
        //     dispatch(showMessage({ message: result.errmsg, code: 2 }));
        // }
    }
);

// 信用卡转出（crypto）
export const creditCardCryptoWithdraw = createAsyncThunk(
    'credit/creditCardCryptoWithdraw',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("credit.creditCardCryptoWithdraw", settings);
        return result
        // if (result.errno === 0) {
        //     return result.data
        // } else {
        //     dispatch(showMessage({ message: result.errmsg, code: 2 }));
        // }
    }
);

// 获取法币充值订单状态
export const getDepositeFiatOrderStatus = createAsyncThunk(
    'payment/fiatPayQueryOrder',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("payment.fiatPayQueryOrder", settings);
        return result
    }
);

