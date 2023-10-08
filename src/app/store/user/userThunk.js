import { createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from "../../util/web3";
import React from "react";
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateTransfer, updateUser, updateUserToken, updateWallet } from "./index";
import utils from "../../util/tools/utils";
import BN from "bn.js";
import { getWithdrawTransferStats } from '../wallet/walletThunk';
import coinbaseWallet from '../../util/web3/coinbase';
import walletEthereum from '../../util/web3/walletEthereum';
import settingsConfig from 'app/configs/settingsConfig';
import loginWays from '../../main/login/loginWays'
import { EthereumProvider } from '@walletconnect/ethereum-provider';

// 获取用户信息
export const userProfile = createAsyncThunk(
    'user/userProfile',
    async (settings, { dispatch, getState }) => {
        const userProfile = await React.$api("user.profile");
        if (userProfile.errno === 0) {
            dispatch(updateUser(userProfile));
        } else {
            dispatch(showMessage({ message: userProfile.errmsg, code: 2 }));
        }
    }
);
// 设置CurrencySelect
export const setCurrencySelect = createAsyncThunk(
    'setCurrencySelect',
    async (settings, { dispatch, getState }) => {
        let data = {
            currencyType: settings.currencyType,
            currencySymbol: settings.currencySymbol,
        };
        const setCurrencySelect = await React.$api("account.setCurrencySelect", data);
        if (setCurrencySelect.errno === 0) {
            // dispatch(updateUser(setCurrencySelect));
        } else {
            dispatch(showMessage({ message: setCurrencySelect.errmsg, code: 2 }));
        }
    }
);
export const getCurrencySelect = createAsyncThunk(
    'getCurrencySelect',
    async (settings, { dispatch, getState }) => {
        const getCurrencySelect = await React.$api("account.getCurrencySelect");
        if (getCurrencySelect.errno === 0) {
            // dispatch(updateUser(getCurrencySelect));
        } else {
            dispatch(showMessage({ message: getCurrencySelect.errmsg, code: 2 }));
        }
    }
);



// 去中心以太链钱包登录
export const doLogin = createAsyncThunk(
    'user/doLogin',
    async (settings, { dispatch, getState }) => {
        let res = loginWays.list.find(function (item) {
            return item.id === settings.id
        })
        let walletType = res.name;
        if (walletType == "MetaMask") {
            walletType = 'metamask';
        }

        const { config, user } = getState();
        const web3 = await Web3.connectWeb3(walletType);
        let address = web3.coinbase;


        const userBindWallet = user.userInfo.bindWallet ?? false;
        if (userBindWallet) {
            if (user.profile?.user?.address !== address) {
                dispatch(showMessage({ message: 'The address is different from the previous one, please log in again', code: 2 }));
                return false;
            }
        }
        let signData = await Web3.loginWallet(address);

        let data = {
            userAddress: address,
            signature: signData.signature,
            timestamp: signData.timestamp,
            regWallet: walletType,
            agentId: settings?.agentId,
        };

        const userLoginData = await React.$api("user.login", data);

        if (userLoginData.errno === 0) {
            window.localStorage.setItem('isDecentralized', 1);
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            window.localStorage.setItem('walletname', walletType);
            // dispatch(updateUser(userLoginData));
            dispatch(updateUser({ ...userLoginData, pathname: settings.pathname }));
            if (config.storageKey) {
                React.$api("security.setKey", {
                    key: config.storageKey,
                    value: userLoginData.data.token
                })
            }
        } else {
            dispatch(showMessage({ message: userLoginData.errmsg, code: 2 }));
        }
    }
);




// 手机号/邮箱 登录
export const mobileLogin = createAsyncThunk(
    'user/mobileLogin',
    async (settings, { dispatch, getState }) => {
        const { config } = getState();

        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            email: settings.email,
            password: settings.password,
            // agentId: settings.agentId,
        };
        const userLoginData = await React.$api("user.mobileLogin", data);
        if (userLoginData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userLoginData));
            // console.log('config.storageKey', config.storageKey);
            if (config.storageKey) {
                React.$api("security.setKey", {
                    key: config.storageKey,
                    value: userLoginData.data.token
                })
            }
        } else {
            dispatch(showMessage({ message: userLoginData.errmsg, code: 2 }));
        }
    }
);

// facebook 登录
export const facebookLoginApi = createAsyncThunk(
    'user/facebookLogin',
    async (settings, { dispatch, getState }) => {
        const { config } = getState();
        const userLoginData = await React.$api("user.facebookLogin", settings);
        if (userLoginData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userLoginData));
            if (config.storageKey) {
                React.$api("security.setKey", {
                    key: config.storageKey,
                    value: userLoginData.data.token
                })
            }
        } else {
            dispatch(showMessage({ message: userLoginData.errmsg, code: 2 }));
        }
    }
);

// telegram 登录
export const telegramLoginApi = createAsyncThunk(
    'user/telegramLogin',
    async (settings, { dispatch, getState }) => {
        const { config } = getState();
        const userLoginData = await React.$api("user.telegramLogin", settings);
        if (userLoginData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userLoginData));
            if (config.storageKey) {
                React.$api("security.setKey", {
                    key: config.storageKey,
                    value: userLoginData.data.token
                })
            }
        } else {
            dispatch(showMessage({ message: userLoginData.errmsg, code: 2 }));
        }
    }
);

// google 登录
export const googleLoginApi = createAsyncThunk(
    'user/googleLoginApi',
    async (settings, { dispatch, getState }) => {
        const { config } = getState();
        const userLoginData = await React.$api("user.googleLogin", settings);
        if (userLoginData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userLoginData));
            if (config.storageKey) {
                React.$api("security.setKey", {
                    key: config.storageKey,
                    value: userLoginData.data.token
                })
            }
        } else {
            dispatch(showMessage({ message: userLoginData.errmsg, code: 2 }));
        }
    }
);

// 自动连接钱包
export const automaticConnectWeb3 = createAsyncThunk(
    'user/automaticConnectWeb3',
    async (settings, { dispatch, getState }) => {
        const { user } = getState();
        if (user.userInfo.loginType == 1) {
            if (!window.wallet) {
                const web3 = await Web3.connectWeb3();
            }
        }
    }
);

// 发送手机验证码
export const sendSms = createAsyncThunk(
    'user/sendSms',
    async (settings, { dispatch, getState }) => {
        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            codeType: settings.codeType,
            lang: settings.lang,
        };
        const res = await React.$api("user.sendSms", data);
        if (res?.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true
        } else {
            const msg = res?.errmsg;
            dispatch(showMessage({ message: msg, code: 2 }));
            return false
        }
    }
);

// 发送邮件验证码
export const sendEmail = createAsyncThunk(
    'user/sendEmail',
    async (settings, { dispatch, getState }) => {
        let data = {
            email: settings.email,
            codeType: settings.codeType
        };
        const res = await React.$api("user.sendEmail", data);
        if (res?.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true
        } else {
            const msg = res?.errmsg;
            dispatch(showMessage({ message: msg, code: 2 }));
            return false
        }
    }
);

// 绑定手机号
export const bindPhone = createAsyncThunk(
    'user/bindPhone',
    async (settings, { dispatch, getState }) => {
        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            password: settings.password,
            smsCode: settings.smsCode,
        };
        const result = await React.$api("user.bindPhone", data);
        if (result.errno === 0) {
            dispatch(showMessage({ message: 'Success', code: 1 }));
            dispatch(getUserData());
            return true
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 绑定邮箱
export const bindEmail = createAsyncThunk(
    'user/bindEmail',
    async (settings, { dispatch, getState }) => {
        let data = {
            email: settings.email,
            smsCode: settings.smsCode,
            password: settings.password,
        };
        const result = await React.$api("user.bindEmail", data);
        if (result.errno === 0) {
            dispatch(showMessage({ message: 'Success', code: 1 }));
            dispatch(getUserData());
            return true
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

// 手机注册
export const signUp = createAsyncThunk(
    'user/signUp',
    async (settings, { dispatch, getState }) => {
        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            password: settings.password,
            smsCode: settings.smsCode,
            agentId: settings.agentId,
        };
        const userSignUpData = await React.$api("user.register", data);
        if (userSignUpData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userSignUpData));
            history.push('login')    
        } else {
            dispatch(showMessage({ message: userSignUpData.errmsg, code: 2 }));
        }
    }
);

// 邮箱注册
export const emailSignUp = createAsyncThunk(
    'user/emailSignUp',
    async (settings, { dispatch, getState }) => {
        let data = {
            email: settings.email,
            password: settings.password,
            smsCode: settings.smsCode,
            agentId: settings.agentId,
        };
        const userSignUpData = await React.$api("user.emailRegister", data);
        if (userSignUpData.errno === 0) {
            dispatch(showMessage({ message: 'Sign Success', code: 1 }));
            dispatch(updateUser(userSignUpData));
            history.push('login')    
        } else {
            dispatch(showMessage({ message: userSignUpData.errmsg, code: 2 }));
        }
    }
);

// 修改密码
export const resetPass = createAsyncThunk(
    'user/changePass',
    async (settings, { dispatch, getState }) => {
        let data = {
            passOld: settings.oldPassword,
            passNew: settings.password,
        };
        const userResetPassData = await React.$api("user.changePass", data);
        if (userResetPassData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            history.push('/wallet/login');
        } else {
            dispatch(showMessage({ message: userResetPassData.errmsg, code: 2 }));
        }
    }
);

// 修改手机
export const changePhone = createAsyncThunk(
    'user/changePhone',
    async (settings, { dispatch, getState }) => {
        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            smsCode: settings.smsCode,
            password: settings.password,
        };
        const userResetPassData = await React.$api("user.changePhone", data);
        if (userResetPassData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            history.push('/wallet/home');;
        } else {
            dispatch(showMessage({ message: userResetPassData.errmsg, code: 2 }));
        }
    }
);

// 修改手机
export const changeEmail = createAsyncThunk(
    'user/changeEmail',
    async (settings, { dispatch, getState }) => {
        let data = {
            email: settings.email,
            smsCode: settings.smsCode,
            password: settings.password,
        };
        const userResetPassData = await React.$api("user.changeEmail", data);
        if (userResetPassData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            history.push('/wallet/home');;
        } else {
            dispatch(showMessage({ message: userResetPassData.errmsg, code: 2 }));
        }
    }
);

// 忘记密码
export const forgotPass = createAsyncThunk(
    'user/resetPass',
    async (settings, { dispatch, getState }) => {
        let data = {
            nationCode: settings.nationCode,
            phone: settings.phone,
            email: settings.email,
            password: settings.password,
            smsCode: settings.smsCode,
        };
        const userForgotData = await React.$api("user.resetPass", data);
        if (userForgotData.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            history.push('/wallet/login');
        } else {
            dispatch(showMessage({ message: userForgotData.errmsg, code: 2 }));
        }
    }
);


// 切链接口
export const doSetNetwork = createAsyncThunk(
    'user/doSetNetwork',
    async (settings, { dispatch, getState }) => {
        const networkId = settings.networkId;
        const networkRes = await React.$api("user.selectnetwork", { networkId });
        if (networkRes.errno === 0) {
            dispatch(getUserData());
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true
        }
        dispatch(showMessage({ message: networkRes.errmsg, code: 2 }));
    }
);


// 去中心化钱包切链
export const selNetwork = createAsyncThunk(
    'user/selNetwork',
    async (settings, { dispatch, getState }) => {
        console.log(settings, 'settings.................');

        // console.log(getState().user.profile.user.regWallet);

        const { user } = getState();
        // let regWallet = user.profile.user.regWallet; //BitKeep


        // let   regWallet1  = localStorage.getItem("walletname");
        if (localStorage.getItem("walletname")) {
            var regWallet = localStorage.getItem("walletname");
        } else {
            var regWallet = user.profile.user.regWallet;
        }

        console.log(regWallet);


        // 验证登录
        const networkId = settings.id;  //11
        const chainId = settings.chainId; //128
        const networkName = settings.network; //"HOUBI"
        const rpc = settings.rpc; /// "huobi"
        const symbol = settings.symbol; //"HT"
        const avatar = settings.avatar;
        try {
            switch (regWallet) {
                case 'metamask':
                    try {
                        const res = await window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x" + chainId.toString(16) }],
                        });
                        dispatch(doSetNetwork({
                            networkId
                        }));
                        return true;
                    } catch (e) {
                        if (e.code == 4001) {
                            dispatch(showMessage({ message: e.message, code: 2 }));
                            return false
                        }
                        try {
                            await window.ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x" + chainId.toString(16),
                                        chainName: networkName,
                                        nativeCurrency: {
                                            name: symbol,
                                            symbol: symbol,
                                            decimals: 18,
                                        },
                                        rpcUrls: [rpc],
                                    },
                                ],
                            });

                            await window.ethereum.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: "0x" + chainId.toString(16) }],
                            });

                            dispatch(doSetNetwork({
                                networkId
                            }));
                            return true;
                        } catch (e) {
                            dispatch(showMessage({ message: e.message, code: 2 }));
                            return false
                        }
                    };
                    break;
                case 'coinbase':
                    var initCoinbase = await coinbaseWallet.initCoinbase();
                    try {
                        // attempt to switch to Harmony One network
                        const result = await initCoinbase.send('wallet_switchEthereumChain', [{ chainId: "0x" + chainId.toString(16) }])
                        dispatch(doSetNetwork({
                            networkId
                        }));
                        return true;
                    } catch (switchError) {
                        // 4902 indicates that the client does not recognize the Harmony One network
                        if (switchError.code === 4902) {
                            const result = await initCoinbase.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: "0x" + chainId.toString(16),
                                    rpcUrls: [`${rpc}`],
                                    chainName: networkName,
                                    nativeCurrency: { name: symbol, decimals: 18, symbol },
                                    blockExplorerUrls: [''],
                                    iconUrls: [avatar],
                                }],
                            })
                        }
                    }
                    break;
                case 'trustWallet':
                    var injectedProvider = await trustProvider.getTrustWalletInjectedProvider();
                    try {
                        await injectedProvider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x1" }],
                        });
                    } catch (e) {
                        console.error(e);
                        if (e.code === 4001) {
                            setError("User rejected switching chains.");
                        }
                    }
                    break;
                case 'BitKeep':

                    const provider = window.bitkeep && window.bitkeep.ethereum;

                    try {
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: "0x" + chainId.toString(16) }],
                        });

                        dispatch(doSetNetwork({
                            networkId
                        }));
                        return true;

                    } catch (switchError) {
                        console.log(switchError);
                        if (switchError.code === 4902) {

                            console.log(symbol);

                            try {
                                let res = await provider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainId: "0x" + chainId.toString(16),
                                            nativeCurrency: {
                                                name: symbol,
                                                symbol: symbol,
                                                decimals: 18,
                                            },
                                            chainName: networkName,
                                            rpcUrls: [rpc],
                                        },
                                    ],
                                });

                                console.log(res);


                                console.log('222222222222222222222222');

                                await provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: "0x" + chainId.toString(16) }],
                                });

                                dispatch(doSetNetwork({
                                    networkId
                                }));

                            } catch (addError) {
                                console.log(addError);
                            }
                        }
                        // handle other "switch" errors
                    }

                    break;

                case 'WalletConnect':
                    const WalletConnectprovider = await EthereumProvider.init({
                        projectId: 'f52eb6556997b1ef13ad7fc8ac632ca6',
                        showQrModal: true,
                        qrModalOptions: { themeMode: "light" },
                        chains: [1],
                        methods: ["eth_sendTransaction", "personal_sign",],
                        events: ["chainChanged", "accountsChanged"],
                        metadata: {
                            name: "My Dapp",
                            description: "My Dapp description",
                            url: "https://my-dapp.com",
                            icons: ["https://my-dapp.com/logo.png"],
                        },
                    });

                    try {
                        await WalletConnectprovider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: "0x" + chainId.toString(16) }],
                        });

                        dispatch(doSetNetwork({
                            networkId
                        }));
                        return true;

                    } catch (switchError) {
                        console.log(switchError);
                        if (switchError.code === 4001) {

                            console.log(symbol);

                            try {
                                let res = await WalletConnectprovider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainId: "0x" + chainId.toString(16),
                                            nativeCurrency: {
                                                name: symbol,
                                                symbol: symbol,
                                                decimals: 18,
                                            },
                                            chainName: networkName,
                                            rpcUrls: [rpc],
                                        },
                                    ],
                                });

                                console.log(res);


                                console.log('222222222222222222222222');

                                await provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: "0x" + chainId.toString(16) }],
                                });

                                dispatch(doSetNetwork({
                                    networkId
                                }));

                            } catch (addError) {
                                console.log(addError);
                            }
                        }
                        // handle other "switch" errors
                    }

            }
        } catch (e) {
        }

    }
);



// 绑定去中心化钱包
export const bindWallet = createAsyncThunk(
    'user/bindWallet',
    async (settings, { dispatch, getState }) => {
        const { user } = getState();
        const userBindWallet = user.userInfo.bindWallet ?? false;
        // const userCurrentAddress = user.userInfo.address;
        // const userCenterWalletData = user.wallet.other;

        // 判断当前钱包地址是否是去中心化钱包
        // let isExit = false;
        // for (let centerWallet of userCenterWalletData) {
        //     if (centerWallet.address === userCurrentAddress) {
        //         isExit = true;
        //         break;
        //     }
        // }

        let res = loginWays.list.find(function (item) {
            return item.id === settings.id
        })
        let walletType = res.name;
        if (walletType == "MetaMask") {
            walletType = 'metamask';
        }

        if (!userBindWallet) {
            const web3 = await Web3.connectWeb3();
            let address = web3.coinbase;
            let signData = await Web3.loginWallet(address);
            let data = {
                walletAddress: address,
                signature: signData.signature,
                timestamp: signData.timestamp,
                regWallet: walletType
            };

            const doBindWalletRes = await dispatch(doBindWallet(data));
            if (doBindWalletRes.payload) {
                return true
            }
            return false
        }
        return true
    }
);

// 执行绑定去中心化钱包
// 只有没有绑定去中心化钱包的才能绑定
export const doBindWallet = createAsyncThunk(
    'user/doBindWallet',
    async (settings, { dispatch, getState }) => {
        settings = settings || {};

        let data = {
            walletAddress: settings.walletAddress,
            signature: settings.signature,
            timestamp: settings.timestamp,
            regWallet: settings.regWallet
        };

        const sendResult = await React.$api("user.bindWallet", data);
        if (sendResult.errno === 0) {
            dispatch(updateUserToken(sendResult));
            dispatch(getUserData());
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true
        } else {
            dispatch(showMessage({ message: sendResult.errmsg, code: 2 }));
            return false
        }
    }
);

// Google验证器绑定信息
export const googleQrText = createAsyncThunk(
    'user/googleQrText',
    async (settings, { dispatch, getState }) => {
        let data = {
            strTile: 'FuniBox',
        };
        const userGoogleData = await React.$api("security.getQRText", data);
        if (userGoogleData?.errno === 0) {
            return userGoogleData?.data
        }

        return {}
    }
);

// 验证并绑定Google验证器
export const verifyGAuth = createAsyncThunk(
    'user/verifyGAuth',
    async (settings, { dispatch, getState }) => {
        let data = {
            checkCode: settings.checkCode,
        };
        const googleRes = await React.$api("security.verifyGAuth", data);
        if (googleRes?.errno === 0 && googleRes?.data === true) {
            dispatch(showMessage({ message: 'success', code: 1 }));
            return true
        } else {
            // alert(googleRes?.errmsg);
            dispatch(showMessage({ message: 'error', code: 2 }));
            return false
        }
    }
);

// 获取用户信息
export const getUserData = createAsyncThunk(
    'user/getUserData',
    async (settings, { dispatch, getState }) => {
        const userData = await React.$api("user.profile");

        if (userData.errno === 0) {
            dispatch(updateUser(userData));
            return userData
        } else {
            dispatch(showMessage({ message: userData.errmsg, code: 1 }));
        }
    }
);

// 查询资金变化记录
export const transferRecords = createAsyncThunk(
    'user/transferRecords',
    async (settings, { dispatch, getState }) => {
        let data = {
            logType: settings.logType,
            page: settings.page + 1,
            limit: settings.limit,
        };
        const tranferList = await React.$api("transfer.records", data);
        if (tranferList.errno === 0) {
            return tranferList.data
            dispatch(updateTransfer(tranferList));
        } else {
            dispatch(showMessage({ message: tranferList.errmsg, code: 2 }));
        }
    }
);

// 获取内部记账信息
export const centerGetTokenBalanceList = createAsyncThunk(
    'user/centerGetTokenBalanceList',
    async (settings, { dispatch, getState }) => {
        const balanceList = await React.$api("wallet.centerGetTokenBalanceList");
        if (balanceList.errno === 0) {
            dispatch(updateWallet(balanceList));
        } else {
            dispatch(showMessage({ message: balanceList.errmsg, code: 2 }));
        }
    }
);


// 内部转账
export const sendTips = createAsyncThunk(
    'user/sendTips',
    async (settings, { dispatch, getState }) => {
        let data = {
            userId: settings.userId,
            address: settings.address,
            amount: settings.amount,
            symbol: settings.symbol,
            checkCode: settings.checkCode,
        };
        const sendTipsRes = await React.$api("transfer.sendTips", data);
        if (sendTipsRes.errno === 0) {
            dispatch(showMessage({ message: 'success', code: 1 }));
        } else {
            dispatch(showMessage({ message: sendTipsRes.errmsg, code: 2 }));
        }
    }
);


// 热钱包转账
export const tokenTransfer = createAsyncThunk(
    'user/tokenTransfer',
    async (settings, { dispatch, getState }) => {
        let data = {
            address: settings.address,
            amount: settings.amount,
            coinName: settings.coinName,
            checkCode: settings.checkCode,
            networkId: settings.networkId,
            walletName: settings.walletName,
            priceLevel: settings.priceLevel,
            bAppendFee: settings.bAppendFee,
        };
        const transferRes = await React.$api("wallet.tokenTransfer", data);

        if (transferRes.errno === 0) {
            // dispatch(getTransferOrder({
            //     orderId: transferRes.data
            // }));
            dispatch(showMessage({ message: 'pending...', code: 1 }));
            return transferRes.data
        } else {
            dispatch(showMessage({ message: transferRes.errmsg, code: 2 }));
            return false
        }
    }
);

// 获取转账订单信息
export const getTransferOrder = createAsyncThunk(
    'user/getTransferOrder',
    async (settings, { dispatch, getState }) => {
        let data = {
            orderId: settings.orderId,
        };

        let timer = setInterval(async () => {
            const result = await React.$api("wallet.getTokenOrderInfo", data);
            if (result.errno === 0) {
                if (result.data.length > 0) {
                    if (result.data[0].orderStatus === 71) {
                        clearInterval(timer);
                        dispatch(getWithdrawTransferStats());
                        dispatch(showMessage({ message: 'success', code: 1 }));
                        return true
                    } else if (result.data[0].orderStatus === 72) {
                        clearInterval(timer);
                        dispatch(showMessage({ message: 'error', code: 2 }));
                    }
                }
            } else {
                dispatch(showMessage({ message: result.errmsg, code: 2 }));
            }
        }, 5000);
    }
);

// 去中心化查询余额
export const getDecenterWalletBalance = createAsyncThunk(
    'user/getDecenterWalletBalance',
    async (settings, { dispatch, getState }) => {
        const { user } = getState();

        // console.log(settings,'settings111111111111111111');

        // 验证登录
        const regWallet = localStorage.getItem('walletname');
        console.log(regWallet, 'regWallet....................');
        let { loginType } = user.profile;
        let symbolAdress = settings.address || '';
        let decimals = settings.decimals || 1;
        let image = settings.image;
        let type = settings.type;
        let currNetworkChainId = settings.networkChainId;

        // console.log(currNetworkChainId);

        if (loginType == 1) {
            // console.log(loginType,'address......ß');

            if (regWallet === 'WalletConnect') {
                var address = getState().user.profile;
                var networkChainId = 1;
            } else {
                var etherPro = await walletEthereum.ether();
                var web3 = await Web3.connectWeb3(regWallet);
                var address = web3.coinbase;
                // console.log(address);
                var networkChainId = web3.networkId;
            }


            // console.log(networkChainId);
            if (currNetworkChainId != networkChainId) {
                dispatch(showMessage({ message: 'Please switch to the correct network', code: 2 }));
                return false;
            }
            if (type === 0) {
                return await (etherPro.request({
                    method: 'eth_getBalance',
                    params: [address, 'latest'],
                    "id": 1,
                    "jsonrpc": "2.0"
                })) / Math.pow(10, decimals);
            }

            // 代币合约
            var symbolConstruct = utils.contractAbi('USGT');
            // var symbolConstruct = utils.contractAbi('BGT');
            var symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAdress);
            // 查询余额
            var balanceOfRes = (await symbolConstructObj.balanceOf(address)).div(new BN(10).pow(new BN(decimals))).toNumber();
            return balanceOfRes;
            //以下是旧的switch方法
            // switch (regWallet) {
            //     case 'metamask':
            //         var web3 = await Web3.connectWeb3();
            //         var address = web3.coinbase;
            //         var fromAddress = address;
            //         if (type === 0) {
            //             return await (window.ethereum.request({
            //                 method: 'eth_getBalance',
            //                 params: [fromAddress],
            //             })) / Math.pow(10, decimals);
            //         }
            //         // 代币合约
            //         var symbolConstruct = utils.contractAbi('USGT');
            //         var symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAdress);
            //         // 查询余额
            //         var balanceOfRes = (await symbolConstructObj.balanceOf(fromAddress)).div(new BN(10).pow(new BN(decimals))).toNumber();
            //         return balanceOfRes;
            //         break;
            //     case 'coinbase':
            // var web3 = await Web3.connectWeb3('coinbase');
            // var address = web3.coinbase;
            // var initCoinbase = await coinbaseWallet.initCoinbase();
            // if (type == 0) {
            //     // console.log('start request')
            //     try {
            //         const res = await (initCoinbase.request({
            //             method: 'eth_getBalance',
            //             params: [address, 'latest'],
            //             "id": 1,
            //             "jsonrpc": "2.0"
            //         })) / Math.pow(10, decimals);
            //         return res;
            //     } catch (error) {
            //     }

            // };
            // //文档方法
            // // 代币合约
            // try{
            // var symbolConstruct = utils.contractAbi('USGT');
            //     var symbolConstructObj = await utils.contractAt(symbolConstruct, symbolAdress);
            // // 查询余额
            // var balanceOfRes = (await symbolConstructObj.balanceOf(address)).div(new BN(10).pow(new BN(decimals))).toNumber();
            // return balanceOfRes;
            // }catch(err){
            //     console.log(err,'err')
            // }
            // break;

            // };
        };
    })

// 银行卡列表
export const getListBank = createAsyncThunk(
    'user/getListBank',
    async (settings, { dispatch, getState }) => {
        const result = await React.$api("bank.listBank");
        if (result.errno === 0) {
            return result.data
        } else {
            dispatch(showMessage({ message: result.errmsg, code: 2 }));
        }
    }
);

