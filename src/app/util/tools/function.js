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
