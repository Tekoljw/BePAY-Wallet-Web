import { useEffect, useState } from 'react';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import history from '@history';
import MobileDetect from 'mobile-detect';
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";
import { useTranslation } from "react-i18next";
import { getMenuList } from "app/store/config/configThunk";

const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    color: '#94A3B8!important',
    textDecoration: 'none!important',
    height: 40,
    width: '100%',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 8,
    fontWeight: 700,
    '&.active': {
        color: theme.palette.common.white + ' !important',
        backgroundColor:
            theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, .05)!important'
                : '#0C8B7F !important',
        pointerEvents: 'none',
        '& .list-item-icon': {
            color: theme.palette.common.white,
        },
    },
    '& .list-item-icon': {
        marginRight: 16,
    },
}));

function HomeSidebarContent(props) {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const [logo, setLogo] = useState("assets/images/logo/logo.png");
    const [hideMenu, setHideMenu] = useState([]);

    const changePhoneTab = (tab) => {
        setTab(tab)
        window.localStorage.setItem('phoneTab', tab);
    }

    const [activeMenu, setTab] = useState(props.tab !== 'home' ? props.tab : 'wallet');

    const tabClick = (tab) => {
        history.push(tab === 'wallet' ? '/home' : `/home/${tab}`);
        // history.push(`/home/${tab}`);
        // console.log('tab', tab);
        // history.push({pathname: tab});
        // if (props.setTab) {
        // setTab(tab)
        changePhoneTab(tab)
        // }
        // setTab(tab);
        // if (props.setIsLoading) {
        // props.setIsLoading(true);
        // setTimeout(() => {
        //     props.setIsLoading(false)
        // }, 3000)
        // }
    };

    const config = useSelector(selectConfig);
    const kycInfo = config.kycInfo || {};


    useEffect(() => {
        setTab(window.localStorage.getItem('phoneTab'))
    }, [window.localStorage.getItem('phoneTab')]);




    useEffect(() => {
        if (config) {
            let openAppId = window.sessionStorage.getItem('openAppId')
            if (openAppId) {
                setLogo(`${config.staticSourceUrl}/${openAppId}.png`)
                // setLogo(`${config.staticSourceUrl}/${openAppId}-logo.png`)
            }
        }
    }, [config]);

    useEffect(() => {
        dispatch(getMenuList()).then(res => {
            let result = res.payload
            if (result) {
                let tmpHide = []
                result.forEach(item => {
                    if (item.state === 0) {
                        tmpHide.push(item.name)
                    }
                })
                setHideMenu(tmpHide);
            }
        })
    }, [])


    useEffect(() => {
        if (window.localStorage.getItem('phoneTab')) {
            if (window.localStorage.getItem('phoneTab') == "deposite" || window.localStorage.getItem('phoneTab') == "withdraw" || window.localStorage.getItem('phoneTab') == "buyCrypto" || window.localStorage.getItem('phoneTab') == "swap" || window.localStorage.getItem('phoneTab') == "borrow" || window.localStorage.getItem('phoneTab') == "c2c" || window.localStorage.getItem('phoneTab') == "pools" || window.localStorage.getItem('phoneTab') == "sendTips" || window.localStorage.getItem('phoneTab') == "record" || window.localStorage.getItem('phoneTab') == "nft" || window.localStorage.getItem('phoneTab') == "security") {
                tabClick(window.localStorage.getItem('phoneTab'));
            }
        }
    }, []);


    return (
        <div className={!isMobileMedia ? "px-16 py-24 text-18 left-side-text-box" : "px-16 py-24 text-18"}>
            <div
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                style={{ backgroundColor: '#151c2a', borderRadius: '1.6rem' }}
            >
                <List className={!isMobileMedia ? 'left-side-list-box left-side-container ' : 'left-side-container'}>
                    {
                        !isMobileMedia &&
                        <div>
                            <img className="left-side-logo" src={logo} />
                            <img className="left-side-line" src="assets/images/logo/left-side-line.png" alt="left-side-line" />
                        </div>
                    }
                    {/*<StyledListItem*/}
                    {/*    button*/}
                    {/*    className={*/}
                    {/*        clsx(*/}
                    {/*            '',*/}
                    {/*            activeMenu === 'wallet' && 'active'*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    onClick={(ev) => {*/}
                    {/*        tabClick('wallet');*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    /!* <FuseSvgIcon className="list-item-icon" color="disabled">*/}
                    {/*        heroicons-outline:pencil-alt*/}
                    {/*    </FuseSvgIcon> *!/*/}
                    {/*    <div className='iconWz'>*/}
                    {/*        <img className='menu-icon ' src='assets/images/menu/icon-wallet.png' alt='icon' />*/}
                    {/*        <img className='menu-icon  active' src='assets/images/menu/icon-wallet-active.png' alt='icon' />*/}
                    {/*    </div>*/}
                    {/*    <ListItemText className="truncate font16" primary="Account" disableTypography />*/}
                    {/*</StyledListItem>*/}

                    {hideMenu.indexOf('deposite') === -1 &&
                        <StyledListItem
                            button
                            className={
                                clsx(
                                    '',
                                    activeMenu === 'deposite' && 'active'
                                )
                            }
                            onClick={(ev) => {
                                tabClick('deposite');
                            }}
                        >
                            {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-twotone:login
                        </FuseSvgIcon> */}
                            <div className='iconWz'>
                                <img className='menu-icon ' src='assets/images/menu/deposite.png' alt='icon' />
                                <img className='menu-icon  active' src='assets/images/menu/deposite-active.png' alt='icon' />
                            </div>
                            <ListItemText className="truncate font16" primary={t('menu_2')} disableTypography />
                        </StyledListItem>
                    }
                    {hideMenu.indexOf('withdraw') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'withdraw' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('withdraw');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-twotone:logout
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/withdraw.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/withdraw-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_3')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('buyCrypto') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'buyCrypto' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('buyCrypto');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-twotone:credit_card
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/buyCrypto.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/buyCrypto-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_4')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('swap') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'swap' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('swap');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-outline:sync_alt
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-wallet.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-wallet-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_5')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('borrow') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'borrow' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('borrow');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-borrow.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-borrow-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_6')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('c2c') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'c2c' && 'active')
                        }
                        onClick={(ev) => {
                            tabClick('c2c');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            heroicons-outline:user-group
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/c2c.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/c2c-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate" primary={t('menu_7')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('pools') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'pools' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('pools');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-pools.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-pools-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_8')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('sendTips') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'sendTips' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('sendTips');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-twotone:launch
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/sendTips.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/sendTips-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_9')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('record') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'record' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('record');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            material-outline:text_snippet
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/record.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/record-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_10')} disableTypography />
                    </StyledListItem>}

                    {hideMenu.indexOf('nft') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'nft' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('nft');
                        }}
                    >
                        {/* <FuseSvgIcon className="list-item-icon" color="disabled">
                            heroicons-outline:pencil-alt
                        </FuseSvgIcon> */}
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-ntfs.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-ntfs-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" disableTypography children={
                            <div>NFT
                                {activeMenu === 'nft' && <div className="text-12" style={{ color: "#ffffff" }} >{t('menu_11')}</div>}
                                {activeMenu != 'nft' && <div className="text-12" style={{ color: "#575D6A" }} >{t('menu_11')}</div>}
                            </div>
                        } />
                    </StyledListItem>}

                    
                    {hideMenu.indexOf('security') === -1 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'security' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            setTab('security');
                            history.push('/home/security');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/security.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/security-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_17')} disableTypography />
                    </StyledListItem>}

                    {/* <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'enable2fa' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('enable2fa');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-2fa.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-2fa-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_12')} disableTypography />
                    </StyledListItem> */}

                    {/* <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 're-tied-phone' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            setTab('re-tied-phone');
                            history.push('/re-tied-phone');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-2fa.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-2fa-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_14')} disableTypography />
                    </StyledListItem> */}
                    {/* <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'reset-pass' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            setTab('reset-pass');
                            history.push('/reset-pass');
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/icon-2fa.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/icon-2fa-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate font16" primary={t('menu_15')} disableTypography />
                    </StyledListItem> */}
                    {/* {kycInfo?.ldAuditStatus != 5 && <StyledListItem
                        button
                        className={
                            clsx(
                                '',
                                activeMenu === 'kyc' && 'active'
                            )
                        }
                        onClick={(ev) => {
                            tabClick('kyc');
                            history.push('/kyc')
                        }}
                    >
                        <div className='iconWz'>
                            <img className='menu-icon ' src='assets/images/menu/kyc.png' alt='icon' />
                            <img className='menu-icon  active' src='assets/images/menu/kyc-active.png' alt='icon' />
                        </div>
                        <ListItemText className="truncate" primary={t('menu_16')} disableTypography />
                    </StyledListItem>} */}
                </List>
            </div>
        </div>
    );
}

export default HomeSidebarContent;
