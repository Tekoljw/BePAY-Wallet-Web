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
import { getUserCreditCard } from "app/store/payment/paymentThunk";

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

    // public static final int CONST_LOG_TYPE_DEPOSIT                = 1;
    // public static final int CONST_LOG_TYPE_POOL_TAKE_OUT            = 2;
    // // deductUserBalance => CONST_LOG_TYPE_SYS_DEDUCT
    // public static final int CONST_LOG_TYPE_SYS_DEDUCT              = 3;
    // // awardCoinByAdmin => CONST_LOG_TYPE_ADMIN_AWARD
    // public static final int CONST_LOG_TYPE_ADMIN_AWARD              = 4;
    // public static final int CONST_LOG_TYPE_BORROW_PAYBACK            = 5;
    // public static final int CONST_LOG_TYPE_SEND_TIPS              = 6;
    // public static final int CONST_LOG_TYPE_FIAT_BUY                = 7;
    // public static final int CONST_LOG_TYPE_CRYPTO_SELL              = 8;
    // public static final int CONST_LOG_TYPE_CRYPTO_SWAP              = 9;
    // public static final int CONST_LOG_TYPE_ADMIN_WITHDRAW            = 10;
    // public static final int CONST_LOG_TYPE_HASH_GAME_BET            = 11;
    // public static final int CONST_LOG_TYPE_USER_WITHDRAW            = 12;
    //
    // public static final int CONST_LOG_TYPE_VOLUNTEER_DIRECT_ACTIVE        = 13;
    // public static final int CONST_LOG_TYPE_VOLUNTEER_RELEASE_ACTIVE        = 14;
    // public static final int CONST_LOG_TYPE_VOLUNTEER_USE_TASK_CODE        = 15;
    // public static final int CONST_LOG_TYPE_TRANSFER_TO_GAME            = 16;
    // public static final int CONST_LOG_TYPE_TRANSFER_FROM_GAME          = 17;

    const typeList = [
        { id: 0, label: t('home_record_0') },
        { id: 1, label: t('home_record_1') },
        // { id: 2, label: 'Pool' },
        // { id: 3, label: 'Service charge' },
        // { id: 4, label: 'Change' },
        // { id: 5, label: 'Borrow' },
        { id: 6, label: t('home_record_6') },
        // { id: 7, label: 'Fiat Buy' },
        { id: 8, label: t('home_record_14') },
        { id: 9, label: 'Swap' },
        // { id: 10, label: 'Admin Withdraw' },
        // { id: 11, label: 'Hash Game Bet' },
        { id: 12, label: t('home_record_15') },
        { id: 13, label: t('home_record_16') },
        { id: 14, label: t('home_record_17') },
        { id: 15, label: t('home_record_18') },
        // { id: 16, label: 'TRANSFER_TO_GAME' },
        // { id: 17, label: 'TRANSFER_FROM_GAME' },
        { id: 18, label: t('menu_18')},
    ];

    const [timeItem, setTimeItem] = React.useState( new Date().getMonth() +1 );
    const [kaPianItem, setKaPianItem] = React.useState(0);
    const [selectCardID, setSelectCardID] = React.useState(0);


    const [isLoading, setIsLoading] = React.useState(true);
    const columns = [
        { field: 'type', label: t('home_record_19'), minWidth: 100, align: 'left', format: (value) => { return typeList.find(v => { return v.id == value }).label } },
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
                setCardList(tmpCardList)
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
                limit: rowsPerPage
            })).then((res) => {
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
        handleTransferRecord()
    }, [type, timeItem]);

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

    return (
        <div>
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
                    {typeList.map((typeRow) => {
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
                        {typeList.map((item) => {
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

            {selectCardID === 18 && <motion.div
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
                        <MenuItem value={0} className='text-16'>{t('card_169')}</MenuItem>
                            {cardList && cardList[2].map((item) => {
                                return (
                                    <MenuItem value={item.userCreditKey} className='text-16'>{item.userCreditNo}<span style={{ color: "#94A3B8", marginLeft: "1rem" }}>VISA</span></MenuItem>
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
                                                <div className='recordListZi'>{typeList.find(v => {
                                                    return v.id == (transferItem.type)
                                                }).label}</div>
                                                <div className='recordListZi ml-10'>{transferItem.symbol}</div>
                                            </div>
                                            <div className='recordListZi2'>{transferItem.amount}</div>
                                        </div>
                                        <div className='recordListSmallZi'>{t('home_deposite_24')} <span>{transferItem.balance}</span>
                                        </div>
                                        <div
                                            className='recordListSmallZi'>{getNowTime(transferItem.createTime * 1000)}</div>
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
    )
}

export default Record;
