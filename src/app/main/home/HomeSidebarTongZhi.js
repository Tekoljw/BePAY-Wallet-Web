import { useEffect, useState } from 'react';
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
import { isMobile } from 'web3modal';
import { width } from '@mui/system';

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

function HomeSidebarTongZhi(props) {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const [logo, setLogo] = useState("wallet/assets/images/logo/logo.png");
    const [hideMenu, setHideMenu] = useState([]);

    const [activeMenu, setMenuTab] = useState('');

    const config = useSelector(selectConfig);
    const kycInfo = config.kycInfo || {};

    const tabClick = (tab) => {
        history.push(tab === 'wallet' ? '/wallet/home' : `/wallet/home/${tab}`);
        changePhoneTab(tab);
    };

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    useEffect(() => {
        setMenuTab(window.localStorage.getItem('phoneTab'))
    }, [window.localStorage.getItem('phoneTab')])

    useEffect(() => {
        if (config) {
            let openAppId = window.sessionStorage.getItem('openAppId')
            if (openAppId) {
                setLogo(`${config.staticSourceUrl}/${openAppId}.png`)
            }
        }
    }, [config]);

    useEffect(() => {
        if (isMobileMedia) {
            changePhoneTab(props.tab !== 'home' ? props.tab : 'wallet');
        } else {
            changePhoneTab(props.tab !== 'home' ? props.tab : 'deposite');
        }

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



    return (
        <div className={!isMobileMedia ? "px-16 py-24 text-18 left-side-text-box" : "px-16 py-24 text-18"}>
            <div className='flex justify-between' style={{ width: "280px" }}>
                <div>通知</div>
                <div className='text-12' style={{ height: "26px", lineHeight: "26px", color: "#2DD4BF" }}>全部清除</div>
            </div>
            <div style={{ height: "24px" }}></div>
            <div
                className='pt-16 pb-16'
                style={{ backgroundColor: '#151c2a', borderRadius: '1rem' }}
            >
                <div className='flex justify-between px-10'>
                    <div> aaa</div>
                    <div>bbb</div>
                    <div>ccc</div>
                </div>
            </div>
        </div>
    );
}

export default HomeSidebarTongZhi;
