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

import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../../store/user";
import { getListBank } from "../../../store/user/userThunk";
import { makeWithdrawOrder } from "../../../store/payment/paymentThunk";
import { selectConfig } from "../../../store/config";
import { getWithdrawHistoryAddress } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import MobileDetect from 'mobile-detect';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { centerGetNftList, getNftConfig, evalWithdrawFee, nftWithdraw } from "app/store/wallet/walletThunk";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import {handleCopyText, readClipboardText} from "../../../util/tools/function";

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

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function Nft(props) {
    const { t } = useTranslation('mainPage');
    const [openTiBi, setOpenTiBi] = useState(false);
    const [openLoad, setOpenLoad] = useState(false);
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const dispatch = useDispatch();
    const [inputVal, setInputVal] = useState({
        address: ''
    });

    const handleChangeInputVal = (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };

    const changeAddress = (prop, value) => {
        setInputVal({ ...inputVal, [prop]: value });
    };

    const [historyAddress, setHistoryAddress] = useState([]);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const config = useSelector(selectConfig);
    const mounted = useRef();

    const [networks, setNetworks] = useState({});
    const [nftConfig, setNftConfig] = useState({});
    const [nftInner, setNftInner] = useState({});
    const [nftSelected, setNftSelected] = useState('');
    const [nftSelectedId, setNftSelectedId] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [nftSelectedInner, setNftSelectedInner] = useState([]);
    const [networdId, setNetworkId] = useState('');
    const [fee, setFee] = useState(0);
    const [bAppendFee, setBAppendFee] = useState(false);
    const [symbol, setSymbol] = useState(false);

    // 获取NFT config
    const handleNftConfig = () => {
        dispatch(getNftConfig()).then((res) => {
            let result = res.payload;
            if (result) {
                let tmpNftConfig = {};
                result.data.map((nftItem) => {
                    if (tmpNftConfig[nftItem.symbol]) {
                        tmpNftConfig[nftItem.symbol].networks.push(nftItem.networkId);
                        tmpNftConfig[nftItem.symbol].list.push(nftItem);
                    } else {
                        tmpNftConfig[nftItem.symbol] = {
                            networks: [nftItem.networkId],
                            symbol: nftItem.symbol,
                            name: nftItem.name,
                            avatar: nftItem.avatar,
                            list: [nftItem]
                        };
                    }
                });

                if (Object.keys(tmpNftConfig).length > 0) {
                    setNftConfig(tmpNftConfig);
                    setNftSelected(tmpNftConfig[Object.keys(tmpNftConfig)[0]].symbol);
                    setNetworkId(tmpNftConfig[Object.keys(tmpNftConfig)[0]].networks[0]);
                }

            }
        })
    };

    // 获取Nft余额
    const handleCenterGetNftList = () => {
        dispatch(centerGetNftList()).then((res) => {
            let result = res.payload;
            if (result) {
                let tmpNftInner = {}
                result.inner.map((item) => {
                    if (tmpNftInner[item.nftId]) {
                        tmpNftInner[item.nftId].push(item)
                    } else {
                        tmpNftInner[item.nftId] = [item]
                    }
                })

                setNftInner(tmpNftInner)
            }
        })
    };

    // 获取Nft手续费
    const handleEvalWithdrawFee = () => {
        dispatch(evalWithdrawFee({
            nftId: 2,
            tokenId: 3
        })).then((res) => {
            let result = res.payload;
            if (result) {
                setFee(result.gasFee.toFixed(6));
                setSymbol(result.symbol);
            }
        })
    };

    // 根据Nft Symbol 和 networkID 获取Nft ID
    const handleGetNftID = (nftSymbol, networkId) => {
        let nftId = 0;
        if (nftConfig[nftSelected]?.list) {
            nftId = nftConfig[nftSelected]?.list.filter((item) => {
                return item.networkId === networkId;
            })[0].id;
        }

        return nftId
    }

    const handleSubmit = () => {
        // let nftId = 54;
        // let tokenId = 1;
        let data = {
            nftId: nftSelectedId,
            tokenId,
            toAddress: inputVal.address,
        };
        dispatch(nftWithdraw(data)).then((res) => {
            let result = res.payload;
            if (result) {
            }
        });
    };

    const userData = useSelector(selectUserData);
    // select切换
    const handleChangeNft = (event) => {
        if (nftConfig[event.target.value]) {
            setNftSelected(event.target.value);
            setNetworkId(nftConfig[event.target.value].networks[0]);
        }
    };

    // 切换token
    const handleChangeToken = (event) => {
        setTokenId(event.target.value);
    }

    useEffect(() => {
        handleNftConfig();
        handleCenterGetNftList();
        handleEvalWithdrawFee();

        dispatch(getWithdrawHistoryAddress()).then((res) => {
            if (res.payload?.data?.length > 0) {
                setHistoryAddress(res.payload.data);
            }
        });
    }, []);

    useEffect(() => {
        if (config.networks.length > 0) {
            let tmpNetworks = {};
            config.networks.map((item) => {
                tmpNetworks[item.id] = item;
            });

            setNetworks(tmpNetworks);
        }

    }, [config.networks]);

    useEffect(() => {
        if (nftSelected && nftSelected && nftInner) {
            let tmpNftId = handleGetNftID(nftSelected, networdId);
            if (nftInner[tmpNftId]) {
                setNftSelectedInner(nftInner[tmpNftId]);
                setNftSelectedId(tmpNftId);
                setTokenId(nftInner[tmpNftId][0].tokenId);
            }

        }
    }, [nftSelected, networdId, nftInner]);

    //从大到小排列
    // const sortUseAge = (a, b) => {
    //     return b.dollarFiat - a.dollarFiat;
    // };
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

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {

        }
    }, []);

    return (
        <div>
            <div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-24"
                    style={{ padding: '0 1.5rem 0 1.5rem' }}
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
                                value={nftSelected}
                                onChange={handleChangeNft}
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
                                {Object.keys(nftConfig).length > 0 && Object.keys(nftConfig).map((key) => {
                                    return (
                                        <MenuItem
                                            key={key}
                                            value={key}
                                        >
                                            <div
                                                className="flex items-center py-4 flex-grow"
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
                                                {/*<div style={{ marginLeft: 'auto' }}>*/}
                                                {/*    <div className="px-12 font-medium" style={{ textAlign: 'right' }}>*/}
                                                {/*        <Typography className="text-16 font-medium">{row.balance}</Typography>*/}

                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </div>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
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
                        className="w-full rounded-16 border flex flex-col "
                        style={{ borderRadius: '0.5rem' }}
                        sx={{
                            backgroundColor: '#1E293B',
                            border: 'none'
                        }}
                    >
                        <div className="py-16" style={{ paddingTop: 0 }}>
                            <Typography className="text-16 px-16 my-12 " style={{ marginBottom: '0.5rem', marginTop: "10px" }}>{t('home_withdraw_1')}</Typography>
                            <div className="flex px-16" style={{ flexWrap: 'wrap', paddingLeft: '0.7rem', paddingRight: '0.7rem' }}>
                                {nftConfig[nftSelected] && nftConfig[nftSelected].networks.map((netwotkItem) => {
                                    return (
                                        <div
                                            key={netwotkItem}
                                            // className="flex items-center px-8 rounded-8 border"
                                            className={clsx('flex items-center px-8 rounded-8 border cursor-pointer deposite-token', networdId === netwotkItem && 'active-border')}
                                            onClick={() => {
                                                // setWalletName(item.network);
                                                setNetworkId(netwotkItem);
                                            }}
                                            style={{
                                                // width: '30%',
                                                margin: '.8rem 1%',
                                                paddingLeft: '0.2rem',
                                                paddingRight: '0.2rem',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <img style={{ width: '2rem', borderRadius: '50%' }} src={networks[netwotkItem]?.avatar} alt="" />
                                            <div className="px-12"
                                                style={{
                                                    paddingLeft: '0.4rem',
                                                    paddingRight: '0.4rem'
                                                }}
                                            >
                                                <Typography className={clsx("text-14 font-medium", networdId === netwotkItem && 'color-ffffff')}>{networks[netwotkItem]?.symbol}</Typography>
                                                <Typography className={clsx("text-12 font-medium color-grey", networdId === netwotkItem && 'color-ffffff')}>{networks[netwotkItem]?.network}</Typography>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="px-16">

                                <div className="flex py-16">
                                    <Typography className="text-16 cursor-pointer withdraw-tab-active">{t('home_withdraw_2')} </Typography>
                                </div>
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
                                            placeholder='Recipient Account Name'
                                        />
                                        <div className='paste-btn' onClick={() => {
                                            readClipboardText().then(readText => {
                                                changeAddress('address', readText)
                                            });
                                        }}>Paste</div>
                                    </FormControl>
                                    <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                        <img style={{ width: "24px", height: "24px" }} src="wallet/assets/images/withdraw/info.png" alt="" />
                                    </div>
                                </div>

                                <div className="flex py-16">
                                    <Typography className="text-16 cursor-pointer">{t('home_withdraw_26')} NFT</Typography>
                                </div>
                                <Box
                                    className="w-full rounded-16 border flex flex-col select-fieldset-noborder"
                                    sx={{
                                        backgroundColor: '#151C2A',
                                        border: 'none'
                                    }}
                                >
                                    <FormControl sx={{
                                        m: 1,
                                        minWidth: "100%",
                                        margin: 0,
                                        border: 'none',
                                        borderRadius: '8px!important',
                                        backgroundColor: '#151C2A!important',
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
                                            value={tokenId}
                                            onChange={handleChangeToken}
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
                                            {nftSelectedInner?.length > 0 && nftSelectedInner.map((itemInner) => {
                                                return (
                                                    <MenuItem
                                                        key={itemInner.tokenId}
                                                        value={itemInner.tokenId}
                                                    >
                                                        <div
                                                            className="flex items-center py-4 flex-grow"
                                                            style={{ width: '100%' }}
                                                        >
                                                            <div className="flex items-center">
                                                                <img style={{
                                                                    width: '3rem',
                                                                    borderRadius: '8px'
                                                                }} src={nftConfig[nftSelected]?.avatar} alt="" />
                                                                <div className="px-12 font-medium">
                                                                    <Typography className="text-16 font-medium">{itemInner.tokenId}</Typography>
                                                                </div>
                                                            </div>
                                                            {/*<div style={{ marginLeft: 'auto' }}>*/}
                                                            {/*    <div className="px-12 font-medium" style={{ textAlign: 'right' }}>*/}
                                                            {/*        <Typography className="text-16 font-medium">{row.balance}</Typography>*/}

                                                            {/*    </div>*/}
                                                            {/*</div>*/}
                                                        </div>
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <div className="flex items-center justify-between my-16" style={{ marginTop: "10px" }}>
                                    <Typography className="text-16 cursor-pointer">
                                        {t('home_withdraw_7')}: {fee}  {symbol}
                                    </Typography>
                                    <Typography
                                        className="text-16 cursor-pointer color-2DD4BF"
                                    // onClick={() => {
                                    //     if (!bAppendFee) {
                                    //         setBAppendFee(true);
                                    //         changeAddress('amount', Number(inputVal.amount) + Number(fee));
                                    //     } else {
                                    //         setBAppendFee(false);
                                    //         changeAddress('amount', Number(inputVal.amount) - Number(fee));
                                    //     }
                                    //     evalFee(symbol, networkId, amountTab)
                                    // }}
                                    >
                                        {/* {t('home_withdraw_8')} */}
                                    </Typography>
                                </div>

                                <Box
                                    className="py-8"
                                    sx={{
                                        backgroundColor: '#0F172A',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography className="text-14 px-16">
                                        <span style={{ color: '#FCE100' }}>⚠</span>{t('home_withdraw_15')} {fee} {symbol}  . {t('home_withdraw_16')}. {t('home_withdraw_17')}
                                    </Typography>
                                </Box>

                            </div>
                        </div>

                        {/* 提币动画演示 */}
                        <LoadingButton
                            className={clsx('px-48  m-28 btnColorTitleBig loadingBtnSty')}
                            color="secondary"
                            loading={openLoad}
                            variant="contained"
                            sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                            style={{ width: '24rem', height: '4rem', fontSize: "20px", margin: '1rem auto 2.5rem', display: 'block', lineHeight: "inherit", padding: "0px" }}
                            onClick={() => {
                                // handleSubmit()
                                setTimeout(() => {
                                    setOpenTiBi(true)
                                }, 3000);
                                setOpenLoad(true)
                            }}
                        >
                            {t('home_withdraw_10')}
                        </LoadingButton>



                    </Box>
                </motion.div>

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
                                                <IconButton onClick={() => handleCopyText(item)}>
                                                    <img src="wallet/assets/images/deposite/copy.png" alt="" />
                                                </IconButton>
                                                <IconButton>
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



                {/*提法币界面样式*/}
                <BootstrapDialog
                    onClose={() => { setOpenTiBi(false); }}
                    aria-labelledby="customized-dialog-title"
                    open={openTiBi}
                    className="dialog-container"
                >
                    <DialogContent dividers >
                        <div className='dialog-box' >
                            <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>Transaction
                                <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                                    setOpenTiBi(false)
                                    setOpenLoad(false)
                                }} alt="close icon" />
                            </Typography>
                        </div>
                        <Box className="dialog-content dialog-content-paste-height " style={{ paddingRight: "0px", height: "600px" }}>
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="dialog-content-inner  border-r-5">
                                <motion.div variants={item}>
                                    <img style={{ margin: "0 auto", width: "60px", height: "60px", marginTop: "10px" }} src='wallet/assets/images/wallet/naoZhong.png'></img>
                                </motion.div>
                                <motion.div className='flex justify-content-center' variants={item} style={{ margin: "0 auto", marginTop: "20px", fontSize: "20px", }}>
                                    <img style={{ width: "28px", height: "28px", borderRadius: "5px" }} src='wallet/assets/images/wallet/zt.png'></img>
                                    <div className='ml-12'>BeingFi Genesis Robot</div>
                                </motion.div>
                                <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "10px", fontSize: "16px", color: "#ffc600" }}>● Pending Review</motion.div>
                                <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                    <div style={{ color: "#888B92" }}>NetWork</div>
                                    <div>Ethereum</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                    <div style={{ color: "#888B92" }}>Type</div>
                                    <div>NFTs</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>Address</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>0x4867cf194bf42fd5e446eaf360af380f4094053a</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>ID</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>fe7993aceb3c2cdf9a9186a5cc5</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>Fee</div>
                                    <div>0.0026 ETH</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>Time</div>
                                    <div>2023/6/18 16:40:21</div>
                                </motion.div>
                            </motion.div>
                        </Box>
                    </DialogContent>
                </BootstrapDialog>




            </div>
        </div >
    )
}

export default Nft;
