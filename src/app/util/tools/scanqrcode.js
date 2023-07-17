// 安装包 npm i --save html5-qrcode
// https://github.com/mebjas/html5-qrcode

import {Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode"

let html5QrCodeObj;

const defaultConfig = {
    fps: 10,                                    // 摄像头识别帧率
    qrbox: { width: 210, height: 210 },         // 中间识别区域大小

    divIdName : "qrcode_reader",                // 绘制视频的div名字
    facingMode : "environment"                  // 优先后置摄像头
};

//调用摄像头
export const openScan = ( lpfnCallback, config, errCallback ) => {

    config = config || defaultConfig;

    if( !html5QrCodeObj ) {
        html5QrCodeObj = new Html5Qrcode( config.divIdName || defaultConfig.divIdName );
    }

    // This method will trigger user permissions
    Html5Qrcode.getCameras().then(devices => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
            const cameraId = devices[0].id;
            console.log('cameraId===>', cameraId)
            // .. use this to start scanning.
            // If you want to prefer back camera
            html5QrCodeObj.start(
                // { facingMode: config.facingMode || defaultConfig.facingMode },
                cameraId,
                // config,
                {
                    fps: config.fps,                                    // 摄像头识别帧率
                    qrbox: config.qrbox
                },
                (decodedText, decodedResult) => {
                    // do something when code is read
                    lpfnCallback( { text : decodedText, content: decodedResult } );
                },
                (errorMessage) => {
                    // parse error, ideally ignore it. For example:
                    // console.log(`QR Code no longer in front of camera.`);
                    console.log(errorMessage); 
                }
            ).catch((err) => {
                // Start failed, handle it. For example,
                console.log(`Unable to start scanning, error: ${err}`);
                errCallback && errCallback(err)
            });
        }
    }).catch(err => {
        // handle err
    });
}

export const closeScan = () => {
    if(!html5QrCodeObj) return;

    html5QrCodeObj.stop().then((ignore) => {
        // QR Code scanning is stopped.
    }).catch((err) => {
        // Stop failed, handle it.
    });
}

