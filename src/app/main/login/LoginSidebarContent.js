import React, { useEffect, useState, memo } from 'react';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import { arrayLookup, getUrlParam } from "../../util/tools/function";
import { useDispatch, useSelector } from 'react-redux';
import MobileDetect from 'mobile-detect';
import { useTranslation } from "react-i18next";
import loginWays from "./loginWays.json";
import { showMessage } from 'app/store/fuse/messageSlice';
import {
    doLogin,
} from '../../store/user/userThunk';
import walletConnect from '../../store/walletconnect/wcTest';
import QrView from '../../store/walletconnect/QRview';
import phantom from '../../util/web3/phantom1.js';
import clsx from 'clsx';

import Web3 from "web3";


// walletconnect钱包导入文件

import { EthereumProvider } from '@walletconnect/ethereum-provider';


function LoginSidebarContent(props) {

    // f52eb6556997b1ef13ad7fc8ac632ca6

    const dispatch = useDispatch();
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));

    const agentId = getUrlParam('agentId');

    //----------Phantom------------
    const phantomLogin = async () => {
        if (phantom.isPhantomInstalled) {
            phantom.getRequest();
        }
    };
    //end---------------
    //以太链登录
    const walletLogin = (walletType, id) => {
        //    console.log(walletType);
        // console.log(agentId,'agentId................');
        // let wallettype = walletType
        const checkPhone = () => {
            var sUserAgent = navigator.userAgent.toLowerCase(),
                bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
                bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
                bIsMidp = sUserAgent.match(/midp/i) == "midp",
                bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
                bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
                bIsAndroid = sUserAgent.match(/android/i) == "android",
                bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
                bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                return true;
            } return false;
        };


        const checkIsPhone = checkPhone();
        switch (walletType) {
            case 'trustWallet':
                if (checkIsPhone) {
                    dispatch(doLogin({
                        agentId: agentId,
                        walletType,
                        id
                    }))
                } else {
                    dispatch(showMessage({ message: 'Only for phone' }))
                }
                break;
            case 'metamask':
                if (!checkIsPhone) {
                    dispatch(doLogin({
                        agentId: agentId,
                        walletType,
                        id
                    }))
                } else {
                    dispatch(showMessage({ message: 'Only for PC' }))
                }
                break;

            case 'BitKeep':
                if (!checkIsPhone) {
                    dispatch(doLogin({
                        agentId: agentId,
                        walletType,
                        id
                    }))
                } else {
                    dispatch(showMessage({ message: 'Only for PC' }))
                }
                break;

            case 'WalletConnect':
                if (!checkIsPhone) {
                    dispatch(doLogin({
                        agentId: agentId,
                        walletType,
                        id
                    }))
                } else {
                    dispatch(showMessage({ message: 'Only for PC' }))
                }
                break;

            default:
                dispatch(doLogin({
                    agentId: agentId,
                    walletType,
                    id
                }));
                break;
        }
    };

    const { t } = useTranslation('mainPage');


    // async function onConnect() {

    //     const provider = await EthereumProvider.init({
    //         projectId:'f52eb6556997b1ef13ad7fc8ac632ca6',
    //         showQrModal: true,
    //         qrModalOptions: { themeMode: "light" },
    //         chains: [1],
    //         methods: ["eth_sendTransaction", "personal_sign"],
    //         events: ["chainChanged", "accountsChanged"],
    //         metadata: {
    //           name: "My Dapp",
    //           description: "My Dapp description",
    //           url: "https://my-dapp.com",
    //           icons: ["https://my-dapp.com/logo.png"],
    //         },
    //       });


    //       console.log(provider);

    //       await provider.connect();

    //       const result = await provider.request({method:'eth_requestAccounts' });



    //       console.log(result);

    // }


    return (
        <div className='login-right-content loginMarginZhong ' style={{ marginLeft: "20px" }}>

            {!isMobileMedia && <div className='login-right-content-title font-furore text-20 ' >
                <span className="color-16c2a3">
                    Web 3.0
                </span> {t('signIn_1')}
            </div>
            }
            <div className={clsx("login-right-btns", !isMobileMedia ? "mt-2" : "mt-12")}>
                {
                    loginWays.list.map((way, index) => {
                        const balckimg = way.id === 0 || way.id === 13;
                        return (
                            <div className={
                                clsx(
                                    `${balckimg == true ? '' : 'checkIsPhone'}`,
                                    'login-right-btns-item text-16 flex items-center justify-start txtColorTitleSmall ',
                                    ((!isMobileMedia && way.isOnlyMobileShow) || (isMobileMedia && way.isOnlyPcShow)) && 'checkIsPhone'
                                )
                            } key={index}
                                onClick={() => {
                                    way.id === 0 && walletLogin('metamask', way.id)
                                    // way.id === 1 && phantomLogin(),
                                    way.id === 4 && walletLogin('WalletConnect', way.id)
                                    // way.id === 9 && walletLogin('Coinbase',way.id),
                                    // way.id === 11 && walletLogin('trustWallet'),
                                    // way.id === 12 && walletLogin('Polygon'),
                                    way.id === 13 && walletLogin('BitKeep', way.id);
                                    // way.id === 14 && walletLogin('Bitski', way.id);
                                    // way.id === 16 && walletLogin('BinanceSmart', way.id);
                                }}
                                style={{ width: "23rem" }}
                            >
                                <img className='login-way-img' src={`/wallet/assets/images/login/${way.src}.png`} alt="" />
                                <span className='login-way-name'>{way.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default React.memo(LoginSidebarContent);