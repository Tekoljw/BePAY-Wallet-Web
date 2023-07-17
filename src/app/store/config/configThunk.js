import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';
import { setConfig, setNetworks, setContactAddress, setSymbols, setPaymentConfig, setPhoneCode as setPhone } from "./index";

// action/thunk
// 获取config
export const getConfig = createAsyncThunk(
    '/config/fetch',
    async (settings, { dispatch, getState }) => {
        const configData = await React.$api("config.fetch");
        if (configData.errno === 0) {
            dispatch(setConfig(configData));
        }
    }
);

// 获取可用链
export const getNetworks = createAsyncThunk(
    '/user/chain',
    async (settings, { dispatch, getState }) => {
        const { config } = getState();

        let bReload = false;
        if (settings && settings.reload) {
            bReload = settings.reload;
        }

        if (config.networks && Object.entries(config.networks).length > 0) {
            if (!bReload) {
                return;
            }
        }

        const configData = await React.$api("user.chain");
        if (configData.errno === 0) {
            dispatch(setNetworks(configData));
        }
    }
);

// 获取合约信息
export const getContactAddress = createAsyncThunk(
    '/paytoken/address',
    async (settings, { dispatch, getState }) => {

        const { config, user } = getState();

        let bReload = false;
        let networkId;
        if (settings) {
            if (settings.reload) bReload = settings.reload;
            if (settings.networkId) networkId = settings.networkId;
        }

        if (!networkId) {
            networkId = user.userInfo.networkId
        }

        if (config.contactAddress && config.contactAddress[networkId] && Object.entries(config.contactAddress[networkId]).length > 0) {
            if (!bReload) {
                return config.contactAddress[networkId];
            }
        }

        // console.log("config.contactAddress", config.contactAddress, settings);

        let data = {
            networkId: networkId
        };

        const configData = await React.$api("paytoken.address", data);
        configData.networkId = networkId;

        if (configData.errno === 0) {
            dispatch(setContactAddress(configData));
            return configData.data;
        } else {
            dispatch(showMessage({ message: configData.errmsg, code: 2 }));
        }
    }
);

// 获取代币信息
export const getSymbols = createAsyncThunk(
    '/paytoken/list',
    async (settings, { dispatch, getState }) => {
        let data = {
            networkId: ''
        };
        if (settings) {
            data.networkId = settings.networkId
        }
        const configData = await React.$api("paytoken.list", data);
        if (configData.errno === 0) {
            dispatch(setSymbols(configData));
        }
    }
);

// 获取支付配置(法币汇率)
export const paymentConfig = createAsyncThunk(
    '/payment/config',
    async (settings, { dispatch, getState }) => {
        const configData = await React.$api("payment.config");
        if (configData.errno === 0) {
            dispatch(setPaymentConfig(configData));
            return configData.data;
        }
    }
);

// 临时存储key
export const setKey = createAsyncThunk(
    '/security/setKey',
    async (settings, { dispatch, getState }) => {
        const configData = await React.$api("security.setKey");
        if (configData.errno === 0) {
            return true
        }

        return false
    }
);

// 根据IP获取国家区号
export const setPhoneCode = createAsyncThunk(
    '/security/setPhoneCode',
    async (settings, { dispatch, getState }) => {
        // console.log('settings', settings)
        dispatch(setPhone({
            phoneCode: settings.phoneCode || ''
        }))
    }
);

// 获取菜单列表menuList
export const getMenuList = createAsyncThunk(
    '/config/getMenuList',
    async (settings, { dispatch, getState }) => {
        const menuResult = await React.$api("config.menuList")
        if (menuResult.errno === 0) {
            return menuResult.data
        }

        return false
    }
);

