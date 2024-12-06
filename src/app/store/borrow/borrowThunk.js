import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';

import { setBorrowConfig } from "../config/index";
import {showServerErrorTips} from "../../util/tools/function";

// action/thunk
// 获取借贷配置信息
export const getBorrowConfig = createAsyncThunk(
    '/borrow/config',
    async (settings, { dispatch, getState }) => {

        const { config } = getState();

        let bReload = false;
        settings = settings || {};

        let data = {
            networkId: settings.networkId,
            type: settings.type,
        };

        if (settings.reload) {
            bReload = settings.reload;
        }

        let strKey = data.networkId + "-" + data.type;

        if (config.borrowConfig && config.borrowConfig[strKey] && config.borrowConfig[strKey].length > 0) {
            if (!bReload) {
                return config.borrowConfig[strKey];
            }
        }

        const configData = await React.$api("borrow.config", data);

        if (configData.errno === 0) {
            dispatch(setBorrowConfig(configData));
            return configData.data;
        } else {
            showServerErrorTips(dispatch, configData);
        }
    }
);

// 借贷记录
export const getBorrowOrderList = createAsyncThunk(
    'borrow/getBorrowOrderList',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            txStatus: settings.txStatus,
            page: settings.page,
            limit: settings.limit,
        };

        const resultData = await React.$api("borrow.getOrderList", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 去中心化报告借贷交易进行验证
export const afterBorrowToken = createAsyncThunk(
    'borrow/afterBorrowToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            txId: settings.txId,
            borrowId: settings.borrowId,
        };

        const resultData = await React.$api("borrow.afterBorrowToken", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 去中心化报告归还交易进行验证
export const afterRepayToken = createAsyncThunk(
    'borrow/afterRepayToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            txId: settings.txId,
            orderId: settings.orderId,
        };

        const resultData = await React.$api("borrow.afterRepayToken", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 直接使用中心化钱包余额归还交易
export const directRepayToken = createAsyncThunk(
    'borrow/directRepayToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            orderId: settings.orderId,
        };

        const resultData = await React.$api("borrow.directRepayToken", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);