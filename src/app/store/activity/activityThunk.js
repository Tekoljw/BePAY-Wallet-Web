import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';

// 获取活动基础信息接口（赚钱页面）
export const beingFiActivityInfo = createAsyncThunk(
    'activity/beingFiActivityInfo',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const resultData = await React.$apiGet("activity.beingFiActivityInfo", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取控制接口（判断活动是否启用）
export const beingFiActivityControl = createAsyncThunk(
    'activity/beingFiActivityControl',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const resultData = await React.$apiGet("activity.beingFiActivityControl", {});
        if (resultData.errno === 0) {
           return resultData
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取签到配置
export const signInActivityConfig = createAsyncThunk(
    'activity/signInActivityConfig',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const resultData = await React.$apiGet("activity.signInActivityConfig", {});
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取签到信息
export const signInActivityInfo = createAsyncThunk(
    'activity/signInActivityInfo',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$apiGet("activity.signInActivityInfo", {});
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 进行签到
export const signIn = createAsyncThunk(
    'activity/signIn',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$api("activity.signIn", {});
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 活期利息信息
export const demandInterestActivity = createAsyncThunk(
    'activity/demandInterestActivity',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let params = {
            day: 180
        }

        const resultData = await React.$apiGet('activity.demandInterestActivity' , params);
        if (resultData.errno === 0) {
           return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 支付分成
export const walletPayRewardActivity = createAsyncThunk(
    'activity/walletPayRewardActivity',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$apiGet("activity.walletPayRewardActivity", {});
        if (resultData.errno === 0) {
           return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// swap奖励信息
export const swapRewardActivity = createAsyncThunk(
    'activity/swapRewardActivity',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$apiGet("activity.swapRewardActivity", {});
        if (resultData.errno === 0) {
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 邀请用户处理
export const uniqueInvite = createAsyncThunk(
    'activity/uniqueInvite',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            inviteCode: settings.inviteCode
        };
        
        const resultData = await React.$api("activity.uniqueInvite", data);
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取邀请奖励配置
export const getInviteRewardConfig = createAsyncThunk(
    'activity/getInviteRewardConfig',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        const resultData = await React.$apiGet("activity.getInviteRewardConfig", {});
        if (resultData.errno === 0) {
           return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 重置邀请关系
export const resetInvite = createAsyncThunk(
    'activity/resetInvite',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            inviteCode: settings.inviteCode
        };

        const resultData = await React.$api("activity.resetInvite", {});
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取邀请的奖励的汇总信息
export const getInviteRewardAllInfo = createAsyncThunk(
    'activity/getInviteRewardAllInfo',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        const resultData = await React.$apiGet("activity.getInviteRewardAllInfo", {});
        if (resultData.errno === 0) {
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 获取邀请的某个活动的详细信息
export const getInviteRewardDetail = createAsyncThunk(
    'activity/getInviteRewardDetail',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        let data = {
            activityId: settings.activityId
        }
        const resultData = await React.$apiGet("activity.getInviteRewardDetail", data);
        if (resultData.errno === 0) {
            return resultData
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);