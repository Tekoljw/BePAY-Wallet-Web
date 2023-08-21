import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import '../../../styles/home.css';
import history from '@history';

import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";
import { getKycInfo, getFaTPayConfig } from "app/store/payment/paymentThunk";
import { showMessage } from 'app/store/fuse/messageSlice';

import utils from '../../util/tools/utils'
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FusePageCarded from '@fuse/core/FusePageCarded';
import HomeSidebarContent from "../home/HomeSidebarContent";
import {styled} from "@mui/material";
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

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {},
    '& .FusePageCarded-sidebar': {},
    '& .FusePageCarded-leftSidebar': {},
}));

function FaTPayBuyPage() {
    const state = history.location.state;
    // console.log(state);

    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const kycInfo = config.kycInfo;

    const [isInitial, setInitial ]  = useState(false);
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down(isMobileMedia ? 'lg' : 'sm'));
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

    const [ configValue, setConfigValue ] = useState({
        walletAddress: '',
        timestamp: '',
        nonce: '',
        signature: '',
        url:'',
    });

    const isNeedAudit = () => {
        console.log('kycInfo', kycInfo)
        console.log('isNeedAudit', kycInfo.isNeedAudit())
        if( kycInfo ) {
            return kycInfo.isNeedAudit();
        }

        return true;
    };

    const isValidConfig = () => {
        console.log(configValue, 'isValidConfig')
        if( configValue && configValue.walletAddress && configValue.walletAddress != '' ) {
            return true;
        }
        // dispatch(showMessage({ message: 'Please bind your phone number or email' }));
        return false;
    };

    const refreshFaTPayConfig = () => {
        // 参数参考： https://dev.fatpay.org/v/zh/reference/integration-tutorial/widget-customization
        dispatch(getFaTPayConfig(
            {
                cryptoCurrency : (state && state.symbol) || 'ETH',        // 默认币种
                amount : (state && state.balance) || 30,                    // 默认法币数值
                fiatCurrency: '',
            }

        )).then( (value) => {
            if( !value.payload ) return;
            let resultData = value.payload.data;

            if(!resultData || Object.entries(resultData).length < 1 ) return;

            let copyData = {};

            Object.keys(configValue).map((prop, index) => {
                copyData[prop] = resultData[prop];
            } );
            console.log('copyData', copyData)
            setConfigValue(copyData);
        } ) ;
    };

    useEffect(() => {
        dispatch(getKycInfo()).then(() => {
            setInitial(true);
        });
        refreshFaTPayConfig();
    }, []);


    useEffect(() => {
        if (isInitial && isNeedAudit() === true) {
            history.push('/kyc');
        }
    }, [isInitial, kycInfo]);

    useEffect(() => {
        if (configValue.url) {
            if (isNeedAudit() === false && isValidConfig() === true) {
                window.open(configValue.url);
                history.push('/home/buyCrypto');
            }
        }
    }, [configValue.url]);


    return (
        // <Root
        //     header={
        //         <Hidden smUp={!isMobileMedia} lgUp={isMobileMedia}>
        //             <IconButton
        //                 onClick={() => {
        //                     setLeftSidebarOpen(true);
        //                 }}
        //                 aria-label="open left sidebar"
        //                 size="large"
        //             >
        //                 <FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
        //             </IconButton>
        //         </Hidden>
        //     }
        //     content={
                <div>
                    {/*head*/}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <Box
                            component={motion.div}
                            variants={item}
                            sx={{ height : '100vh'}}
                        >
                            {(isInitial && isNeedAudit()) && <>
                                <Typography className="text-16 mx-12 cursor-pointer">
                                    You need kyc real-name authentication
                                </Typography>
                            </>}

                            {isNeedAudit() === false && isValidConfig() === true && <>
                                {/*<iframe*/}
                                {/*    src={ configValue.url + "&windowOpen=1"}*/}
                                {/*    allow="accelerometer; autoplay; camera; gyroscope; payment"*/}
                                {/*    width="100%"*/}
                                {/*    height="100%"*/}
                                {/*    frameBorder="0"*/}
                                {/*>*/}
                                {/*</iframe>*/}
                            </>}

                        </Box>
                    </motion.div>

                </div>
        //     }
        //     leftSidebarOpen={leftSidebarOpen}
        //     leftSidebarOnClose={() => {
        //         setLeftSidebarOpen(false);
        //     }}
        //     leftSidebarContent={<HomeSidebarContent tab={'buy'}/>}
        //     scroll={isMobile ? 'normal' : 'content'}
        // />

    )
}

export default FaTPayBuyPage;
