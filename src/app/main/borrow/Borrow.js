import { useEffect, useState } from 'react';
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
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import StyledAccordionSelect from '../../components/StyledAccordionSelect';

import '../../../styles/home.css';
import { useSelector } from "react-redux";
import { selectUserData } from "../../store/user";
import { selectConfig } from "../../store/config";
import { arrayLookup } from "../../util/tools/function";
import { useTranslation } from "react-i18next";

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

function Borrow() {
    const { t } = useTranslation('mainPage');
    const [expanded, setExpanded] = useState(null);
    const toggleAccordion = (panel) => (event, _expanded) => {
        setExpanded(_expanded ? panel : false);
    };


    const [percentage, setPercentage] = useState('');
    const handleClick = (index) => {
        // console.log(percentage, 'percentage')
        setPercentage(index)
    };


    const [symbol, setSymbol] = useState('');
    const walletData = useSelector(selectUserData).wallet;
    const config = useSelector(selectConfig);
    const symbols = config.symbols;
    const [symbolWallet, setSymbolWallet] = useState([]);

    // 初始化数据
    const initSymbol = () => {
        let tmpSymbol = [];
        let tmpSymbolWallet = [];
        for (let i = 0; i < symbols.length; i++) {
            if (tmpSymbol.indexOf(symbols[i].symbol) == -1 && symbols[i].symbol != 'eUSDT' && symbols[i].symbol != 'eBGT') {
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
        setLoadingShow(false)
        if (symbols) {
            initSymbol()
            setLoadingShow(false)
        }
    }, [symbols]);

    const [loadingShow, setLoadingShow] = useState(false);


    return (
        <div>
            {!loadingShow &&
                <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="borrow-container mt-10"
                        style={{ padding: "1.4rem 1.5rem 2.4rem 1.5rem" }}
                    >
                        <div className="mb-16 flex items-center justify-between color-76819B" style={{ marginBottom: '0.8rem' }}>
                            <Typography className="text-20 font-medium">{t('home_borrow_1')} </Typography>
                            <div className="text-14 flex" style={{ color: '#FFFFFF', marginBottom: "1rem" }}>
                                <Typography className={clsx("cursor-pointer text-14 mx-8 txtColorTitle", percentage === 1 && 'colro-12C1A2')} onClick={() => { handleClick(1) }}>25%</Typography>
                                <Typography className={clsx("cursor-pointer text-14 mx-8 txtColorTitle", percentage === 2 && 'colro-12C1A2')} onClick={() => { handleClick(2) }}>50%</Typography>
                                <Typography className={clsx("cursor-pointer text-14 mx-8 txtColorTitle", percentage === 3 && 'colro-12C1A2')} onClick={() => { handleClick(3) }}>75%</Typography>
                                <Typography className={clsx("cursor-pointer text-14 mx-8 txtColorTitle", percentage === 4 && 'colro-12C1A2')} onClick={() => { handleClick(4) }}>100%</Typography>
                            </div>
                        </div>

                        <Box
                            className="w-full rounded-16 border flex flex-col"
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                        >
                            {/*<StyledAccordionSelect*/}
                            {/*    symbol={[*/}
                            {/*        {symbol: 'USDT', balance: 0}*/}
                            {/*    ]}*/}
                            {/*    // currencyCode="USD"*/}
                            {/*    // setSymbol={setSymbol}*/}
                            {/*    // isSetAmount={true}*/}
                            {/*    // setAmount={setAmount}*/}
                            {/*/>*/}

                            {symbolWallet.length > 0 && <StyledAccordionSelect
                                symbol={symbolWallet}
                                currencyCode="USD"
                                setSymbol={setSymbol}
                            />}
                        </Box>

                        <motion.div
                            component={motion.div}
                            variants={item}
                            className="flex items-center justify-content-center -mb-56 -mt-4 position-re"
                        >
                            <div className="cursor-pointer borrow-btn flex items-center justify-content-center double-borrow-btn">
                                {/* <FuseSvgIcon className="list-item-icon" sx={{ color: '#76819B' }} size={52}>
                                feather:chevrons-down
                            </FuseSvgIcon> */}
                                <img src="wallet/assets/images/borrow/double-arrow.png" alt="" />
                            </div>
                        </motion.div>

                        <Typography className="font-medium my-16 color-76819B" style={{ marginBottom: '0.8rem', marginTop: '2rem', fontSize: "18px" }}>{t('home_borrow_2')} </Typography>
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
                            />}
                            {/*<StyledAccordion*/}
                            {/*    component={motion.div}*/}
                            {/*    variants={item}*/}
                            {/*    classes={{*/}
                            {/*        root: 'FaqPage-panel shadow',*/}
                            {/*    }}*/}
                            {/*    expanded={expanded === 2}*/}
                            {/*    onChange={toggleAccordion(2)}*/}
                            {/*>*/}
                            {/*    <AccordionSummary*/}
                            {/*        expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}*/}
                            {/*    >*/}
                            {/*        <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}>*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <img style={{*/}
                            {/*                    width: '3rem'*/}
                            {/*                }} src="wallet/assets/images/deposite/usd.png" alt=""/>*/}
                            {/*                <div className="px-12 font-medium">*/}
                            {/*                    <Typography className="text-16 font-medium">BNB</Typography>*/}
                            {/*                    <Typography className="text-12" style={{color: '#94A3B8'}}>Binance Coin</Typography>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            <div style={{marginLeft: 'auto'}}>*/}
                            {/*                <div className="px-12 font-medium" style={{textAlign: 'right'}}>*/}
                            {/*                    <Typography className="text-16 font-medium">0.00000001</Typography>*/}
                            {/*                    <Typography className="text-12" style={{color: '#94A3B8'}}>$12.00</Typography>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </AccordionSummary>*/}

                            {/*    <AccordionDetails>*/}
                            {/*    </AccordionDetails>*/}
                            {/*</StyledAccordion>*/}
                        </Box>

                        <Typography className="my-8 text-14 color-76819B text-center" style={{ margin: '1.8rem 0' }}>
                            {t('home_borrow_11')}
                            <span className="color-ffffff">&nbsp; 1BNB &nbsp; </span>
                            {t('home_borrow_12')}
                        </Typography>

                        <Box
                            className="w-full rounded-16 border flex flex-col my-16"
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none',
                            }}
                            style={{ marginTop: 0 }}
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
                                <div className="items-center p-12 flex-grow" style={{ width: '100%', padding: '0.7rem 1.2rem' }}>
                                    <div className="flex items-center my-4">
                                        <div className="px-12 font-medium color-76819B">
                                            <Typography className="text-14 font-medium">
                                                {t('home_borrow_13')}
                                                <span className="color-ffffff">1ETH ~ 0.07867355 BTC</span>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-4">
                                        <div className="px-12 font-medium color-76819B">
                                            <Typography className="text-14 font-medium">
                                                {t('home_borrow_5')} :
                                                <span className="color-ffffff">0.5%</span>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-4">
                                        <div className="px-12 font-medium color-76819B">
                                            <Typography className="text-14 font-medium">
                                                {t('home_borrow_6')} :
                                                <span className="color-ffffff">0.00000000 BTC</span>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-4">
                                        <div className="px-12 font-medium color-76819B">
                                            <Typography className="text-14 font-medium">
                                                {t('home_borrow_7')} :
                                                <span className="color-ffffff">0</span>
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </StyledAccordion>
                        </Box>



                        <Button
                            style={{ width: '100%', margin: '2.9rem auto', display: 'block' }}
                            className='m-28 px-48 text-lg btnColorTitleBig'
                            color="secondary"
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                        >
                            {t('home_borrow_17')}
                        </Button>
                    </motion.div>
                </div>
            }{
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

                    </div>
                </div>
            }
        </div>
    )
}

export default Borrow;
