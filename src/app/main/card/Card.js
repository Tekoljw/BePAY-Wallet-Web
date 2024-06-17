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
import { selectConfig, setSwapConfig } from "../../store/config";
import { arrayLookup, setPhoneTab } from "../../util/tools/function";
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
import PropTypes from 'prop-types';
import AnimateModal from "../../components/FuniModal";
import LoadingButton from "@mui/lab/LoadingButton";
import history from '@history';
import AccordionActions from '@mui/material/AccordionActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { margin } from '@mui/system';
import { getSwapConfig } from "app/store/swap/swapThunk";



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

// export interface DialogTitleProps {
//     id: string;
//     children?: React.ReactNode;
//     onClose: () => void;
// }

// function BootstrapDialogTitle(props: DialogTitleProps) {
//     const { children, onClose, ...other } = props;
//     return (
//         <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
//             {children}
//             {onClose ? (
//                 <IconButton
//                     aria-label="close"
//                     onClick={onClose}
//                     sx={{
//                         position: 'absolute',
//                         right: 8,
//                         top: 8,
//                         color: (theme) => theme.palette.grey[500],
//                     }}
//                 >
//                     <CloseIcon />
//                 </IconButton>
//             ) : null}
//         </DialogTitle>
//     );
// }

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
    const [kaBeiButton, setKaBeiButton] = useState(false);
    const [kaBeiButton2, setKaBeiButton2] = useState(true);
    const [fanZhuan, setFanZhuan] = useState(false);
    const [openXiangQing, setOpenXiangQing] = useState(false);
    const [openMyCard, setOpenMyCard] = useState(false);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [openCardBtnShow, setOpenCardBtnShow] = useState(false);
    const [openAnimateHuanKa, setOpenAnimateHuanKa] = useState(false);
    const [isOpenEye, setIsOpenEye] = useState(false);
    const [openRecordWindow, setOpenRecordWindow] = useState(false);

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    const handleImgClick = (e, action) => {
        e.stopPropagation(); // 阻止事件冒泡
        action(); // 执行传入的动作函数
    };

    const kaPianGongNeng = () => {
        // setOpenMyCard(true);
    };

    const myFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    };

    const FanKa = () => {
        setKaBeiButton(true);
        document.getElementById('responsive-div').classList.add('shrink');
        setTimeout(() => {
            setFanZhuan(true);
        }, 300);
        setTimeout(() => {
            setKaBeiButton2(false);
            document.getElementById('responsive-div').classList.remove('shrink');
            document.getElementById('cardIconWTwo').classList.add('alphaCard');
            document.getElementById('zhangDanZiTwo').classList.add('alphaCard');
        }, 600);
    };

    const FanKaBei = () => {
        setKaBeiButton2(true);
        document.getElementById('responsive-div').classList.add('shrink');
        setTimeout(() => {
            setFanZhuan(false);
        }, 300);
        setTimeout(() => {
            setKaBeiButton(false);
            document.getElementById('responsive-div').classList.remove('shrink');
            document.getElementById('cardIconWOne').classList.add('alphaCard');
            document.getElementById('zhangDanZiOne').classList.add('alphaCard');
            document.getElementById('cardNumberOne').classList.add('alphaCard');
        }, 600);
    };

    useEffect(() => {
        setPhoneTab('card');
    }, []);



    const closeRecordFunc = () => {
        document.getElementById('openRecord').classList.remove('PinMoveAni');
        document.getElementById('openRecord').classList.add('PinMoveOut');
        setTimeout(() => {
            openRecordWindow(false)
        }, 300);
    };

    const openRecordFunc = () => {
        setTimeout(() => {
            document.getElementById('openRecord').classList.add('PinMoveAni');
        }, 0);
    };

    return (
        <div className='' style={{ position: "relative" }}>
            <div style={{ position: "absolute", width: "100%" }}>
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
                                className="text-16 font-semibold min-w-64  txtColorTitle zindex opacity-100 cardBigBtn"
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

                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="pb-12 flex justify-center"
                            >
                                <div
                                    className="cardSty"
                                    style={{ flexWrap: "warp" }}
                                >

                                    <div className="flex justify-between" style={{ marginTop: "6.5%" }}>
                                        <div className=" flex px-16 " style={{ width: "70%", height: "3rem" }}>
                                            {
                                                isOpenEye && <img className="cardImg"
                                                    src="/wallet/assets/images/withdraw/yan2.png"
                                                    onClick={() => {
                                                        setIsOpenEye(!isOpenEye);
                                                    }}></img>

                                            }
                                            {
                                                !isOpenEye && <img className="cardImg"
                                                    src="/wallet/assets/images/withdraw/yan.png"
                                                    onClick={() => {
                                                        setIsOpenEye(!isOpenEye);
                                                    }}></img>
                                            }
                                            <div className="ml-8 walletBalanceZi" style={{ color: "#84A59F" }} >Wallet Balance</div>
                                        </div>
                                        <div className="zhangDanXiangQinZi" onClick={() => {
                                            changePhoneTab('record');
                                            history.push('/wallet/home/record')
                                            // setOpenRecordWindow(true)
                                            // openRecordFunc()
                                        }} >账单详情</div>
                                    </div>

                                    <div className=" flex items-conter px-16" style={{ width: "100%", marginTop: "1.5rem", justifyContent: "space-between" }}>
                                        <div className="flex" style={{ width: "70%" }}>
                                            <img className="cardImg mt-3" src="/wallet/assets/images/withdraw/usd.png" onClick={() => {

                                            }}></img>
                                            {
                                                isOpenEye ? <div className="eyeGongNengZi" style={{ color: "#ffffff" }}>{(userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat).toFixed(2) ?? '0.00'}</div>
                                                    : <div className="eyeGongNengZi2 pt-5" style={{ color: "#ffffff" }}>******</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className='cardSelectBg'>
                                <div className='cardSelectBgPadding '>
                                    <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }} >
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
                                            style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
                                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                            TabIndicatorProps={{
                                                children: (
                                                    <Box
                                                        sx={{ bgcolor: 'text.disabled' }}
                                                        className="w-full h-full rounded-full huaKuaBgColorCard"
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
                                                        color: '#FFFFFF', height: '32px', width: 'auto', marginRight: "1rem"
                                                    }}
                                                />
                                            ))}
                                        </Tabs>

                                        {
                                            smallTabValue === 0 && <div style={{ margin: "1.5rem 0rem 6rem 0rem" }}>
                                                <motion.div variants={item}
                                                    initial="hidden"
                                                    animate="show"
                                                    className='cardJianGe'
                                                >
                                                    <div className='flex justify-center'>
                                                        <div className="responsive-div" id="responsive-div">
                                                            <div className={clsx("", fanZhuan && "xiaoShi")}>
                                                                <div className="responsive-div-content card4Bg cardZhiDi" onClick={() => {
                                                                    kaPianGongNeng();
                                                                }}  >
                                                                    <div className={clsx("cardNumber", kaBeiButton && "xiaoShi")}> <span id="cardNumberOne" >3449 7794 2794 9831</span> </div>
                                                                    <div className='cardBeiMian'>
                                                                        <div className={clsx("", kaBeiButton && "xiaoShi")}>
                                                                            <div className='kaBeiZi flex'>
                                                                                <img id="cardIconWOne"
                                                                                    onClick={(e) => handleImgClick(e, FanKa)}
                                                                                    className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id="zhangDanZiOne" className='zhangDanZi'>背面</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={clsx("", !fanZhuan && "xiaoShi")} >
                                                                <div className="responsive-div-content card41Bg cardZhiDi" onClick={() => {
                                                                    kaPianGongNeng();
                                                                }}  >
                                                                    <div className='cardBeiMian'>
                                                                        <div className={clsx("", kaBeiButton2 && "xiaoShi")}>
                                                                            <div className='kaBeiZi flex'>
                                                                                <img id="cardIconWTwo"
                                                                                    onClick={(e) => handleImgClick(e, FanKaBei)}
                                                                                    className='cardIconW' src="wallet/assets/images/card/yanJing.png" alt="" /><span id="zhangDanZiTwo" className='zhangDanZi'>正面</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='cardGongNengMyDi'>
                                                        <Accordion className='gongNengTan1'>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1-content"
                                                                id="panel1-header"
                                                                className='gongNengTan2'
                                                            >
                                                                <div className='flex justify-between w-full'>
                                                                    <div className='flex'>
                                                                        <div className=''>余额</div>
                                                                        <div className='ml-8 yuEZi'>$50.00</div>
                                                                    </div>
                                                                    <div className='cardDepositeDi'>充值</div>
                                                                </div>
                                                            </AccordionSummary>

                                                            <AccordionDetails className='gongNengTan3'>
                                                                <div className='flex justify-center'>
                                                                    <div className='gongNengLanW' onClick={() => {
                                                                        setOpenAnimateModal(true);
                                                                    }} >
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/guaShi.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>一键冻结</div>
                                                                    </div>
                                                                    <div className='gongNengLanW' onClick={() => {
                                                                        setOpenAnimateHuanKa(true);
                                                                    }}>
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/gengHuanKaPian.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>更换卡片</div>
                                                                    </div>

                                                                    <div className='gongNengLanW'>
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/miMaGuanLi.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>密码管理</div>
                                                                    </div>
                                                                </div>

                                                                <div className='mt-24 flex justify-center'>
                                                                    <div className='gongNengLanW'>
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/daE.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>大额预约</div>
                                                                    </div>
                                                                    <div className='gongNengLanW'>
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/bangDing.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>解除订阅</div>
                                                                    </div>
                                                                    <div className='gongNengLanW'>
                                                                        <img className='gongNengTuBiao' src="wallet/assets/images/menu/atm.png"></img>
                                                                        <div className='gongNengZiW mt-4 text-14'>ATM/POS</div>
                                                                    </div>
                                                                </div>

                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                </motion.div>

                                                <motion.div variants={item}
                                                    initial="hidden"
                                                    animate="show"
                                                    className='cardJianGe'
                                                >
                                                    <div className="responsive-div">
                                                        <div className="responsive-div-content card5Bg cardZhiDi" >
                                                            <div className='cardZhuangTaiDi'>
                                                                <div className='cardZhuangTai'>审核中</div>
                                                            </div>
                                                            <div className='cardNumber'>2489 8794 8894 7845</div>
                                                            <div className='cardBeiMian'>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>

                                        }
                                        {
                                            smallTabValue === 1 && <div>
                                                <div className='tianJiaKaPian flex items-center pl-16' onClick={() => {
                                                    setTabValue(1);
                                                }}>
                                                    <img className='cardIconW' src="wallet/assets/images/card/jiaHao.png" alt="" />
                                                    <div className='zhangDanZi' >申请更多卡片</div>
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
                                        style={{ padding: '0 0', margin: '0rem 0rem 1rem 1rem', borderColor: 'transparent', backgroundColor: '#1E293B', width: 'auto', borderRadius: '0px', height: '30px' }}
                                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                                        TabIndicatorProps={{
                                            children: (
                                                <Box
                                                    sx={{ bgcolor: 'text.disabled' }}
                                                    className="w-full h-full rounded-full huaKuaBgColorCard"
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
                                                    color: '#FFFFFF', height: '32px', width: 'auto', marginRight: "1rem"
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
                                                    <div className="responsive-div-content card1Bg" onClick={() => {
                                                        setOpenXiangQing(true);
                                                        myFunction;
                                                    }}   >
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>VISA卡</div>
                                                        <div className='kaPianInfo' onClick={() => {
                                                            setOpenXiangQing(true);
                                                            myFunction;
                                                        }}   >卡片详情</div>
                                                    </div>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='openingFee'>开卡费用 18USD</div>
                                                        <div className='openCardBtn' >立即申请</div>
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
                                                    <div className="responsive-div-content card2Bg" onClick={() => {
                                                        setOpenXiangQing(true);
                                                        myFunction;
                                                    }}  >
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>MASTER卡</div>
                                                        <div className='kaPianInfo' onClick={() => {
                                                            setOpenXiangQing(true);
                                                            myFunction;
                                                        }}  >卡片详情</div>
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
                                                    <div className="responsive-div-content card3Bg" onClick={() => {
                                                        setOpenXiangQing(true);
                                                        myFunction;
                                                    }}  >
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>MASTER卡</div>
                                                        <div className='kaPianInfo' onClick={() => {
                                                            setOpenXiangQing(true);
                                                            myFunction;
                                                        }}  >卡片详情</div>
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
                                                    <div className="responsive-div-content card6Bg" onClick={() => {
                                                        setOpenXiangQing(true);
                                                        myFunction;
                                                    }}  >
                                                    </div>
                                                </div>
                                                <div className='cardNameInFoDi px-12'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ fontWeight: "bold" }}>VISA卡</div>
                                                        <div className='kaPianInfo' onClick={() => {
                                                            setOpenXiangQing(true);
                                                            myFunction;
                                                        }}  >卡片详情</div>
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

            {openXiangQing && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }} >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                    id="stickyGo"
                >
                    <div className='flex' onClick={() => {
                        setOpenXiangQing(false);
                        myFunction;
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>返回</span>
                    </div>

                    <div className='flex justify-center mt-10'>
                        <motion.div variants={item} className='shenQingCardDi flex items-center'>
                            <img className='shenQingCard' src="wallet/assets/images/card/card1.png"></img>
                        </motion.div>
                    </div>
                    <div className='kaPianQuanYiZi'>卡片权益</div>
                    <motion.div variants={item} className='flex'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>卡片币种</div>
                                <div className='flex'>
                                    <img className='quanYiIcon' src="wallet/assets/images/card/usd2.png" alt="" /><span className='quanYiZi'>USD</span>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>卡片类型</div>
                                <div>实体卡</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>开发费</div>
                                <div className='flex'>
                                    <div className='quanYiZi quanYiHui mr-10'>100 USD</div><div className='quanYiZi quanYiLv'>18 USD</div>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>快递费</div>
                                <div >根据距离估算</div>
                            </div>

                            <div className='flex justify-between mt-10 mb-10'>
                                <div className='quanYiHuiZi'>消费上线</div>
                                <div> 1000,000 USD/天</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10'>
                                <div className='text-16'>收费标准</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>月费</div>
                                <div>0 USD </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>卡种</div>
                                <div>VISA</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>存储手续费</div>
                                <div className='flex'>
                                    <div className='quanYiZi quanYiHui mr-10'>2.5%</div><div className='quanYiZi quanYiLv'>1.05%</div>
                                </div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>更换卡费用</div>
                                <div>70 USD</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>卡片类型</div>
                                <div>预付卡</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>发行地区</div>
                                <div>新加坡</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>ATM取款</div>
                                <div>除新加坡与中国大陆外均可</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi'>提交资料</div>
                                <div>护照、联系方式、账单地址、个人照片</div>
                            </div>

                            <div className='flex justify-between mt-10 '>
                                <div className='quanYiHuiZi'>交付周期</div>
                                <div>三周左右</div>
                            </div>

                            <div className='flex justify-between mt-10'>
                                <div className='quanYiHuiZi2'>支持平台</div>
                                <div className='langYouZi'>GooglePay/paypal/facebook/Ebay/AliExpress/Walmart/Taobao</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className='flex mt-10  '>
                        <LoadingButton
                            disabled={false}
                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                            color="secondary"
                            loading={false}
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '24rem', height: '4rem', fontSize: "20px", margin: '1rem auto 2.5rem', display: 'block', lineHeight: "inherit", padding: "0px" }}
                            onClick={() => {
                                setOpenXiangQing(false);
                            }}
                        >
                            立即申请
                        </LoadingButton>
                    </motion.div>
                    <motion.div variants={item} className='flex mt-10 ' style={{ height: "5rem" }}>
                    </motion.div>
                </motion.div>
            </div>}


            {/* {openMyCard && <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mt-12'
                >
                    <div className='flex' onClick={() => {
                        setOpenMyCard(false);
                    }}   >
                        <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>返回</span>
                    </div>

                    <motion.div variants={item} className='flex mt-20'>
                        <div className='quanYiDi' style={{ padding: "1.5rem" }}>
                            <div className='mt-10'>
                                <div className='text-16' style={{ fontWeight: "600" }}>卡片信息</div>
                            </div>
                            <div className='flex justify-between mt-10'>
                                <div className='text-18'>VISA Card</div>
                                <div className='text-16'>卡片信息</div>
                            </div>

                        </div>
                    </motion.div>
                    <motion.div variants={item} className='flex mt-20'>
                    </motion.div>
                    <div className='flex mt-10 ' style={{ height: "5rem" }}>
                    </div>
                </motion.div>
            </div>} */}


            <AnimateModal
                className="faBiDiCard"
                open={openAnimateModal}
                onClose={() => setOpenAnimateModal(false)}
            >
                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard"
                    sx={{
                        backgroundColor: "#1e293b",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "3rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        是否将卡号5487 3254 1474 6658的卡片进行冻结？
                    </div>
                </Box>

                <div className='flex mt-32 mb-32 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        onClick={() => {
                            setOpenCardBtnShow(true);
                            setTimeout(() => {
                                setOpenAnimateModal(false);
                                setOpenCardBtnShow(false);
                            }, 1500);
                        }}
                    >
                        冻结
                    </LoadingButton>


                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenAnimateModal(false)
                        }}
                    >
                        取消
                    </LoadingButton>
                </div>
            </AnimateModal>


            <AnimateModal
                className="faBiDiCard"
                open={openAnimateHuanKa}
                onClose={() => setOpenAnimateHuanKa(false)}
            >
                <Box
                    className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard"
                    sx={{
                        backgroundColor: "#1e293b",
                        padding: "1.5rem",
                        overflow: "hidden",
                        margin: "3rem auto 0rem auto"
                    }}
                >
                    <div className="dialog-select-fiat danChuangTxt">
                        将卡号5487 3254 1474 6658的卡片进行更换，是否沿用旧卡片的申请信息？
                    </div>
                </Box>

                <div className='flex mt-32 mb-32 px-15 justify-between' >
                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={false}
                        variant="contained"
                        onClick={() => {
                            setOpenAnimateHuanKa(false)
                        }}

                    >
                        变更
                    </LoadingButton>


                    <LoadingButton
                        disabled={false}
                        className="boxCardBtn"
                        color="secondary"
                        loading={openCardBtnShow}
                        variant="contained"
                        onClick={() => {
                            setOpenCardBtnShow(true);
                            setTimeout(() => {
                                setOpenAnimateHuanKa(false);
                                setOpenCardBtnShow(false);
                            }, 1500);
                        }}
                    >
                        沿用
                    </LoadingButton>
                </div>
            </AnimateModal>


            {/* <BootstrapDialog
                onClose={() => {
                    closeRecordFunc();
                }}
                aria-labelledby="customized-dialog-title"
                open={openRecordWindow}
                className="dialog-container"
            >
                <div id="openRecord" className="PINSty">
                    <div className='pinWindow'>
                        <div className='flex'>
                            <div className='PINTitleSelectCardZi'>选择查询的卡片</div>
                            <img src="wallet/assets/images/logo/close_Btn.png" className='closePinBtn' onClick={() => {
                                closeRecordFunc();
                            }} />
                        </div>
                        <div className='flex mt-20 justify-between'>
                            <div className='flex'>
                                <img className='cardSelectIcon' src="wallet/assets/images/card/all.png"></img>
                                <div className='cardSelectZi'>全部卡片</div>
                            </div>
                        </div>
                    </div>

                    <div>
                    </div>
                </div>
            </BootstrapDialog> */}

        </div>
    )
}

export default Card;
