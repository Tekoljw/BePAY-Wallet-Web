// 登录方式集合

import {getThirdPartId} from "./function";
import {centerGetTokenBalanceList, getUserData, telegramLoginApi} from "app/store/user/userThunk";
import {getContactAddress, getSymbols, paymentConfig} from "app/store/config/configThunk";
import {getBorrowConfig} from "app/store/borrow/borrowThunk";
import {getPoolConfig} from "app/store/pool/poolThunk";
import {centerGetUserFiat, getWithdrawTransferStats} from "app/store/wallet/walletThunk";

//telegram 登录
export const loginTelegram = (thirdPartId) => {
    //这里唯一要做的就是把你机器人参数传入进去
    window.Telegram.Login.auth({ bot_id: thirdPartId, request_access: 'write', embed: 1 }, (data) => {
        console.log(data, '这是回调数据');//这里的data和之前返回的user数据和格式无差异
        if (!data) {
            // fail
            return
        }
        telegramCallbackFn(data);
    });
};
const telegramCallbackFn = (data) => {
    dispatch(telegramLoginApi(data))
};

//请求用户登录基础数据
export const requestUserLoginData = (dispatch) => {
    dispatch(getUserData());
    dispatch(getSymbols());
    dispatch(getContactAddress());
    dispatch(paymentConfig());
    dispatch(getBorrowConfig());
    dispatch(getPoolConfig());
    dispatch(centerGetTokenBalanceList());
    dispatch(centerGetUserFiat());
    dispatch(getWithdrawTransferStats());
};

