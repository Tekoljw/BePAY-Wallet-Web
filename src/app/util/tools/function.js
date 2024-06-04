// 公共方法
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

// 获取openAppId
export const getOpenAppId = () => {
    return  window.sessionStorage.getItem('openAppId') || 0;
};

// 获取openAppIndex
export const getOpenAppIndex = () => {
    return  window.sessionStorage.getItem('openIndex') || 0;
};

// 获取accessType(0:正常方式，1:telegram小程序)
export const getAccessType = () => {
    return window.localStorage.getItem('accessType') || 0;
}

// 获取thirdPartId(0:不使用第三方，其他为使用的第三方ID)
export const getThirdPartId = () => {
    return  window.localStorage.getItem('thirdPartId') || 0;
};

// 获取自动登录的key
export const getAutoLoginKey = () => {
    return  window.localStorage.getItem('autoLoginKey') || 0;
};

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

export const getNowTime = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return currentTime;
}

