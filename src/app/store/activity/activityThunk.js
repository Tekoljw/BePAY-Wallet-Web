import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';
import {showServerErrorTips} from "../../util/tools/function";
import { updateActivityInfos, updateActivityConfig, updateActivityControl, updateActivityInfosExpiredTime} from "../user/index";

// 获取活动基础信息接口（赚钱页面）
export const beingFiActivityInfo = createAsyncThunk(
    'activity/beingFiActivityInfo',
    async (settings, { dispatch, getState }) => {
        const state = getState();
        settings = settings || {};
        if (state.user.activityInfos && !settings.forceUpdate && state.user.activityInfosExpiredTime && state.user.activityInfosExpiredTime > new Date().getTime()) {
            return state.user.activityInfos
        } else {
            const resultData = await React.$apiGet("activity.beingFiActivityInfo", {});
            if (resultData.errno === 0) {
                const expiredTime = new Date().getTime() + 3600 * 1000;
                dispatch(updateActivityInfos(resultData));
                dispatch(updateActivityInfosExpiredTime(expiredTime))
                return resultData
            } else {
                showServerErrorTips(dispatch, resultData);
            }   
        }
    }
);

// 获取控制接口（判断活动是否启用）
export const beingFiActivityControl = createAsyncThunk(
    'activity/beingFiActivityControl',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        const state = getState();
        if (state.user.activityControl && !settings.forceUpdate) {
            return state.user.activityControl
        } else {
            const resultData = await React.$apiGet("activity.beingFiActivityControl", {});
            if (resultData.errno === 0) {
               dispatch(updateActivityControl(resultData));
               return resultData
            } else {
                showServerErrorTips(dispatch, resultData);
            }
        }
    }
);

// 获取签到配置
export const signInActivityConfig = createAsyncThunk(
    'activity/signInActivityConfig',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        const state = getState();
        if (state.user.activityConfig && !settings.forceUpdate) {
            return state.user.activityConfig
        } else {
            const resultData = await React.$apiGet("activity.signInActivityConfig", {});
            if (resultData.errno === 0) {
                dispatch(updateActivityConfig(resultData));
                return resultData
            } else {
                showServerErrorTips(dispatch, resultData);
            }
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
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
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
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 获取转盘配置
export const turnTableActivityConfig = createAsyncThunk(
    'activity/turnTableActivityConfig',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const resultData = await React.$apiGet("activity.turnTableActivityConfig", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 获取转盘信息
export const turnTableActivityInfo = createAsyncThunk(
    'activity/turnTableActivityInfo',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$apiGet("activity.turnTableActivityInfo", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 进行转动
export const turntable = createAsyncThunk(
    'activity/turntable',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$api("activity.turntable", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 获取质押挖矿配置
export const tokenPledgeActivityConfig = createAsyncThunk(
    'activity/tokenPledgeActivityConfig',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const resultData = await React.$apiGet("activity.tokenPledgeActivityConfig", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 获取质押挖矿信息
export const tokenPledgeActivityInfo = createAsyncThunk(
    'activity/tokenPledgeActivityInfo',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        
        const resultData = await React.$apiGet("activity.tokenPledgeActivityInfo", {});
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
        }
    }
);

// 质押挖矿
export const pledge = createAsyncThunk(
    'activity/pledge',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            configId: settings.configId,
            pledgeAmount: settings.pledgeAmount
        }
        
        const resultData = await React.$api("activity.pledge", data);
        if (resultData.errno === 0) {
            return resultData
        } else {
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
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
            showServerErrorTips(dispatch, resultData);
        }
    }
);