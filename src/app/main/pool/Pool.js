import { useState } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import history from '@history';
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";
import { selectUserData } from "../../store/user";
import { takeBackPoolToken, goPoolToken, getPoolOrderList } from "../../store/pool/poolThunk";

import '../../../styles/home.css';
import Typography from "@mui/material/Typography";
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from "react-i18next";
import ComingSoon from "../coming-soon/ComingSoon";

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

function Pool() {
    const { t } = useTranslation('mainPage');
    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const userData = useSelector(selectUserData);
    const [selectPool, setSelectPool] = useState(0);
    const networkId = userData.userInfo.networkId;
    const poolConfig = config.poolConfig[networkId + '-' + config.poolType]?.config;

    const [inputVal, setInputVal] = useState({
        // amount: 0
    });
    const handleChangeInputVal = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };
    const directPoolToken = async (request) => {
        dispatch(goPoolToken({
            poolId: request.poolId,
            amount: request.amount
        }))
    };
    const onTakeBackPool = async (request) => {
        const orderList = await dispatch(getPoolOrderList({
            poolId: request.poolId,
            txStatus: 2,
            page: 1,
            limit: 5,
        }));
        if (orderList.payload.records.length > 0) {
            let res = await dispatch(takeBackPoolToken({
                orderId: orderList.payload.records[0].id
            }));

            console.log(res)
        }
    };
    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{ paddingTop: "1.5rem" }}
            >
                {poolConfig?.length > 0 && poolConfig.map((row, index) => {
                    return (
                        <Box
                            key={index}
                            className={
                                clsx("w-full rounded-16 border flex flex-col p-16 cursor-pointer my-12", selectPool === index && 'active-border')
                            }
                            component={motion.div}
                            variants={item}
                            sx={{
                                backgroundColor: '#1E293B',
                                border: 'none'
                            }}
                            onClick={() => { setSelectPool(index) }}
                        >
                            <div className="flex justify-between">
                                <Typography className="font-medium text-20">
                                    {row.calculator.config.name} {t('home_pools_14')}
                                </Typography>
                                <Typography className="font-medium text-20" style={{ color: '#16aa90' }}>
                                    {t('home_pools_1')}  {row.calculator.config.targetSymbol}
                                </Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography className="text-16">
                                    {t('home_pools_2')}: {row.calculator.getMyRevenueYearRate()}%
                                    {t('home_pools_3')}: {(row.calculator.config.lockTime / 86400).toFixed(1)}d
                                </Typography>
                                <Typography className="text-16" style={{ color: '#ffffff' }}>
                                    {t('home_pools_4')} {row.calculator.config.sourceSymbol}
                                </Typography>
                            </div>
                            <div className="w-full my-20" style={{ marginBottom: '0.5rem' }}>
                                <div className="flex justify-between my-8">
                                    <Typography className="text-16">{t('home_pools_5')}</Typography>
                                    <div className='border-bottom-fit'></div>
                                    <Typography className="text-16">
                                        <span className="text-18" style={{ color: '#16aa90' }}>{row.calculator.config.mineBalance}</span> {row.calculator.config.mineSymbol}
                                    </Typography>
                                </div>
                                <div className="flex justify-between my-8">
                                    <Typography className="text-16">{t('home_pools_6')}</Typography>
                                    <div className='border-bottom-fit'></div>
                                    <Typography className="text-16">
                                        <span className="text-18" style={{ color: '#16aa90' }}>{row.calculator.getMyStake()}</span> {row.calculator.config.mineSymbol}
                                    </Typography>
                                </div>
                                <div className="flex justify-between my-8">
                                    <Typography className="text-16">{t('home_pools_7')}</Typography>
                                    <div className='border-bottom-fit'></div>
                                    <Typography className="text-16">
                                        <span className="text-18" style={{ color: '#16aa90' }}>{row.calculator.getMyRevenue()}</span> {row.calculator.config.targetSymbol}
                                    </Typography>
                                </div>
                                <div className="flex justify-between my-8">
                                    <Typography className="text-16">{t('home_pools_8')}</Typography>
                                    {
                                        row.calculator.getLeftTime() ? <div className='border-bottom-fit'></div> : ''
                                    }
                                    <Typography className="text-18" style={{ color: '#16aa90' }}>
                                        {row.calculator.getLeftTime()}
                                    </Typography>
                                </div>
                            </div>
                            <div className="w-full flex">
                                <Typography className="font-medium text-14" style={{ color: '#76819B', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#ffffff' }}>{t('home_pools_9')}</span>
                                    : {t('home_pools_10')}</Typography>
                            </div>
                            <div className="w-full flex">
                                <FuseSvgIcon className="list-item-icon" sx={{ color: "#2DD4BF" }}>
                                    material-twotone:launch
                                </FuseSvgIcon>
                                <Typography className="font-medium text-14 color-2DD4BF">{t('home_pools_11')}</Typography>
                            </div>

                            <div className="flex justify-between mt-16">
                                {row.calculator.hasStake() && <Button
                                    size="large"
                                    color="secondary"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        color: '#ffffff',
                                        margin: '0 2rem',
                                        borderRadius: '8px',
                                        border: '1px solid #797979'
                                    }}
                                    onClick={() => {
                                        onTakeBackPool({
                                            poolId: row.calculator.config.id,
                                        })
                                    }}
                                >
                                    {t('home_pools_12')}
                                </Button>}
                                {row.calculator.hasStake() === false && <>
                                    {/* <FormControl sx={{ flex: '1', borderColor: '#94A3B8' }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-address"
                                            value={inputVal['amount' + row.id]}
                                            onChange={handleChangeInputVal('amount' + row.id)}
                                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'address',
                                            }}
                                            type="number"
                                        />
                                    </FormControl> */}
                                    <Button
                                        size="large"
                                        color="secondary"
                                        variant="contained"
                                        // sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 2rem', borderRadius: '8px' }}
                                        sx={{ backgroundColor: '#374252', color: '#ffffff' }}
                                        style={{ width: '16rem', height: '3.6rem', fontSize: '2rem', lineHeight: 'initial' }}
                                        onClick={() => {
                                            directPoolToken({
                                                poolId: row.calculator.config.id,
                                                amount: inputVal['amount' + row.id]
                                            })
                                        }}
                                    >
                                        {t('home_pools_15')}
                                    </Button>
                                    <Button
                                        size="large"
                                        color="secondary"
                                        variant="contained"
                                        // sx={{ backgroundColor: '#0D9488', color: '#ffffff', margin: '0 2rem', borderRadius: '8px' }}
                                        style={{ width: '16rem', height: '3.6rem', fontSize: '2rem', lineHeight: 'initial' }}
                                        sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                        className="btnColorTitleBig"
                                        onClick={() => {
                                            directPoolToken({
                                                poolId: row.calculator.config.id,
                                                amount: inputVal['amount' + row.id]
                                            })
                                        }}
                                    >
                                        {t('home_pools_12')}
                                    </Button>
                                </>}
                            </div>
                            <div className="flex justify-content-center my-8">
                                <Typography className="font-medium text-14" style={{ color: '#FF9900', marginTop: '0.8rem' }}>
                                    {(row.calculator.config.earlyTakeout * 100)}% {t('home_pools_13')} {(row.calculator.config.lockTime / 86400).toFixed(1)}d
                                </Typography>
                            </div>
                        </Box>
                    )
                })}
                <ComingSoon />
            </motion.div>
        </div>
    )
}

export default Pool;
