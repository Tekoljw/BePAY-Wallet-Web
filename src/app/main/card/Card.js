import { useState, useEffect, default as React, useRef } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { tokenTransfer } from "../../store/user/userThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { selectConfig } from "../../store/config";
import { arrayLookup } from "../../util/tools/function";
import { openScan, closeScan } from "../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, getWithdrawHistoryAddress, getWithdrawTransferStats } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import OtpPass from "../otpPass/OtpPass";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getCryptoDisplay } from "../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from "react-i18next";

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


function Card(props) {
    const { t } = useTranslation('mainPage');

    const userData = useSelector(selectUserData);
    const [tabValue, setTabValue] = useState(0);
    const [ranges, setRanges] = useState([t('我的卡片'), t('申请卡片')]);
    const [smallTabValue, setSmallTabValue] = useState(0);

    return (
        <div>
            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                >
                    <Tabs
                        component={motion.div}
                        variants={item}
                        value={tabValue}
                        onChange={(ev, value) => setTabValue(value)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons={false}
                        className="min-h-36 card-show-type card-show-type-tab"
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full min-h-36' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    className="w-full h-full rounded-full  huaKuaBgColor0"
                                />
                            ),
                        }}
                        sx={{
                            padding: '1rem 1.2rem',
                            flex: 1,
                        }}
                    >
                        {Object.entries(ranges)?.map(([key, label]) => (
                            <Tab
                                className="text-14 font-semibold min-w-64  txtColorTitle zindex opacity-100 cardBigBtn"
                                disableRipple
                                key={key}
                                icon={
                                    <img
                                        className="mr-8"
                                        width="22"
                                        src={(() => {
                                            switch (key) {
                                                case "0":
                                                    return "/wallet/assets/images/menu/myCard.png";
                                                case "1":
                                                    return "/wallet/assets/images/menu/card-active.png";
                                            }
                                        }
                                        )()}
                                        alt=""
                                    />
                                }
                                iconPosition="start"
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '3.2rem', width: '50%'
                                }}
                            />
                        ))}
                    </Tabs>

                    {
                        tabValue === 0 &&
                        <div>
                            <motion.div variants={item} className='myCardDi p-16'>
                                <div className='flex justify-between'>
                                    <div className='flex'>
                                        <img className='cardIconW' src="wallet/assets/images/card/zhangDanIcon.png" alt="" />
                                        <div className='zhangDanZi'>账单</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='zhangDanZi'>明细</div>
                                        <img className='cardIconW2' src="wallet/assets/images/card/goJianTou.png" alt="" />
                                    </div>
                                </div>

                                <div className='flex pt-12 justify-between'>
                                    <div className='flex'>
                                        <img className='cardIconW' src="wallet/assets/images/card/usd.png" alt="" />
                                        <div className='zhangDanZi'>可用余额</div>
                                    </div>

                                    <div className='zhangDanZi'>154.00</div>
                                </div>
                            </motion.div>

                            <div className='cardSelectBg'>
                                <div className='cardSelectBgPadding '>
                                    <div style={{ padding: '1.5rem 1.5rem' }} >
                                        <Tabs
                                            component={motion.div}
                                            variants={item}
                                            value={smallTabValue}
                                            onChange={(ev, value) => setSmallTabValue(value)}
                                            indicatorColor="secondary"
                                            textColor="inherit"
                                            variant="scrollable"
                                            scrollButtons={false}
                                            className="min-h-32"
                                            style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#374252', width: '24rem', borderRadius: '20px', height: '30px' }}
                                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                            TabIndicatorProps={{
                                                children: (
                                                    <Box
                                                        sx={{ bgcolor: 'text.disabled' }}
                                                        className="w-full h-full rounded-full huaKuaBgColor"
                                                    />
                                                ),
                                            }}
                                            sx={{
                                                padding: '1rem 1rem',
                                            }}
                                        >
                                            {Object.entries(['虚拟卡', '实体卡']).map(([key, label]) => (
                                                <Tab
                                                    className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
                                                    disableRipple
                                                    key={key}
                                                    label={label}
                                                    sx={{
                                                        color: '#FFFFFF', height: '32px', width: '12rem'
                                                    }}
                                                />
                                            ))}
                                        </Tabs>
                                        {
                                            smallTabValue === 0 && <div style={{ marginTop: "1.5rem" }}>
                                                <motion.div variants={item}
                                                    initial="hidden"
                                                    animate="show"
                                                    className='cardJianGe'
                                                >
                                                    <div className="responsive-div">
                                                        <div className="responsive-div-content card5Bg cardZhiDi" >
                                                            <div className='cardBeiMian'>
                                                                <div className='kaBeiZi' style={{ float: "right" }}>
                                                                    <div className='flex pl-10'>
                                                                        <img className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span className='zhangDanZi'>背面</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='cardNumber'>2489 8794 8894 7845</div>
                                                        </div>
                                                    </div>
                                                    <div className='cardNameInFoMyDi px-12'>
                                                        <div className='flex justify-between'>
                                                            <div style={{ fontWeight: "bold" }}>状态</div>
                                                            <div style={{ color: "#ff3f3f" }}>冻结</div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        }
                                        {
                                            smallTabValue === 1 && <div>
                                                <div className='tianJiaKaPian flex items-center pl-16'>
                                                    <img className='cardIconW' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                    <div className='zhangDanZi'>申请更多卡片</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        tabValue === 1 &&
                        <div className='cardSelectBg '>
                            <div className='cardSelectBgPadding '>
                                <div style={{ padding: '1.5rem 1.5rem' }} >
                                    <Tabs
                                        component={motion.div}
                                        variants={item}
                                        value={smallTabValue}
                                        onChange={(ev, value) => setSmallTabValue(value)}
                                        indicatorColor="secondary"
                                        textColor="inherit"
                                        variant="scrollable"
                                        scrollButtons={false}
                                        className="min-h-32"
                                        style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#374252', width: '24rem', borderRadius: '20px', height: '30px' }}
                                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                        TabIndicatorProps={{
                                            children: (
                                                <Box
                                                    sx={{ bgcolor: 'text.disabled' }}
                                                    className="w-full h-full rounded-full huaKuaBgColor"
                                                />
                                            ),
                                        }}
                                        sx={{
                                            padding: '1rem 1rem',
                                        }}
                                    >
                                        {Object.entries(['虚拟卡', '实体卡']).map(([key, label]) => (
                                            <Tab
                                                className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
                                                disableRipple
                                                key={key}
                                                label={label}
                                                sx={{
                                                    color: '#FFFFFF', height: '32px', width: '12rem'
                                                }}
                                            />
                                        ))}
                                    </Tabs>

                                    {
                                        smallTabValue === 0 && <div>
                                            <motion.div variants={item}
                                                initial="hidden"
                                                animate="show"
                                                className='cardJianGe'
                                            >
                                                <div className='cardName'>BeingFi V</div>
                                                <div className="responsive-div">
                                                    <div className="responsive-div-content card1Bg">
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>VISA卡</div>
                                                        <div style={{ textDecoration: "underline" }}>卡片详情</div>
                                                    </div>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='openingFee'>开卡费用 18USD</div>
                                                        <div className='openCardBtn'>立即申请</div>
                                                    </div>
                                                </div>
                                            </motion.div>


                                            <motion.div variants={item}
                                                initial="hidden"
                                                animate="show"
                                                className='cardJianGe'
                                            >
                                                <div className='cardName'>BeingFi M</div>
                                                <div className="responsive-div">
                                                    <div className="responsive-div-content card2Bg">
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>MASTER卡</div>
                                                        <div style={{ textDecoration: "underline" }}>卡片详情</div>
                                                    </div>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='openingFee'>开卡费用 18USD</div>
                                                        <div className='openCardBtn'>立即申请</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    }
                                    {
                                        smallTabValue === 1 && <div>
                                            <motion.div variants={item}
                                                initial="hidden"
                                                animate="show"
                                                className='cardJianGe'
                                            >
                                                <div className='cardName'>BeingFi X MASTER Card</div>
                                                <div className="responsive-div">
                                                    <div className="responsive-div-content card3Bg">
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>MASTER卡</div>
                                                        <div style={{ textDecoration: "underline" }}>卡片详情</div>
                                                    </div>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='openingFee'>开卡费用 18USD</div>
                                                        <div className='openCardBtn'>立即申请</div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <motion.div variants={item}
                                                initial="hidden"
                                                animate="show"
                                                className='cardJianGe'
                                            >
                                                <div className='cardName'>BeingFi X VISA Card</div>
                                                <div className="responsive-div">
                                                    <div className="responsive-div-content card4Bg">
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>VISA卡</div>
                                                        <div style={{ textDecoration: "underline" }}>卡片详情</div>
                                                    </div>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='openingFee'>开卡费用 18USD</div>
                                                        <div className='openCardBtn'>立即申请</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }










                </motion.div>
            </div>
        </div>
    )
}

export default Card;
