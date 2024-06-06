import { useState, useEffect, default as React, useRef } from 'react';
import axios from "axios";
import domain from "../../api/Domain";
import TextField from '@mui/material/TextField';
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
import { useNavigate } from 'react-router-dom';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { tokenTransfer } from "../../store/user/userThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { selectConfig } from "../../store/config";
import {arrayLookup, getNowTime, getOpenAppId, getOpenAppIndex, setPhoneTab} from "../../util/tools/function";
import { openScan, closeScan } from "../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, cryptoWithdrawFee, getWithdrawHistoryAddress, delWithdrawHistoryAddress, getWithdrawTransferStats } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import OtpPass from "../otpPass/OtpPass";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getCryptoDisplay } from "../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Fiat from "./components/Fiat";
import Nft from "./components/Nft";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
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
        if (dollarFiatB == dollarFiatA) {
            return -1
        }
        return dollarFiatB - dollarFiatA;
    } else if (isPrioritizedBSecond) {
        // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
        // return 1;
        if (dollarFiatB == dollarFiatA) {
            return -1
        }
        return dollarFiatB - dollarFiatA;
    } else {
        // 如果两个币种都不属于优先展示的币种，则保持原有顺序
        // return 0;
        return dollarFiatB - dollarFiatA;
    }
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



function Withdraw(props) {
    const navigate = useNavigate()
    const { t } = useTranslation('mainPage');
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const dispatch = useDispatch();
    const [inputVal, setInputVal] = useState({
        address: '',
        amount: 0.00,
        showAmount: 0.00,
    });
    const [withdrawConfig, setWithdrawConfig] = useState({});
    const [walletName, setWalletName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [amountTab, setAmountTab] = useState('HIGHER');
    const [fee, setFee] = useState(0);
    const [TransactionFee, setTransactionFee] = useState(0);
    const [bAppendFee, setBAppendFee] = useState(false);

    const handleChangeInputVal = (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (prop == 'amount' && event.target.value != '' && event.target.value != 0) {
            console.log(networkId, 'networkId')
            evalFee2(networkId, symbol, event.target.value);
        }
    };

    const changeAddress = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };
    const [historyAddress, setHistoryAddress] = useState([]);
    const [transferState, setTransferState] = useState([]);
    const [googleCode, setGoogleCode] = useState('');
    const [openChangeCurrency, setOpenChangeCurrency] = useState(false);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const [openGoogleCode, setOpenGoogleCode] = useState(false);
    const [openTiBi, setOpenTiBi] = useState(false);
    const [withDrawOrderID, setWithDrawOrderID] = useState('');
    const [openLoad, setOpenLoad] = useState(false);
    const [openPaste, setOpenPaste] = useState(false);
    const walletData = useSelector(selectUserData).wallet;
    const transferStats = useSelector(selectUserData).transferStats;
    const config = useSelector(selectConfig);
    const symbols = config.symbols;
    const mounted = useRef();
    const hasAuthGoogle = useSelector(selectUserData).userInfo?.hasAuthGoogle

    function ismore(inputVal) {
        if (Number(inputVal) > Number(arrayLookup(symbolWallet, 'symbol', symbol, 'balance'))) {

            return true
        } else return false
    }

    const handleSubmit = () => {
        var amount = inputVal.amount;
        var tmpBAppendFee = false;
        if (bAppendFee) {
            amount = inputVal.amount - fee;
        }
        if (fee == 0) {
            tmpBAppendFee = true;
        } else {
            tmpBAppendFee = bAppendFee;
        }

        const rate = arrayLookup(symbols, 'symbol', symbol, 'rate');
        let conversionAmount = rate * amount;

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
            address: inputVal.address,
            amount: amount,
            coinName: symbol,
            checkCode: googleCode,
            networkId: networkId,
            priceLevel: amountTab,
            bAppendFee: tmpBAppendFee,
        };
        setOpenLoad(true);
        dispatch(tokenTransfer(data)).then((res) => {
            setGoogleCode('');
            setOpenTiBi(true);
            if (res.payload) {
                setWithDrawOrderID(res.payload);
            }

        });
    };
    const handleCopyText = (text) => {
        var input1 = document.createElement('input');
        document.body.appendChild(input1);
        input1.setAttribute('value', text);
        input1.select();
        document.execCommand("copy"); // 执行浏览器复制命令
        navigator.clipboard.writeText(text)
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            document.execCommand('copy');
            document.execCommand('copy');
        }
        document.body.removeChild(input1);
    }
    useEffect(() => {
        if (googleCode.length === 6) {
            setOpenGoogleCode(false);
            handleSubmit();
        }

    }, [googleCode]);

    useEffect(() => {
        if (openChangeCurrency) {
            console.log(openChangeCurrency);
            console.log('startScanQRCode');
            setTimeout(() => {
                startScanQRCode();
            }, 1000);
        }
    }, [openChangeCurrency]);

    useEffect(() => {
        setTransferState(transferStats);
    }, [transferStats]);

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
        }, false, (err) => {
            console.log(`error错误: ${err}`);
            dispatch(showMessage({ message: t('error_2'), code: 2 }));
            setOpenChangeCurrency(false);
            closeScan();
        });
    };

    const evalFee = (coinName, networkId, priceLevel) => {
        let decimals = (arrayLookup(symbols, 'symbol', coinName, 'decimals') || 18) - 4;
        console.log('decimals', decimals)
        dispatch(evalTokenTransferFee({
            coinName: coinName,
            networkId: networkId,
            priceLevel: priceLevel,
            decimals: decimals,
            // setFee: setFee
        })).then((res) => {
            let resData = res.payload;
            if (resData.data == 0) {
                setFee(0);
                return
            }
            let fee = ((resData.data / (new BN(10).pow(new BN(decimals)).toNumber())) / 10000).toFixed(6);
            setFee(fee);
        });
    };

    const evalFee2 = (networkId, coinName, amount) => {
        dispatch(cryptoWithdrawFee({
            networkId: networkId,
            coinName: coinName,
            amount: amount,
        })).then((res) => {
            let resData = res.payload;
            if (resData && resData.data != 0) {
                let TransactionFee = (resData.data).toFixed(2);
                setTransactionFee(TransactionFee);
            } else {
                setTransactionFee(0);
                return
            }

        });
    };

    const del = (item) => {
        dispatch(delWithdrawHistoryAddress(item)).then((res) => {
            dispatch(getWithdrawHistoryAddress()).then((res) => {

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
        setPhoneTab('withdraw');
        dispatch(getWithdrawHistoryAddress()).then((res) => {
            if (res.payload?.data?.length > 0) {
                setHistoryAddress(res.payload.data);
            }
        });
    }, []);

    const fiatData = useSelector(selectUserData).fiat;
    const userData = useSelector(selectUserData);
    const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || 'USD');

    const networks = config.networks;
    const symbolsData = config.symbols;
    const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
    const [networkData, setNetworkData] = useState([]);
    const [networkId, setNetworkId] = useState(0);

    const loginType = window.localStorage.getItem('loginType') ?? userData?.userInfo?.loginType;

    const symbolsFormatAmount = () => {
        let currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'exchangeRate') || 0;
        let displayData = [];
        cryptoDisplayData?.map((item, index) => {
            displayData.push(item.name);
        });
        symbolsData.map((item, index) => {
            if (displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
                displayData.push(item.symbol);
            }
        });
        let tmpSymbols = [];
        // 美元汇率
        let dollarCurrencyRate = arrayLookup(config.payment.currency, 'currencyCode', 'USD', 'exchangeRate') || 0;
        displayData.forEach((item, index) => {
            var tmpShow = arrayLookup(cryptoDisplayData, 'name', item, 'show');
            if (tmpShow === '') {
                tmpShow = arrayLookup(symbolsData, 'symbol', item, 'userShow');
            }
            if (tmpShow === true && item != 'eBGT') {
                // 兑换成USDT的汇率
                let symbolRate = arrayLookup(symbolsData, 'symbol', item, 'rate') || 0;
                var balance = getUserMoney(item);
                tmpSymbols.push({
                    avatar: arrayLookup(symbolsData, 'symbol', item, 'avatar') || '',
                    symbol: item,
                    balance: balance, // 余额
                    dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
                    currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
                    tradeLock: arrayLookup(walletData.inner, 'symbol', item, 'tradeLock') || 0,
                    withdrawLock: arrayLookup(walletData.inner, 'symbol', item, 'withdrawLock') || 0
                });
            }
        });

        const sortUseLen = (a, b) => {
            return a.networkLen - b.networkLen;
        };

        let tmpNetworks = {};
        tmpSymbols.forEach((item, index) => {
            var tmpNetId = [];
            var tmpNetData = [];
            symbolsData.map((symbolData) => {
                if (tmpNetId.indexOf(symbolData.networkId) === -1 && symbolData.symbol === item.symbol) {
                    tmpNetId.push(symbolData.networkId);
                }
            });

            for (var i = 0; i < tmpNetId.length; i++) {
                if (arrayLookup(networks, 'id', tmpNetId[i], 'symbol')) {
                    tmpNetData.push({
                        id: tmpNetId[i],
                        symbol: arrayLookup(networks, 'id', tmpNetId[i], 'symbol'),
                        avatar: arrayLookup(networks, 'id', tmpNetId[i], 'avatar'),
                        network: arrayLookup(networks, 'id', tmpNetId[i], 'network'),
                        text: 1,
                        desc: 2,
                        networkLen: arrayLookup(networks, 'id', tmpNetId[i], 'network').length || 0,
                    })
                }
            }

            tmpNetData.sort(sortUseLen);
            tmpNetworks[item.symbol] = tmpNetData;
        });
        tmpSymbols.sort(sortUseAge);
        console.log(tmpSymbols);
        setSymbolWallet(tmpSymbols.filter(i => i.symbol !== 'eUSDT'));
        setNetworkData(tmpNetworks);
    };

    const getUserMoney = (symbol) => {
        let arr = userData.wallet.inner || [];
        let balance = arrayLookup(arr, 'symbol', symbol, 'balance') || 0;
        return balance.toFixed(6)
    };

    const tidyWalletData = () => {
        symbolsFormatAmount();
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            tidyWalletData();
        }
    }, [cryptoDisplayData, symbolsData, networks]);

    useEffect(() => {
        // getWalletConfig();
        dispatch(getCryptoDisplay()).then((res) => {
            let result = res.payload;
            setCryptoDisplayData(result?.data);
        });
    }, []);

    useEffect(() => {
        if (networkData[symbol]) {
            setNetworkId(networkData[symbol][0]?.id);
            evalFee(symbol, networkData[symbol][0]?.id, amountTab);
        }
    }, [symbol, amountTab]);

    const [tabValue, setTabValue] = useState(0);
    const [ranges, setRanges] = useState([
        t('home_deposite_1'), t('home_deposite_2')
        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
    ]);
    const [cryptoSelect, setCryptoSelect] = useState(0);
    const [fiatSelect, setFiatSelect] = useState(1);
    const getSettingSymbol = async () => {
        return {}
        var openAppId = getOpenAppId();
        var openIndex = getOpenAppIndex();
        const service = axios.create({
            timeout: 50000, // request timeout
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Finger-Nft-Token": window.localStorage.getItem(`Authorization-${openAppId}-${openIndex}`) || "",
            },
        });
        var post = {
            url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/getUserSetting`,
            method: "post",
            // data: qs.stringify(data),
            async: true,
        };

        let res = await service(post);
        console.log(res, 'res........');
        if (res.data.errno === 0) {
        }

        return res;
    };

    useEffect(() => {
        getSettingSymbol().then((res) => {
            var currencyType = res.data?.data?.setting?.currencyType
            console.log(currencyType);
            if (loginType !== "telegram_web_app") {
                if (currencyType) {
                    if (currencyType == 1) {
                        tmpRanges = [
                            t('home_deposite_1'), t('home_deposite_2')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        console.log('存在.......');
                        var tmpRanges = [
                            t('home_deposite_2'), t('home_deposite_1')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        var tmpCryptoSelect = 1;
                        var tmpFiatSelect = 0;
                    }
                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                }
                else if (userData.profile?.loginType !== "unknown") {
                    var tmpRanges = [
                        t('home_deposite_2'), t('home_deposite_1')
                        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                    ];
                    var tmpCryptoSelect = 1;
                    var tmpFiatSelect = 0;
                    if (userData.profile.wallet?.Crypto < userData.profile.wallet?.Fiat) {
                    } else if (userData.profile.wallet?.Crypto > userData.profile.wallet?.Fiat) {
                        tmpRanges = [
                            t('home_deposite_1'), t('home_deposite_2')
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        if (userData.profile?.loginType === "web3_wallet") {
                            tmpRanges = [
                                t('home_deposite_1'), t('home_deposite_2')
                                // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                            ];
                            tmpCryptoSelect = 0;
                            tmpFiatSelect = 1;
                        }
                    }
                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                }
            }
        })

    }, [userData.profile]);

    return (
        <div>
            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className='mb-6 mt-12'
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
                        className="min-h-40 wallet-show-type wallet-show-type-tab ml-16 mr-12 "
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full min-h-32' }}
                        TabIndicatorProps={{
                            children: (
                                <Box className="w-full h-full rounded-full  huaKuaBgColor0" />
                            ),
                        }}
                        sx={{
                            padding: '1rem 1.2rem',
                            flex: 1,
                        }}
                    >
                        {Object.entries(ranges).map(([key, label]) => (
                            <Tab
                                className="text-14 font-semibold min-w-64 wallet-tab-item txtColorTitle zindex opacity-100"
                                disableRipple
                                key={key}
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '3.5rem', width: '16.8rem'
                                    // color: '#FFFFFF', height: '3.5rem', width: '10.8rem'
                                }}
                            />
                        ))}
                    </Tabs>
                </motion.div>


                {tabValue === cryptoSelect && <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        style={{ padding: '0 1.5rem 2rem 1.5rem' }}
                    >
                        <Box
                            className="w-full rounded-16 border flex flex-col "
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            {symbolWallet.length > 0 && <StyledAccordionSelect
                                symbol={symbolWallet}
                                currencyCode="USD"
                                setSymbol={setSymbol}
                            />}
                        </Box>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="p-24 mb-24"
                        style={{ padding: '0 1.5rem 0 1.5rem' }}
                    >
                        <Box
                            component={motion.div}
                            variants={item}
                            className="w-full rounded-16 border flex flex-col "
                            style={{ borderRadius: '0.5rem' }}
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            <Typography className="text-16 px-16 my-12" style={{ marginBottom: '0.5rem', marginTop: '10px' }}>{t('home_withdraw_1')}</Typography>
                            <div className="flex px-16" style={{ flexWrap: 'wrap', paddingLeft: '0.7rem', paddingRight: '0.7rem' }}>
                                {networkData[symbol]?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            // className="flex items-center px-8 rounded-8 border"
                                            className={clsx('flex items-center px-8 rounded-8 border cursor-pointer deposite-token', networkId === item.id && 'active-border')}
                                            onClick={() => {
                                                setWalletName(item.network);
                                                setNetworkId(item.id);
                                            }}
                                            style={{
                                                // width: '30%',
                                                margin: '.8rem 1%',
                                                paddingLeft: '0.2rem',
                                                paddingRight: '0.2rem',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <img style={{ width: '2rem', borderRadius: '50%' }} src={item.avatar} alt="" />
                                            <div className="px-12"
                                                style={{
                                                    paddingLeft: '0.4rem',
                                                    paddingRight: '0.4rem'
                                                }}
                                            >
                                                <Typography className={clsx("text-14 font-medium", networkId === item.id && 'color-ffffff')}>{item.symbol}</Typography>
                                                <Typography className={clsx("text-12 font-medium color-grey", networkId === item.id && 'color-ffffff')}>{item.network}</Typography>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="py-16" style={{ paddingTop: 0 }}>
                                <div className="flex p-16">
                                    <Typography className="text-16 cursor-pointer withdraw-tab-active">{t('home_sendTips_1')}</Typography>
                                </div>

                                <div className="px-16">
                                    <div className="flex items-center justify-between">
                                        <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                            <OutlinedInput
                                                id="outlined-adornment-address send-tips-container-address"
                                                value={inputVal.address}
                                                onChange={handleChangeInputVal('address')}
                                                aria-describedby="outlined-weight-helper-text"
                                                inputProps={{
                                                    'aria-label': 'address',
                                                }}
                                            />
                                            <div className='paste-btn' onClick={() => {
                                                const clipPromise = navigator.clipboard.readText();
                                                clipPromise.then(clipText => {
                                                    changeAddress('address', clipText)
                                                })
                                            }}>{t('home_withdraw_11')}</div>
                                        </FormControl>
                                        {
                                            isMobileMedia &&
                                            <div className="flex items-center justify-content-center"
                                                onClick={() => {
                                                    setOpenChangeCurrency(true);
                                                }}
                                            >
                                                <img src="wallet/assets/images/withdraw/code.png" alt="" />
                                            </div>
                                        }

                                        <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center">
                                            <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                        </div>
                                    </div>

                                    <Typography className="text-16 cursor-pointer mt-16">
                                        {t('home_withdraw_3')}
                                    </Typography>
                                    <div className="flex items-center py-16 justify-between" style={{ marginRight: '-1rem' }}>
                                        <FormControl sx={{ width: '70%', borderColor: '#94A3B8' }} variant="outlined">
                                            {/* <OutlinedInput
                                                id="outlined-adornment-address send-tips-container-amount"
                                                value={inputVal.amount}
                                                onChange={handleChangeInputVal('amount')}
                                                endAdornment={<InputAdornment position="end">
                                                    <Typography className="text-16 font-medium cursor-pointer color-2DD4BF">
                                                        {t('home_withdraw_5')}
                                                    </Typography>
                                                </InputAdornment>}
                                                aria-describedby="outlined-weight-helper-text"
                                                inputProps={{
                                                    'aria-label': 'amount',
                                                }}
                                                type="number"
                                            /> */}
                                            <TextField
                                                error={ismore(inputVal.amount)}
                                                helperText={ismore(inputVal.amount) ? t('home_deposite_28') : ''}
                                                step="0.000001"
                                                id="outlined-adornment-address send-tips-container-amount"
                                                value={inputVal.amount}
                                                onChange={handleChangeInputVal('amount')}
                                                endAdornment={<InputAdornment position="end">
                                                    <Typography className="text-16 font-medium cursor-pointer color-2DD4BF">
                                                        {t('home_withdraw_5')}
                                                    </Typography>
                                                </InputAdornment>}
                                                aria-describedby="outlined-weight-helper-text"
                                                inputProps={{
                                                    'aria-label': 'amount',
                                                }}
                                                type="number"
                                                FormHelperTextProps={{ className: "form-helper-text" }}
                                            />
                                        </FormControl>
                                        <div
                                            className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'HIGHER' && 'withdraw-input-item-right-active')}
                                            onClick={() => {
                                                setAmountTab('HIGHER')
                                            }}
                                        >
                                            {t('home_withdraw_12')}
                                        </div>
                                        <div
                                            className={clsx('mx-8 withdraw-input-item-right py-16 cursor-pointer text-center touchnGoListDi amount-tab-item', amountTab === 'LOW' && 'withdraw-input-item-right-active')}
                                            onClick={() => {
                                                setAmountTab('LOW')
                                            }}
                                        >
                                            {t('home_withdraw_13')}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between my-16" style={{ marginTop: 0 }}>
                                        <Typography className="text-16 cursor-pointer ">
                                            <p style={{ fontSize: '1.3rem' }}> {t('home_withdraw_7')}: {fee}  {symbol}</p>
                                        </Typography>
                                        <Typography
                                            className="text-16 cursor-pointer color-2DD4BF"
                                            onClick={() => {
                                                if (!bAppendFee) {
                                                    setBAppendFee(true);
                                                    changeAddress('amount', Number(inputVal.amount) + Number(fee));
                                                } else {
                                                    setBAppendFee(false);
                                                    changeAddress('amount', Number(inputVal.amount) - Number(fee));
                                                }
                                                evalFee(symbol, networkId, amountTab)
                                            }}
                                        >
                                            <p style={{ fontSize: '1.3rem' }}>{t('home_withdraw_8')}</p>
                                        </Typography>
                                    </div>

                                    <Box
                                        className="py-8"
                                        sx={{
                                            backgroundColor: '#0F172A',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <Typography className="text-14 px-16 ">
                                            <span style={{ color: '#FCE100' }}>⚠</span> {t('home_withdraw_15')}{TransactionFee}  {symbol}{t('home_withdraw_16')}{t('home_withdraw_17')}
                                        </Typography>
                                    </Box>

                                </div>
                            </div>

                            {/* 提币动画演示 */}
                            <LoadingButton
                                disabled={ismore(inputVal.amount)}
                                className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                                color="secondary"
                                loading={openLoad}
                                variant="contained"
                                sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                style={{ width: '24rem', height: '4rem', fontSize: "20px", margin: '1rem auto 2.5rem', display: 'block', lineHeight: "inherit", padding: "0px" }}
                                onClick={() => {

                                    handleSubmit()
                                }}
                            >
                                {t('home_withdraw_10')}
                            </LoadingButton>

                        </Box>
                    </motion.div>
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
                                    <span className='scan-code-title text-18'>Scan Code</span>
                                    <img className='scan-code-camera' src="wallet/assets/images/withdraw/scan-code-img.png" alt="back-button" />
                                </Typography>
                                <div id="qrcode_reader" className='qrcode-reader' style={{ width: '300px', minHeight: "200px" }}></div>
                                <div className='scan-code-bottom-tips'>Align the QR code to the scan frame</div>
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
                                                <div className='dialog-item' key={index} style={{ margin: "10px auto" }} >
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
                                <Typography className="text-18 px-16 my-12 font-medium">Google Code</Typography>
                                <OtpPass setGoogleCode={setGoogleCode} />
                            </div>
                        </DialogContent>
                    </BootstrapDialog>



                    {/*提虚拟币界面样式*/}
                    <BootstrapDialog
                        onClose={() => { setOpenTiBi(false); }}
                        aria-labelledby="customized-dialog-title"
                        open={openTiBi}
                        className="dialog-container"
                    >
                        <DialogContent dividers >
                            <div className='dialog-box' >
                                <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                    <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                        setOpenTiBi(false)
                                        setOpenLoad(false)
                                    }} alt="close icon" />
                                </Typography>
                            </div>
                            <Box className="dialog-content dialog-content-paste-height " style={{ paddingRight: "0px", height: "580px" }}>
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="dialog-content-inner  border-r-5">
                                    <motion.div variants={item}>
                                        <img style={{ margin: "0 auto", width: "60px", height: "60px", marginTop: "10px" }} src='wallet/assets/images/wallet/naoZhong.png'></img>
                                    </motion.div>
                                    <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "20px", fontSize: "24px" }}>-{inputVal.amount} {symbol}</motion.div>
                                    <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "10px", fontSize: "16px", color: "#ffc600" }}>● {t('home_PendingReview')}</motion.div>
                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                        <div style={{ color: "#888B92" }}>{t('home_NetWork')}</div>
                                        <div>{walletName}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                        <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                                        <div>Crypto</div>
                                    </motion.div>
                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_withdraw_14')}</div>
                                        <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.address}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                                        <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{withDrawOrderID}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_sendTips_5')}</div>
                                        <div>{fee} {symbol}</div>
                                    </motion.div>

                                    <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                                        <div>{getNowTime()}</div>
                                    </motion.div>
                                </motion.div>
                            </Box>
                        </DialogContent>
                    </BootstrapDialog>










                </div>}

                {tabValue === fiatSelect && <Fiat />}
                {tabValue === 2 && <Nft />}

                {/*打开粘贴板*/}
                {/* <BootstrapDialog
                    onClose={() => {setOpenPaste(false)}}
                    aria-labelledby="customized-dialog-title"
                    open={openPaste}
                    className="dialog-container"
                >
                    <DialogContent dividers>
                        <div className='dialog-box'>
                            <Typography className="text-24 px-16 font-furore dialog-title-text">Withdraw Address
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {setOpenPaste(false)}} alt="close icon"/>
                            </Typography>

                        </div>
                    </DialogContent>
                </BootstrapDialog> */}

                {/*Select Fiat*/}
                {/* <BootstrapDialog
                    onClose={() => {setOpenPaste(false)}}
                    aria-labelledby="customized-dialog-title"
                    open={openPaste}
                    className="dialog-container"
                >
                    <DialogContent dividers>
                        <div className='dialog-box'>
                            <Typography className="text-24 px-16 font-furore dialog-title-text">Select Fiat
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {setOpenPaste(false)}} alt="close icon"/>
                            </Typography>
                            <Box className="dialog-content dialog-content-select-fiat-height">
                                <Box
                                    className="dialog-content-inner dialog-content-select-fiat-width border-r-5"
                                    sx={{
                                        backgroundColor: '#1e293b',
                                        padding: '1.5rem',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Typography className="text-14 font-medium" style={{marginBottom: '2rem'}}>
                                    Please note that these are currency approximations.
                                    All bets & transactions will be settled in the
                                    cryptoequivalent. For further details feel free to
                                    contact our live support.
                                    </Typography>
                                    <div className='dialog-select-fiat'>
                                        {
                                            [1,1,1,1,1,1,1,1,1,1].map((item, index) => {
                                                return (
                                                    <div className='dialog-select-fiat-item border-r-5 flex items-center justify-start' key={index}>
                                                        <img src="wallet/assets/images/deposite/bnb.png" className='dialog-select-fiat-icon border-r-5' alt=""/>
                                                        <Typography className="text-14">USD</Typography>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Box>
                            </Box>
                        </div>
                    </DialogContent>
                </BootstrapDialog> */}

            </div>
        </div>
    )
}

export default Withdraw;
