import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';

// import { setSwapConfig } from "../config/index";

// action/thunk
// 获取兑换支持的配置信息
export const getSwapConfig = createAsyncThunk(
    '/swap/config',
    async (settings, { dispatch, getState }) => {

        const { config } = getState();

        let bReload = false;
        if (settings && settings.reload) {
            bReload = settings.reload;
        }

        if (config.swapConfig && Object.entries(config.swapConfig).length > 0 && !bReload) {
            return config.swapConfig;
        }

        const configData = await React.$api("swap.config");

        if (configData.errno === 0) {
            // dispatch(setSwapConfig(configData));
            return configData;
        } else {
            dispatch(showMessage({ message: configData.errmsg, code: 2 }));
        }
    }
);

// 获取兑换 价格信息
export const getSwapPrice = createAsyncThunk(
    '/swap/price',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};

        let data = {
            srcSymbol: settings.srcSymbol,
            dstSymbol: settings.dstSymbol,
            amount: settings.amount,
        };

        const resultData = await React.$api("swap.price", data);

        if (resultData.errno === 0) {
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

export const getSwapFiat = createAsyncThunk(
    '/swap/fiat',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};

        let data = {
            srcSymbol: settings.srcSymbol,
            dstSymbol: settings.dstSymbol,
            amount: settings.amount,
        };

        const resultData = await React.$api("swap.fiat", data);

        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取兑换 价格信息
export const getSwapCrypto = createAsyncThunk(
    '/swap/crypto',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};

        let data = {
            srcSymbol: settings.srcSymbol,
            dstSymbol: settings.dstSymbol,
            amount: settings.amount,
            // 非1比1兑换时
            priceId: settings.priceId,
            qtyBase: settings.qtyBase,
            qtyQuote: settings.qtyQuote,
            price: settings.price,
        };

        const resultData = await React.$api("swap.crypto", data);

        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取兑换订单详情
export const getSwapOrderDetail = createAsyncThunk(
    '/swap/orderDetail',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};

        let data = {
            orderId: settings.orderId,
        };

        const resultData = await React.$api("swap.orderDetail", data);

        if (resultData.errno === 0) {
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);
