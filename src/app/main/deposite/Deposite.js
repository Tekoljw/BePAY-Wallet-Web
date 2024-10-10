import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import axios from "axios";
import domain from "../../api/Domain";
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
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
import AnimateModal from "../../components/FuniModal";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import { DialogActions } from '@mui/material';
import '../../../styles/home.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { selectConfig, setNftConfig } from "../../store/config";
import {
    arrayLookup, getOpenAppId, getOpenAppIndex,
    setPhoneTab, handleCopyText, getUserLoginType,
    judgeIosOrAndroid, getNowTime
} from "../../util/tools/function";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { foxSendTransaction, manualCryptoNotify } from "../../store/transfer/transferThunk";
import {
    getWalletAddressConfig,
    getWalletAddress,
    getAddressListDesc,
    WalletConfigDefineMap,
    checkWalletAddress,
    getNftConfig,
    centerGetNftList, getFiatDisplay, centerGetUserFiat
} from "app/store/wallet/walletThunk";
import { goCenterTransfer, getOwner } from "app/store/nft/nftThunk";
import QRCode from "qrcode.react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getCryptoDisplay } from "../../store/wallet/walletThunk";
import { centerGetTokenBalanceList, getDecenterWalletBalance } from "../../store/user/userThunk";
import FuseLoading from '@fuse/core/FuseLoading';
import { useTranslation } from "react-i18next";
import { makeOrder, getDepositeFiatOrderStatus } from "../../store/payment/paymentThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { StepStatus, useStatStyles } from '@chakra-ui/react';
import history from '@history';
import { local } from 'web3modal';
import LoadingButton from "@mui/lab/LoadingButton";
import userLoginType from "../../define/userLoginType";
import { borderTop, width } from '@mui/system';
import * as _ from 'lodash'
import { selectCurrentLanguage } from "app/store/i18nSlice";


const marks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 25,
        label: '25%',
    },
    {
        value: 50,
        label: '50%',
    },
    {
        value: 75,
        label: '75%'
    },
    {
        value: 100,
        label: 'MAX',
    },
];

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

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: 0,
    border: 'none',
    borderRadius: '8px!important',
    backgroundColor: '#1E293B!important',
    marginBottom: 24,
    '&:before': {
        display: 'none',
    },
    '&:first-of-type': {},
    '&:last-of-type': {
        marginBottom: 0,
    },
}));

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const nftNetwork = [
    { network: "BSC", walletName: "BSC", protol: "BSC", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'BSC', 'desc2': 'BSC-2' },
    { network: "Ethereum", walletName: "ETH", protol: "ETH", url: 'wallet/assets/images/deposite/btc.png', 'desc': 'ETH', 'desc2': 'ETH-2' },
];




function Deposite() {

    const [inputValue, setInputValue] = useState(0);
    const [sliderValue, setSliderValue] = useState(100);
    const divRefs = useRef([]);
    const divRefsParent = useRef([]);
    const [balanceAll, setbalanceAll] = useState(0)
    const [checkboxChecked, setCheckboxChecked] = useState(true);
    const [copyTiShi, setCopyTiShi] = useState(false);
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const mounted = useRef();
    const [openLoad, setOpenLoad] = useState(false);
    const [cryptoOpenLoad, setCryptoOpenLoad] = useState(false);
    const [ranges, setRanges] = useState([
        t('home_deposite_1'), t('home_deposite_2')
        // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
    ]);
    const [walletloginname, setwalletloginname] = useState(window.localStorage.getItem('walletname') === 'metamask' ? 'MetaMask' : localStorage.getItem('walletname'))
    const [decentralized, setDdecentralized] = useState(window.localStorage.getItem('isDecentralized'));
    const [cryptoSelect, setCryptoSelect] = useState(0);
    const [fiatSelect, setFiatSelect] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [weight, setWeight] = useState(0);
    const [tiJiaoState, setTiJiaoState] = useState(0);
    const [symbol, setSymbol] = useState('');
    const [walletName, setWalletName] = useState('');
    const [walletAddressList, setWalletAddressList] = useState([]);
    const [selectWalletAddressIndex, setSelectWalletAddressIndex] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    // const [walletConfig, setWalletConfig] = useState([]);
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [defineMapSelected, setDefineMapSelected] = useState(0);
    const [nftWalletAddress, setNftWalletAddress] = useState('');
    // const [nftWalletName, setNftWalletName] = useState('');
    const [nftWalletKey, setNftWalletKey] = useState(0);
    const [transferDialogState, setTransferDialogState] = useState(false);
    const [transferFormData, setInputVal] = useState({
        money: '',
        amount: ''
    });
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [isGetWalletAddress, setIsGetWalletAddress] = useState(false);
    const userData = useSelector(selectUserData);
    const walletData = userData.wallet;
    // 法币余额数据
    const fiatData = userData.fiat;
    const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || 'USD');
    const config = useSelector(selectConfig);
    const nftConfig = config.nftConfig;
    const networks = config.networks;
    const symbolsData = config.symbols;
    const bankCodeList = config.payment?.bankCode || [];
    const currentLanguage = useSelector(selectCurrentLanguage);
    const currencys = useSelector(selectConfig).payment.currency || [];
    // const [currencyBalance, setCurrencyBalance] = useState(fiatData[0]?.balance || 0);
    const [openUpdateBtnShow, setOpenUpdateBtnShow] = useState(false);
    const [fiatsSelected, setFiatsSelected] = useState(0);
    const [openAnimateModal, setOpenAnimateModal] = useState(false);
    const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
    const [networkData, setNetworkData] = useState([]);
    const [networkId, setNetworkId] = useState(0);
    const [addressData, setAddressData] = useState({}); // 地址存储{symbol:{networdId:xx}}
    const [tempAccount, setTempAccount] = useState(0);
    const [chongZhiVal, setChongZhiVal] = useState({
        id: '',
        amount: 0,
        currencyCode: '',
        successTime: 0
    });
    const [time, setTime] = useState({ hour: 0, minute: 0, second: 0 })
    const [refreshTime, setRefreshTime] = useState(10)
    // const regWallet = toRegWallet(userData.profile?.user?.regWallet);
    const regWallet = localStorage.getItem('walletname')
    const walletImage = config.walletConfig[regWallet]?.img;
    const [nftId, setNftId] = useState('');
    const [isConfirmTransfer, setIsConfirmTransfer] = useState(false);
    const [tokenId, setTokenId] = useState('');

    console.log('enter deposit page')
    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    // 创建处理滑块变化的函数
    const handleSliderChange = (e) => {
        const value = e.target.value;
        setInputValue((value * balanceAll / 100).toFixed(6));
        setSliderValue(value);
    };

    const handleCheckboxChange = (e) => {
        setCheckboxChecked(!checkboxChecked);
        if (checkboxChecked) {
            setInputValue('');
            setSliderValue('');
        } else {
            setInputValue(Number(balanceAll));
            setSliderValue(100);
        }
    }
    const toggleAccordion = (panel) => (event, _expanded) => {
        setExpanded(_expanded ? panel : false);
    };

    const handleChangeTransferVal = (prop) => (event) => {
        setInputVal({ ...transferFormData, [prop]: event.target.value });
    };
    const handleChangeTransferVal2 = (prop, value) => {
        setInputVal({ ...transferFormData, [prop]: value });
    };
    // 创建处理输入框变化的函数
    const handleInputChange = (e) => {
        // 限制输入框的值只保留六位小数
        const value = parseFloat(e.target.value);
        setInputValue(value);
        setSliderValue(value / balanceAll * 100);

    };
    // select切换
    const handleChangeFiats = (event) => {
        setFiatsSelected(event.target.value);
        setCurrencyCode(fiats[event.target.value].currencyCode);
        setWeight('');
    };

    //设置图片地址
    const toRegWallet = (regWalletParam) => {
        if (regWalletParam) {
            return regWalletParam.slice(0, 1).toUpperCase() + regWalletParam.slice(1).toLowerCase()
        }
        return regWalletParam
    };

    //转账
    const BransferSubmit = () => {
        console.log(transferFormData.amount, 'money...');

        // if (submitDisabled) {
        console.log(transferFormData.money, 'money...');
        dispatch(foxSendTransaction({
            amount: inputValue,
            symbol: symbol,
            address: walletAddress,
            notPool: true,
            networkId: networkId
        })).then((res) => {
            fbq('track', 'Purchase', { value: inputValue, currency: symbol });
            let tx = res.payload
            if (tx && arrayLookup(symbolWallet, 'symbol', symbol, 'isManualNotify') == 1) {
                dispatch(manualCryptoNotify({
                    txId: tx,
                    networkId: networkId,
                    symbol: symbol,
                }));
            }
        });
        // }
    };

    // 获取地址列表
    const getWalletAddressList = (selectNetworkId) => {
        dispatch(getAddressListDesc({
            networkId: selectNetworkId,
            symbol: symbol,
        })).then((res) => {
            let result = res.payload
            if (result) {
                let tmpList = []
                result.map(async (item) => {
                    tmpList.push({ ...item, disabled: true })
                })
                setWalletAddressList(tmpList)
            }
        })
    }

    function BootstrapDialogTitle(props) {
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

    const refreshOrderStatus = () => {
        setOpenUpdateBtnShow(true)
        dispatch(getDepositeFiatOrderStatus({
            payOrderId: chongZhiVal.id,
        })).then((res) => {
            let result = res.payload
            if (result && result.errno === 0) {
                setTiJiaoState(result?.data?.state)
                if (result?.data?.successTime) {
                    setChongZhiVal({
                        ...chongZhiVal,
                        successTime: _.toNumber(result?.data?.successTime)
                    })
                    setRefreshTime(9)
                }
            }
        })
        setTimeout(() => {
            setOpenUpdateBtnShow(false)
            setTempAccount(0)
        }, 2000);
        // setTempAccount(fiats[fiatsSelected].balance)
        // if (tempAccount == 0) {
        //     setTempAccount(fiats[fiatsSelected].balance)
        // }
        // if (fiats[fiatsSelected].balance > tempAccount) {
        //     history.push('/wallet');
        // }
    }

    const backLoading = () => {
        setTimeout(() => setOpenLoad(false), 1000);
    };

    useEffect(() => {
        setLoadingShow(false);
        dispatch(getCryptoDisplay()).then((res) => {
            setLoadingShow(false);
            let result = res.payload;
            setCryptoDisplayData(result?.data);
        });
    }, []);

    useEffect(() => {
        setSubmitDisabled(!transferFormData.money || !transferFormData.amount);
    }, [transferFormData]);

    // 获取钱包地址
    const getWalletAddressClick = (id) => {

        // console.log(symbol); //USGT
        // console.log(id);  //24

        dispatch(getWalletAddress({ networkId: id, symbol: symbol })).then((res) => {
            setIsLoading(false);
            const result = res.payload;
            if (result.errno === 0) {
                setCryptoOpenLoad(false);
                let addressDataObj = { ...addressData } || {};
                if (!addressDataObj[symbol]) {
                    addressDataObj[symbol] = {}
                }
                addressDataObj[symbol][id] = result?.data || ''
                setAddressData(addressDataObj);
                if (!result) return;
                setWalletAddress(result.data);
                setIsGetWalletAddress(true);

                if (result?.data?.address) {
                    setWalletAddressList([...walletAddressList, {
                        address: result?.data?.address ?? '',
                    }])
                }
            } else {
                dispatch(showMessage({ message: t('error_39'), code: 2 }));
            }
        });
    };

    const handleWalletAddress = (id) => {
        // if (networkData[symbol] && (!addressData[symbol]|| addressData[symbol][id] === undefined)) {
        setIsLoading(true);
        getWalletAddressClick(id);
        // }
    };

    const handleCheckWalletAddress = (id) => {
        dispatch(checkWalletAddress({ networkId: id, symbol: symbol })).then((value) => {
            let res = value.payload;
            if (res && res.data) {
                handleWalletAddress(id)
            }
        });
    };

    // 获取nft钱包地址
    const getNftWalletAddressClick = (walltName) => {
        dispatch(getWalletAddress({ walletName: walltName })).then((res) => {
            setIsLoading(false);
            const result = res.payload;
            if (result.errno === 0) {
                if (!result) return;
                let resultData = result?.data;
                setNftWalletAddress(resultData);
            } else {
                dispatch(showMessage({ message: t('error_39'), code: 2 }));
            }
        });
    };

    // 法币充值
    const fiatRecharge = async (bankID) => {
        if (currencyCode === 'IDR') {
            if (weight < 20000) {
                setOpenLoad(false)
                dispatch(showMessage({ message: t('error_4'), code: 2 }));
                return
            }
        }
        const res = await dispatch(makeOrder({
            bankcode: bankID,
            // currency: arrayLookup(currencys, 'currencyCode', currencyCode, 'id'),
            currency: currencyCode,
            amount: weight,
            clientcb: 'http://funibox.com'
        }))

        let result = res.payload;
        if (result) {
            setOpenAnimateModal(true);
            if (result.payUrl) {
                setChongZhiVal({
                    ...chongZhiVal,
                    id: result.orderId,
                    amount: weight,
                    currencyCode: currencyCode
                })
                const loginType = getUserLoginType(userData);
                switch (loginType) {
                    case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP: { //telegramWebApp
                        if (judgeIosOrAndroid() === "ios") {
                            window.location.href = result.payUrl
                        } else {
                            window.open(result.payUrl, "_blank");
                        }
                        break;
                    }
                    default: {
                        window.open(result.payUrl, "_blank");
                        break;
                    }
                }
                fbq('track', 'InitiateCheckout');
            }
            if (result.status === 'wait') {
                timeFun((result.expiredTime))
                setTiJiaoState(1)
            } else if (result.status === 'success') {
                setTiJiaoState(2)
            } else if (result.status === 'failed') {
                setTiJiaoState(3)
                // dispatch(showMessage({ message: t('error_5'), code: 2 }));
            }
        }
        setOpenLoad(false)
    };

    //格式化币种和网络
    const symbolsFormatAmount = (selectNetworkId) => {
        let filterSymbolData = {};
        if (selectNetworkId && selectNetworkId > 0) {
            //筛选币种
            filterSymbolData = symbolsData.filter(i => i.networkId === selectNetworkId);
        } else {
            filterSymbolData = symbolsData;
        }

        let currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'exchangeRate') || 0;
        let displayData = [];
        cryptoDisplayData?.map((item, index) => {
            displayData.push(item.name);
        });
        symbolsData?.map((item, index) => {
            if (displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
                displayData.push(item.symbol);
            }
        });

        if (displayData.length > 0) {
            let tmpSymbols = [];
            // 美元汇率
            let dollarCurrencyRate = arrayLookup(config.payment.currency, 'currencyCode', 'USD', 'exchangeRate') || 0;
            displayData.forEach((item, index) => {
                var tmpShow = arrayLookup(cryptoDisplayData, 'name', item, 'show');
                if (tmpShow === '') {
                    tmpShow = arrayLookup(symbolsData, 'symbol', item, 'userShow');
                }
                if (tmpShow === true && item !== 'eBGT') {
                    // 兑换成USDT的汇率
                    let symbolRate = arrayLookup(symbolsData, 'symbol', item, 'rate') || 0;
                    var balance = getSymbolMoney(item);
                    tmpSymbols.push({
                        avatar: arrayLookup(symbolsData, 'symbol', item, 'avatar') || '',
                        address: arrayLookup(filterSymbolData, 'symbol', item, 'address') || '',
                        decimals: arrayLookup(symbolsData, 'symbol', item, 'decimals') || '',
                        isManualNotify: arrayLookup(symbolsData, 'symbol', item, 'isManualNotify') || '',
                        type: arrayLookup(symbolsData, 'symbol', item, 'type') ?? '',
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
                var tmpNetIds = [];
                var tmpNetData = [];
                symbolsData?.map((symbolData) => {
                    if (tmpNetIds.indexOf(symbolData.networkId) === -1 && symbolData.symbol === item.symbol) {
                        tmpNetIds.push(symbolData.networkId);
                    }
                });

                for (var i = 0; i < tmpNetIds.length; i++) {
                    if (arrayLookup(networks, 'id', tmpNetIds[i], 'symbol')) {
                        tmpNetData.push({
                            id: tmpNetIds[i],
                            symbol: arrayLookup(networks, 'id', tmpNetIds[i], 'symbol'),
                            avatar: arrayLookup(networks, 'id', tmpNetIds[i], 'avatar'),
                            network: arrayLookup(networks, 'id', tmpNetIds[i], 'network'),
                            text: 1,
                            desc: 2,
                            networkLen: arrayLookup(networks, 'id', tmpNetIds[i], 'network').length || 0,
                        })
                    }
                }

                tmpNetData.sort(sortUseLen);
                tmpNetworks[item.symbol] = tmpNetData;
            });
            tmpSymbols.sort(sortUseAge);
            // console.log(tmpSymbols,'........');
            setSymbolWallet(tmpSymbols.filter(i => i.symbol !== 'eUSDT'));
            setNetworkData(tmpNetworks);
            // console.log(arrayLookup(filterSymbolData, 'symbol', 'USDD', 'address') );
        } else {
            setSymbolWallet([]);
            setNetworkData([]);
        }
    };

    //所有币种和所有网络发生变化需要处理的逻辑
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            symbolsFormatAmount();
        }
    }, [cryptoDisplayData, symbolsData, networks, walletData]);

    //网络数据发生变化需要处理的逻辑
    useEffect(() => {
        if (networkData[symbol] && networkId === 0) {
            setNetworkId(networkData[symbol][0]?.id);
        }
    }, [networkData]);

    //币种发生变化需要处理的逻辑
    useEffect(() => {
        setIsGetWalletAddress(false);
        setWalletAddress('');
        setWalletAddressList([]);
        setSelectWalletAddressIndex(null);
        if (networkData[symbol]) {
            setNetworkId(networkData[symbol][0]?.id);
        } else {
            setNetworkId(0);
        }
    }, [symbol]);

    //选择的网络发生变化需要处理的逻辑
    useEffect(() => {
        symbolsFormatAmount(networkId);
        handleChangeNetWork(networkId);
    }, [networkId]);

    const getSymbolMoney = (symbol) => {
        let arr = userData.wallet.inner || [];
        let balance = arrayLookup(arr, 'symbol', symbol, 'balance') || 0;
        return balance.toFixed(6)
    };

    const handleEditAddressDesc = (currentIndex, editData) => {
        let tmpList = []
        walletAddressList.map(async (item, index) => {
            if (index === currentIndex) {
                tmpList.push({
                    ...item, ...editData
                })

                if (editData.disabled === true) {
                    dispatch(getAddressListDesc({
                        addressDesc: item.addressDesc,
                        address: item.address,
                        networkId: networkId,
                        symbol: symbol,
                    }))
                }
            } else {
                tmpList.push({ ...item })
            }
        })

        setWalletAddressList(tmpList)
    }

    //改变网络的处理
    const handleChangeNetWork = (tmpNetwordId) => {
        let address = (addressData[symbol] && addressData[symbol][tmpNetwordId]) || ''
        setSelectWalletAddressIndex(null)
        setIsGetWalletAddress(addressData[symbol] && addressData[symbol][tmpNetwordId]);
        setWalletAddress(address);
        if (tmpNetwordId !== 0) {
            getWalletAddressList(tmpNetwordId);
            handleCheckWalletAddress(tmpNetwordId);
        }
    };

    useEffect(() => {
        if (refreshTime === 0) {
            setOpenAnimateModal(false);
            history.push('/wallet/home/wallet');
        } else {
            if (tiJiaoState === 2) {
                setTimeout(() => {
                    setRefreshTime(refreshTime - 1)
                }, 1000)
            }
        }
    }, [refreshTime])

    let timer;
    const timeFun = (time) => {
        let end_time = new Date(time).getTime(),
            sys_second = (end_time - new Date().getTime());
        timer = setInterval(() => {
            if (sys_second > 1000) {
                sys_second -= 1000;
                let hour = Math.floor((sys_second / 1000 / 3600) % 24);
                let minute = Math.floor((sys_second / 1000 / 60) % 60);
                let second = Math.floor(sys_second / 1000 % 60);
                setTime({
                    hour: hour < 10 ? "0" + hour : hour,
                    minute: minute < 10 ? "0" + minute : minute,
                    second: second < 10 ? "0" + second : second
                })
            } else {
                setTiJiaoState(6)
                clearInterval(timer);
            }
        }, 1000);
    }

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

        if (res.data.errno === 0) {
        }

        return res;
    };

    useEffect(() => {
        const loginType = getUserLoginType(userData);
        if (loginType !== userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP) {
            getSettingSymbol().then((res) => {
                var currencyType = res.data?.data?.setting?.currencyType
                console.log(currencyType, 'currencyType.....');

                if (currencyType) {
                    if (currencyType == 1) {
                        tmpRanges = [
                            // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                            t('home_deposite_1'), t('home_deposite_2')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        console.log('存在.......');
                        var tmpRanges = [
                            // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
                            t('home_deposite_2'), t('home_deposite_1')
                        ];
                        var tmpCryptoSelect = 1;
                        var tmpFiatSelect = 0;
                    }

                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                } else if (loginType !== "unknown") {
                    var tmpRanges = [
                        t('home_deposite_2'), t('home_deposite_1')
                        // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
                    ];
                    var tmpCryptoSelect = 1;
                    var tmpFiatSelect = 0;
                    if (userData.profile.wallet?.Crypto < userData.profile.wallet?.Fiat) {
                    } else if (userData.profile.wallet?.Crypto > userData.profile.wallet?.Fiat) {
                        tmpRanges = [
                            t('home_deposite_1'), t('home_deposite_2')
                            // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
                        ];
                        tmpCryptoSelect = 0;
                        tmpFiatSelect = 1;
                    } else {
                        if (loginType === "web3_wallet") {
                            tmpRanges = [
                                t('home_deposite_1'), t('home_deposite_2')
                                // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
                            ];
                            tmpCryptoSelect = 0;
                            tmpFiatSelect = 1;
                        }
                    }

                    setRanges(tmpRanges);
                    setCryptoSelect(tmpCryptoSelect);
                    setFiatSelect(tmpFiatSelect);
                }
            })
        } else {
            //默认选中虚拟币
            setCryptoSelect(0);
            setFiatSelect(1);
        }
    }, [userData.profile]);

    useEffect(() => {
        setRanges([t('home_deposite_1'), t('home_deposite_2')]);
    }, [currentLanguage.id]);

    useEffect(() => {
        if (!nftId && nftConfig[Object.keys(nftConfig)[0]]) {
            setNftId(nftConfig[Object.keys(nftConfig)[0]].id);
        }
    }, [nftConfig]);

    // 切换NFT
    const handleChangeNft = (event) => {
        if (nftConfig[event.target.value]) {
            setNftId(event.target.value);
        }
    };

    // nft授权转账
    const doNftTransfer = (param) => {
        dispatch(getWalletAddress({
            walletName: 'DeFi',
        })).then(res => {
            setIsLoading(false);
            const result = res.payload;
            if (result && result.errno === 0) {
                dispatch(goCenterTransfer({
                    toAddress: result.data,
                    tokenId: param.tokenId,
                    nftToken: param.nftToken
                })).then((transferRes) => {
                    let transferResult = transferRes.payload;
                    if (transferResult) {
                        setIsConfirmTransfer(true);
                        console.log(transferResult);
                    }
                })
            } else {
                dispatch(showMessage({ message: t('error_39'), code: 2 }));
            }
        })
    }

    useEffect(() => {
        if (isConfirmTransfer) {
            let timer = setInterval(() => {
                dispatch(centerGetNftList()).then(res => {
                    let result = res.payload;
                    let tmpNftBalance = {};
                    result.inner.forEach((item) => {
                        if (item.frozen === 0) {
                            if (tmpNftBalance[item.nftId]) {
                                tmpNftBalance[item.nftId] = tmpNftBalance[item.nftId] + 1
                            } else {
                                tmpNftBalance[item.nftId] = 1
                            }
                        }

                        if (item.nftId == nftId && item.tokenId == tokenId) {
                            dispatch(showMessage({ message: 'success', code: 1 }));
                            setIsConfirmTransfer(false);
                            clearInterval(timer);
                        }
                    })
                });
            }, 10000);
        }
    }, [isConfirmTransfer]);

    const [paymentFiat, setPaymentFiat] = useState(config.payment?.currency || []);
    const [fiatDisplayData, setFiatDisplayData] = useState([]);
    const [fiats, setFiats] = useState([]);
    const [showQRcode, setShowQRcode] = useState(false);

    const fiatsFormatAmount = () => {
        if (fiatData.length === 0 && paymentFiat.length === 0) {
            return
        }
        let tmpFiatDisplayData = {};
        let tmpPaymentFiat = {};
        let tmpFiatsData = {};
        let tmpFiats = [];
        let displayFiatData = [];
        //根据支付方式来处理是否显示法币
        if (paymentFiat?.length > 0) {
            paymentFiat.map((item, index) => {
                if (displayFiatData.indexOf(item.currencyCode) === -1 && item.userShow === true) {
                    displayFiatData.push(item.currencyCode);
                }
                tmpPaymentFiat[item.currencyCode] = item
            });
        }
        fiatDisplayData?.map((item, index) => {
            displayFiatData.push(item.name);
            tmpFiatDisplayData[item.name] = item
        });
        if (fiatData.length > 0) {
            fiatData?.map((item, index) => {
                tmpFiatsData[item.currencyCode] = item;
            });
        }

        //需要展示的法币
        displayFiatData.forEach((item) => {
            // var tmpShow = arrayLookup(fiatDisplayData, 'name', item, 'show');
            var tmpShow = tmpFiatDisplayData[item]?.show;
            if (tmpShow === '' || tmpShow === null || tmpShow === undefined) {
                // tmpShow = arrayLookup(paymentFiat, 'currencyCode', item, 'userShow');
                tmpShow = tmpPaymentFiat[item]?.userShow;
            }

            if (tmpShow === true && !arrayLookup(tmpFiats, 'currencyCode', item, 'currencyCode')) {
                // let balance = arrayLookup(fiatsData, 'currencyCode', item, 'balance') || 0;
                var balance = tmpFiatsData[item]?.balance || 0;
                tmpFiats.push({
                    avatar: tmpPaymentFiat[item]?.avatar || '',
                    currencyCode: item,
                    // balance: balance == 0 ? 0.00 : balance.toFixed(2),
                    balance,
                    dollarFiat: (balance == 0) ? 0 : balance / tmpPaymentFiat[item]?.exchangeRate
                })
            }
        });

        tmpFiats.sort(sortUseAge);

        setFiats(tmpFiats);
        if (tmpFiats.length > 0) {
            setCurrencyCode(tmpFiats[0]?.currencyCode)
        }
    };

    const tidyFiatWalletData = () => {

    };

    useEffect(() => {
        setPaymentFiat(config.payment?.currency);
    }, [config.payment?.currency]);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            fiatsFormatAmount();
        }
    }, [fiatData, fiatDisplayData, paymentFiat]);

    useEffect(() => {
        setPhoneTab('deposite');
        dispatch(getFiatDisplay()).then((res) => {
            let result = res.payload;
            setFiatDisplayData(result?.data);
        });
    }, []);

    // 格式化金额
    const formatAmount = (amount) => {
        if (amount >= 1000000000) {
            return (amount / 1000000000) + 'B';
        } else if (amount >= 100000000) {
            return (amount / 100000000) + 'E';
        } else if (amount >= 1000000) {
            return (amount / 1000000) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000) + 'K';
        }
        return amount
    }

    useEffect(() => {
        setTimeout(() => {
            divRefs.current.forEach(div => {
                if (div) {
                    div.style.fontSize = '1.2rem';
                    if ((div.getBoundingClientRect().width + 22 + 16) > (divRefsParent.current[0]?.getBoundingClientRect().width)) {
                        div.style.fontSize = '0.95rem';
                    }
                }
            });
        }, 0);
    }, [walletAddressList]);

    const copyTiShiFunc = () => {
        setCopyTiShi(true)
        setTimeout(() => {
            setCopyTiShi(false)
        }, 800);
    }

    const [loadingShow, setLoadingShow] = useState(false);

    return (
        <div>
            {!loadingShow && <div>
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
                        className="tongYongDingBtn"
                        style={{ width: '50%!import' }}
                        classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                        TabIndicatorProps={{
                            children: (
                                <Box
                                    sx={{ bgcolor: 'text.disabled' }}
                                    className="w-full h-full rounded-full  huaKuaBgColor0"
                                />
                            ),
                        }}
                        sx={{
                            margin: "1rem 1.2rem",
                        }}
                    >
                        {Object.entries(ranges)?.map(([key, label]) => (
                            <Tab
                                className="text-14 font-semibold min-h-36 min-w-64 mx4 px-12 opacity1 txtColorTitle zindex"
                                disableRipple
                                key={key}
                                label={label}
                                sx={{
                                    color: '#FFFFFF', height: '3.6rem', width: '50%'
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
                        style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}
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
                                isExpand={true}

                            />}
                        </Box>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="InsideW"
                    >
                        <div className='addressBigW flex justify-between mt-10'>
                            <div className="userIdW guoDuDongHua" style={{ height: showQRcode ? '22rem' : '4.2rem' }}>
                                <div className="addressW2 flex justify-between guoDuDongHua">
                                    <div className='idZi guoDuDongHua'> <span style={{ color: "#ffffff", marginRight: "10px" }}>UserID</span>  {userData?.profile?.user?.id}</div>
                                    <img onClick={() => {
                                        copyTiShiFunc();
                                        handleCopyText(userData?.profile?.user?.id)
                                    }} className='bianJiBiImg' src="wallet/assets/images/deposite/newCopy.png" />
                                </div>
                                <QRCode
                                    className='testQrCodeImg'
                                    style={{
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#ffffff',
                                        margin: '2.6rem auto 1rem auto',
                                    }}
                                    size={138}
                                    value={userData?.profile?.user?.id}
                                />
                                {/*<img className='testQrCodeImg' src="wallet/assets/images/deposite/testCode.png"></img>*/}
                            </div>

                            <img className='qrCodeImg ' src="wallet/assets/images/deposite/newQrCode.png" onClick={() => {
                                setShowQRcode(!showQRcode);
                            }} ></img>
                        </div>
                        <div className='px-10 mt-12'><span style={{ color: '#2DD4BF' }}>⚠ </span><span style={{ color: "#94A3B8", fontSize: "1.3rem" }}>{t('card_177')}</span></div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="p-24 mb-24"
                        style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}
                    >
                        <Box
                            component={motion.div}
                            variants={item}
                            className="w-full rounded-16 border flex flex-col py-16"
                            style={{ borderRadius: '1rem' }}
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            <Typography className="text-16 px-10 my-12 " style={{ marginBottom: '0.5rem' }}>{t('home_deposite_4')}</Typography>

                            <div className="flex " style={{ flexWrap: 'wrap' }}>
                                {networkData[symbol]?.length > 0 && networkData[symbol]?.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                setWalletName(item.network);
                                                setNetworkId(item.id);
                                            }}
                                            className={clsx('flex items-center rounded-8 border cursor-pointer deposite-token', networkId === item.id && 'active-border')}
                                            key={index}
                                            style={{
                                                margin: '1rem 0rem 1.4rem 0.6rem',
                                                paddingLeft: '0.2rem',
                                                paddingRight: '0rem',
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
                                                <Typography className={clsx("text-14 font-medium", networkId === item.id && 'color-ffffff')}>
                                                    {item.symbol}
                                                </Typography>
                                                <Typography className={clsx("text-12 font-medium color-grey", networkId === item.id && 'color-ffffff')}>
                                                    {item.network}
                                                </Typography>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className='text-16 ml-10 mt-16 mb-16'>{t('card_189')}</div>
                            {/* 新地址 */}
                            <>
                                {walletAddressList.map((addressItem, index) => {
                                    return (
                                        <div className='mb-16' key={index}>
                                            <div>
                                                <div className='flex ml-10'>
                                                    <img onClick={() => {
                                                        handleEditAddressDesc(index, { disabled: !addressItem.disabled })
                                                    }} className='bianJiBiImg' src="wallet/assets/images/deposite/bianJiBi.png"></img>
                                                    <OutlinedInput
                                                        className='diZhiShuRu'
                                                        sx={{
                                                            padding: '0rem',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                border: 'none',
                                                            },
                                                        }}
                                                        disabled={addressItem.disabled}
                                                        value={addressItem.addressDesc}
                                                        inputProps={{ 'aria-label': 'weight' }}
                                                        onChange={(event) => {
                                                            handleEditAddressDesc(index, { addressDesc: event.target.value })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='addressBigW flex justify-between mt-10'>
                                                <div
                                                    ref={el => (divRefsParent.current[index] = el)}
                                                    className="addressW guoDuDongHua" style={{ height: selectWalletAddressIndex == index ? "22rem" : '4.2rem' }}>
                                                    <div
                                                        className="addressW2 flex justify-between guoDuDongHua">
                                                        <div
                                                            ref={el => (divRefs.current[index] = el)}
                                                            className={clsx('addressZi')}>{addressItem.address}
                                                        </div>
                                                        <img
                                                            onClick={() => {
                                                                copyTiShiFunc();
                                                                handleCopyText(addressItem.address)
                                                            }}
                                                            className='bianJiBiImg '
                                                            src="wallet/assets/images/deposite/newCopy.png"
                                                        />
                                                    </div>
                                                    <QRCode
                                                        className='testQrCodeImg'
                                                        style={{
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            background: '#ffffff',
                                                            margin: '2.6rem auto 1rem auto',
                                                        }}
                                                        size={138}
                                                        value={addressItem.address}
                                                        imageSettings={{ // 二维码中间的logo图片
                                                            src: 'wallet/assets/images/logo/logoNew.png',
                                                            height: 30,
                                                            width: 30,
                                                            excavate: true, // 中间图片所在的位置是否镂空
                                                        }}
                                                    />
                                                </div>
                                                <img className='qrCodeImg' src="wallet/assets/images/deposite/newQrCode.png" onClick={() => {
                                                    if (selectWalletAddressIndex === index) {
                                                        setSelectWalletAddressIndex(null)
                                                    } else {
                                                        setSelectWalletAddressIndex(index)
                                                    }
                                                }} ></img>
                                            </div>
                                        </div>
                                    )
                                })}

                                {walletAddressList.length < 10 && (
                                    <div className='mb-16'>
                                        <div className='addressBigW flex justify-between mt-10' onClick={() => {
                                            handleWalletAddress(networkId)
                                        }}>
                                            <div className="addressW flex justify-between">
                                                <div className='addressZi2 flex'>
                                                    <img className='bianJiBiImg2' src="wallet/assets/images/card/jiaHao.png"></img>
                                                    <div className='addressZi2'>{t('card_6')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </>

                            {false ?? (<>
                                {
                                    isGetWalletAddress
                                        ? (//有钱包地址
                                            <>{arrayLookup(symbolWallet, 'symbol', symbol, 'isManualNotify') != 1 && <Typography className="text-20 px-16 my-24 text-center" style={{ margin: '1rem' }}>
                                                {symbol}&nbsp;{t('home_deposite_5')}({walletName})
                                            </Typography>}

                                                <div style={{
                                                    position: 'relative'
                                                }}>{arrayLookup(symbolWallet, 'symbol', symbol, 'isManualNotify') != 1 && <QRCode
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        background: '#ffffff',
                                                        margin: '10px auto',
                                                    }}
                                                    value={walletAddress ? walletAddress : ''}
                                                    size={138}
                                                />}

                                                    {!isGetWalletAddress &&
                                                        (<div className="shade-box cursor-pointer">
                                                            {isLoading && <FuseLoading />}
                                                            {!isLoading && <img
                                                                className="txtColorTitleSmall"
                                                                src="wallet/assets/images/deposite/refresh.png"
                                                                alt=""
                                                                onClick={() => {
                                                                    handleWalletAddress(networkId).bind(this, 0);
                                                                }}
                                                            />}
                                                        </div>)
                                                    }

                                                    {
                                                        isGetWalletAddress &&
                                                        (<div style={{ width: '21rem' }} className='login-right-btns-item text-16 flex items-center justify-start txtColorTitleSmall bg-success btn-center '
                                                            // onClick={async () => {
                                                            //     // console.log(symbolWallet, symbol, arrayLookup(symbolWallet, 'symbol', symbol, 'type'), "arrayLookup(symbolWallet, 'symbol', symbol, 'type')")
                                                            //     let balanceRes = await dispatch(getDecenterWalletBalance({
                                                            //         address: arrayLookup(symbolWallet, 'symbol', symbol, 'address'),
                                                            //         decimals: arrayLookup(symbolWallet, 'symbol', symbol, 'decimals'),
                                                            //         type: arrayLookup(symbolWallet, 'symbol', symbol, 'type'),
                                                            //     }));
                                                            //     console.log(arrayLookup(symbolWallet, 'symbol', symbol, 'address'), arrayLookup(symbolWallet, 'symbol', symbol, 'decimals'), arrayLookup(symbolWallet, 'symbol', symbol, 'type'),);
                                                            //     let balance = balanceRes.payload || 0;
                                                            //     setTransferDialogState(true)
                                                            //     console.log(balance,regWallet,'balance...111');
                                                            //     setbalanceAll(balance.toFixed(6))
                                                            //     setInputValue(balance.toFixed(6));
                                                            //     handleChangeTransferVal2('amount', balance);
                                                            //     // console.log(transferFormData,'money...');

                                                            // }}
                                                            onClick={async () => {


                                                                if (decentralized != 1 && userData.profile?.loginType != "unkown") {
                                                                    // 跳转到 /account 页面
                                                                    history.push('/wallet/account');
                                                                } else {

                                                                    // 保留原有的 onClick 逻辑
                                                                    let balanceRes = await dispatch(getDecenterWalletBalance({
                                                                        address: arrayLookup(symbolWallet, 'symbol', symbol, 'address'),
                                                                        decimals: arrayLookup(symbolWallet, 'symbol', symbol, 'decimals'),
                                                                        type: arrayLookup(symbolWallet, 'symbol', symbol, 'type'),
                                                                        networkChainId: arrayLookup(networks, 'id', networkId, 'chainId'),
                                                                    }));
                                                                    let balance = balanceRes.payload || 0;
                                                                    // if (balance == 0) {
                                                                    //     return;
                                                                    // }
                                                                    handleChangeTransferVal2('amount', balance);
                                                                    setTransferDialogState(true);
                                                                    console.log(balance, 'balance..222.');
                                                                    setbalanceAll(balance.toFixed(6));
                                                                    setInputValue(balance.toFixed(6));
                                                                    handleChangeTransferVal2('amount', balance);
                                                                }
                                                            }}
                                                        >
                                                            <div className='flex justify-content-center' style={{ width: "180px", overflow: "hidden" }}>
                                                                {/* <img className='login-way-img'

                                                src={
                                                    (decentralized != 1 || userData.profile?.loginType != 1) ? `/wallet/assets/images/menu/icon-wallet-active.png` : `${walletImage}`} alt="" /> */}
                                                                <img className='login-way-img button-noreduce'
                                                                    src={
                                                                        (() => {
                                                                            switch (walletloginname) {
                                                                                case 'BitKeep':
                                                                                    return '/wallet/assets/images/login/icon-right-14.png';
                                                                                case 'MetaMask':
                                                                                    return '/wallet/assets/images/login/icon-right-1.png';
                                                                                case 'WalletConnect':
                                                                                    return '/wallet/assets/images/login/icon-right-5.png';
                                                                                case 'coinbase':
                                                                                    return '/wallet/assets/images/login/icon-right-10.png';
                                                                                case 'TrustWallet':
                                                                                    return '/wallet/assets/images/login/icon-right-12.png';
                                                                                case 'Coinbase':
                                                                                    return '/wallet/assets/images/login/icon-right-4.png';
                                                                                case 'Polygon':
                                                                                    return '/wallet/assets/images/login/icon-right-13.png';
                                                                                case 'Bitski':
                                                                                    return '/wallet/assets/images/login/icon-right-15.png';
                                                                                case 'CLedger':
                                                                                    return '/wallet/assets/images/login/icon-right-16.png';
                                                                                case 'Binance Smart':
                                                                                    return '/wallet/assets/images/login/icon-right-17.png';
                                                                                case 'value2':
                                                                                    return '';
                                                                                default:
                                                                                    return '/wallet/assets/images/menu/icon-wallet-active.png ';
                                                                            }
                                                                        })()
                                                                    }
                                                                    alt=""
                                                                />
                                                                <span className='login-way-name'>
                                                                    {(decentralized != -1 && userData.profile?.loginType === "web3_wallet") ? t('home_deposite_12') : t('home_deposite_10')}

                                                                </span>
                                                            </div>
                                                        </div>)
                                                    }
                                                </div>
                                                {!isGetWalletAddress &&
                                                    <Button
                                                        className='text-lg btnColorTitleBig address-btn'
                                                        color="secondary"
                                                        variant="contained"
                                                        onClick={() => {
                                                            handleWalletAddress(networkId);
                                                        }}
                                                    >{t('home_deposite_13')}
                                                    </Button>
                                                }
                                                {isGetWalletAddress && (
                                                    <div className="px-10 my-24 fa-input-conatiner ">
                                                        {arrayLookup(symbolWallet, 'symbol', symbol, 'isManualNotify') != 1 && <FormControl sx={{ width: '100%' }} variant="outlined">
                                                            <OutlinedInput
                                                                disabled={true}
                                                                id="outlined-adornment-weight "
                                                                value={walletAddress}
                                                                endAdornment={<InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility "
                                                                        onClick={() => {
                                                                            handleCopyText(walletAddress)
                                                                        }}
                                                                        edge="end"
                                                                    >
                                                                        <img src="wallet/assets/images/deposite/copy.png" alt="" />
                                                                    </IconButton>
                                                                </InputAdornment>}
                                                                aria-describedby="outlined-weight-helper-text "
                                                                inputProps={{
                                                                    'aria-label': 'weight',
                                                                }}
                                                            />
                                                        </FormControl>}

                                                    </div>
                                                )}
                                                <Box
                                                    className="mx-10 "
                                                    sx={{
                                                        backgroundColor: '#0F172A',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Typography className="text-14 px-16 my-12" style={{ margin: '0.8rem 0' }}>
                                                        <span style={{ color: '#FCE100' }}>⚠</span>
                                                        {/* {networkData[symbol] ? networkData[symbol][networkId]?.desc : ''} */}
                                                        {t('home_deposite_15')} {symbol}, {t('home_deposite_16')}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (//没有钱包地址
                                            <>
                                                <div className='ml-10 mt-10 mb-16 text-16'>USDT Deposite Address(TRX)</div>
                                                {walletAddressList.map((addressItem) => {
                                                    return (
                                                        <div className='mb-16'>
                                                            <div>
                                                                <div className='flex ml-10'>
                                                                    <img className='bianJiBiImg' src="wallet/assets/images/deposite/bianJiBi.png"></img>
                                                                    <div className='bianJiBiZi'>Address1</div>
                                                                </div>
                                                            </div>
                                                            <div className='addressBigW flex justify-between mt-10'>
                                                                <div className="addressW flex justify-between  guoDuDongHua" style={{ height: showQRcode ? "22rem" : '4.2rem' }}>
                                                                    <div className="addressW2 flex justify-between guoDuDongHua">
                                                                        <div className='addressZi '>{addressItem}</div>
                                                                        <img className='bianJiBiImg' src="wallet/assets/images/deposite/newCopy.png"></img>
                                                                    </div>
                                                                    <img className='testQrCodeImg' src="wallet/assets/images/deposite/testCode.png"></img>
                                                                </div>
                                                                <img className='qrCodeImg' src="wallet/assets/images/deposite/newQrCode.png" onClick={() => {
                                                                    setShowQRcode(!showQRcode);
                                                                }} ></img>
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                <div className='mb-16'>
                                                    <div>
                                                        <div className='flex ml-10'>
                                                            <img className='bianJiBiImg' src="wallet/assets/images/deposite/bianJiBi.png"></img>
                                                            <div className='bianJiBiZi'>Address5</div>
                                                        </div>
                                                    </div>

                                                    <div className='addressBigW flex justify-between mt-10' onClick={() => {
                                                        handleWalletAddress()
                                                    }}>
                                                        <div className="addressW flex justify-between">
                                                            <div className='addressZi2 flex'>
                                                                <img className='bianJiBiImg2' src="wallet/assets/images/card/jiaHao.png"></img>
                                                                <div className='addressZi2'>{t('card_6')}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <div className='flex justify-content-center' style={{ width: "100%", overflow: "hidden" }}>
                                            <LoadingButton className="px-48 text-lg btnColorTitleBig"
                                                size="large"
                                                color="secondary"
                                                variant="contained"
                                                loading={cryptoOpenLoad}
                                                sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 1rem' }}
                                                onClick={async () => {
                                                    setCryptoOpenLoad(true);
                                                    getWalletAddressClick(networkId);
                                                }}
                                                style={{ width: "28rem" }}
                                            >
                                                <div className='flex justify-content-center' style={{ width: "280px", overflow: "hidden" }}>
                                                    {!cryptoOpenLoad && <img className='login-way-img button-noreduce'
                                                        src="wallet/assets/images/menu/icon-wallet-active.png"
                                                        alt="" />}
                                                    <span className='login-way-name'>{t('home_deposite_13')}</span>
                                                </div>
                                            </LoadingButton>
                                        </div> */}
                                            </>
                                        )}
                            </>)}

                            <BootstrapDialog
                                onClose={() => { setTransferDialogState(false); }}
                                aria-labelledby="customized-dialog-title"
                                open={transferDialogState}
                                className="dialog-container "
                            >
                                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setTransferDialogState(false) }} style={{ textAlign: "center" }} >
                                    {t('home_deposite_23')}
                                </BootstrapDialogTitle>

                                <DialogContent dividers style={{ width: "360px", padding: "0" }}>
                                    <Box
                                        className="dialog-content-inner dialog-content-select-fiat-width border-r-5 "
                                        style={{ height: "224px" }}
                                    >
                                        <div className='' style={{ position: "relative", height: "70px", marginLeft: "15px" }}>
                                            <div className='flex' style={{ position: "absolute" }}>
                                                <div className='flex' style={{ width: "168px", overflow: "hidden", backgroundColor: "#1e293b", padding: "4px 14px", borderRadius: "5px" }}>
                                                    <img className='w-28 h-28 mt-8' src={arrayLookup(symbolWallet, 'symbol', symbol, 'avatar')} style={{ borderRadius: '50%' }}></img>
                                                    {/* <img className='w-16 h-8 mt-12 cursor-pointer' src={arrayLookup(symbolWallet, 'symbol', symbol, 'avatar')} style={{ marginLeft: "16px" }} ></img> */}
                                                    <div>
                                                        <div className='ml-6' style={{ fontSize: "18px" }}>{symbol}</div>
                                                        <div className='ml-6' style={{ fontSize: "12px", color: "#76819b" }}>
                                                            {balanceAll}
                                                        </div>
                                                    </div>
                                                    {/* <img className='w-16 h-8 mt-12 cursor-pointer' src="wallet/assets/images/deposite/jianTou.png" style={{ marginLeft: "16px" }} ></img> */}
                                                </div>

                                                <div className='flex' style={{ width: "147px", marginLeft: "15px", height: "50px", backgroundColor: "#1e293b", borderRadius: "5px" }} >
                                                    {/* <div style={{ width: "147px", fontSize: "18px", height: "50px", lineHeight: "50px", textAlign: "center" }}>{balanceAll*sidevalue/100} </div> */}
                                                    {/* <input value={inputvalue} onChange={handleSliderChange} style={{ width: "147px", fontSize: "18px", height: "50px", lineHeight: "50px", textAlign: "center", backgroundColor:'rgb(30, 41, 59)' }}></input> */}
                                                    <TextField
                                                        style={{ width: "147px", fontSize: "18px", height: "40px", textAlign: "center", backgroundColor: 'rgb(30, 41, 59)' }}
                                                        type="number"
                                                        step="0.000001"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        size="small"
                                                        error={Number(inputValue) > Number(balanceAll)}
                                                        helperText={Number(inputValue) > Number(balanceAll) ? t('home_deposite_28') : ''}
                                                    />

                                                </div>

                                            </div>

                                            <img style={{ position: "absolute", left: "161px", top: "10px" }} src='wallet/assets/images/deposite/fenPei.png'></img>
                                        </div>

                                        {/* <div className='flex justify-content-space cursor-pointer' style={{ widht: "340px", marginLeft: "12px", marginBottom: "20px" }}>
                                        <div className='text-16 txtColorTitleD' style={{ width: "54px", textAlign: "center", height: "36px", lineHeight: "36px" }} >10%</div>
                                        <div className='text-16 txtColorTitleD' style={{ width: "54px", textAlign: "center", height: "36px", lineHeight: "36px" }} >25%</div>
                                        <div className='text-16 txtColorTitleD' style={{ width: "54px", textAlign: "center", height: "36px", lineHeight: "36px" }} >50%</div>
                                        <div className='text-16 txtColorTitleD' style={{ width: "54px", textAlign: "center", height: "36px", lineHeight: "36px" }} >80%</div>
                                        <div className='text-16 txtColorTitleD' style={{ width: "54px", textAlign: "center", height: "36px", lineHeight: "36px" }} >MAX</div>
                                    </div> */}
                                        <Box sx={{ width: 300 }} >
                                            <Slider
                                                style={{ marginLeft: '30px' }}
                                                marks={marks}
                                                // value={typeof value === 'number' ? value : 0}
                                                value={sliderValue}
                                                onChange={handleSliderChange}

                                                aria-labelledby="input-slider"
                                            />
                                        </Box>
                                        <div className='flex' style={{ marginLeft: "15px", marginTop: "5px" }}>
                                            <FormControlLabel control={<Checkbox defaultChecked onChange={handleCheckboxChange} />} label="" />
                                            <div style={{ marginLeft: "-10px", marginTop: "12px", color: "#76819b" }}>{t('home_deposite_26')} <span style={{ color: "#ffffff" }}>{t('home_deposite_25')} </span>{t('home_deposite_27')} </div>
                                        </div>

                                        {/* <FormControl sx={{ width: '73%' }}>
                                        <OutlinedInput
                                            value={transferFormData.money}
                                            placeholder="Enter quantity"
                                            id="money"
                                            sx={{
                                                backgroundColor: '#141a25',
                                            }}
                                            onChange={handleChangeTransferVal('money')}
                                            // aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'money',
                                            }}
                                            type="number"
                                        />
                                    </FormControl> */}
                                        {/* <FormControl sx={{ width: '73%' }}>

                                        <OutlinedInput
                                            value={transferFormData.amount}
                                            placeholder="Enter"
                                            id="amount"
                                            sx={{
                                                backgroundColor: '#141a25',
                                                marginTop: '1rem',
                                            }}
                                            onChange={handleChangeTransferVal('amount')}
                                            // aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            disabled={true}
                                            type="number"
                                        />
                                    </FormControl> */}
                                    </Box>
                                </DialogContent>

                                <DialogActions className='mb-20'>
                                    <Button
                                        style={{ height: '4rem', width: '70%', margin: '0rem auto' }}
                                        className='text-lg btnColorTitleBig'
                                        color="secondary"
                                        variant="contained"
                                        disabled={inputValue > balanceAll}
                                        sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                        onClick={() => {
                                            BransferSubmit()
                                        }}
                                    >
                                        {t('home_deposite_29')}

                                    </Button>
                                </DialogActions>

                            </BootstrapDialog>
                        </Box>
                    </motion.div>
                </div>}

                {tabValue === fiatSelect && <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="px-15"
                    >
                        <Box
                            className="w-full rounded-16 border flex flex-col select-fieldset-noborder"
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            <FormControl sx={{
                                m: 1,
                                minWidth: "100%",
                                margin: 0,
                                border: 'none',
                                borderRadius: '8px!important',
                                backgroundColor: '#1E293B!important',
                                '&:before': {
                                    display: 'none',
                                },
                                '&:first-of-type': {},
                                '&:last-of-type': {
                                    marginBottom: 0,
                                }
                            }}
                            >
                                <Select
                                    value={fiatsSelected}
                                    onChange={handleChangeFiats}
                                    displayEmpty
                                    inputProps={{ "aria-label": "Without label" }}
                                    className="MuiSelect-icon"
                                    // IconComponent={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                border: 'none'
                                            },
                                        },
                                    }}
                                >
                                    {fiats.length > 0 && fiats?.map((row, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                value={index}
                                            >
                                                <div
                                                    className="flex items-center py-2 flex-grow"
                                                    style={{ width: '100%' }}
                                                >
                                                    <div className="flex items-center">
                                                        <img style={{
                                                            width: '3rem',
                                                            borderRadius: '99px'
                                                        }} src={arrayLookup(currencys, 'currencyCode', row.currencyCode, 'avatar')} alt="" />
                                                        <div className="px-12 font-medium">
                                                            <Typography className="text-16 font-medium">{row.currencyCode}</Typography>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginLeft: 'auto' }}>
                                                        <div className="px-12 font-medium" style={{ textAlign: 'right' }}>
                                                            <Typography className="text-16 font-medium">{row.balance?.toFixed(2)}</Typography>

                                                        </div>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            {/*<StyledAccordion*/}
                            {/*    component={motion.div}*/}
                            {/*    variants={item}*/}
                            {/*    classes={{*/}
                            {/*        root: 'FaqPage-panel shadow',*/}
                            {/*    }}*/}
                            {/*    expanded={expanded === true}*/}
                            {/*    onChange={toggleAccordion(true)}*/}
                            {/*>*/}
                            {/*    <AccordionSummary*/}
                            {/*        expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}*/}
                            {/*    >*/}
                            {/*        <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}>*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <img style={{*/}
                            {/*                    width: '3rem'*/}
                            {/*                }} src="" alt=""/>*/}
                            {/*                <div className="px-12 font-medium">*/}
                            {/*                    <Typography className="text-16 font-medium">{currencyCode}</Typography>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            <div style={{marginLeft: 'auto'}}>*/}
                            {/*                <div className="px-12 font-medium" style={{textAlign: 'right'}}>*/}
                            {/*                    <Typography className="text-16 font-medium">{currencyBalance}</Typography>*/}

                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </AccordionSummary>*/}

                            {/*    <AccordionDetails>*/}
                            {/*        <div*/}
                            {/*            style={{*/}
                            {/*                flexWrap: 'wrap',*/}
                            {/*            }}*/}
                            {/*            className='flex items-center justify-between'*/}
                            {/*        >*/}
                            {/*            {fiatData.map((row, index) => {*/}
                            {/*                return (*/}
                            {/*                    <div*/}
                            {/*                        key={index}*/}
                            {/*                        style={{*/}
                            {/*                            width: '30%',*/}
                            {/*                            margin: '.8rem 1.5%',*/}
                            {/*                            textAlign: 'center',*/}
                            {/*                            border: '1px solid #2DD4BF',*/}
                            {/*                            borderRadius: '8px'*/}
                            {/*                        }}*/}
                            {/*                        className="my-8 cursor-pointer"*/}
                            {/*                        onClick={() => {setCurrencyCode(row.currencyCode);setCurrencyBalance(row.balance)}}*/}
                            {/*                    >*/}
                            {/*                        <Typography className="text-16 font-medium">{row.currencyCode}</Typography>*/}
                            {/*                        <Typography className="text-12" style={{color: '#94A3B8'}}>{row.balance}</Typography>*/}
                            {/*                    </div>*/}
                            {/*                )*/}
                            {/*            })}*/}
                            {/*        </div>*/}

                            {/*    </AccordionDetails>*/}
                            {/*</StyledAccordion>*/}
                        </Box>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="Inside2W"
                        >
                            <div className='addressBigW flex justify-between mt-10'>
                                <div className="userIdW   guoDuDongHua" style={{ height: showQRcode ? "22rem" : '4.2rem' }}>
                                    <div className="addressW2 flex justify-between guoDuDongHua">
                                        <div className='idZi guoDuDongHua' > <span style={{ color: "#ffffff", marginRight: "10px" }}>UserID</span>  {userData?.profile?.user?.id}</div>
                                        <img onClick={() => {
                                            copyTiShiFunc();
                                            handleCopyText(userData?.profile?.user?.id)
                                        }} className='bianJiBiImg' src="wallet/assets/images/deposite/newCopy.png" />
                                    </div>
                                    <QRCode
                                        className='testQrCodeImg'
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            background: '#ffffff',
                                            margin: '2.6rem auto 1rem auto',
                                        }}
                                        size={138}
                                        value={userData?.profile?.user?.id}
                                    />
                                    {/*<img className='testQrCodeImg' src="wallet/assets/images/deposite/testCode.png"></img>*/}
                                </div>
                                <img className='qrCodeImg ' src="wallet/assets/images/deposite/newQrCode.png" onClick={() => {
                                    setShowQRcode(!showQRcode);
                                }} ></img>
                            </div>
                            <div className='px-10 mt-12'><span style={{ color: '#2DD4BF' }}>⚠ </span><span style={{ color: "#94A3B8", fontSize: "1.3rem" }}>{t('card_177')}</span></div>
                        </motion.div>

                        <Typography className="text-16 px-16 my-10">{t('home_deposite_17')}</Typography>

                        {bankCodeList.length > 0 && bankCodeList?.map((bankItem) => {
                            if (currencyCode === bankItem.currency) {
                                return (
                                    <StyledAccordion
                                        key={bankItem.id}
                                        component={motion.div}
                                        variants={item}
                                        classes={{
                                            root: clsx('FaqPage-panel shadow', expanded === `bank-${bankItem.id}` && 'active-border'),
                                        }}
                                        expanded={expanded === `bank-${bankItem.id}`}
                                        onChange={toggleAccordion(`bank-${bankItem.id}`)}
                                    >
                                        <AccordionSummary
                                            expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                                        >
                                            <div className="flex items-center py-4 flex-grow" style={{ width: '100%' }}>
                                                <div className="flex items-center">
                                                    <img style={{
                                                        width: '3rem',
                                                        borderRadius: "5px"
                                                    }} src={bankItem.url || "wallet/assets/images/deposite/touchngo.png"} alt="" />
                                                    <div className="px-12 font-medium">
                                                        <Typography className="text-18 font-medium">{bankItem.payName}</Typography>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <div className="px-12 font-medium" style={{ textAlign: 'right' }}>
                                                        <Typography className="text-14" style={{ color: '#94A3B8' }}>{t('home_deposite_18')}:{formatAmount(bankItem.minValue)} - {formatAmount(bankItem.maxValue)}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionSummary>

                                        <AccordionDetails>
                                            <div>
                                                <FormControl className="my-16 " sx={{ width: '100%' }} variant="outlined">
                                                    <OutlinedInput
                                                        type='text'
                                                        disabled={false}
                                                        id="outlined-adornment-weight send-tips-container-amount"
                                                        value={weight}
                                                        endAdornment={
                                                            <InputAdornment
                                                                position="end"
                                                                onClick={() => {
                                                                    setWeight(bankItem.maxValue)
                                                                }}
                                                            >MAX</InputAdornment>}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'weight',
                                                            inputMode: 'numeric',
                                                            pattern: '[0-9]*',
                                                        }}
                                                        onChange={(event) => {
                                                            if (event.target.value === '') {
                                                                setWeight('')
                                                                return
                                                            }
                                                            let numericValue = event.target.value.replace(/[^0-9.]/g, '');
                                                            if (numericValue.startsWith('0') && numericValue.length > 1 && numericValue[1] !== '.') {
                                                                numericValue = numericValue.replace(/^0+/, '');
                                                            }
                                                            setWeight(numericValue);
                                                        }}
                                                    />
                                                </FormControl>

                                                {bankItem?.depositRange?.length > 0 && <div className="flex weight-list">
                                                    {bankItem?.depositRange.map((depositRangeItem) => {
                                                        return (
                                                            <div
                                                                onClick={() => { setWeight(depositRangeItem) }}
                                                                className={clsx('weight-item px-16 py-8 text-center my-12 touchnGoListDi color-0F172A', weight === 10 && 'weight-active')}>
                                                                {depositRangeItem}
                                                            </div>
                                                        )
                                                    })}
                                                </div>}

                                                <div className='ml-2' style={{ fontSize: "13px" }} >{t('home_borrow_16')}  { (bankItem?.ifRate * weight + bankItem?.basicFee)?.toFixed(2)} </div>

                                                <div className="my-16 flex items-center justify-content-center">
                                                    <LoadingButton
                                                        className="px-48 text-lg btnColorTitleBig"
                                                        size="large"
                                                        color="secondary"
                                                        variant="contained"
                                                        loading={openLoad}
                                                        sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 1rem' }}
                                                        onClick={() => {
                                                            setOpenLoad(true);
                                                            fiatRecharge(bankItem.id);
                                                        }}
                                                    >
                                                        {t('home_borrow_8')}
                                                    </LoadingButton>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </StyledAccordion>
                                )
                            }
                        })}

                        {/*<StyledAccordion*/}
                        {/*    component={motion.div}*/}
                        {/*    variants={item}*/}
                        {/*    classes={{*/}
                        {/*        root: clsx('FaqPage-panel shadow', expanded === 4 && 'active-border')*/}
                        {/*    }}*/}
                        {/*    expanded={expanded === 4}*/}
                        {/*    onChange={toggleAccordion(4)}*/}
                        {/*>*/}
                        {/*    <AccordionSummary*/}
                        {/*        expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}*/}
                        {/*    >*/}
                        {/*        <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}>*/}
                        {/*            <div className="flex items-center">*/}
                        {/*                <img style={{*/}
                        {/*                    width: '3rem'*/}
                        {/*                }} src="wallet/assets/images/deposite/touchngo.png" alt=""/>*/}
                        {/*                <div className="px-12 font-medium">*/}
                        {/*                    <Typography className="text-18 font-medium">Touchn Go</Typography>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div style={{marginLeft: 'auto'}}>*/}
                        {/*                <div className="px-12 font-medium" style={{textAlign: 'right'}}>*/}
                        {/*                    <Typography className="text-12" style={{color: '#94A3B8'}}>Limit:51-5000</Typography>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </AccordionSummary>*/}

                        {/*    <AccordionDetails>*/}
                        {/*        <div>*/}
                        {/*            <FormControl className="my-16" sx={{ width: '100%' }} variant="outlined">*/}
                        {/*                <OutlinedInput*/}
                        {/*                    disabled={true}*/}
                        {/*                    id="outlined-adornment-weight"*/}
                        {/*                    value={weight}*/}
                        {/*                    endAdornment={<InputAdornment position="end">MAX</InputAdornment>}*/}
                        {/*                    aria-describedby="outlined-weight-helper-text"*/}
                        {/*                    inputProps={{*/}
                        {/*                        'aria-label': 'weight',*/}
                        {/*                    }}*/}
                        {/*                />*/}
                        {/*            </FormControl>*/}
                        {/*            <div className="flex weight-list">*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(51)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 51 && 'weight-active')}>*/}
                        {/*                    51*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(100)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 100 && 'weight-active')}>*/}
                        {/*                    100*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(1000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 1000 && 'weight-active')}>*/}
                        {/*                    1000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(2000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 2000 && 'weight-active')}>*/}
                        {/*                    2000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(3000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 3000 && 'weight-active')}>*/}
                        {/*                    3000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(5000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 5000 && 'weight-active')}>*/}
                        {/*                    5000*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="my-16 flex items-center justify-content-center">*/}
                        {/*                <Button*/}
                        {/*                    className="px-48 text-lg"*/}
                        {/*                    size="large"*/}
                        {/*                    color="secondary"*/}
                        {/*                    variant="contained"*/}
                        {/*                    sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 1rem' }}*/}
                        {/*                >*/}
                        {/*                    Confirm*/}
                        {/*                </Button>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </AccordionDetails>*/}
                        {/*</StyledAccordion>*/}
                        {/*<StyledAccordion*/}
                        {/*    component={motion.div}*/}
                        {/*    variants={item}*/}
                        {/*    classes={{*/}
                        {/*        root: clsx('FaqPage-panel shadow', expanded === 5 && 'active-border')*/}
                        {/*    }}*/}
                        {/*    expanded={expanded === 5}*/}
                        {/*    onChange={toggleAccordion(5)}*/}
                        {/*>*/}
                        {/*    <AccordionSummary*/}
                        {/*        expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}*/}
                        {/*    >*/}
                        {/*        <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}>*/}
                        {/*            <div className="flex items-center">*/}
                        {/*                <img style={{*/}
                        {/*                    width: '3rem'*/}
                        {/*                }} src="wallet/assets/images/deposite/touchngo.png" alt=""/>*/}
                        {/*                <div className="px-12 font-medium">*/}
                        {/*                    <Typography className="text-18 font-medium">Touchn Go</Typography>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div style={{marginLeft: 'auto'}}>*/}
                        {/*                <div className="px-12 font-medium" style={{textAlign: 'right'}}>*/}
                        {/*                    <Typography className="text-12" style={{color: '#94A3B8'}}>Limit:51-5000</Typography>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </AccordionSummary>*/}

                        {/*    <AccordionDetails>*/}
                        {/*        <div>*/}
                        {/*            <FormControl className="my-16" sx={{ width: '100%' }} variant="outlined">*/}
                        {/*                <OutlinedInput*/}
                        {/*                    disabled={true}*/}
                        {/*                    id="outlined-adornment-weight"*/}
                        {/*                    value={weight}*/}
                        {/*                    endAdornment={<InputAdornment position="end">MAX</InputAdornment>}*/}
                        {/*                    aria-describedby="outlined-weight-helper-text"*/}
                        {/*                    inputProps={{*/}
                        {/*                        'aria-label': 'weight',*/}
                        {/*                    }}*/}
                        {/*                />*/}
                        {/*            </FormControl>*/}
                        {/*            <div className="flex weight-list">*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(51)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 51 && 'weight-active')}>*/}
                        {/*                    51*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(100)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 100 && 'weight-active')}>*/}
                        {/*                    100*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(1000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 1000 && 'weight-active')}>*/}
                        {/*                    1000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(2000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 2000 && 'weight-active')}>*/}
                        {/*                    2000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(3000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 3000 && 'weight-active')}>*/}
                        {/*                    3000*/}
                        {/*                </div>*/}
                        {/*                <div*/}
                        {/*                    onClick={ () => {setWeight(5000)}}*/}
                        {/*                    className={clsx('weight-item px-16 py-8 text-center my-12', weight === 5000 && 'weight-active')}>*/}
                        {/*                    5000*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="my-16 flex items-center justify-content-center">*/}
                        {/*                <Button*/}
                        {/*                    className="px-48 text-lg"*/}
                        {/*                    size="large"*/}
                        {/*                    color="secondary"*/}
                        {/*                    variant="contained"*/}
                        {/*                    sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 1rem' }}*/}
                        {/*                >*/}
                        {/*                    Confirm*/}
                        {/*                </Button>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </AccordionDetails>*/}
                        {/*</StyledAccordion>*/}
                    </motion.div>
                </div>}
            </div>}

            {
                loadingShow &&
                <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>

                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>
                </div>
            }


            {/* 上线暂时关闭
            {tabValue === 2 && <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-24 mb-24"
            >
                <Box
                    component={motion.div}
                    variants={item}
                    className="w-full rounded-16 border flex flex-col py-16 "
                    style={{ paddingTop: '0' }}
                    sx={{
                        backgroundColor: '#1E293B',
                        border: 'none',
                    }}
                >
                    <Select
                        value={nftId}
                        onChange={handleChangeNft}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="MuiSelect-icon mx-16 my-10"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                    border: 'none !important',
                                },
                            },
                        }}
                    >
                        {Object.keys(nftConfig).length > 0 && Object.keys(nftConfig).map((key) => {
                            return (
                                <MenuItem
                                    key={key}
                                    value={key}
                                >
                                    <div
                                        className="flex items-center py-4 flex-grow "
                                        style={{ width: '100%' }}
                                    >
                                        <div className="flex items-center">
                                            <img style={{
                                                width: '3rem',
                                                borderRadius: '8px'
                                            }} src={nftConfig[key].avatar} alt="" />
                                            <div className="px-12 font-medium">
                                                <Typography className="text-16 font-medium">{nftConfig[key].name}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </MenuItem>
                            )
                        })}
                    </Select>

                    <Typography className="text-16 px-16 my-10"> {t('home_deposite_30')}</Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%', margin: "20px auto 40px auto" },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div className='mx-16'>
                            <TextField
                                disabled={isConfirmTransfer}
                                id="outlined-multiline-flexible"
                                label="Token"
                                multiline
                                maxRows={4}
                                value={tokenId}
                                onChange={(event) => {
                                    setTokenId(event.target.value);
                                }}
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                    </Box>

                    {isConfirmTransfer ? (
                        <FuseLoading />
                    ) : (
                        <Button
                            className='px-48  text-lg btnColorTitleBig mb-10'
                            color="secondary"
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '70%', height: '4rem', display: 'block', fontSize: '2rem', margin: "0 auto", lineHeight: 'initial' }}
                            onClick={() => {
                                let nftAddress = nftConfig[nftId]?.address

                                dispatch(getOwner({
                                    nftToken: nftAddress,
                                    tokenId: tokenId
                                })).then((res) => {
                                    if (res.payload) {
                                        doNftTransfer({
                                            tokenId: tokenId,
                                            nftToken: nftAddress,
                                        });
                                    }
                                })
                            }}
                        >
                            {t('kyc_23')}
                        </Button>
                    )}

                </Box>
            </motion.div>} */}

            <AnimateModal
                className="faBiDiCard2 tanChuanDiSe2"
                open={openAnimateModal}
                onClose={() => setOpenAnimateModal(false)}
            >

                {/* 成功*/}
                {
                    tiJiaoState === 2 && <div>
                        <div className='daGouDingWei2' >
                            <motion.div variants={item} className=' daGouDingWei1' style={{ width: "78px", height: "78px", margin: "20px auto" }}>
                                <div className='daGouDingWei1' style={{}}>
                                    <img className='' style={{ width: "78px", height: "78px" }} src='wallet/assets/images/wallet/naoZhong6.png'></img>
                                </div>
                            </motion.div>
                        </div>

                        <div className='flex justify-center' style={{ width: "100%" }}>
                            <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", margin: "0 auto", color: "#2ECB71" }}>
                                ● {t('errorMsg_1')}
                            </motion.div>
                        </div>

                        <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", fontSize: "20px", }}> {chongZhiVal?.amount} {chongZhiVal?.currencyCode}</motion.div>

                        <div className='mt-16' style={{ borderTop: "1px solid #2C3950" }}></div>

                        <Box
                            className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard px-16"
                            sx={{
                                backgroundColor: "#1E293B",
                                padding: "0rem",
                                overflow: "hidden",
                                margin: "1rem auto 0rem auto"
                            }}
                        >
                            <div className='flex justify-content-space mt-16' >
                                <div style={{ color: "#888B92" }}>ID</div>
                                <div>{chongZhiVal?.id}</div>
                            </div>

                            <div className='flex justify-content-space mt-16' >
                                <div style={{ color: "#888B92" }}>Time</div>
                                <div>{getNowTime(chongZhiVal?.successTime)}</div>
                            </div>
                        </Box>

                        <div className='px-16 mt-20 mb-24'>
                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn2"
                                color="secondary"
                                loading={false}
                                variant="contained"
                                onClick={() => {
                                    history.push('/wallet/home/wallet');
                                }}
                            >
                                {t('card_186')} ({refreshTime})
                            </LoadingButton>
                        </div>
                    </div>
                }

                {/* 等待*/}
                {
                    tiJiaoState === 1 && <div>
                        <div className='flex justify-center' style={{ width: "100%" }}>
                            <div className='' style={{ fontSize: "20px" }}>
                                {t('card_187')}
                            </div>
                        </div>

                        <div className='daGouDingWei2' >
                            <motion.div variants={item} className=' daGouDingWei1' style={{ width: "60px", height: "60px", margin: "20px auto" }}>
                                <div className='daGouDingWei1' style={{}}>
                                    <img className='chuKuanDongHua' style={{ width: "60px", height: "60px" }} src='wallet/assets/images/wallet/zhuanQuanChongZhi.png'></img>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", fontSize: "20px", color: "#ffc600" }}>{`${time.hour}:${time.minute}:${time.second}`}</motion.div>

                        <div style={{ margin: "0 auto", textAlign: "center", height: "23px", fontSize: "14px" }}>
                            <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                                {chongZhiVal?.amount} {chongZhiVal?.currencyCode}
                            </motion.div>
                        </div>

                        <div className='mt-16' style={{ borderTop: "1px solid #2C3950" }}></div>

                        <Box
                            className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard px-16"
                            sx={{
                                backgroundColor: "#1E293B",
                                padding: "0rem",
                                overflow: "hidden",
                                margin: "1rem auto 0rem auto"
                            }}
                        >
                            <div className='flex justify-content-space mt-16' >
                                <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                                <div>{chongZhiVal?.id}</div>
                            </div>
                        </Box>

                        <div className='px-16 mt-20 mb-24'>
                            <LoadingButton
                                disabled={false}
                                className="boxCardBtn2"
                                color="secondary"
                                loading={openUpdateBtnShow}
                                variant="contained"
                                onClick={() => {
                                    refreshOrderStatus()
                                }}
                            >
                                {t('card_185')}
                            </LoadingButton>
                        </div>
                    </div>
                }
                {/* 失败*/}
                {
                    (tiJiaoState === 3 || tiJiaoState === 6) && <div>
                        <div className='daGouDingWei2' >
                            <motion.div variants={item} className=' daGouDingWei1' style={{ width: "78px", height: "78px", margin: "20px auto" }}>
                                <div className='daGouDingWei1' style={{}}>
                                    <img className='' style={{ width: "78px", height: "78px" }} src='wallet/assets/images/wallet/naoZhong6_1.png'></img>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", fontSize: "16px", }}> {t('card_188')}</motion.div>
                        <div className='mt-36' style={{}}></div>
                    </div>
                }

            </AnimateModal >

            <BootstrapDialog
                onClose={() => {
                    setCopyTiShi(false)
                }}
                aria-labelledby="customized-dialog-title "
                open={copyTiShi}
                className="dialog-container copyTiShiW"
            >
                <div style={{ textAlign: "center", padding: "1rem 1rem 1rem 1rem" }}>
                    {t('card_195')}
                </div>

            </BootstrapDialog>
        </div >
    )
}

export default React.memo(Deposite);
