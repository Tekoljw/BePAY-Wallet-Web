import { useState, useEffect, default as React } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import '../../../styles/home.css';

import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { sendTips } from "../../store/user/userThunk";
import StyledAccordionSelect from '../../components/StyledAccordionSelect';
import { selectConfig } from "../../store/config";
import {arrayLookup, handleCopyText, readClipboardText} from "../../util/tools/function";
import { closeScan, openScan } from "../../util/tools/scanqrcode";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getSendTipsHistoryAddress, delSendTipsHistoryAddress } from "app/store/wallet/walletThunk";
import OtpPass from "../otpPass/OtpPass";
import MobileDetect from 'mobile-detect';
import { useTranslation } from "react-i18next";

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;


    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function Earn(props) {
    const navigate = useNavigate()
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const [inputVal, setInputVal] = useState({
        address: '',
        amount: 0.00
    });

    const [tabVal, setTabVal] = useState(props.tab);
    const [tabValue, setTabValue] = useState(1);
    const [symbol, setSymbol] = useState('');
    const [googleCode, setGoogleCode] = useState('');
    const [transferState, setTransferState] = useState([]);
    const [historyAddress, setHistoryAddress] = useState([]);
    const [openChangeCurrency, setOpenChangeCurrency] = useState(false);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const [openGoogleCode, setOpenGoogleCode] = useState(false);
    const [amountTab, setAmountTab] = useState('HIGHER');

    const handleChangeInputVal = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };
    const changeAddress = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };
    const walletData = useSelector(selectUserData).wallet;
    const transferStats = useSelector(selectUserData).transferStats;
    const hasAuthGoogle = useSelector(selectUserData).userInfo?.hasAuthGoogle
    const sortUseAge = (a, b) => {
        const prioritizedSymbolsFirst = ['eUSDT', 'USDT', 'BGT', 'eBGT'];
        const prioritizedSymbolsSecond = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'PAX', 'GUSD', 'USDD'];

        // 检查币种是否属于优先展示的币种
        const isPrioritizedAFirst = prioritizedSymbolsFirst.includes(a.symbol);
        const isPrioritizedBFirst = prioritizedSymbolsFirst.includes(b.symbol);
        const isPrioritizedASecond = prioritizedSymbolsSecond.includes(a.symbol);
        const isPrioritizedBSecond = prioritizedSymbolsSecond.includes(b.symbol);

        // 获取币种 a 和币种 b 的 dollarFiat 值
        const dollarFiatA = parseFloat(a.dollarFiat);
        const dollarFiatB = parseFloat(b.dollarFiat);

        if (isPrioritizedAFirst && isPrioritizedBFirst) {
            // 如果两个币种都属于第一组优先展示的币种，则比较它们的 dollarFiat 值进行排序
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedAFirst) {
            // 如果只有 a 是第一组优先展示的币种，则将 a 排在前面
            return -1;
        } else if (isPrioritizedBFirst) {
            // 如果只有 b 是第一组优先展示的币种，则将 b 排在前面
            return 1;
        } else if (isPrioritizedASecond && isPrioritizedBSecond) {
            // 如果两个币种都属于第二组优先展示的币种，则比较它们的 dollarFiat 值进行排序
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedASecond) {
            // 如果只有 a 是第二组优先展示的币种，则将 a 排在前面
            // return -1;
            return dollarFiatB - dollarFiatA;
        } else if (isPrioritizedBSecond) {
            // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
            // return 1;
            return dollarFiatB - dollarFiatA;
        } else {
            // 如果两个币种都不属于优先展示的币种，则保持原有顺序
            // return 0;
            return dollarFiatB - dollarFiatA;
        }
    };

    const config = useSelector(selectConfig);
    const symbols = config.symbols;
    const [symbolWallet, setSymbolWallet] = useState([]);

    // 初始化数据
    const initSymbol = () => {
        let tmpSymbol = [];
        let tmpSymbolWallet = [];
        for (let i = 0; i < symbols.length; i++) {
            if (tmpSymbol.indexOf(symbols[i].symbol) == -1 && symbols[i].symbol != 'eUSDT') {
                tmpSymbol.push(symbols[i].symbol)
                tmpSymbolWallet.push({
                    avatar: symbols[i].avatar,
                    balance: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'balance') || 0,
                    symbol: symbols[i].symbol,
                    tradeLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'tradeLock') || 0,
                    withdrawLock: arrayLookup(walletData.inner, 'symbol', symbols[i].symbol, 'withdrawLock') || 0
                })
            }
        }
        tmpSymbolWallet.sort(sortUseAge)
        setSymbolWallet(tmpSymbolWallet)
    }

    useEffect(() => {
        if (symbols) {
            initSymbol()
        }
    }, [symbols]);

    useEffect(() => {
        if (openChangeCurrency) {
            console.log(openChangeCurrency);
            console.log('startScanQRCode');
            setTimeout(() => {
                startScanQRCode();
            }, 1000);
        }
    }, [openChangeCurrency]);

    const startScanQRCode = () => {
        openScan((result, err) => {
            if (result && result.text && result.text.length > 0) {
                console.log("openScan", result);
                changeAddress('address', result.text);
                closeScan();
                setOpenChangeCurrency(false);
            }

            if (err) {
                console.error(err);
                closeScan();
                setOpenChangeCurrency(false);
            }
        });
    };
    function ismore(inputVal) {
        if (Number(inputVal) > Number(arrayLookup(symbolWallet, 'symbol', symbol, 'balance')) || Number(inputVal) <= 0) {

            return true
        } else return false
    }
    const handleSubmit = () => {
        if (inputVal.amount <= 0) {
            return
        }
        const rate = arrayLookup(symbols, 'symbol', symbol, 'rate');
        let conversionAmount = rate * inputVal.amount;
        if (conversionAmount >= transferState.limitSingle && googleCode.length < 6) {
            if (!hasAuthGoogle) {
                navigate('/home/security');
                return;
            }
            setOpenGoogleCode(true);
            return
        }

        if (transferState.daily >= transferState.limitDaily && googleCode.length < 6) {
            if (!hasAuthGoogle) {
                navigate('/home/security');
                return;
            }
            setOpenGoogleCode(true);
            return
        }

        if (transferState.month >= transferState.limitMonth && googleCode.length < 6) {
            if (!hasAuthGoogle) {
                navigate('/home/security');
                return;
            }
            setOpenGoogleCode(true);
            return
        }

        let data = {
            userId: '',
            address: '',
            amount: inputVal.amount,
            symbol: symbol,
            checkCode: googleCode
        };
        if (tabValue === 0) {
            data.address = inputVal.address
        } else {
            data.userId = inputVal.address
        }
        dispatch(sendTips(data));
        setTimeout(() => {
            setGoogleCode('');
        }, 500)
    };
    const del = (item) => {
        dispatch(delSendTipsHistoryAddress(item)).then((res) => {
            console.log(res, '.........res');
            dispatch(getSendTipsHistoryAddress()).then((res) => {

                if (res.payload?.data?.length > 0) {
                    setHistoryAddress(res.payload.data);
                } else {
                    setHistoryAddress([])
                }
            });
            // if (res.payload.data.length > 0) {
            // setHistoryAddress(res.payload.data);
            // }
        });
    };
    useEffect(() => {
        dispatch(getSendTipsHistoryAddress()).then((res) => {
            if (res.payload?.data?.length > 0) {
                setHistoryAddress(res.payload.data);
            }
        });
    }, []);

    useEffect(() => {
        if (googleCode.length === 6) {
            setOpenGoogleCode(false);
            handleSubmit();
        }

    }, [googleCode]);

    useEffect(() => {
        setTransferState(transferStats);
    }, [transferStats]);

    return (
        <div>
            <div className="send-tips-container mt-12">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{ padding: '0 1.5rem 2rem 1.5rem' }}
                >
                    <Box
                        className="w-full rounded-16 border flex flex-col"
                        sx={{
                            backgroundColor: '#1E293B',
                            border: 'none'
                        }}
                    >
                        {symbolWallet.length > 0 && <StyledAccordionSelect
                            symbol={symbolWallet}
                            currencyCode="USD"
                            setSymbol={setSymbol}
                        // isSetAmount={true}
                        // setAmount={setAmount}
                        />}
                    </Box>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-24"
                    style={{ padding: '0 1.5rem 0 1.5rem' }}
                >
                    <Box
                        component={motion.div}
                        variants={item}
                        className="w-full rounded-16 border flex flex-col"
                        style={{ borderRadius: '0.5rem' }}
                        sx={{
                            backgroundColor: '#1E293B',
                            border: 'none'
                        }}
                    >
                        <div>
                            <div className="flex">
                                {/* <Typography
                                    className={clsx('text-16 cursor-pointer', tabVal === 'address' && 'withdraw-tab-active')}
                                    onClick={() => {
                                        setTabVal('address')
                                    }}
                                >
                                    Address
                                </Typography>
                                <Typography
                                    className={clsx('text-16 mx-12 cursor-pointer', tabVal === 'funi' && 'withdraw-tab-active')}
                                    onClick={() => {
                                        setTabVal('funi')
                                    }}
                                >
                                    Funi ID
                                </Typography> */}

                                <Tabs
                                    component={motion.div}
                                    variants={item}
                                    value={tabValue}
                                    onChange={(ev, value) => setTabValue(value)}
                                    indicatorColor="secondary"
                                    textColor="inherit"
                                    variant="scrollable"
                                    scrollButtons={false}
                                    className="min-h-32"
                                    style={{ padding: '0 0', margin: '1.8rem 0rem 1.5rem 1.5rem', borderColor: 'transparent', backgroundColor: '#374252', width: '21.6rem', borderRadius: '20px', height: '30px' }}
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
                                        padding: '1rem 1.2rem',
                                        width: 'auto'
                                    }}
                                >
                                    {Object.entries([t('home_sendTips_1'), t('home_sendTips_2')]).map(([key, label]) => (
                                        <Tab
                                            className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 txtColorTitle opacity-100 zindex"
                                            disableRipple
                                            key={key}
                                            label={label}
                                            sx={{
                                                color: '#FFFFFF', height: '32px', width: '10.8rem'
                                            }}
                                        />
                                    ))}
                                </Tabs>

                            </div>

                            <div className="px-16">
                                <div className="flex items-center justify-between">
                                    <FormControl sx={{ width: tabValue === 0 && isMobileMedia ? '77%' : '88%', borderColor: '#94A3B8' }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-address send-tips-container-address"
                                            value={inputVal.address}
                                            onChange={handleChangeInputVal('address')}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'address',
                                            }}
                                        />
                                        <div className='paste-btn' onClick={() => {
                                            readClipboardText().then(readText => {
                                                changeAddress('address', readText)
                                            });
                                        }}>{t('home_withdraw_11')}</div>
                                    </FormControl>
                                    {isMobileMedia && tabValue === 0 && <>
                                        <div
                                            onClick={() => {
                                                setOpenChangeCurrency(true);
                                            }}
                                            className="flex items-center justify-content-center cursor-pointer">
                                            <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/code.png" alt="" />
                                        </div>
                                    </>}
                                    <div
                                        onClick={() => {
                                            setOpenWithdrawLog(true)
                                        }}
                                        className="flex items-center justify-content-center cursor-pointer">
                                        <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                    </div>
                                </div>

                                <Typography className="text-16 cursor-pointer mt-16" style={{ marginTop: '1rem' }}>
                                    {t('home_sendTips_3')}
                                </Typography>
                                <div className="flex  py-16 justify-between" style={{ paddingTop: '1.3rem', marginRight: '-0.8rem', marginBottom: '1rem' }}>
                                    <FormControl sx={{ width: tabValue === 0 ? '73.4%' : '98%', borderColor: '#94A3B8' }} variant="outlined">
                                        {/* <OutlinedInput
                                            id="outlined-adornment-address send-tips-container-amount"
                                            value={inputVal.amount}
                                            onChange={handleChangeInputVal('amount')}
                                            // endAdornment={<InputAdornment position="end" onClick={() => {alert(1)}}>
                                            //     <Typography className="text-12 font-medium cursor-pointer">
                                            //         MAX
                                            //     </Typography>
                                            // </InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            type="number"
                                        /> */}
                                        <TextField
                                            error={ismore(inputVal.amount)}
                                            helperText={ismore(inputVal.amount) ? t('home_deposite_28') : ''}
                                            type="number"
                                            step="0.000001"
                                            id="outlined-adornment-address send-tips-container-amount"
                                            value={inputVal.amount}
                                            onChange={handleChangeInputVal('amount')}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            FormHelperTextProps={{ className: "form-helper-text" }}
                                        />
                                    </FormControl>
                                    {tabValue === 0 && <>
                                        <div
                                            className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'HIGHER' && 'withdraw-input-item-right-active')}
                                            onClick={() => {
                                                setAmountTab('HIGHER')
                                            }}
                                        >
                                            {t('home_withdraw_4')}
                                        </div>
                                        <div
                                            className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'LOW' && 'withdraw-input-item-right-active')}
                                            onClick={() => {
                                                setAmountTab('LOW')
                                            }}
                                        >
                                            {t('home_withdraw_13')}
                                        </div>
                                    </>}
                                </div>

                                {/*<div className="flex items-center justify-between my-16">*/}
                                {/*    <Typography className="text-12 cursor-pointer">*/}
                                {/*        Fee: 0.000012  BTC*/}
                                {/*    </Typography>*/}
                                {/*    <Typography className="text-12 cursor-pointer color-2DD4BF">*/}
                                {/*        Add fee to Amount*/}
                                {/*    </Typography>*/}
                                {/*</div>*/}

                                {/*{tabVal === 'address' && <Box*/}
                                {/*    className="py-8"*/}
                                {/*    sx={{*/}
                                {/*        backgroundColor: '#0F172A',*/}
                                {/*        borderRadius: '8px'*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <Typography className="text-12 px-16 my-12">*/}
                                {/*        <span style={{color: '#FCE100'}}>⚠</span> The minimum deposit amount 0.00005 BTC, lower amount won't be credited or refunded.*/}
                                {/*    </Typography>*/}
                                {/*</Box>}*/}
                                {/* <div className='send-tips-total text-16 flex items-center justify-between'>
                                    <div className='send-tips-total-left'>Fee: 0.000012  BTC</div>
                                    <div className='send-tips-total-right'>Add fee to Amount</div>
                                </div> */}
                            </div>
                        </div>

                        {
                            // tabValue === 1 &&
                            <div className="px-16 flex items-center justify-content-start " style={{ paddingLeft: '0.7rem' }}>
                                {/* <Checkbox defaultChecked /> */}
                                {/* <Typography style={{ fontSize: '1.5rem' }}>
                                    {t('home_sendTips_8')}
                                </Typography> */}
                            </div>}
                        <Button
                            disabled={ismore(inputVal.amount)}
                            className={clsx('px-48 text-lg btnColorTitleBig', tabValue === 0 ? 'm-28' : 'mx-28 my-16')}
                            color="secondary"
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '24rem', height: '4rem', margin: '1rem auto 2.5rem', display: 'block', fontSize: '2rem', lineHeight: 'initial' }}
                            onClick={() => { handleSubmit() }}
                        >
                            {t('home_sendTips_9')}
                        </Button>
                    </Box>
                    {/*打开摄像头*/}
                    <BootstrapDialog
                        onClose={() => { setOpenChangeCurrency(false); closeScan(); }}
                        aria-labelledby="customized-dialog-title"
                        open={openChangeCurrency}
                        className='scan-dialog-content'
                    >
                        {/*<BootstrapDialogTitle id="customized-dialog-title" onClose={() => {setOpenChangeCurrency(false)}}>*/}
                        {/*    Change Currency*/}
                        {/*</BootstrapDialogTitle>*/}
                        <DialogContent dividers>
                            <div style={{ width: '100%', height: '90vh', backgroundColor: '#181818' }}>
                                <Typography className="text-18 px-16 my-12 font-medium flex items-center justify-between scan-code-top">
                                    <img className='scan-code-back' src="wallet/assets/images/withdraw/icon-back.png" onClick={() => { setOpenChangeCurrency(false); closeScan(); }} alt="back-button" />
                                    <span className='scan-code-title text-18'>{t('home_sendTips_10')}</span>
                                    <img className='scan-code-camera' src="wallet/assets/images/withdraw/scan-code-img.png" alt="back-button" />
                                </Typography>
                                <div id="qrcode_reader" className='qrcode-reader' style={{ width: '300px', minHeight: "200px" }}></div>
                                <div className='scan-code-bottom-tips'>{t('home_sendTips_11')}</div>
                            </div>
                        </DialogContent>
                    </BootstrapDialog>

                    {/*打开历史记录*/}
                    <BootstrapDialog
                        onClose={() => { setOpenWithdrawLog(false); }}
                        aria-labelledby="customized-dialog-title"
                        open={openWithdrawLog}
                        className="dialog-container"
                    >
                        <DialogContent dividers>
                            <div className='dialog-box'>
                                <Typography id="customized-dialog-title" className="text-24 px-16  dialog-title-text">&nbsp;
                                    <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => { setOpenWithdrawLog(false) }} alt="close icon" />
                                </Typography>
                            </div>
                            <Box
                                className="dialog-content dialog-content-paste-height"
                                style={{ padding: "0px" }}
                            >
                                <Box
                                    className="dialog-content-inner dialog-content-paste-width border-r-5" style={{ width: "100%" }}
                                >
                                    {
                                        historyAddress.map((item, index) => {
                                            return (
                                                <div className='dialog-item' key={index} style={{ margin: "10px auto" }}>
                                                    <Typography className="text-14 px-16 dialog-withdraw-text"
                                                        onClick={() => {
                                                            setOpenWithdrawLog(false);
                                                            changeAddress('address', item)
                                                        }}
                                                    >
                                                        {item}
                                                    </Typography>
                                                    <IconButton onClick={() => { handleCopyText(item) }}>
                                                        <img src="wallet/assets/images/deposite/copy.png" alt="" />
                                                    </IconButton>
                                                    <IconButton onClick={() => { del(item) }}>
                                                        <img src="wallet/assets/images/deposite/delete.png" alt="" />
                                                    </IconButton>
                                                </div>
                                            )
                                        })
                                    }
                                </Box>
                            </Box>
                        </DialogContent>
                    </BootstrapDialog>

                    {/*填写google验证码*/}
                    <BootstrapDialog
                        onClose={() => { setOpenGoogleCode(false); }}
                        aria-labelledby="customized-dialog-title"
                        open={openGoogleCode}
                    >
                        <DialogContent dividers>
                            <div className="mt-8">
                                <Typography className="text-18 px-16 my-12 font-medium">{t('home_sendTips_12')}</Typography>
                                <OtpPass setGoogleCode={setGoogleCode} />
                            </div>
                        </DialogContent>
                    </BootstrapDialog>
                </motion.div>
            </div>
        </div>
    )
}

export default Earn;
