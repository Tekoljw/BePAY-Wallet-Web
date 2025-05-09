import React,{ useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { lighten, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FusePageCarded from '@fuse/core/FusePageCarded';
import HomeSidebarContent from './HomeSidebarContent';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Wallet from '../wallet/Wallet';
import Deposite from '../deposite/Deposite';
import Withdraw from "../withdraw/Withdraw";
import SendTips from "../send-tips/SendTips";
import Buy from "../buy/Buy";
import Swap from "../swap/Swap";
import Security from "../security/Security";
import Record from "../record/Record";
import Borrow from "../borrow/Borrow";
import Pool from "../pool/Pool";
import Account from "../account/Account"

import { useDispatch, useSelector } from "react-redux";
import { centerGetTokenBalanceList, getUserData } from '../../store/user/userThunk';
import { centerGetUserFiat, getWithdrawTransferStats } from '../../store/wallet/walletThunk';
import { getSymbols, paymentConfig, getContactAddress } from "../../store/config/configThunk";
import { getBorrowConfig } from "../../store/borrow/borrowThunk";
import { getPoolConfig } from "../../store/pool/poolThunk";
// import {useTranslation} from "react-i18next";
// import { changeLanguage } from 'app/store/i18nSlice';
import ComingSoon from "../coming-soon/ComingSoon";
import web3 from '../../util/web3';
import { arrayLookup } from "../../util/tools/function";
import { selectConfig } from "../../store/config";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import { selectUserData } from "../../store/user";
import { SvgIcon } from '@mui/material';
import history from '@history';
// import FuseLoading from '@fuse/core/FuseLoading';

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {},
    '& .FusePageCarded-sidebar': {},
    '& .FusePageCarded-leftSidebar': {},
    '& .FusePageCarded-rightSidebar': {},
}));

function HomePage(props) {
    // const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
    const userData = useSelector(selectUserData);
    // const [ isLoading, setIsLoading ] = useState(true);
    // const getUrlParam = (param) => {
    //     const res = window.location.href;
    //     const URL = res.split('?')[1];
    //     if (!URL) {
    //         return
    //     }
    //     let obj = {}; // 声明参数对象
    //     let arr = URL.split("&");
    //     for (let i = 0; i < arr.length; i++) {
    //         let arrNew = arr[i].split("=");
    //         obj[arrNew[0]] = arrNew[1];
    //     }
    //     return obj[param]
    // };
    // const defaultTab = getUrlParam('tab') ? getUrlParam('tab') : 'wallet';

    // const testClick = () => {
    //     dispatch(changeLanguage('zh'));
    // };
    const config = useSelector(selectConfig);
    const networks = config.networks || [];
    const { pathname } = useLocation();
    useEffect(() => {
        let userBindWallet = userData.userInfo.bindWallet ?? false;
        if (userBindWallet) {
            web3.getChainId().then((res) => {
                if (networks.length > 0 && res) {
                    let tmpNetworkId = arrayLookup(networks, 'chainId', res, 'id');
                    if (!tmpNetworkId) {
                        dispatch(showMessage({ message: 'This chain is not supported', code: 2 }));
                    }
                }
                if (window.ethereum) {
                    window.ethereum.on("chainChanged", (chainId) => {
                        let network = chainId.toString();
                        let tmpNetworkId = arrayLookup(networks, 'chainId', network, 'id');
                        if (networks.length > 0 && !tmpNetworkId) {
                            dispatch(showMessage({ message: 'This chain is not supported', code: 2 }));
                        }
                    });
                }
            })
        }
    }, [config.networks]);

    const mounted = useRef();
    const [currentTab, setCurrentTab] = useState(window.localStorage.getItem('phoneTab') ?? 'account');
    const changePhoneTab = (tab) => {
        setCurrentTab(tab)
        window.localStorage.setItem('phoneTab', tab);
    }

    useEffect(() => {
        if (isMobile) {
            let tmpCurrentTab = window.localStorage.getItem('phoneTab')
            setCurrentTab(window.localStorage.getItem('phoneTab'))

            const navLinks = document.querySelectorAll('.nav-link');
            const slide = document.querySelector('.slide');
            navLinks.forEach((link) => link.addEventListener('click', handleClick));
            function handleClick() {
                const index = parseInt(this.dataset.index);
                slide.style.transform = `translateX(${index * 100}%)`;
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }

            if (tmpCurrentTab === 'deposite') {
                history.push('/wallet/home/deposite')
                slide.style.transform = `translateX(${1 * 100}%)`;
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[1].classList.add('active');
                slide.style.backgroundColor = "#2C3640";
            } else if (tmpCurrentTab === 'withdraw') {
                history.push('/wallet/home/withdraw')
                slide.style.transform = `translateX(${2 * 100}%)`;
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[2].classList.add('active');
                slide.style.backgroundColor = "#2C3640";
            } else if (tmpCurrentTab === 'account') {
                history.push('/wallet/home/wallet')
                slide.style.transform = `translateX(${0 * 100}%)`;
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[0].classList.add('active');
                slide.style.backgroundColor = "#2C3640";
            } else {
                // slide.style.transform = `translateX(${0 * 100}%)`;
                slide.style.backgroundColor = "#171F29";
                navLinks.forEach(link => link.classList.remove('active'));
            }
        }
    }, [window.localStorage.getItem('phoneTab')]);

    // useEffect(() => {
    //     console.log(window.localStorage.getItem('phoneTab'), '11111111111111111111111111111111')
    //     setCurrentTab(window.localStorage.getItem('phoneTab'))
    // }, [window.localStorage.getItem('phoneTab')]);




    //监听其他地方该值的变化
    // useEffect(() => {
    //     if () {}
    //     setCurrentTab(window.localStorage.getItem('phoneTab'));
    // }, []);


    // const componentDidUpdate = () => {
    //     console.log(1);
    // setTimeout(() => {
    //     setIsLoading(false);
    // }, 3000)
    // };

    // useEffect(() => {
    //    if (!mounted.current) {
    //        mounted.current = true;
    //    } else {
    // componentDidUpdate();
    // console.log('componentsDidUpdate')
    //    }
    // });

    useEffect(() => {
        dispatch(getUserData());
        dispatch(getSymbols());
        dispatch(getContactAddress());
        dispatch(paymentConfig());
        dispatch(getBorrowConfig());
        dispatch(getPoolConfig());
        dispatch(centerGetTokenBalanceList());
        dispatch(centerGetUserFiat());
        dispatch(getWithdrawTransferStats());
    }, []);

    return (
        <>
            {/*{t("home.title")}*/}
            {/*<div onClick={() => testClick()}>change</div>*/}
            <Root
                // header={
                //     <Hidden smUp={!isMobileMedia} lgUp={isMobileMedia}>
                //         <IconButton
                //             onClick={() => {
                //                 setLeftSidebarOpen(true);
                //             }}
                //             aria-label="open left sidebar"
                //             size="large"
                //         >
                //             <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
                //         </IconButton>
                //     </Hidden>
                // }
                content={
                    <div className="flex flex-col w-full items-center pb-24">
                        <Box
                            className="w-full rounded-16 border py-12 flex flex-col"
                            style={{ paddingTop: isMobileMedia ? '0rem' : 0 }}
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? lighten(theme.palette.background.default, 0.4)
                                        // : lighten(theme.palette.background.default, 0.02),
                                        : 'none',
                                border: 'none'
                            }}
                        >
                            <Routes>
                                <Route index element={<Deposite />} />
                                <Route path="deposite" element={<Deposite />} />
                                <Route path="withdraw" element={<Withdraw tab='address' />} />
                                <Route path="buyCrypto" element={<Buy />} />
                                <Route path="swap" element={<Swap />} />
                                <Route path="borrow" element={<Borrow />} />
                                <Route path="pools" element={<Pool />} />
                                <Route path="sendTips" element={<SendTips tab='funi' />} />
                                <Route path="c2c" element={<ComingSoon />} />
                                <Route path="nft" element={<ComingSoon />} />
                                <Route path="record" element={<Record />} />
                                <Route path="security" element={<Security />} />
                                <Route path="wallet" element={<Wallet />} />
                            </Routes>
                            {/*<div style={{*/}
                            {/*    width: '100%',*/}
                            {/*    height: '100vh',*/}
                            {/*    display: isLoading ? 'flex' : 'none',*/}
                            {/*    justifyContent: 'center',*/}
                            {/*    alignItems: 'center',*/}
                            {/*    position: "absolute",*/}
                            {/*    background: '#0e1421',*/}
                            {/*    zIndex: 9999999*/}
                            {/*}}>*/}
                            {/*    <FuseLoading style={{}}></FuseLoading>*/}
                            {/*</div>*/}

                            {/* {tab === 'wallet' && <Wallet />}
                            {tab === 'deposite' && <Deposite />}
                            {tab === 'withdraw' && <Withdraw tab='address' />}
                            {tab === 'buyCrypto' && <Buy />}
                            {tab === 'swap' && <Swap />}
                            {tab === 'borrow' && <Borrow />}
                            {tab === 'pools' && <Pool />}
                            {tab === 'sendTips' && <SendTips tab='funi' />} */}

                            {/*{tab === 'withdraw' && <ComingSoon/>}*/}
                            {/*{tab === 'buyCrypto' && <ComingSoon />}*/}
                            {/*{tab === 'swap' && <ComingSoon />}*/}
                            {/*{tab === 'borrow' && <ComingSoon />}*/}
                            {/*{tab === 'pools' && <ComingSoon />}*/}
                            {/*{tab === 'sendTips' && <ComingSoon />}*/}



                            {/* {tab === 'c2c' && <ComingSoon />}
                            {tab === 'nft' && <ComingSoon />}

                            {tab === 'record' && <Record />}
                            {tab === 'enable2fa' && <Enable2FA />} */}
                        </Box>
                    </div>
                }
                leftSidebarOpen={leftSidebarOpen}
                leftSidebarOnClose={() => {
                    setLeftSidebarOpen(false);
                }}
                leftSidebarContent={<HomeSidebarContent
                    tab={pathname.substring(pathname.lastIndexOf('\/') + 1, pathname.length) || 'wallet'}
                // setTab={setTab}
                // setIsLoading={setIsLoading}
                />}
                scroll={isMobile ? 'normal' : 'content'}
            />
            {isMobile && <div >
                <div class="containerMenu " style={{ position: "fixed", left: "0", right: "0", bottom: "0", zIndex: "999999", width: "100%", height: "60px ", margin: "0px auto", backgroundColor: "#171F29" }}>
                    <IconButton
                        onClick={() => {
                            setLeftSidebarOpen(true);
                        }}
                        aria-label="open left sidebar"
                        size="large"
                        style={{ maxWidth: "40px", marginLeft: "2rem" }}
                    >
                        <FuseSvgIcon>heroicons-outline:menu-alt-1</FuseSvgIcon>
                    </IconButton>
                    <div class="phone-bottom ">
                        <nav class="nav">
                            <div class="slide"></div>
                            <div class="nav-link active" data-index="0" onClick={() => {
                                changePhoneTab('account')
                                history.push('/wallet/home/wallet')
                            }}>
                                <img class="material-icons md-18" width="24px" src={currentTab === 'account' ? 'assets/images/menu/icon-wallet-active2.png' : 'assets/images/menu/icon-wallet-active.png'} alt="" />
                                {/* <i class="material-icons md-18">signal_cellular_alt</i> */}
                                <span class="nav-text">Account</span>
                            </div>
                            <div class="nav-link" data-index="1" onClick={() => {
                                changePhoneTab('deposite')
                                history.push('/wallet/home/deposite')
                            }}>
                                {/* {changePhoneTab('deposit')} */}
                                <img class="material-icons md-18" width="24px" src={currentTab === 'deposite' ? 'assets/images/menu/deposite-active2.png' : 'assets/images/menu/deposite-active.png'} alt="" />
                                <span class="nav-text">Deposit</span>
                            </div>
                            <div class="nav-link" data-index="2" onClick={() => {
                                changePhoneTab('withdraw')
                                history.push('/wallet/home/withdraw')
                            }}>
                                {/* {changePhoneTab('withdraw')} */}
                                <img class="material-icons md-18" width="24px" src={currentTab === 'withdraw' ? 'assets/images/menu/withdraw-active2.png' : 'assets/images/menu/withdraw-active.png'} alt="" />
                                <span class="nav-text">Withdraw</span>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default React.memo(HomePage);
