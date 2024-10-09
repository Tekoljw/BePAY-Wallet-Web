import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import Web3 from "../../util/web3";
import utils from '../../util/tools/utils'
import BN from "bn.js";
import { showMessage } from 'app/store/fuse/messageSlice';

import { setPoolConfig } from "../config/index";
import { arrayLookup } from "../../util/tools/function";

const CONST_YEAR_SECOND = (365 * 24 * 3600);

function stringLeftTime(finishTime) {
    //计算剩余的秒数
    const leftTime = finishTime - parseInt(new Date().getTime() / 1000);

    if (leftTime < 0) return "00:00:00";

    var days = parseInt(leftTime / 60 / 60 / 24, 10); //计算剩余的天数
    if (days == 0) {
        days = "";
    } else {
        days = days + "d";
    }

    var hours = parseInt(leftTime / 60 / 60 % 24, 10); //计算剩余的小时
    if (hours < 10) {
        hours = "0" + hours;
    }

    var minutes = parseInt(leftTime / 60 % 60, 10);//计算剩余的分钟
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    var seconds = parseInt(leftTime % 60, 10);//计算剩余的秒数
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return `${days} ${hours}:${minutes}:${seconds} `;
}

// action/thunk
// 获取质押配置信息
export const getPoolConfig = createAsyncThunk(
    '/pool/config',
    async (settings, { dispatch, getState }) => {

        const { config } = getState();

        let bReload = false;
        settings = settings || {};

        let data = {
            networkId: settings.networkId,          // 可选 没有就是用户当前选择的网络
            type: settings.type,                    // 可选 没有就是代币类型 1
        };

        if (settings.reload) {
            bReload = settings.reload;
        }

        let strKey = data.networkId + "-" + data.type;

        if (config.poolConfig && config.poolConfig[strKey] && Object.entries(config.poolConfig[strKey]).length > 0) {
            if (!bReload) {
                return config.poolConfig[strKey];
            }
        }
        const configData = await React.$api("pool.config", data);

        if (configData.errno === 0) {
            // 解析和运算关联参数
            if (configData.data && configData.data.config && configData.data.config.length > 0) {
                let configList = configData.data.config;
                let sumList = configData.data.sum || [];

                configList.forEach((configItem, index) => {

                    // 确保格式
                    configItem.shareTime = Number(configItem.shareTime);
                    configItem.lockTime = Number(configItem.lockTime);
                    configItem.startTime = Number(configItem.startTime);
                    configItem.mineBalance = Number(configItem.mineBalance);
                    configItem.stakeBalance = Number(configItem.stakeBalance);
                    configItem.shareRate = Number(configItem.shareRate);

                    let calculator = {
                        config: Object.assign({}, configItem),
                        sum: null,

                        // 保存关联配置
                        saveSumConfig: function (sumItem) {
                            this.sum = sumItem;

                            // 确保格式
                            this.sum.finishTime = Number(this.sum.finishTime);
                            this.sum.sourceAmount = Number(this.sum.sourceAmount);
                        },

                        // 是否存在质押
                        hasStake: function () {
                            if (this.sum) return true;
                            return false;
                        },

                        // 获取质押总额
                        getTotalStake: function () {
                            if (this.config) return this.config.stakeBalance;
                            return "";
                        },

                        // 获取我的质押数额
                        getMyStake: function () {
                            if (this.sum) return this.sum.sourceAmount;
                            return 0;
                        },

                        // 计算质押剩余时间
                        getLeftTime: function () {
                            if (this.sum) {
                                let nowTime = parseInt(new Date().getTime() / 1000);
                                let awardTime = Math.ceil((nowTime - this.config.startTime) / this.config.shareTime)
                                    * this.config.shareTime + this.config.startTime;

                                return stringLeftTime(Math.min(this.sum.finishTime, awardTime));
                            }
                            return "";
                        },

                        // 获取我的收益
                        getMyRevenue: function () {
                            let nowTime = parseInt(new Date().getTime() / 1000);

                            if (this.sum && this.config.startTime < nowTime) {
                                // 质押已经过期
                                if (this.sum.finishTime < nowTime) {
                                    return 0;
                                }

                                // 计算下一轮发放时间
                                let awardTime = Math.ceil((nowTime - this.config.startTime) / this.config.shareTime)
                                    * this.config.shareTime + this.config.startTime;

                                // 计算上一轮发放时间
                                let preSettleTime = awardTime - this.config.shareTime;

                                // 计算用户分享总额
                                let allShareBalance = this.config.mineBalance * this.config.shareRate;

                                // 计算用户资金占比
                                let userRatio = this.sum.sourceAmount / this.config.stakeBalance;

                                // 计算用户时间占比
                                let blankTime = (awardTime - nowTime);

                                if (this.sum.createTime > preSettleTime) {
                                    blankTime += (this.sum.createTime - preSettleTime);
                                }

                                let userTime = Math.max(0, 1 - (blankTime / this.config.shareTime));

                                // 计算用户收益
                                let userShareBalance = allShareBalance * userRatio * userTime;

                                // 保留4位
                                return Number(userShareBalance.toFixed(4));
                            }

                            return 0;
                        },

                        // 计算年化收益率
                        getMyRevenueYearRate: function () {
                            let userShareBalance = this.getMyRevenue();

                            if (userShareBalance > 0 && this.config.shareTime > 0) {
                                let rate = (userShareBalance * 100 / this.sum.sourceAmount) / (this.config.shareTime / CONST_YEAR_SECOND);

                                // 保留2位
                                return Number(rate.toFixed(2));
                            }

                            return 0;
                        },
                    };

                    sumList.some((item) => {
                        if (item.poolId == configItem.id) {
                            calculator.saveSumConfig(item);
                            return true;
                        }
                        return false;
                    });

                    // 保存计算模块
                    configItem.calculator = calculator;
                });
            }

            dispatch(setPoolConfig(configData));
            return configData.data;
        } else {
            dispatch(showMessage({ message: configData.errmsg, code: 2 }));
        }
    }
);

// 质押记录
export const getPoolOrderList = createAsyncThunk(
    'pool/getPoolOrderList',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            poolId: settings.poolId,            // 可选 没有就是所有
            txStatus: settings.txStatus,        // 可选 没有就是所有
            page: settings.page,
            limit: settings.limit,
        };

        const resultData = await React.$api("pool.getOrderList", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 中心化钱包进行质押
export const directPoolToken = createAsyncThunk(
    'pool/directPoolToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            poolId: settings.poolId,
            amount: settings.amount,
        };

        const resultData = await React.$api("pool.directPoolToken", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            dispatch(showMessage({ message: directPoolToken.errmsg, code: 2 }));
        }
    }
);

// 去中心化钱包质押
export const goPoolToken = createAsyncThunk(
    'pool/goPoolToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const { config, user } = getState();
        let amount = settings.amount || 0;
        const poolId = settings.poolId || 0;
        const poolType = config.poolType;
        const networkId = user.userInfo.networkId;
        const poolName = arrayLookup(config.poolConfig[networkId + '-' + poolType].config, 'id', poolId, 'name');
        const symbol = arrayLookup(config.poolConfig[networkId + '-' + poolType].config, 'id', poolId, 'sourceSymbol');
        const symbolAddress = arrayLookup(config.symbols, 'symbol', symbol, 'address');
        const type = arrayLookup(config.symbols, 'symbol', symbol, 'type');
        const symbolecimals = arrayLookup(config.symbols, 'symbol', symbol, 'decimals');

        if (symbolAddress.length === 0) {
            dispatch(showMessage({ message: "error_105", code: 2 }));
            return false
        }
        if (type === 0) {
            dispatch(showMessage({ message: "error_106", code: 2 }));
            return false
        }

        // 代币合约
        const symbolConstruct = utils.contractAbi('USGT');
        const symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAddress);
        // 质押合约
        const poolForTokenConstruct = utils.contractAbi('PoolForToken');
        const poolForTokenConstructObj = await utils.contractAt(poolForTokenConstruct, config.contactAddress[networkId].PoolForToken);

        // 转换金额
        amount = new BN(10).pow(new BN(symbolecimals)).mul(new BN(amount));

        try {
            // 授权
            const approveRes = await symbolConstructObj.approve(config.contactAddress[networkId].PoolForToken, amount, {
                from: user.userInfo.address
            });
            console.log('approveRes ====> ', approveRes);
            // 合约质押
            const poolTokenRes = await poolForTokenConstructObj.PoolToken(poolName, amount, {
                from: user.userInfo.address
            });
            console.log('poolTokenRes', poolTokenRes)

            dispatch(afterPoolToken({
                txId: poolTokenRes.tx,
                poolId: poolId
            }));
        } catch (e) {
            dispatch(showMessage({ message: e.errmsg, code: 2 }));
        }
    }
);

// 去中心化报告质押交易进行验证
export const afterPoolToken = createAsyncThunk(
    'pool/afterPoolToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        let data = {
            poolId: settings.poolId,
            txId: settings.txId,
        };

        const resultData = await React.$api("pool.afterPoolToken", data);

        if (resultData.errno === 0) {
            // dispatch(showMessage({ message: 'success' }));
            return resultData.data;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 去中心化报告解除质押交易进行验证
export const takeBackPoolToken = createAsyncThunk(
    'pool/takeBackPoolToken',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            orderId: settings.orderId,
        };

        const resultData = await React.$api("pool.takeBackPoolToken", data);

        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            // return resultData.data;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);
