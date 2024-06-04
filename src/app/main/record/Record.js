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
import {useTranslation} from "react-i18next";
import {setPhoneTab} from "../../util/tools/function";

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
    const [type, setType] = useState(1);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [ transferList, setTransferList ] = useState([]);

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
        { id: 13, label: t('home_record_16')  },
        { id: 14, label: t('home_record_17')  },
        { id: 15, label: t('home_record_18')  },
        // { id: 16, label: 'TRANSFER_TO_GAME' },
        // { id: 17, label: 'TRANSFER_FROM_GAME' },
    ];
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
        dispatch(transferRecords({
            logType: type,
            page: 0,
            limit: event.target.value
        }));
    };

    useEffect(() => {
        setPhoneTab('record');
    }, []);

    useEffect( () => {
        if (type) {
            dispatch(transferRecords({
                logType: type,
                page: page,
                limit: rowsPerPage
            })).then((res) => {
                setTransferList(res.payload)
            })
        }
    }, [type]);

    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-24 pb-24"
                style={{marginBottom: '0', paddingBottom: '0'}}
            >
                {/*1*/}
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
                // SelectProps={
                //     IconComponent: <FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>
                // }
            />
        </div>
    )
}

export default Record;
