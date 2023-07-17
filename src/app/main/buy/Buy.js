import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
// import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import history from '@history';
import domain from '../../api/Domain';

import '../../../styles/home.css';
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import {useSelector, useDispatch} from "react-redux";
import {selectUserData} from "../../store/user";
import {selectConfig} from "../../store/config";
import {arrayLookup} from "../../util/tools/function";
import Button from "@mui/material/Button";
import { getFaTPayCryptoTarget, getFaTPayPaymentOption, getLegendTradingCryptoTarget, getLegendTradingPaymentOption } from "../../store/payment/paymentThunk";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import {useTranslation} from "react-i18next";

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

    const fiatsData = useSelector(selectUserData).fiat || [];
    const config = useSelector(selectConfig);
    const currencys = useSelector(selectConfig).payment.currency || [];
    const [ fiats, setFiats ] = useState([]);
    const [ fiatsSelected, setFiatsSelected ] = useState(0);
    const [ currencyCode, setCurrencyCode ] = useState('USD');
    const [ currencyBalance, setCurrencyBalance ] = useState(0);
    const [ payType, setPayType ] = useState('LegendTrading');
    const [ symbolWallet, setSymbolWallet ] = useState([]);
    const [ symbol, setSymbol ] = useState('');

    const walletData = useSelector(selectUserData).wallet;
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
    const getSdkSymbolData = async (payType) => {
        let allSymbols = [];
        let paymentOption = {};
        if (payType === 'LegendTrading') {
            await Promise.all([getCryptoTarget(),getPaymentOption()]).then((resArr) => {
                let cryptoTarget = resArr[0];
                cryptoTarget.payload.data.forEach((symbol, index) => {
                    allSymbols.push(symbol.cryptoCurrency);
                })
                paymentOption = resArr[1];
            });
            // var cryptoTarget = await dispatch(getLegendTradingCryptoTarget());
            // var paymentOption = await dispatch(getLegendTradingPaymentOption());

        } else if (payType === 'FaTPay') {
            // var cryptoTarget = await dispatch(getFaTPayCryptoTarget());
            // var paymentOption = await dispatch(getFaTPayPaymentOption());
            await Promise.all([getFaTPayTarget(),getFaTPayOption()]).then((resArr)=> {
                let cryptoTarget = resArr[0];
                paymentOption = resArr[1];
                cryptoTarget.payload.data.forEach((symbol, index) => {
                    if (allSymbols.indexOf(symbol.cryptoCurrency) === -1) {
                        allSymbols.push(symbol.cryptoCurrency);
                    }
                })
            });

        }
        if (allSymbols?.length > 0) {
            let tmpSymbols = [];
            for (let i = 0; i < allSymbols.length; i++) {
                tmpSymbols[i] = {
                    balance: (arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'balance') || 0).toFixed(6),
                    symbol: allSymbols[i],
                    tradeLock: arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'tradeLock') || 0,
                    withdrawLock: arrayLookup(walletData.inner, 'symbol', allSymbols[i], 'withdrawLock') || 0
                };
            }
            setSymbolWallet(tmpSymbols);
        }
        if (paymentOption?.payload?.data) {
            let tmpFiats = [];
            for (let [key, payment] of Object.entries(paymentOption.payload.data)) {
                tmpFiats.push({
                    currencyCode: payment.fiatCurrency,
                    balance: arrayLookup(fiatsData, 'currencyCode', payment.fiatCurrency, 'balance') || 0,
                });
            }
            if (tmpFiats.length > 0) {
                setFiats(tmpFiats);
                setCurrencyCode(tmpFiats[0].currencyCode);
                setCurrencyBalance(tmpFiats[0].balance);
            }
        }
    };
    useEffect(() => {
        getSdkSymbolData(payType);
    }, [walletData.inner]);

    // select切换
    const handleChangeFiats = (event) => {
        setFiatsSelected(event.target.value);
        setCurrencyCode(fiats[event.target.value].currencyCode);
        setCurrencyBalance(fiats[event.target.value].balance);
    };

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
            history.push('/fatpaybuy', {
                symbol: symbol,     // 加密货币
                // num: 10,            // 加密货币数量
                // currency: 'USD',    // 法币
                // balance: 11         // 法币金额
            });
        }
    };

    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
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
                    className="-mx-4 min-h-35"
                    style={{padding: '0 0', margin: '1rem 2.4rem 0.4rem', borderColor: 'transparent', backgroundColor: '#374252', width: '21.6rem', borderRadius: '20px', height: '3.2rem'}}
                    classes={{ indicator: 'flex justify-center bg-transparent w-full h-full ' }}
                    TabIndicatorProps={{
                        children: (
                            <Box
                                sx={{ bgcolor: 'text.disabled' }}
                                className="w-full h-full rounded-full huaKuaBgColor0"
                            />
                        ),
                    }}
                    sx={{
                        padding: '1rem 1.2rem',
                        width: 'auto'
                    }}
                >
                    {Object.entries(ranges).map(([key, label]) => (
                        <Tab
                            className="text-14 font-semibold min-h-32 min-w-64 mx4 px-12 opacity1 txtColorTitle zindex"
                            disableRipple
                            key={key}
                            label={label}
                            sx={{
                                color: '#FFFFFF', height: '3.2rem', width: '10.8rem'
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
                    className="p-24"
                >
                    <Typography className="text-20 font-medium mb-16">
                        {tabValue === 0 && <>
                            {t('home_buy_1')}
                        </>}
                        {tabValue === 1 && <>
                            {t('home_buy_2')}
                        </>}&nbsp;
                        {symbol}
                    </Typography>
                    <Box
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
                    </Box>

                    <Typography className="text-20 font-medium my-16">
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
                            } }}
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
                                {fiats.map((row, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={index}
                                        >
                                            <div
                                                key={index}
                                                className="flex items-center py-4 flex-grow"
                                                style={{width: '100%'}}
                                            >
                                                <div className="flex items-center">
                                                    <img style={{
                                                        width: '3rem',
                                                        borderRadius: '8px'
                                                    }} src={arrayLookup(currencys, 'currencyCode', row.currencyCode, 'avatar')} alt=""/>
                                                    <div className="px-12 font-medium">
                                                        <Typography className="text-20 font-medium">{row.currencyCode}</Typography>
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
                        {/*                    /!*<Typography className="text-16 font-medium">{currencyBalance}</Typography>*!/*/}

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
                        {/*            {fiats.map((row, index) => {*/}
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
                        {/*                        /!*<Typography className="text-12" style={{color: '#94A3B8'}}>{row.balance}</Typography>*!/*/}
                        {/*                    </div>*/}
                        {/*                )*/}
                        {/*            })}*/}
                        {/*        </div>*/}

                        {/*    </AccordionDetails>*/}
                        {/*</StyledAccordion>*/}
                    </Box>

                    <Typography className="text-20 font-medium my-16" style={{marginTop: '2rem'}}>{t('home_buy_4')}</Typography>

                    <Box
                        className={clsx("w-full rounded-8  flex flex-col my-20 cursor-pointer", payType === 'LegendTrading' && 'buy-pay-type-acitve')}
                        sx={{
                            backgroundColor: '#1E293B',
                            border:"1px solid #1E293B"
                        }}
                        onClick={() => {
                            setPayType('LegendTrading');
                            getSdkSymbolData('LegendTrading');
                        }}
                    >
                        <StyledAccordion
                            component={motion.div}
                            variants={item}
                            classes={{
                                root: 'FaqPage-panel shadow',
                            }}
                            expanded={expanded === 2}
                            onChange={toggleAccordion(2)}
                        >
                            <div className="flex items-center flex-grow buy-pay-type " style={{width: '100%', padding: '1.6rem 1.2rem'}}>
                                <div className="flex items-center">
                                    <div  style={{
                                        width: '30px',
                                        borderRadius: '5px',
                                    }}>
                                        <img className='border-r-10' src="assets/images/buy/LegendTrading.png" alt=""/>
                                    </div>
                                    <div className="px-12 font-medium">
                                        <Typography className="text-20 font-medium">LegendTrading</Typography>
                                    </div>
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <div className="px-12 font-medium flex justify-content-center items-center" style={{textAlign: 'right'}}>
                                        <div className="mx-4"><img src="assets/images/buy/visa.png" alt=""/></div>
                                        <div className="mx-4"><img src="assets/images/buy/jh.png" alt=""/></div>
                                        <div className="mx-4"><img src="assets/images/buy/jcb.png" alt=""/></div>
                                    </div>
                                </div>
                            </div>
                        </StyledAccordion>
                    </Box>
                    {tabValue === 0 && <>
                        <Box
                            className={clsx("w-full rounded-8  flex flex-col my-20 cursor-pointer", payType === 'FaTPay' && 'buy-pay-type-acitve')}
                            sx={{
                                backgroundColor: '#1E293B',
                                border:"1px solid #1E293B"
                            }}
                            onClick={() => {
                                setPayType('FaTPay');
                                getSdkSymbolData('FaTPay');
                            }}
                        >
                            <StyledAccordion
                                component={motion.div}
                                variants={item}
                                classes={{
                                    root: 'FaqPage-panel shadow',
                                }}
                                expanded={expanded === 2}
                                onChange={toggleAccordion(2)}
                            >
                                <div className="flex items-center flex-grow buy-pay-type" style={{width: '100%', padding: '1.6rem 1.2rem'}}>
                                    <div className="flex items-center">
                                        <div  style={{
                                            width: '30px',
                                            borderRadius: '5px',

                                        }}>
                                            <img className='border-r-10' src="assets/images/buy/FaTPay.png" alt=""/>
                                        </div>
                                        <div className="px-12 font-medium">
                                            <Typography className="text-20 font-medium">FaTPay</Typography>
                                        </div>
                                    </div>
                                    <div style={{marginLeft: 'auto'}}>
                                        <div className="px-12 font-medium flex justify-content-center items-center" style={{textAlign: 'right'}}>
                                            <div className="mx-4"><img src="assets/images/buy/visa.png" alt=""/></div>
                                            <div className="mx-4"><img src="assets/images/buy/jh.png" alt=""/></div>
                                            <div className="mx-4"><img src="assets/images/buy/jcb.png" alt=""/></div>
                                        </div>
                                    </div>
                                </div>
                            </StyledAccordion>
                        </Box>
                    </>}

                    <Box
                        className=""
                        sx={{
                            borderRadius: '8px'
                        }}
                    >
                        <Typography className="text-14 my-16" style={{magin: '2.6rem 0 2.6rem 2rem', color: '#94a3b8'}}>
                            <span style={{color: '#fce100'}}>⚠</span>
                            {t('home_buy_5')}
                        </Typography>
                    </Box>

                    <Button
                        style={{width: '24rem', height: '4rem', margin: '0 auto', display: 'block', fontSize: '2rem', lineHeight: 'initial'}}
                        className='m-28 px-48 text-lg btnColorTitleBig text-20'
                        color="secondary"
                        variant="contained"
                        sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                        onClick={() => {
                            goBuy();
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
    )
}

export default Buy;
