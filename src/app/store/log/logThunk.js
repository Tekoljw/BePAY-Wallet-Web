import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';

// action/thunk
// 发送信息日志
export const sendLogInfo = createAsyncThunk(
    '/log/logInfo',
    async (settings, { dispatch, getState }) => {

        if (settings === undefined) {
            settings = {logPlatform: 'platform null', logTitle: 'title null', logContent: "content null"};
        }
        if(!settings.logPlatform) {
            settings.logPlatform = "common platform"
        }
        if(!settings.logTitle) {
            settings.logTitle = "common title"
        }
        const kycData = await React.$api("log.logInfo", settings);
        if (kycData.errno === 0) {

        } else {
            dispatch(showMessage({ message: 'send log info error', code: 2 }));
        }
    }
);

// 发送错误日志
export const sendLogError = createAsyncThunk(
    '/log/logError',
    async (settings, { dispatch, getState }) => {

        if (settings === undefined) {
            settings = {logPlatform: 'platform null', logTitle: 'title null', logContent: "content null"};
        }
        if(!settings.logPlatform) {
            settings.logPlatform = "common platform"
        }
        if(!settings.logTitle) {
            settings.logTitle = "common title"
        }
        const kycData = await React.$api("log.logError", settings);
        if (kycData.errno === 0) {

        } else {
            dispatch(showMessage({ message: 'send log info error', code: 2 }));
        }
    }
);

