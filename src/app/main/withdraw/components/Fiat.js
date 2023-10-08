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
import { makeWithdrawOrder, getFiatFee, payoutBank } from "../../../store/payment/paymentThunk";
import BN from "bn.js";
import StyledAccordionSelect from "../../../components/StyledAccordionSelect";
import { selectConfig } from "../../../store/config";
import { arrayLookup, getNowTime } from "../../../util/tools/function";
import { openScan, closeScan } from "../../../util/tools/scanqrcode";
import { getWithDrawConfig, WalletConfigDefineMap, evalTokenTransferFee, getWithdrawHistoryAddress, getWithdrawTransferStats } from "app/store/wallet/walletThunk";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import OtpPass from "../../otpPass/OtpPass";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import { getCryptoDisplay, getFiatDisplay } from "../../../store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';
import MobileDetect from 'mobile-detect';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";

import InputLabel from '@mui/material/InputLabel';

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

function Fiat(props) {
    const { t } = useTranslation('mainPage');
    const [openTiBi, setOpenTiBi] = useState(false);
    const [withdrawOrderID, setWithdrawOrderID] = useState('');
    const [openLoad, setOpenLoad] = useState(false);
    const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
    const dispatch = useDispatch();
    const [inputVal, setInputVal] = useState({
        bankName: '',
        cardName: '',
        pixId: '',
        cardNo: '',
        amount: '',
    });

    const handleChangeInputVal = (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };
    const changeAllInput = (value) => {
        let tmpInputVal = { ...inputVal, ...value };
        setInputVal(tmpInputVal);
    };
    const [historyAddress, setHistoryAddress] = useState([]);
    const [openWithdrawLog, setOpenWithdrawLog] = useState(false);
    const config = useSelector(selectConfig);
    const mounted = useRef();

    const [accountType, setAccountType] = useState('CPF');

    const handleChangeAccountType = (event) => {
        setAccountType(event.target.value);
    };

    const getEntryType = (currencyCode) => {
        var result = bankList[currencyCode][entryType].bankCode;

        return result
    }

    const handleSubmit = () => {
        let data = {
            amount: inputVal.amount,
            bankName: inputVal.bankName,
            accountType,
            identityInfo: inputVal.cardNo,
            accountOwnerName: inputVal.cardName,
            accountNo: inputVal.pixId,
            currency: currencyCode,
            entryType: getEntryType(currencyCode)
        };
        setOpenLoad(true)
        dispatch(makeWithdrawOrder(data)).then((res) => {
            let result = res.payload;
            if (result === false || result.status == 'failed') {
                dispatch(showMessage({ message: result.msg || 'error', code: 2 }));
                setOpenLoad(false)
            } else {
                setOpenTiBi(true)
                setWithdrawOrderID(result.outTradeNo);
                dispatch(showMessage({ message: 'success', code: 1 }));
            }
        });
    };



    useEffect(() => {
        dispatch(getListBank()).then((res) => {
            let result = res.payload;
            if (result) {
                setHistoryAddress(result);
            }
        });
    }, []);



    const userData = useSelector(selectUserData);
    const fiatData = userData.fiat || [];
    const paymentFiat = config.payment?.currency;
    const [fiatDisplayData, setFiatDisplayData] = useState([]);
    const [fiats, setFiats] = useState([]);
    const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || 'USD');
    const [fee, setFee] = useState(0);
    const [fiatsSelected, setFiatsSelected] = useState(0);
    const [ entryType, setEntryType ] = useState(0);
    const [ bankList, setBankList ] = useState({});
    // select切换
    const handleChangeFiats = (event) => {
        setFiatsSelected(event.target.value);
        setCurrencyCode(fiats[event.target.value].currencyCode);
    };

    const handleChangeEntryType = (event) => {
        setEntryType(event.target.value);
    };

    const getBankList = () => {
        dispatch(payoutBank()).then((res) => {
            let result = res.payload
            if (result) {
                let tmpBank = {}
                result.map((item) => {
                    if (tmpBank[item.currency]) {
                        tmpBank[item.currency].push(item)
                    } else {
                        tmpBank[item.currency] = [item]
                    }
                })
                setBankList(tmpBank)
            }
        })
    }

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


    const fiatsFormatAmount = () => {
        if (fiatData.length === 0 || !paymentFiat) {
            return
        }
        let tmpFiatDisplayData = {};
        let tmpPaymentFiat = {};
        let tmpFiatsData = {};
        let tmpFiats = [];
        let displayFiatData = [];
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
        fiatData?.map((item, index) => {
            tmpFiatsData[item.currencyCode] = item;
        });

        displayFiatData.forEach((item) => {
            // var tmpShow = arrayLookup(fiatDisplayData, 'name', item, 'show');
            var tmpShow = tmpFiatDisplayData[item]?.show;
            if (tmpShow === '' || tmpShow === null || tmpShow === undefined) {
                // tmpShow = arrayLookup(paymentFiat, 'currencyCode', item, 'userShow');
                tmpShow = tmpPaymentFiat[item]?.userShow;
            }

            if (tmpShow === true && !arrayLookup(tmpFiats, 'currencyCode', item, 'currencyCode')) {
                // let balance = arrayLookup(fiatsData, 'currencyCode', item, 'balance') || 0;
                let balance = tmpFiatsData[item]?.balance || 0;
                tmpFiats.push({
                    avatar: tmpPaymentFiat[item]?.avatar || '',
                    currencyCode: item,
                    balance: balance.toFixed(2),
                    dollarFiat: (balance == 0) ? 0 : balance / tmpPaymentFiat[item]?.exchangeRate
                })
            }
        });

        tmpFiats.sort(sortUseAge);
        setFiats(tmpFiats);
        setCurrencyCode(tmpFiats[0].currencyCode)
    };

    const tidyWalletData = () => {
        fiatsFormatAmount();
    };

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            tidyWalletData();
        }
    }, [fiatData, fiatDisplayData]);

    useEffect(() => {
        dispatch(getFiatDisplay()).then((res) => {
            let result = res.payload;
            setFiatDisplayData(result?.data);
        });
        getBankList()
    }, []);

    useEffect(() => {
        if (inputVal.amount > 0) {
            dispatch(getFiatFee({
                currency: currencyCode,
                wayCode: '',
                amount: inputVal.amount
            })).then((res) => {
                let result = res.payload;
                setFee(result)
            })
        }

    }, [inputVal.amount, currencyCode])

    const [percentage, setPercentage] = useState('');
    const handleClick = (index) => {
        setPercentage(index)
    };

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
                                value={fiatsSelected}
                                onChange={handleChangeFiats}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className="MuiSelect-icon "
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
                                {fiats.length > 0 && fiats.map((row, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={index}
                                        >
                                            <div
                                                className="flex items-center py-4 flex-grow"
                                                style={{ width: '100%' }}
                                            >
                                                <div className="flex items-center">
                                                    <img style={{
                                                        width: '3rem',
                                                        borderRadius: '8px'
                                                    }} src={row.avatar} alt="" />
                                                    <div className="px-12 font-medium">
                                                        <Typography className="text-16 font-medium">{row.currencyCode}</Typography>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <div className="px-12 font-medium" style={{ textAlign: 'right' }}>
                                                        <Typography className="text-16 font-medium">{row.balance}</Typography>

                                                    </div>
                                                </div>
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
                            <div className="px-16">
                                {
                                    (currencyCode !== "BRL" && currencyCode !== "IDR") && <div>
                                        <div className="flex" style={{ padding: "16px 16px 16px 0px" }} >
                                            <Typography className="text-16 ">{t('home_withdraw_18')} </Typography>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputVal.bankName}
                                                    onChange={handleChangeInputVal('bankName')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'bankName',
                                                    }}
                                                    placeholder={t('home_withdraw_19')}
                                                />
                                            </FormControl>
                                            <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                                <img style={{ width: "24px", height: "24px" }} src="assets/images/withdraw/info.png" alt="" />
                                            </div>
                                        </div>

                                        <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                            <Typography className="text-16 ">{t('home_withdraw_20')} </Typography>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputVal.cardName}
                                                    onChange={handleChangeInputVal('cardName')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'cardName',
                                                    }}
                                                    placeholder={t('home_withdraw_21')}
                                                />
                                            </FormControl>
                                            <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                                <img style={{ width: "24px", height: "24px" }} src="assets/images/withdraw/info.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {currencyCode === 'IDR' && <div>
                                    <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                        <Typography className="text-16 ">{t('home_withdraw_22')}</Typography>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                            <OutlinedInput
                                                id="outlined-adornment-address send-tips-container-address"
                                                value={inputVal.pixId}
                                                onChange={handleChangeInputVal('pixId')}
                                                aria-describedby="outlined-weight-helper-text"
                                                inputProps={{
                                                    'aria-label': 'pixId',
                                                }}
                                                placeholder={t('home_withdraw_27')}
                                            />
                                        </FormControl>

                                        <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                            <img style={{ width: "24px", height: "24px" }} src="assets/images/withdraw/info.png" alt="" />
                                        </div>
                                    </div>

                                </div>}

                                {bankList[currencyCode]?.length > 0 && <>
                                    <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                        <Typography className="text-16 ">{t('home_withdraw_28')}</Typography>
                                    </div>
                                    <div>
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
                                                value={entryType}
                                                onChange={handleChangeEntryType}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                className="MuiSelect-icon "
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
                                                {bankList[currencyCode]?.length > 0 && bankList[currencyCode].map((row, index) => {
                                                    return (
                                                        <MenuItem
                                                            key={index}
                                                            value={index}
                                                        >
                                                            <div
                                                                className="flex items-center py-4 flex-grow"
                                                                style={{ width: '100%' }}
                                                            >
                                                                <Typography className="text-16 font-medium">{row.bankName}</Typography>
                                                            </div>
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>

                                </>}

                                {
                                    (currencyCode == "BRL") && <div>
                                        <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                            <Typography className="text-16 ">{t('home_withdraw_27')}</Typography>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputVal.pixId}
                                                    onChange={handleChangeInputVal('pixId')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'pixId',
                                                    }}
                                                    placeholder={t('home_withdraw_27')}
                                                />
                                            </FormControl>

                                            <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                                <img style={{ width: "24px", height: "24px" }} src="assets/images/withdraw/info.png" alt="" />
                                            </div>
                                        </div>

                                        <div className="flex " style={{ padding: "16px 16px 16px 0px" }} >
                                            <Typography className="text-16 ">{t('home_withdraw_28')}</Typography>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FormControl className='' sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8', backgroundColor: "#151C2A" }} variant="outlined">
                                                <InputLabel id="demo-simple-select-label">CPF</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={accountType}
                                                    label="CPF"
                                                    onChange={handleChangeAccountType}
                                                >
                                                    <MenuItem value={"CPF"}>CPF</MenuItem>
                                                    <MenuItem value={"CNPJ"}>CNPJ</MenuItem>
                                                    <MenuItem value={"PHONE"}>PHONE</MenuItem>
                                                    <MenuItem value={"EMAIL"}>EMAIL</MenuItem>
                                                </Select>

                                            </FormControl>
                                        </div>

                                        <div className="flex" style={{ padding: "16px 16px 16px 0px" }} >
                                            <Typography className="text-16 ">{t('home_withdraw_29')} </Typography>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <FormControl sx={{ width: isMobileMedia ? '77%' : '89%', borderColor: '#94A3B8' }} variant="outlined">
                                                <OutlinedInput
                                                    id="outlined-adornment-address send-tips-container-address"
                                                    value={inputVal.cardNo}
                                                    onChange={handleChangeInputVal('cardNo')}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'cardNo',
                                                    }}
                                                    placeholder={t('home_withdraw_29')}
                                                />
                                                <div className='paste-btn' onClick={() => {

                                                }}>{t('home_withdraw_11')}</div>
                                            </FormControl>
                                            <div onClick={() => { setOpenWithdrawLog(true) }} className="flex items-center justify-content-center cursor-pointer">
                                                <img style={{ width: "24px", height: "24px" }} src="assets/images/withdraw/info.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                }





                                <Typography className="text-16  mt-16 " style={{ width: "89%", display: "flex", justifyContent: " space-between" }}>
                                    <span>{t('home_withdraw_3')} </span>
                                    <span>
                                        <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 1 && 'colro-12C1A2')} onClick={() => { handleClick(1) }}>25%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 2 && 'colro-12C1A2')} onClick={() => { handleClick(2) }} style={{ marginLeft: "16px" }}>50%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 3 && 'colro-12C1A2')} onClick={() => { handleClick(3) }} style={{ marginLeft: "16px" }}>75%</span> <span className={clsx("cursor-pointer text-14  txtColorTitle", percentage === 4 && 'colro-12C1A2')} onClick={() => { handleClick(4) }} style={{ marginLeft: "16px" }}>100%</span>
                                    </span>
                                </Typography>

                                <div className="flex items-center py-16 justify-between" style={{ marginRight: '-1rem' }}>
                                    <FormControl sx={{ width: '87%', borderColor: '#94A3B8' }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-address send-tips-container-amount"
                                            value={inputVal.amount}
                                            onChange={handleChangeInputVal('amount')}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            type="number"
                                        />
                                    </FormControl>
                                </div>


                                <Box
                                    className="py-8"
                                    sx={{
                                        backgroundColor: '#0F172A',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography className="text-14 px-16">
                                        <span style={{ color: '#FCE100' }}>⚠</span>{t('home_withdraw_15')} {fee} {currencyCode} . {t('home_withdraw_16')}. {t('home_withdraw_17')}
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
                                handleSubmit()
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
                                <img src="assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => { setOpenWithdrawLog(false) }} alt="close icon" />
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
                                            <div className='dialog-item' key={item.id} style={{ margin: "10px auto" }}>
                                                <Typography className="text-14 px-16 dialog-withdraw-text"
                                                    onClick={() => {
                                                        setOpenWithdrawLog(false);

                                                        changeAllInput({
                                                            bankName: item.bankName,
                                                            cardName: item.cardName,
                                                            cardNo: item.cardNo,
                                                        });
                                                    }}
                                                >
                                                    {item.cardNo}
                                                </Typography>
                                                <IconButton>
                                                    <img src="assets/images/deposite/delete.png" alt="" />
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
                            <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('home_Transaction')}
                                <img src="assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
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
                                    <img style={{ margin: "0 auto", width: "60px", height: "60px", marginTop: "10px" }} src='assets/images/wallet/naoZhong.png'></img>
                                </motion.div>
                                <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "20px", fontSize: "24px" }}>-{inputVal.amount} {currencyCode}</motion.div>
                                <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "10px", fontSize: "16px", color: "#ffc600" }}>● {t('home_PendingReview')}</motion.div>
                                <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                    <div style={{ color: "#888B92" }}>{t('home_Bank')}</div>
                                    <div>{inputVal.bankName}</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-40' >
                                    <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                                    <div>Fiat</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>{t('home_Name')}</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.cardName}</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>{t('home_withdraw_14')}</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{inputVal.cardNo}</div>
                                </motion.div>

                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                                    <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{withdrawOrderID}</div>
                                </motion.div>

                                {/* <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                        <div style={{ color: "#888B92" }}>Fee</div>
                                        <div>0.8 USDT</div>
                                    </motion.div> */}
                                <motion.div variants={item} className='flex justify-content-space px-20 mt-28' >
                                    <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                                    <div>{getNowTime()}</div>
                                </motion.div>
                            </motion.div>
                        </Box>
                    </DialogContent>
                </BootstrapDialog>




            </div>
        </div >
    )
}

export default Fiat;
