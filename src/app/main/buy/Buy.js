import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import OutlinedInput from '@mui/material/OutlinedInput';
// import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
// import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import history from '@history';
import domain from '../../api/Domain';

import '../../../styles/home.css';
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../store/user";
import { selectConfig } from "../../store/config";
import { arrayLookup, getUserLoginType, setPhoneTab } from "../../util/tools/function";
import Button from "@mui/material/Button";
import {
    getFaTPayCryptoTarget,
    getFaTPayPaymentOption,
    getLegendTradingCryptoTarget,
    getLegendTradingPaymentOption,
    getStarPayPaymentOption,
    getRampPaymentOption,
    getRampCryptoTarget,
    getStarPayCryptoTarget,
    getStarPayConfig,
    getRampConfig,
} from "../../store/payment/paymentThunk";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from "react-i18next";
import { showMessage } from "app/store/fuse/messageSlice";
import userLoginType from "../../define/userLoginType";
import { current } from '@reduxjs/toolkit';

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

function Buy(props) {
    const { t } = useTranslation('mainPage');
    const ranges = [
        t('home_buy_1'), t('home_buy_2')
    ];
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const toggleAccordion = (panel) => (event, _expanded) => {
        setExpanded(_expanded ? panel : false);
    };

    const [amount, setAmount] = useState('');
    const [buyAddress, setBuyAddress] = useState('');
    const userData = useSelector(selectUserData);
    const fiatsData = userData.fiat || [];
    const walletData = userData.wallet || {};
    const config = useSelector(selectConfig);
    const currencys = useSelector(selectConfig).payment.currency || [];
    const symbols = useSelector(selectConfig).symbols || [];
    const [fiatObj, setFiatObj] = useState({});
    const [cryptos, setCryptos] = useState([]);
    const [cryptoSelected, setCryptoSelected] = useState(0);
    const [currencyBalance, setCurrencyBalance] = useState(0);
    const [payType, setPayType] = useState('StarPay');
    const [symbolWallet, setSymbolWallet] = useState([]);
    const [noSupplier, setNoSupplier] = useState(false);
    const [currencyCrypto, setCurrencyCrypto] = useState('ACH');
    const [currencyNetWork, setCurrencyNetWork] = useState('ETH');


    const [fiats, setFiats] = useState({});
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [fiatsSelected, setFiatsSelected] = useState(0);
    const [currencyPayWay, setCurrencyPayWay] = useState([]);
    const [currencyPayWaySelected, setCurrencyPayWaySelected] = useState(0);
    const [symbolList, setSymbolList] = useState([]);
    const [symbol, setSymbol] = useState('');
    const [symbolSelected, setSymbolSelected] = useState(0);
    const [cryptoNetwork, setCryptoNetwork] = useState('');
    const [cryptoNetworkList, setCryptoNetworkList] = useState([]);
    const [cryptoNetworkSelected, setCryptoNetworkSelected] = useState(0);


    const getCryptoTarget = async () => {
        let res = await dispatch(getLegendTradingCryptoTarget());
        return res;
    }
    const getPaymentOption = async () => {
        let res = await dispatch(getLegendTradingPaymentOption());
        return res;
    }
    const getFaTPayTarget = async () => {
        let res = await dispatch(getFaTPayCryptoTarget());
        return res;
    }
    const getFaTPayOption = async () => {
        let res = await dispatch(getFaTPayPaymentOption());
        return res;
    }
    const getStarPayTarget = async () => {
        let res = await dispatch(getStarPayCryptoTarget());
        return res;
    }
    const getStarPayOption = async () => {
        let res = await dispatch(getStarPayPaymentOption());
        return res;
    }

    const getRampPayTarget = async (currencyParam) => {
        const data = {
            currencyCode: currencyParam,
        };
        let res = await dispatch(getRampCryptoTarget(data));

        let symbolOptions = {}
        if (res.payload?.data) {
            res.payload.data.map((row, index) => {

                if (symbolOptions[row.crypto]) {
                    symbolOptions[row.crypto].networkList.push(row)
                } else {
                    symbolOptions[row.crypto] = {...row,
                        networkList: [row]
                    }
                }
            })
        }

        if (Object.keys(symbolOptions).length !== 0) {
            let symbolOptionsArr = Object.values(symbolOptions)
            setSymbolList(symbolOptionsArr)
            setSymbol(symbolOptionsArr[0].crypto)
            getSymbolData(symbolOptionsArr[0].crypto, symbolOptionsArr)
        }

    }

    const getSymbolData = (symbol, symbolsParam) => {
        if (!symbolsParam) {
            symbolsParam = symbolList
        }

        if (symbolsParam.length > 0) {
            let symbolSelectIndex = symbolsParam.findIndex(item => item.crypto === symbol)
            setSymbolSelected(symbolSelectIndex)
            setCryptoNetworkList(symbolsParam[symbolSelectIndex].networkList);
            setCryptoNetwork(symbolsParam[symbolSelectIndex].networkList[0].network)
        }
    }

    const getRampOption = async () => {
        let res = await dispatch(getRampPaymentOption());
        let fiatOptions = {}
        if (res.payload?.data) {
            res.payload.data.map((row, index) => {

                if (fiatOptions[row.currency]) {
                    fiatOptions[row.currency].payWay.push(row)
                } else {
                    fiatOptions[row.currency] = {...row,
                        avatar: "https://bedao.io/static/Icon/currency/" + row.currency + ".png",
                        payWay: [row]
                    }
                }
            })
        }

        if (Object.keys(fiatOptions).length !== 0) {
            let faitOptionsArr = Object.values(fiatOptions)
            let defaultCurrency = userData.currencyCode || 'USD'
            setCurrencyCode(defaultCurrency)
            setFiats(faitOptionsArr)

            getCurrencyData(defaultCurrency, faitOptionsArr)
        }
    }

    const getCurrencyData = (currency, fiatsParam) => {
        if (!fiatsParam) {
            fiatsParam = fiats
        }

        if (fiatsParam.length > 0) {
            let fiatSelectIndex = fiatsParam.findIndex(item => item.currency === currency)
            setFiatsSelected(fiatSelectIndex)
            setCurrencyPayWay(fiatsParam[fiatSelectIndex].payWay);

            getRampPayTarget(currency)
        }
    }

    const getSdkSymbolData = async (payType) => {
        let allSymbols = [];
        let paymentOption = {};
        let cryptoTarget = {};
        if (payType === 'LegendTrading') {
            await Promise.all([getCryptoTarget(), getPaymentOption()]).then((resArr) => {
                let cryptoTarget = resArr[0];
                cryptoTarget.payload.data.forEach((symbol, index) => {
                    allSymbols.push(symbol.cryptoCurrency);
                })
                paymentOption = resArr[1];
            });
        } else if (payType === 'FaTPay') {
            await Promise.all([getFaTPayTarget(), getFaTPayOption()]).then((resArr) => {
                let cryptoTarget = resArr[0];
                paymentOption = resArr[1];
                cryptoTarget.payload.data.forEach((symbol, index) => {
                    if (allSymbols.indexOf(symbol.cryptoCurrency) === -1) {
                        allSymbols.push(symbol.cryptoCurrency);
                    }
                })
            });

        } else if (payType === 'StarPay') {
            // await Promise.all([getStarPayTarget(), getStarPayOption()]).then((resArr) => {
            await Promise.all([getRampOption()]).then((resArr) => {
                paymentOption = resArr[0];
                // if (cryptoTarget && cryptoTarget.payload && cryptoTarget.payload.data && cryptoTarget.payload.data.length > 0) {
                //     cryptoTarget.payload.data.forEach((symbol, index) => {
                //         if (allSymbols.indexOf(symbol.cryptoCurrency) === -1) {
                //             allSymbols.push(symbol.cryptoCurrency);
                //         }
                //     })
                // }
            });
        }

        // if (allSymbols?.length > 0) {
        //     let tmpSymbols = [];
        //     for (let i = 0; i < allSymbols.length; i++) {
        //         tmpSymbols[i] = {
        //             avatar: arrayLookup(symbols, 'symbol', allSymbols[i], 'avatar') || 0,
        //             balance: (arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'balance') || 0).toFixed(6),
        //             symbol: allSymbols[i],
        //             tradeLock: arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'tradeLock') || 0,
        //             withdrawLock: arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'withdrawLock') || 0
        //         };
        //     }
        //     setSymbolWallet(tmpSymbols);
        // }

        if (paymentOption?.payload?.data) {
            let tmpFiats = [];
            // let tmpFiatObj = {};
            // for (let [key, payment] of Object.entries(paymentOption.payload.data)) {
            //     tmpFiats.push({
            //         currencyCode: payment.currency,
            //         balance: arrayLookup(fiatsData, 'currencyCode', payment.fiatCurrency, 'balance') || 0,
            //         minAmount: payment.paymentOptions[0]?.minAmount ?? 0,
            //         maxAmount: payment.paymentOptions[0]?.maxAmount ?? 0,
            //         avatar: payment.avatar
            //     });
            //     tmpFiatObj[payment.fiatCurrency] = {
            //         currencyCode: payment.fiatCurrency,
            //         balance: arrayLookup(fiatsData, 'currencyCode', payment.fiatCurrency, 'balance') || 0,
            //         minAmount: payment.paymentOptions[0]?.minAmount ?? 0,
            //         maxAmount: payment.paymentOptions[0]?.maxAmount ?? 0,
            //         avatar: payment.avatar
            //     }
            // }

            paymentOption.payload.data.map((row, index) => {
                if (!tmpFiats.some(item => item.currencyCode === row.currency)) {
                    tmpFiats.push({
                        currencyCode: row.currency,
                        minAmount: row.payMin ?? 0,
                        maxAmount: row.payMax ?? 0,
                        avatar: "https://bedao.io/static/Icon/currency/" + row.currency + ".png"
                    });
                }
            })

            if (tmpFiats.length > 0) {
                setFiats(tmpFiats);
                // setFiatObj(tmpFiatObj);
                // setCurrencyCode(tmpFiats[0].currencyCode);
                // setCurrencyBalance(tmpFiats[0].balance);
            }

            // if (cryptoTarget?.payload?.data) {
            //     let tmpCrypto = [];
            //     cryptoTarget.payload.data.map((row, index) => {
            //         console.log("pppppppppppppppppp", row);
            //     })
            //     setCryptos(cryptoTarget.payload.data);
            // }
        }
    };

    useEffect(() => {
        setPhoneTab('buyCrypto');
        getRampOption();
    }, []);

    useEffect(() => {
        getCurrencyData(currencyCode)
    }, [currencyCode]);

    useEffect(() => {
        getSymbolData(symbol)
    }, [symbol]);


    // select切换
    const handleChangeFiats = (event) => {
        setFiatsSelected(event.target.value);
        setCurrencyCode(fiats[event.target.value].currency);
        setCurrencyPayWay(fiats[event.target.value].payWay);
        setCurrencyPayWaySelected(0)
        // setCurrencyBalance(fiats[event.target.value].balance);
    };

    const handleChangePayWay = (event) => {
        setCurrencyPayWaySelected(event.target.value);
    }

    const handleChangeNetwork = (event) => {
        setCryptoNetworkSelected(event.target.value);
        setCryptoNetwork(cryptoNetworkList[event.target.value].network);
    }

    const handleChangeCrypto = (event) => {
        // setCurrencyCrypto();
        setSymbolSelected(event.target.value);
        setSymbol(symbolList[event.target.value].crypto);
        setCryptoNetworkList(symbolList[event.target.value].networkList);
        setCryptoNetworkSelected(0)
        setCryptoNetwork(symbolList[event.target.value].networkList[0].network)
    };

    const handleSubmit = async () => {
        let minAmount = parseInt(cryptoNetworkList[cryptoNetworkSelected].minPurchaseAmount);
        let maxAmount = parseInt(cryptoNetworkList[cryptoNetworkSelected].maxPurchaseAmount);

        if (amount < minAmount || amount > maxAmount) {
            dispatch(showMessage({
                message: `Amount range：${minAmount} - ${maxAmount}`,
                code: 2
            }));
            return
        }
        let res = await dispatch(getRampConfig({
            fiatCurrency: currencyCode,
            // payWayCode: currencyPayWay[currencyPayWaySelected].payWayCode,
            cryptoCurrency: symbol,
            chain: cryptoNetwork,
            amount: amount,
            // address: buyAddress,
        }));

        let result = res.payload
        if (result.errno === 0 && result.data.status === 'success') {
            history.push(result.data.payData)
        } else {
            dispatch(showMessage({ message: 'System busy', code: 2 }));
        }
    }
    // 购买
    const goBuy = () => {
        if (payType === 'LegendTrading') {
            window.open(`${domain.FUNIBOX_DOMAIN}/buy`)
            // history.push('/buy', {
            //     symbol: symbol,     // 加密货币
            //     // num: 10,            // 加密货币数量
            //     // currency: 'USD',    // 法币
            //     // balance: 11         // 法币金额
            // });
        } else if (payType === 'FaTPay') {
            history.push('/wallet/fatpaybuy', {
                symbol: symbol,     // 加密货币
                // num: 10,            // 加密货币数量
                // currency: 'USD',    // 法币
                // balance: 11         // 法币金额
            });
        } else if (payType === 'StarPay') {
            getRampPayTarget();
            // if (amount >= fiatObj[currencyCode]?.minAmount && amount <= fiatObj[currencyCode]?.maxAmount) {
            //     dispatch(getStarPayConfig({
            //         fiatCurrency: currencyCode,
            //         amount,
            //     })).then((res) => {
            //         let result = res.payload
            //         if (result.payurl) {
            //             const loginType = getUserLoginType(userData);
            //             switch (loginType) {
            //                 case userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP: { //telegramWebApp
            //                     window.location.href = result.payurl
            //                     break;
            //                 }
            //                 default: {
            //                     window.open(result.payurl)
            //                     break;
            //                 }
            //             }
            //         }
            //     });
            // } else {
            //     dispatch(showMessage({ message: 'Amount error', code: 2 }));
            // }

        }
    };

    // 初始化symbol & fiat
    const initSymbolAndFiat = () => {
        setSymbol('');
        setSymbolWallet([]);
        setFiats([]);
        setFiatObj({});
        setFiatsSelected(0);
        setCurrencyCode('USD');
        setCurrencyBalance(0);
    }

    const changeNoSupplier = () => {
        if (!noSupplier)
            setNoSupplier(true);
        else
            return
    }

    const [loadingShow, setLoadingShow] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoadingShow(true);
        }, 1500);
    }, []);

    return (
        <div>
            {
                loadingShow &&
                <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className='mt-16'
                    >
                        <Tabs
                            component={motion.div}
                            variants={item}
                            value={tabValue}
                            onChange={(ev, value) => setTabValue(value)}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                            className="tongYongDingBtn"
                            style={{ width: '50%!import' }}
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                            TabIndicatorProps={{
                                children: (
                                    <Box
                                        sx={{ bgcolor: 'text.disabled' }}
                                        className="w-full h-full rounded-full huaKuaBgColor0"
                                    />
                                ),
                            }}
                            sx={{
                                margin: '1rem 1.2rem',
                            }}
                        >
                            {Object.entries(ranges).map(([key, label]) => (
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

                    <div>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className=""
                            style={{ padding: "1.2rem 1.5rem 1.5rem 1.5rem" }}
                        >

                            <Typography className="text-20 font-medium mb-16">
                                {tabValue === 0 && <>
                                    {t('home_buy_3')}
                                </>}
                                {tabValue === 1 && <>
                                    {t('home_buy_7')}
                                </>}&nbsp;
                                {currencyCode}
                            </Typography>

                            <Box
                                className="w-full rounded-16 flex flex-col select-fieldset-noborder"
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
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    border: 'none'
                                                },
                                            },
                                        }}
                                    >
                                        {fiats.length > 0 && fiats.map((row, index) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={index}
                                                >
                                                    <div
                                                        key={index}
                                                        className="flex items-center py-4 flex-grow"
                                                        style={{ width: '100%' }}
                                                    >
                                                        <div className="flex items-center">
                                                            <img style={{
                                                                width: '3rem',
                                                                borderRadius: '999px'
                                                            }} src={row.avatar} alt="" />
                                                            <div className="px-12 font-medium">
                                                                <Typography className="text-20 font-medium">{row.currency}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Typography className="text-20 font-medium my-16">
                                {tabValue === 0 && <>
                                    {t('home_buy_1')}
                                </>}
                                {tabValue === 1 && <>
                                    {t('home_buy_2')}
                                </>}&nbsp;
                                {symbol}
                            </Typography>


                            <Box
                                className="w-full rounded-16 flex flex-col select-fieldset-noborder"
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
                                        value={symbolSelected}
                                        onChange={handleChangeCrypto}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
                                        className="MuiSelect-icon"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    border: 'none'
                                                },
                                            },
                                        }}
                                    >
                                        {symbolList.map((row, index) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={index}
                                                >
                                                    <div
                                                        key={index}
                                                        className="flex items-center py-4 flex-grow"
                                                        style={{ width: '100%' }}
                                                    >
                                                        <div className="flex items-center">
                                                            <img style={{
                                                                width: '3rem',
                                                                borderRadius: '999px'
                                                            }} src={row.icon} alt="" />
                                                            <div className="px-12 font-medium">
                                                                <Typography className="text-20 font-medium">{row.crypto}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Typography className="text-20 font-medium my-16">
                                {tabValue === 0 && <>
                                    Chain
                                </>}
                            </Typography>


                            <Box
                                className="w-full rounded-16 flex flex-col select-fieldset-noborder"
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
                                        value={cryptoNetworkSelected}
                                        onChange={handleChangeNetwork}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
                                        className="MuiSelect-icon"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    border: 'none'
                                                },
                                            },
                                        }}
                                    >
                                        {cryptoNetworkList.map((row, index) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={index}
                                                >
                                                    <div
                                                        key={index}
                                                        className="flex items-center py-4 flex-grow"
                                                        style={{ width: '100%' }}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="px-12 font-medium">
                                                                <Typography className="text-20 font-medium">{row.network}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>



                            {/* <Box
                                className="w-full rounded-16 flex flex-col"
                                sx={{
                                    backgroundColor: '#1E293B',
                                    border: 'none'
                                }}
                            >
                                {symbolWallet.length > 0 && <StyledAccordionSelect
                                    symbol={symbolWallet}
                                    setSymbol={setSymbol}
                                />}
                            </Box> */}


                            <Typography className="text-20 font-medium my-16">
                                {tabValue === 0 && <>
                                    Pay Type
                                </>}
                            </Typography>


                            {/*{tabValue === 0 && <>*/}
                            {/*    <Box*/}
                            {/*        className="w-full rounded-16 flex flex-col select-fieldset-noborder"*/}
                            {/*        sx={{*/}
                            {/*            backgroundColor: '#1E293B',*/}
                            {/*            border: 'none'*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <FormControl sx={{*/}
                            {/*            m: 1,*/}
                            {/*            minWidth: "100%",*/}
                            {/*            margin: 0,*/}
                            {/*            border: 'none',*/}
                            {/*            borderRadius: '8px!important',*/}
                            {/*            backgroundColor: '#1E293B!important',*/}
                            {/*            '&:before': {*/}
                            {/*                display: 'none',*/}
                            {/*            },*/}
                            {/*            '&:first-of-type': {},*/}
                            {/*            '&:last-of-type': {*/}
                            {/*                marginBottom: 0,*/}
                            {/*            }*/}
                            {/*        }}*/}
                            {/*        >*/}
                            {/*            <Select*/}
                            {/*                value={currencyPayWaySelected}*/}
                            {/*                onChange={handleChangePayWay}*/}
                            {/*                displayEmpty*/}
                            {/*                inputProps={{ "aria-label": "Without label" }}*/}
                            {/*                className="MuiSelect-icon"*/}
                            {/*                MenuProps={{*/}
                            {/*                    PaperProps: {*/}
                            {/*                        style: {*/}
                            {/*                            maxHeight: 300,*/}
                            {/*                            border: 'none'*/}
                            {/*                        },*/}
                            {/*                    },*/}
                            {/*                }}*/}
                            {/*            >*/}
                            {/*                {currencyPayWay.length > 0 && currencyPayWay.map((row, index) => {*/}
                            {/*                    return (*/}
                            {/*                        <MenuItem*/}
                            {/*                            key={index}*/}
                            {/*                            value={index}*/}
                            {/*                        >*/}
                            {/*                            <div*/}
                            {/*                                key={index}*/}
                            {/*                                className="flex items-center py-4 flex-grow"*/}
                            {/*                                style={{ width: '100%' }}*/}
                            {/*                            >*/}
                            {/*                                <div className="flex items-center">*/}
                            {/*                                    <div className="px-12 font-medium">*/}
                            {/*                                        <Typography className="text-20 font-medium">{row.payWayName}</Typography>*/}
                            {/*                                    </div>*/}
                            {/*                                </div>*/}
                            {/*                            </div>*/}
                            {/*                        </MenuItem>*/}
                            {/*                    )*/}
                            {/*                })}*/}
                            {/*            </Select>*/}
                            {/*        </FormControl>*/}
                            {/*    </Box>*/}
                            {/*</>}*/}




                            <Typography className="text-20 font-medium my-16" >{t('home_buy_4')}</Typography>
                            {tabValue === 0 && <>
                                <Box
                                    className={clsx("w-full rounded-8  flex flex-col my-16 cursor-pointer", payType === 'StarPay' && 'buy-pay-type-acitve')}
                                    sx={{
                                        backgroundColor: '#1E293B',
                                        border: "1px solid #1E293B"
                                    }}
                                    onClick={() => {
                                    }}
                                >
                                    <StyledAccordion
                                        component={motion.div}
                                        variants={item}
                                        classes={{
                                            root: 'FaqPage-panel shadow',
                                        }}
                                        expanded={expanded === 2}
                                        // onChange={toggleAccordion(2)}
                                    >
                                        <div className="flex items-center flex-grow buy-pay-type " style={{ width: '100%', padding: '1.6rem 1.2rem' }}>
                                            <div className="flex items-center">
                                                <div style={{
                                                    width: '30px',
                                                    borderRadius: '5px',
                                                }}>
                                                    <img className='border-r-10' src="wallet/assets/images/buy/Ramp.png" alt="" />
                                                </div>
                                                <div className="px-12 font-medium">
                                                    <Typography className="text-20 font-medium">RampPay</Typography>
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <div className="px-12 font-medium flex justify-content-center items-center" style={{ textAlign: 'right' }}>
                                                    <div className="mx-4"><img src="wallet/assets/images/buy/visa.png" alt="" /></div>
                                                    <div className="mx-4"><img src="wallet/assets/images/buy/jh.png" alt="" /></div>
                                                    <div className="mx-4"><img src="wallet/assets/images/buy/jcb.png" alt="" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </StyledAccordion>
                                </Box>

                                {/*<Box*/}
                                {/*    className={clsx("w-full rounded-8  flex flex-col my-20 cursor-pointer", payType === 'FaTPay' && 'buy-pay-type-acitve')}*/}
                                {/*    sx={{*/}
                                {/*        backgroundColor: '#1E293B',*/}
                                {/*        border: "1px solid #1E293B"*/}
                                {/*    }}*/}
                                {/*    onClick={() => {*/}
                                {/*        setPayType('FaTPay');*/}
                                {/*        initSymbolAndFiat();*/}
                                {/*        getSdkSymbolData('FaTPay');*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <StyledAccordion*/}
                                {/*        component={motion.div}*/}
                                {/*        variants={item}*/}
                                {/*        classes={{*/}
                                {/*            root: 'FaqPage-panel shadow',*/}
                                {/*        }}*/}
                                {/*        expanded={expanded === 2}*/}
                                {/*        onChange={toggleAccordion(2)}*/}
                                {/*    >*/}
                                {/*        <div className="flex items-center flex-grow buy-pay-type" style={{ width: '100%', padding: '1.6rem 1.2rem' }}>*/}
                                {/*            <div className="flex items-center">*/}
                                {/*                <div style={{*/}
                                {/*                    width: '30px',*/}
                                {/*                    borderRadius: '5px',*/}

                                {/*                }}>*/}
                                {/*                    <img className='border-r-10' src="wallet/assets/images/buy/FaTPay.png" alt="" />*/}
                                {/*                </div>*/}
                                {/*                <div className="px-12 font-medium">*/}
                                {/*                    <Typography className="text-20 font-medium">FaTPay</Typography>*/}
                                {/*                </div>*/}
                                {/*            </div>*/}
                                {/*            <div style={{ marginLeft: 'auto' }}>*/}
                                {/*                <div className="px-12 font-medium flex justify-content-center items-center" style={{ textAlign: 'right' }}>*/}
                                {/*                    <div className="mx-4"><img src="wallet/assets/images/buy/visa.png" alt="" /></div>*/}
                                {/*                    <div className="mx-4"><img src="wallet/assets/images/buy/jh.png" alt="" /></div>*/}
                                {/*                    <div className="mx-4"><img src="wallet/assets/images/buy/jcb.png" alt="" /></div>*/}
                                {/*                </div>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </StyledAccordion>*/}
                                {/*</Box>*/}

                                {payType === 'StarPay' && <>
                                    <Typography className="text-20 font-medium my-16" >Amount</Typography>

                                    <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-address send-tips-container-address"
                                            value={amount}
                                            onChange={(event) => { setAmount(event.target.value) }}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'address',
                                            }}
                                        />

                                    </FormControl>

                                    {/*<Typography className="text-20 font-medium my-16" >Address</Typography>*/}

                                    {/*<FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">*/}
                                    {/*    <OutlinedInput*/}
                                    {/*        id="outlined-adornment-address send-tips-container-address"*/}
                                    {/*        value={buyAddress}*/}
                                    {/*        onChange={(event) => { setBuyAddress(event.target.value) }}*/}
                                    {/*        aria-describedby="outlined-weight-helper-text"*/}
                                    {/*        inputProps={{*/}
                                    {/*            'aria-label': 'address',*/}
                                    {/*        }}*/}
                                    {/*    />*/}

                                    {/*</FormControl>*/}

                                </>}
                            </>}

                            {tabValue === 1 && payType === 'StarPay' && (<div>
                                {changeNoSupplier()}
                                <Typography className="text-14 font-medium my-16  tiShiSty"><span style={{ color: '#fce100' }}>⚠</span> {t('home_buy_10')}</Typography>
                            </div>)}

                            {tabValue === 0 && (
                                <Box
                                    className=""
                                    sx={{ borderRadius: '8px' }}
                                >
                                    <Typography className="text-14 my-20" style={{ magin: '2.6rem 0 2.6rem 2rem', color: '#94a3b8' }}>
                                        <span style={{ color: '#fce100' }}>⚠ </span>
                                        {t('home_buy_5')}
                                    </Typography>
                                </Box>
                            )
                            }

                            {tabValue === 1 && noSupplier && (
                                <Box
                                    className=""
                                    sx={{
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography className="text-14 my-20" style={{ magin: '2.6rem 0 2.6rem 2rem', color: '#94a3b8' }}>
                                        <span style={{ color: '#fce100' }}>⚠ </span>
                                        {t('home_buy_5')}
                                    </Typography>
                                </Box>
                            )
                            }

                            <Button
                                style={{ width: '100%', height: '4rem', margin: '0 auto', display: 'block', fontSize: '2rem', lineHeight: 'initial' }}
                                className='m-28 px-48 text-lg btnColorTitleBig text-20'
                                color="secondary"
                                variant="contained"
                                sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                disabled={tabValue === 1}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                {tabValue === 0 && <>
                                    {t('home_buy_8')}
                                </>}
                                {tabValue === 1 && <>
                                    {t('home_buy_9')}
                                </>}
                            </Button>
                        </motion.div>
                    </div>

                    {/*{tabValue === 1 && <div>*/}
                    {/*    sell*/}
                    {/*</div>}*/}
                </div>
            }
            {
                !loadingShow &&
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
                    </div>
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
                    </div>
                </div>
            }
        </div>
    )
}

export default Buy;
