import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import utils from '../../util/tools/utils'
import BN from "bn.js";
import { showMessage } from 'app/store/fuse/messageSlice';
import {arrayLookup, showServerErrorTips} from "../../util/tools/function";
import web3 from "../../util/web3";
// import coinbaseWallet from '../../util/web3/coinbase';
// import trustProvider from '../../util/web3/trustwallet';
import walletEthereum from '../../util/web3/walletEthereum'
import ether from '../../util/web3/walletEthereum'
import Web3 from "web3";
// 去质押
export const goTransfer = createAsyncThunk(
    'transfer/goTransfer',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        const { user } = getState();
        if (user.userInfo.loginType === "web3_wallet") {
            dispatch(sendTransaction({
                amount: settings.amount,
                symbol: settings.symbol,
                address: settings.address,
                activatyId: settings.activatyId,
                isContract: settings.isContract,
                poolName: settings.poolName,
            }));
        } else {
            dispatch(directActive({
                configId: settings.activatyId
            }));
        }
    }

);

// 转账
export const sendTransaction = createAsyncThunk(
    'transfer/sendTransaction',
    async (settings, { dispatch, getState }) => {

        settings = settings || {};
        const { config, user } = getState();
        let amount = settings.amount || 0;
        let symbol = settings.symbol || '';
        let toAddress = settings.address || '';
        let activatyId = settings.activatyId || '';
        let isContract = settings.isContract || false;
        let poolName = settings.poolName || '';
        let networkId = settings.networkId || user.userInfo.networkId
        let symbolAddress = '';
        let type = 0;
        let symbolecimals = 0;
        for (var i = 0; i < config.symbols?.length; i++) {
            if (config.symbols[i].networkId == networkId && config.symbols[i].symbol === symbol) {
                // arrayLookup(config.symbols, 'symbol', symbol, 'address');
                symbolAddress = config.symbols[i].address;
                type = config.symbols[i].type;
                symbolecimals = config.symbols[i].decimals;
            }
        }

        const chainId = await web3.getChainId();
        const tmpNetworkId = arrayLookup(config.networks, 'id', networkId, 'chainId');

        if (chainId != tmpNetworkId) {
            dispatch(showMessage({ message: t('error_41'), code: 3 }));
            return false
        }

        if (symbolAddress.length === 0) {
            dispatch(showMessage({ message: t('error_28'), code: 3 }));
            return false
        }

        // 转换金额
        amount = new BN(10).pow(new BN(symbolecimals)).mul(new BN(amount * 1000000)).div(new BN(1000000));
        // 基础币直接调用转账
        if (type === 0) {
            try {
                amount = '0x' + amount.toString(16);
                window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: user.userInfo.address,
                        to: toAddress,
                        value: amount,
                    }],
                }).then((txHash) => {
                    dispatch(showMessage({ message: 'success', code: 1 }));
                    dispatch(afterActive({ txId: txHash, configId: activatyId }));
                    console.log('txHash ==> ', txHash)
                }).catch((error) => {
                    dispatch(showMessage({ message: error.errmsg, code: 2 }));
                    console.log('error ==> ', error)
                });
                return true
            } catch (e) {
                dispatch(showMessage({ message: e.message, code: 1 }));
                return false
            }
        }

        // 代币合约
        const symbolConstruct = utils.contractAbi('USGT');
        const symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAddress);

        try {
            if (isContract) {
                // 质押合约
                const poolForTokenConstruct = utils.contractAbi('PoolForToken');
                const poolForTokenConstructObj = await utils.contractAt(poolForTokenConstruct, toAddress);

                // 授权
                const approveRes = await symbolConstructObj.approve(toAddress, amount, {
                    from: user.userInfo.address
                });
                console.log('approveRes ====> ', approveRes);
                // 合约质押
                const poolTokenRes = await poolForTokenConstructObj.PoolToken(poolName, amount, {
                    from: user.userInfo.address
                });
                console.log('poolTokenRes', poolTokenRes);

                dispatch(afterActive({ txId: poolTokenRes.tx, configId: activatyId }));
                return true
            }
            // 合约转账
            const transferRes = await symbolConstructObj.transfer(toAddress, amount, {
                from: user.userInfo.address
            });
            console.log('transferRes ====> ', transferRes);
            dispatch(afterActive({ txId: transferRes.tx, configId: activatyId }));
            return true
        } catch (e) {
            dispatch(showMessage({ message: e.message, code: 1 }));
            return false
        }
    }
);



//去中心化钱包转账
export const foxSendTransaction = createAsyncThunk(
    'transfer/foxSendTransaction',
    async (settings, { dispatch, getState }) => {


        console.log(settings, 'settings.............................');
        const { config, user } = getState();
        let notPool = settings.notPool;
        let amount = settings.amount || 0;
        let symbol = settings.symbol || '';
        let toAddress = settings.address || '';
        let networkId = settings.networkId || user.userInfo.networkId
        let symbolAddress = '';
        let type = 0;
        let symbolecimals = 0;
        let nowSymbol = config.symbols.find(sub => sub.networkId === networkId && sub.symbol === symbol);
        if (nowSymbol) {
            symbolAddress = nowSymbol.address;
            type = nowSymbol.type;
            symbolecimals = nowSymbol.decimals;
        }
        if (!symbolAddress) {
            dispatch(showMessage({ message: 'This currency is not currently supported', code: 1 }));
            return false
        }


        // 转换金额
        amount = new BN(10).pow(new BN(symbolecimals)).mul(new BN(amount * 1000000)).div(new BN(1000000));
        // 基础币直接调用转账
        if (type === 0) {
            try {
                amount = '0x' + amount.toString(16);

                const etherPro = await walletEthereum.ether();
                console.log('进来了,111');

                console.log(etherPro);
                // console.log(etherPro.selectedAddress);

                console.log(user.userInfo.address);
                console.log(toAddress);
                console.log(amount);

                etherPro.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: user.userInfo.address,
                        to: toAddress,
                        value: amount,
                    }],
                }).then((txHash) => {
                    dispatch(showMessage({ message: 'success', code: 1 }));
                    if (!notPool) {
                        dispatch(afterActive({ txId: txHash, configId: activatyId }));
                    }
                    console.log('txHash ==> ', txHash)
                    return txHash
                }).catch((error) => {
                    dispatch(showMessage({ message: error.errmsg, code: 2 }));
                    console.log('error ==> ', error)
                });
                return true
            } catch (e) {
                dispatch(showMessage({ message: e.errmsg, code: 2 }));
                return false
            }
        }



        try {

            // 代币合约
            const symbolConstructObj = await utils.contractAt(utils.contractAbi('USGT'), symbolAddress);

            // 合约转账
            const transferRes = await symbolConstructObj.transfer(toAddress, amount, {
                from: user.userInfo.address
            });
            console.log('transferRes ====> ', transferRes);
            if (!notPool) {
                dispatch(afterActive({ txId: transferRes.tx, configId: activatyId }));
            }
            return transferRes.tx;
        } catch (e) {
            dispatch(showMessage({ message: e.errmsg, code: 2 }));
            return false
        }
    }
);

// 手动通知中心化钱包入金
export const manualCryptoNotify = createAsyncThunk(
    'transfer/manualCryptoNotify',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            txId: settings.txId,
            networkId: settings.networkId,
            symbol: settings.symbol,
        };
        const resultData = await React.$api("payment.manualCryptoNotify", data);
        if (resultData.errno !== 0) {
            showServerErrorTips(dispatch, resultData);
        } else {
            // console.log(resultData)
        }
    }

);


// 去中心化钱包激活活动质押
export const afterActive = createAsyncThunk(
    'transfer/afterActive',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        let data = {
            txId: settings.txId,
            configId: settings.configId,
        };
        const resultData = await React.$api("activity.afterActive", data);
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }

);

// 中心化钱包活动质押
export const directActive = createAsyncThunk(
    'transfer/afterActive',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            configId: settings.configId,
        };
        const resultData = await React.$api("activity.directActive", data);
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);

// 取消活动质押
export const releaseActive = createAsyncThunk(
    'transfer/releaseActive',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            configId: settings.activatyId,
        };
        const resultData = await React.$api("activity.releaseActive", data);
        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }

);

// 转账BGT，（内部测试用）
export const sendTransactionBgt = createAsyncThunk(
    'transfer/sendTransactionBgt',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};
        const { config, user } = getState();
        let amount = settings.amount || 0;
        let symbol = settings.symbol || '';
        let toAddress = settings.address || '';
        // const symbolAddress = arrayLookup(config.symbols, 'symbol', symbol, 'address');
        const symbolAddress = '0x48fD4F8268Ae239F8B5991408a847CF9f72f2B12';
        const symbolecimals = 18;


        // 转换金额
        amount = new BN(10).pow(new BN(symbolecimals)).mul(new BN(amount * 1000000)).div(new BN(1000000));

        // 代币合约
        const symbolConstruct = utils.contractAbi('USGT');
        const symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAddress);
        // 合约转账
        const transferRes = await symbolConstructObj.transfer(toAddress, amount, {
            from: user.userInfo.address
        });
        dispatch(showMessage({ message: e.message, code: 1 }));
        console.log('transferRes ====> ', transferRes);
    }
);

// 获取或者编辑出款历史地址
export const editOrQueryWithdrawalHistoryInfo = createAsyncThunk(
    'transfer/editOrQueryWithdrawalHistoryInfo',
    async (settings, { dispatch, getState }) => {
        let data = {
            withdrawalType: settings.withdrawalType,
            currencyType: settings.currencyType,
        };
        if(settings.editId){
            data.editId = settings.editId
        };
        if(settings.note) {
            data.note = settings.note
        }

        const resultData = await React.$api("transfer.editOrQueryWithdrawalHistoryInfo", data);
        if (resultData.errno === 0) {
            return resultData;
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
        }
    }
);
