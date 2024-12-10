import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import '../../../styles/home.css';
import Typography from "@mui/material/Typography";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import history from "@history";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { transferRecords } from '../../store/user/userThunk';
import { selectUserData } from '../../store/user';
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { borderRadius } from '@mui/system';
import { setPhoneTab, getNowTime } from "../../util/tools/function";
import FuseLoading from "@fuse/core/FuseLoading";
import { getUserCreditCard, getCreditConfig } from "app/store/payment/paymentThunk";

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

function Record() {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const [type, setType] = useState(0);
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [transferList, setTransferList] = useState([]);
    const [cardList, setCardList] = useState([]);
    const [cardConfig, setCardConfig] = useState({ 2: [], 3: [] })
    const [cardConfigList, setCardConfigList] = useState({});

    // 日志类型
    // public static final int LOG_TYPE_MCH_ASSETS_USER_FIAT_CHANGE = 0;    //商户和用户之间法币资产转换
    // public static final int LOG_TYPE_MCH_ASSETS_USER_CRYPTO_CHANGE = 1;  //商户和用户之间虚拟币资产转换
    // public static final int LOG_TYPE_ASSETS_FIAT_DEPOSIT = 2;       //法币资产入金
    // public static final int LOG_TYPE_ASSETS_FIAT_WITHDRAW = 3;      //法币资产出金
    // public static final int LOG_TYPE_ASSETS_CRYPTO_DEPOSIT = 4;     //虚拟币资产入金
    // public static final int LOG_TYPE_ASSETS_CRYPTO_WITHDRAW = 5;    //虚拟币资产出金
    // public static final int LOG_TYPE_CREDIT_FIAT_DEPOSIT = 6;       //法币信用卡入金
    // public static final int LOG_TYPE_CREDIT_FIAT_WITHDRAW = 7;      //法币信用卡出金
    // public static final int LOG_TYPE_CREDIT_CRYPTO_DEPOSIT = 8;     //虚拟币信用卡入金
    // public static final int LOG_TYPE_CREDIT_CRYPTO_WITHDRAW = 9;    //虚拟币信用卡出金
    // public static final int LOG_TYPE_CREDIT_SWAP_FIAT_FIAT = 10;     //兑换法币-法币
    // public static final int LOG_TYPE_CREDIT_SWAP_FIAT_CRYPTO = 11;   //兑换法币-虚拟币
    // public static final int LOG_TYPE_CREDIT_SWAP_CRYPTO_FIAT = 12;  //兑换虚拟币-法币
    // public static final int LOG_TYPE_CREDIT_SWAP_CRYPTO_CRYPTO = 13;//兑换虚拟币-虚拟币
    // public static final int LOG_TYPE_CREDIT_APPLY_CRYPTO_FEE = 14;  //申请信用卡费用
    // public static final int LOG_TYPE_CREDIT_CONSUME_FIAT = 15;      //信用卡消费法币
    // public static final int LOG_TYPE_CREDIT_CONSUME_CRYPTO = 16;    //信用卡消费虚拟币
    // public static final int LOG_TYPE_CREDIT_YEAR_FEE = 17;          //信用卡年费
    // public static final int LOG_TYPE_ASSETS_TRANSFER_FIAT_INNER = 18;  //法币内部转账
    // public static final int LOG_TYPE_ASSETS_TRANSFER_CRYPTO_INNER = 19;//虚拟币内部转账
    // public static final int LOG_TYPE_ASSETS_NFT_DEPOSIT = 20;       //存入NFT
    // public static final int LOG_TYPE_ASSETS_NFT_WITHDRAW = 21;      //取出NFT
    // public static final int LOG_TYPE_CREDIT_SERVICE_FEE = 22;      //信用卡服务手续费
    // public static final int LOG_TYPE_CREDIT_FIAT_FROZEN = 23;  //信用卡法币冻结金额
    // public static final int LOG_TYPE_CREDIT_FIAT_UN_FROZEN = 24;
    // public static final int LOG_TYPE_CREDIT_CRYPTO_FROZEN = 25;
    // public static final int LOG_TYPE_CREDIT_CRYPTO_UN_FROZEN = 26;
    // public static final int LOG_TYPE_CREDIT_FINE_AMOUNT = 27;
    // public static final int LOG_TYPE_CREDIT_REVERSAL_FIAT = 28;
    // public static final int LOG_TYPE_CREDIT_REVERSAL_CRYPTO = 29;
    // public static final int LOG_TYPE_CREDIT_REFUND_FIAT = 30;
    // public static final int LOG_TYPE_CREDIT_REFUND_CRYPTO = 31;
    // public static final int LOG_TYPE_ASSETS_FIAT_INVITE_REWARD= 32;     //邀请法币奖励
    // public static final int LOG_TYPE_ASSETS_CRYPTO_INVITE_REWARD = 33;  //邀请虚拟币奖励
    // public static final int LOG_TYPE_ASSETS_ACTIVITY_FIAT = 34; //活动奖励法币
    // public static final int LOG_TYPE_ASSETS_ACTIVITY_CRYPTO = 35; //活动奖励虚拟币
    // public static final int LOG_TYPE_ASSETS_FIAT_FROZEN = 38; // 法币资产冻结
    // public static final int LOG_TYPE_ASSETS_CRYPTO_FROZEN = 39; // 虚拟币资产冻结
    // public static final int LOG_TYPE_ASSETS_FIAT_UN_FROZEN_SUCCESS = 40; // 法币资产解冻(提现成功)
    // public static final int LOG_TYPE_ASSETS_CRYPTO_UN_FROZEN_SUCCESS = 41; // 虚拟币资产解冻(提现成功)
    // public static final int LOG_TYPE_ASSETS_FIAT_UN_FROZEN_FAIL = 42; // 法币资产解冻(提现失败)
    // public static final int LOG_TYPE_ASSETS_CRYPTO_UN_FROZEN_FAIL = 43; // 虚拟币资产解冻(提现失败)
    // public static final int LOG_TYPE_ASSETS_NO_EXIST = 1000;      //不存在的类型

    const typeList = [
        { key: 0, label: t('recordInfo_0')},
        { key: 1, label: t('recordInfo_1')},
        { key: 2, label: t('recordInfo_2')},
        { key: 3, label: t('recordInfo_3')},
        { key: 4, label: t('recordInfo_4')},
        { key: 5, label: t('recordInfo_5')},
        { key: 6, label: t('recordInfo_6')},
        { key: 7, label: t('recordInfo_7')},
        { key: 8, label: t('recordInfo_8')},
        { key: 9, label: t('recordInfo_9')},
        { key: 10, label: t('recordInfo_10')},
        { key: 11, label: t('recordInfo_11')},
        { key: 12, label: t('recordInfo_12')},
        { key: 13, label: t('recordInfo_13')},
        { key: 14, label: t('recordInfo_14')},
        { key: 15, label: t('recordInfo_15')},
        { key: 16, label: t('recordInfo_16')},
        { key: 17, label: t('recordInfo_17')},
        { key: 18, label: t('recordInfo_18')},
        { key: 19, label: t('recordInfo_19')},
        { key: 20, label: t('recordInfo_20')},
        { key: 21, label: t('recordInfo_21')},
        { key: 22, label: t('recordInfo_22')},
        { key: 23, label: t('recordInfo_23')},
        { key: 24, label: t('recordInfo_24')},
        { key: 25, label: t('recordInfo_25')},
        { key: 26, label: t('recordInfo_26')},
        { key: 27, label: t('recordInfo_27')},
        { key: 28, label: t('recordInfo_28')},
        { key: 29, label: t('recordInfo_29')},
        { key: 30, label: t('recordInfo_30')},
        { key: 31, label: t('recordInfo_31')},
        { key: 32, label: t('recordInfo_32')},
        { key: 33, label: t('recordInfo_33')},
        { key: 34, label: t('recordInfo_34')},
        { key: 35, label: t('recordInfo_35')},
        { key: 38, label: t('card_262')},
        { key: 39, label: t('card_262')},
        { key: 40, label: t('card_263')},
        { key: 41, label: t('card_263')},
        { key: 42, label: t('card_264')},
        { key: 43, label: t('card_264')},
    ]

    const showTypeList = [
        { id: 0, label: t('home_record_0') },
        { id: 1, label: t('home_record_1') },
        // { id: 2, label: 'Pool' },
        // { id: 3, label: 'Service charge' },
        // { id: 4, label: 'Change' },
        // { id: 5, label: 'Borrow' },
        { id: 3, label: t('home_record_6') },
        // { id: 7, label: 'Fiat Buy' },
        { id: 6, label: t('home_record_14') },
        { id: 4, label: 'Swap' },
        // { id: 10, label: 'Admin Withdraw' },
        // { id: 11, label: 'Hash Game Bet' },
        { id: 2, label: t('home_record_15') },
        // { id: 7, label: t('home_record_16') },
        // { id: 8, label: t('home_record_17') },
        // { id: 9, label: t('home_record_18') },
        // { id: 16, label: 'TRANSFER_TO_GAME' },
        // { id: 17, label: 'TRANSFER_FROM_GAME' },
        { id: 5, label: t('menu_18') },
        { id: 10, label: t('home_record_20') },
        { id: 11, label: t('home_record_21') },
    ];

    const [timeItem, setTimeItem] = React.useState(new Date().getMonth() + 1);
    const [kaPianItem, setKaPianItem] = React.useState(0);
    const [selectCardID, setSelectCardID] = React.useState(0);
    const freezeBalanceTypes = [38, 39, 40, 41, 42, 43]


    const [isLoading, setIsLoading] = React.useState(true);
    const columns = [
        { field: 'type', label: t('home_record_19'), minWidth: 100, align: 'left', format: (value) => { return showTypeList.find(v => { return v.id == value }).label } },
        { field: 'symbol', label: t('home_record_8'), minWidth: 100, align: 'center' },
        { field: 'balance', label: t('home_record_9'), minWidth: 100, align: 'center', format: (value) => value.toFixed(4), },
        { field: 'amount', label: t('home_record_10'), minWidth: 100, align: 'center', format: (value) => value.toFixed(4), },
        { field: 'createTime', label: t('home_record_11'), minWidth: 100, align: 'right', format: (value) => formatDistanceToNow(new Date(value * 1000), { addSuffix: true }), },
    ];
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(transferRecords({
            logType: type,
            page: newPage,
            limit: rowsPerPage
        }));
    };

    const changePhoneTab = (tab) => {
        window.localStorage.setItem('phoneTab', tab);
    }

    //获取Config
    const getCardConfig = () => {
        dispatch(getCreditConfig()).then((res) => {
            let result = res.payload
            if (result) {
                let tmpConfig = { 2: [], 3: [] }
                let tmpConfigList = {}
                result.map((item) => {
                    if (item.state === 1) {
                        if (item.creditType === 2) {
                            tmpConfig[2].push(item)
                        } else if (item.creditType === 3) {
                            tmpConfig[3].push(item)
                        }

                        tmpConfigList[item.configId] = item
                    }
                })
                setCardConfig(tmpConfig)
                setCardConfigList(tmpConfigList)
            }
        })
    }

    // 获取卡列表
    const getCardList = () => {
        dispatch(getUserCreditCard()).then((res) => {
            let result = res.payload
            let tmpCardList = { 2: [], 3: [] }
            let tmpCardListObj = {}
            if (result) {
                result.map((item) => {
                    if (item.creditType === 2) {
                        tmpCardList[2].push(item)
                    } else if (item.creditType === 3) {
                        tmpCardList[3].push(item)
                    }
                    tmpCardListObj[item.id] = item
                })
                setCardList([...tmpCardList[2], ...tmpCardList[3]])
                // setCardListObj(tmpCardListObj)
                console.log(tmpCardList, "tmpCardList")
            }
        })
    }

    const handleTransferRecord = (pageParam) => {
        if (type || type === 0) {
            setIsLoading(true)
            dispatch(transferRecords({
                logType: type,
                month: timeItem,
                page: pageParam ?? page,
                limit: rowsPerPage,
                userCreditNo: kaPianItem == 0 ? null : kaPianItem,
            })).then((res) => {
                setLoadingShow(false)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)

                let result = res.payload
                if (result?.records?.length > 0) {
                    setTransferList([...transferList, ...result?.records])
                    setPage(result.current)

                    if (result.current === result.pages) {
                        setMoreBtnShow(false)
                    } else {
                        setMoreBtnShow(true)
                    }
                }
            })
        }
    }

    useEffect(() => {
        getCardList();
        setPhoneTab('record');
    }, []);


    useEffect(() => {
        setLoadingShow(true)
        handleTransferRecord()
    }, [type, timeItem, kaPianItem]);

    const [moreBtnShow, setMoreBtnShow] = React.useState(false);

    const handleChange = (event) => {
        setMoreBtnShow(false)
        setPage(0);
        setTransferList([]);
        setType(event.target.value);
        setSelectCardID(event.target.value)
    };

    const handleChange2 = (event) => {
        setMoreBtnShow(false)
        setPage(0);
        setTransferList([]);
        setTimeItem(event.target.value);
    };

    const handleChange3 = (event) => {
        setMoreBtnShow(false)
        setPage(0);
        setTransferList([]);
        setKaPianItem(event.target.value);
    };

    const fanHuiFunc = () => {
        if (window.localStorage.getItem('backBtn') === "card") {
            changePhoneTab('card');
            history.push('/wallet/home/card')
        } else {
            changePhoneTab('wallet');
            history.push('/wallet/home/wallet')
        }
    }


    const [loadingShow, setLoadingShow] = useState(false);

    return (
        <div>
            <div className='flex mb-2 mt-10' onClick={() => {
                fanHuiFunc();
            }}   >
                <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
            </div>

            {/* <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-24 pb-24"
                style={{marginBottom: '0', paddingBottom: '0'}}
            >
                <Box
                    className="w-full rounded-16 border flex color-76819B"
                    sx={{
                        backgroundColor: '#151c2a',
                        border: 'none',
                        overflowX: 'scroll'
                    }}
                    style={{
                        marginBottom: '0',
                        paddingBottom: '0',
                        border: 'none',
                        overflow: 'auto',
                        borderBottomLeftRadius: '0',
                        borderBottomRightRadius: '0'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    {showTypeList.map((typeRow) => {
                        return (
                            <Typography key={typeRow.id} className={clsx('text-16 px-16 my-16 cursor-pointer font-medium txtColorTitleSmall text-nowrap', type === typeRow.id && 'record-type-active')} onClick={() => {setType(typeRow.id)}}>{typeRow.label}</Typography>
                        )
                    })}
                </Box>

                <Box
                    className="w-full rounded-16 border flex flex-col color-76819B my-24"
                    style={{marginTop: '0', marginBottom: '0'}}
                    sx={{
                        backgroundColor: '#1E293B',
                        border: 'none'
                    }}
                    component={motion.div}
                    variants={item}
                >
                    <Paper sx={{ width: '100%' }} style={{ backgroundColor: '#1E293B'}}>
                        <TableContainer sx={{ height: transferList?.records?.length !== 0 ? 'calc(100vh - 16.3rem)' : '0' }}>
                            <Table aria-label="sticky table" style={{ backgroundColor: '#1E293B'}}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={column.field}
                                                align={column.align}
                                                style={{ color: '#6f7a94', padding: '1rem 0', borderBottomColor: '#151c2a', backgroundColor: '#1E293B', paddingLeft: index === 0 ? '1rem' : '0', paddingRight: index === columns.length-1 ? '1rem' : '0' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(transferList?.records ?? [])
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.field];
                                                        return (
                                                            <TableCell key={column.field} align={column.align}
                                                                style={{ backgroundColor: '#1E293B', color: '#FFFFF', fontSize: '14px', padding: '4px 5px', border: 'none' }}
                                                            >
                                                                {column.format ? column.format(value) : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {transferList?.records?.length === 0 && <div className="mt-12 no-data-container " style={{height: 'calc(100vh - 24rem)'}}>
                            <img className='noDataImg' src='wallet/assets/images/logo/xc.png'></img>
                            <div className='noDataImgTxt text-22'>{t('home_record_12')}</div></div>}
                    </Paper>
                </Box>
            </motion.div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={transferList?.total ?? 0}
                rowsPerPage={rowsPerPage}
                style={{color: '#6f7a94', padding: '0 2.4rem'}}
                className='table-pagination-container table-page-pl'
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}


            {!loadingShow &&
                <div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="select-fieldset-noborder recordPx  flex justify-between"
                    >
                        <FormControl sx={{
                            m: 1,
                            width: "58%",
                            margin: 0,
                            border: 'none',
                            borderRadius: '10px!important',
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
                                value={type}
                                onChange={handleChange}
                                displayEmpty
                                className="MuiSelect-icon recordSelectHeight"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 450,
                                            border: 'none'
                                        },
                                    },
                                }}
                            >
                                {showTypeList.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.id} className='text-16'>{item.label}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={{
                            m: 1,
                            width: "38%",
                            margin: 0,
                            border: 'none',
                            borderRadius: '10px!important',
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
                                value={timeItem}
                                onChange={handleChange2}
                                displayEmpty
                                className="MuiSelect-icon recordSelectHeight"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 600,
                                            border: 'none'
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={1} className='text-16'>{t('card_140')}</MenuItem>
                                <MenuItem value={2} className='text-16'>{t('card_141')}</MenuItem>
                                <MenuItem value={3} className='text-16'>{t('card_142')}</MenuItem>
                                <MenuItem value={4} className='text-16'>{t('card_143')}</MenuItem>
                                <MenuItem value={5} className='text-16'>{t('card_144')}</MenuItem>
                                <MenuItem value={6} className='text-16'>{t('card_145')}</MenuItem>
                                <MenuItem value={7} className='text-16'>{t('card_146')}</MenuItem>
                                <MenuItem value={8} className='text-16'>{t('card_147')}</MenuItem>
                                <MenuItem value={9} className='text-16'>{t('card_148')}</MenuItem>
                                <MenuItem value={10} className='text-16'>{t('card_149')}</MenuItem>
                                <MenuItem value={11} className='text-16'>{t('card_150')}</MenuItem>
                                <MenuItem value={12} className='text-16'>{t('card_151')}</MenuItem>
                            </Select>
                        </FormControl>
                    </motion.div>
                    {selectCardID === 5 && <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="select-fieldset-noborder recordPx  flex justify-between"
                    >
                        <FormControl sx={{
                            m: 1,
                            width: "100%",
                            margin: 0,
                            border: 'none',
                            borderRadius: '10px!important',
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
                                value={kaPianItem}
                                onChange={handleChange3}
                                displayEmpty
                                className="recordSelectHeight"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 600,
                                            overflow: "hidden",
                                            border: 'none',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={0} className='text-16'>{t('home_record_0')}</MenuItem>
                                {cardList && cardList.map((item) => {
                                    return (
                                        <MenuItem value={item.userCreditNo} className='text-16' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span> {item.userCreditNo} </span>
                                            <span style={{ color: "#94A3B8", marginLeft: "1rem" }}>{cardConfigList[item.creditConfigId]?.cardOrganizations == 'visa' ? 'VISA' : 'MASTER'} </span>
                                        </MenuItem>
                                    )
                                })}
                                {/* <MenuItem value={1} className='text-16'>{t('card_169')}</MenuItem>
                    <MenuItem value={2} className='text-16'>6584 2458 7848 7542<span style={{ color: "#94A3B8", marginLeft: "1rem" }}>VISA</span></MenuItem>
                    <MenuItem value={3} className='text-16'>3354 6857 9584 8848<span style={{ color: "#94A3B8", marginLeft: "1rem" }}>MASTER</span></MenuItem> */}
                            </Select>
                        </FormControl>
                    </motion.div>
                    }
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className=""
                    >
                        <Box
                            className="flex flex-col color-76819B recordW"
                            component={motion.div}
                            variants={item}
                        >
                            {/* <Paper sx={{ width: '100%' }} style={{ backgroundColor: '#1E293B' }}>
                    <TableContainer sx={{ height: transferList?.records?.length !== 0 ? 'calc(100vh - 22rem)' : '0' }}>
                        <Table aria-label="sticky table" style={{ backgroundColor: '#1E293B' }}>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={column.field}
                                            align={column.align}
                                            style={{ color: '#6f7a94', padding: '1rem 0', borderBottomColor: '#151c2a', backgroundColor: '#1E293B', paddingLeft: index === 0 ? '1rem' : '0', paddingRight: index === columns.length - 1 ? '1rem' : '0' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(transferList?.records ?? [])
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    const value = row[column.field];
                                                    return (
                                                        <TableCell key={column.field} align={column.align}
                                                            style={{ backgroundColor: '#1E293B', color: '#FFFFF', fontSize: '14px', padding: '4px 5px', border: 'none' }}
                                                        >
                                                            {column.format ? column.format(value) : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {transferList?.records?.length === 0 && <div className="mt-12 no-data-container" style={{ height: 'calc(100vh - 24rem)' }}>
                        <img className='noDataImg' src='wallet/assets/images/logo/xc.png'></img>
                        <div className='noDataImgTxt text-22'>{t('home_record_12')}</div></div>}
                </Paper> */}

                            {isLoading ? (
                                <div className='flex' style={{ height: "85vh" }}>
                                    <FuseLoading />
                                </div>
                            ) : (
                                <div className='px-12'
                                    style={{ width: '100%', borderRadius: "1rem", backgroundColor: '#1E293B' }}>

                                    {transferList?.length > 0 ? (transferList?.map((transferItem, index) => {
                                        return (
                                            <div key={transferItem.id ?? index} className='py-10'
                                                style={{ borderBottom: index != (transferList.length - 1) ? "solid 1px #33435d" : '' }}>
                                                <div className='flex justify-between '>
                                                    <div className='flex'>
                                                        <div className='recordListZi'>{showTypeList.find(v => {
                                                            return v.id == (transferItem.showType)
                                                        })?.label}</div>
                                                        {showTypeList.find(v => {
                                                            return v.id == (transferItem.showType)
                                                        }) ?
                                                            <div className="recordListZi ml-10">{transferItem.symbol}</div> :
                                                            <div className="recordListZi">{transferItem.symbol}</div>
                                                        }
                                                    </div>
                                                    <div className='recordListZi2'>{transferItem.amount}</div>
                                                </div>
                                                <div className='recordListSmallZi'>{ freezeBalanceTypes.indexOf(transferItem.type) > -1 ? t('card_265') : t('home_deposite_24')} <span>{transferItem.balance}</span>
                                                </div>
                                                <div className='recordListSmallZi'>{t('home_borrow_18')} <span>{transferItem.serviceFee}</span>
                                                </div>
                                                <div className='recordListSmallZi'>{
                                                    typeList.find(v => {
                                                        return v.key == (transferItem.type)
                                                    })?.label
                                                }
                                                </div>
                                                <div
                                                    className='recordListSmallZi'>{getNowTime(transferItem.createTime)}</div>
                                            </div>
                                        )
                                    })) : (
                                        <div className="mt-12 no-data-container" style={{ height: 'calc(100vh - 24rem)' }}>
                                            <img className='noDataImg' src='wallet/assets/images/logo/xc.png'></img>
                                            <div className='noDataImgTxt text-22'>{t('home_record_12')}</div>
                                        </div>
                                    )}

                                    {
                                        moreBtnShow && <LoadingButton
                                            disabled={false}
                                            className='px-48 btnColorTitleBig loadingBtnSty recordMoreBtn'
                                            color="secondary"
                                            loading={false}
                                            variant="contained"
                                            onClick={() => {
                                                handleTransferRecord(page + 1)
                                            }}
                                        >
                                            {t('card_169')}
                                        </LoadingButton>
                                    }
                                </div>
                            )}

                        </Box>

                    </motion.div>
                </div>
            }
            {
                loadingShow &&
                <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
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

export default Record;
