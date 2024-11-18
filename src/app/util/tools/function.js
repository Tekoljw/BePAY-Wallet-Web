// 公共方法

import userLoginType from "../../define/userLoginType";
import userLoginState from "../../define/userLoginState";

export const getUrlParam = (param) => {
    const res = window.location.href;
    const URL = res.split('?')[1];
    if (!URL) {
        return
    }
    let obj = {}; // 声明参数对象
    let arr = URL.split("&");
    for (let i = 0; i < arr.length; i++) {
        let arrNew = arr[i].split("=");
        obj[arrNew[0]] = arrNew[1];
    }
    return obj[param]
};

/**
 sessionStorage : 数据只存在于当前浏览器标签页。
 .具有相同页面的另一个标签页中将会有不同的存储。
 .但是，它在同一标签页下的 iframe 之间是共享的（假如它们来自相同的源）。
 .数据在页面刷新后仍然保留，但在关闭/重新打开浏览器标签页后不会被保留。
 */

// 获取openAppId
export const getOpenAppId = () => {
    return  window.sessionStorage.getItem('openAppId') || 0;
};

// 获取openAppIndex
export const getOpenAppIndex = () => {
    return  window.sessionStorage.getItem('openIndex') || 0;
};

// 获取thirdPartId(0:不使用第三方，其他为使用的第三方ID)
export const getThirdPartId = () => {
    return  window.sessionStorage.getItem('thirdPartId') || 0;
};

// 获取自动登录的key
export const getAutoLoginKey = () => {
    return  window.sessionStorage.getItem('autoLoginKey') || 0;
};

//获取用户登录方式
export const getUserLoginType = (userData) => {
    return (window.sessionStorage.getItem('loginType') ?? userData?.userInfo?.loginType) || userLoginType.USER_LOGIN_TYPE_UNKNOWN;
}

//获取用户登录状态
export const getUserLoginState = () => {
    return window.sessionStorage.getItem('loginState') || userLoginState.USER_LOGIN_STATE_UN;
}

/**
 localStorage : 在同源的所有标签页和窗口之间共享数据。
 .数据不会过期。它在浏览器重启甚至系统重启后仍然存在。
 */

// 设置手机分页
export const setPhoneTab = (phoneTab) =>{
    if(window.localStorage.getItem('phoneTab') !== phoneTab){
        window.localStorage.setItem('phoneTab', phoneTab);
    }
}

export const arrayLookup = (data,key,value,targetKey) => {
    var targetValue = "";
    if (data) {
        for (var i = 0; i < data.length; i++) {
            if(data[i][key] == value){
                targetValue = data[i][targetKey];
                break;
            }
        }
    }
    return targetValue;
};

export const randomString = (length) => {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
};

//判断是苹果还是安卓
export const judgeIosOrAndroid = () => {
    var u = navigator.userAgent
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    if (isiOS) {
        return 'ios'
    } else if (isAndroid) {
        return 'android'
    }
};

export const getNowTime = (time) => {
    var date = new Date();
    if (time) {
        date = new Date(time);
    }
    var year = date.getFullYear();
    var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? "0" + date.getDate(): date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return currentTime;
}

//复制文本到粘贴板
export const handleCopyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
};

//能够进行登录后请求
export const canLoginAfterRequest = (userData) =>  {
    const curLoginType = getUserLoginType();
    if(curLoginType === userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP){
        if(userData){
            const sessionLoginState = getUserLoginState();
            if(userData.loginState === sessionLoginState && userData.loginState === userLoginState.USER_LOGIN_STATE_SUCCESS) { //已经进行过登录流程了
                return true;
            }
        }
        return false;
    }
    return true;
}

export const isMobile = () =>  {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
}