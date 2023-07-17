import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import '../../../styles/home.css';
import history from '@history';

import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";
import { getKycInfo, getLegendTradingConfig } from "app/store/payment/paymentThunk";

import utils from '../../util/tools/utils'
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HomeSidebarContent from "../home/HomeSidebarContent";
import { styled } from "@mui/material";
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MobileDetect from 'mobile-detect';

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function BuyPage() {
    const state = history.location.state;

    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const kycInfo = config.kycInfo;
    const [isInitial, setInitial] = useState(false);
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

    const Root = styled(FusePageCarded)(({ theme }) => ({
        '& .FusePageCarded-header': {},
        '& .FusePageCarded-sidebar': {},
        '& .FusePageCarded-leftSidebar': {},
    }));

    const [configValue, setConfigValue] = useState({
        timestamp: '',
        signature: '',
        mode: '',
        "app-email": '',
        "app-key": '',
        "app-url": '',
        "app-uid": '',
        "app-id": '',
    });

    const isNeedAudit = () => {
        if (kycInfo) {
            return kycInfo.isNeedAudit();
        }

        return true;
    };



    const isValidConfig = () => {
        if (configValue && configValue.signature != '') {
            return true;
        }

        return false;
    };

    const refreshTradingConfig = () => {
        dispatch(getLegendTradingConfig()).then((value) => {
            if (!value.payload) return;
            let resultData = value.payload.data;

            if (!resultData || Object.entries(resultData).length < 1) return;

            let copyData = {};

            Object.keys(configValue).map((prop, index) => {
                copyData[prop] = resultData[prop];
            });

            setConfigValue(copyData);
        });
    };

    useEffect(() => {
        // dispatch(getKycInfo()).then(() => {
        //     setInitial(true);
        // });
        refreshTradingConfig();

        return () => {
            console.log('webWidget')
            try {
                window.zE('webWidget', 'hide');
                console.log('hide')
            } catch (e) {
            }
        };
    }, []);
    useEffect(() => {
        if (kycInfo.init === true) {
            setInitial(true);
        }

        if (kycInfo.init === true && isNeedAudit() === true) {
            history.push('/kyc');
        }
    }, [kycInfo]);


    useEffect(() => {
        document.documentElement.style.fontSize = 100 + "%"
    }, []);


    const componentDidMount = async () => {
        // 参数参考： https://ex.legendtrading.com/reference/%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE
        // 文档密码：tPjV8cP#acH3BrMN
        utils.appendScript('https://www.legendtrading.com/jssdk-v3/legend-trade-full.min.js', false);
    };

    componentDidMount();

    return (
        <>
            {/*<Root*/}
            {/*    header={*/}
            {/*        <Hidden smUp={!isMobileMedia} lgUp={isMobileMedia}>*/}
            {/*            <IconButton*/}
            {/*                onClick={() => {*/}
            {/*                    setLeftSidebarOpen(true);*/}
            {/*                }}*/}
            {/*                aria-label="open left sidebar"*/}
            {/*                size="large"*/}
            {/*            >*/}
            {/*                <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>*/}
            {/*            </IconButton>*/}
            {/*        </Hidden>*/}
            {/*    }*/}
            {/*    content={*/}
            {/*        <div>*/}
            {/*            /!*head*!/*/}
            {/*            */}

            {/*        </div>*/}
            {/*    }*/}
            {/*    leftSidebarOpen={leftSidebarOpen}*/}
            {/*    leftSidebarOnClose={() => {*/}
            {/*        setLeftSidebarOpen(false);*/}
            {/*    }}*/}
            {/*    leftSidebarContent={<HomeSidebarContent tab={'buy'}/>}*/}
            {/*    scroll={isMobile ? 'normal' : 'content'}*/}
            {/*/>*/}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
            >
                <Box
                    style={{
                        borderRaduis: '16px'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    {(isInitial && isNeedAudit()) && <>
                        <Typography className="text-16 mx-12 cursor-pointer">
                            You need kyc real-name authentication
                        </Typography>
                    </>}

                    {isNeedAudit() === false && isValidConfig() === true && <>
                        <legend-trade-full
                            mode={configValue.mode}
                            prefers-color-scheme="dark"
                            signature={configValue.signature}
                            timestamp={configValue.timestamp}
                            app-key={configValue['app-key']}
                            app-url={configValue['app-url']}
                            app-uid={configValue['app-uid']}
                            app-id={configValue['app-id']}
                            app-email={configValue['app-email']}
                        >
                        </legend-trade-full>

                    </>}

                </Box>
            </motion.div>
        </>
    )
}

export default BuyPage;
