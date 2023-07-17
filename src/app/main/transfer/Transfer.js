import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import '../../../styles/home.css';
import history from '@history';
import Button from "@mui/material/Button";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { goTransfer } from "../../store/transfer/transferThunk";
import {getUserData, automaticConnectWeb3} from "../../store/user/userThunk";
import {getContactAddress, getSymbols} from "../../store/config/configThunk";
import { getUrlParam } from "../../util/tools/function";

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

function Transfer() {
    const dispatch = useDispatch();
    const amount = getUrlParam('amount');
    const symbol = getUrlParam('symbol');
    const address = getUrlParam('address');
    const activatyId = getUrlParam('activatyId');
    const isContract = getUrlParam('isContract');
    const poolName = getUrlParam('poolName');

    // 转账
    const onTransfer = async () => {
        dispatch(goTransfer({
            amount: amount,
            symbol: symbol,
            address: address,
            activatyId: activatyId,
            isContract: isContract,
            poolName: poolName,
        }));

    };

    useEffect(() => {
        dispatch(getUserData()).then(async () => {
            await dispatch(automaticConnectWeb3());
            await dispatch(getSymbols());
            await dispatch(getContactAddress());
            await onTransfer()
        });
    }, []);

    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
            >
                <Box
                    component={motion.div}
                    variants={item}
                >
                    <Button
                        style={{
                            width: '90%',
                            marginLeft: '5%'
                        }}
                        className="px-48 text-lg my-24"
                        color="secondary"
                        variant="contained"
                        sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                        onClick={() => {onTransfer()}}
                    >
                        Transfer
                    </Button>
                </Box>
            </motion.div>

        </div>
    )
}

export default Transfer;
