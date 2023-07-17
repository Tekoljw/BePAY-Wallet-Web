import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {useState, useEffect} from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import {useDispatch} from "react-redux";
import { sendTransactionBgt } from "../../store/transfer/transferThunk";
import { getUserData } from "../../store/user/userThunk";

export default function TransferBgt() {
    const dispatch = useDispatch();
    const [ inputVal, setInputVal ] = useState({
        address: '',
        amount: 0.00
    });

    const handleChangeInputVal= (prop, value) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
    };

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    const onSubmit = () => {
        dispatch(sendTransactionBgt({
            amount: inputVal.amount,
            symbol: 'BGT',
            address: inputVal.address
        }))
    };

    return (
        <div>
            <Typography className="text-16 m-12 cursor-pointer">Amount</Typography>
            <FormControl className="m-12" sx={{ width: '70%', borderColor: '#94A3B8' }} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-address"
                    value={inputVal.amount}
                    onChange={handleChangeInputVal('amount')}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'amount',
                    }}
                />
            </FormControl>

            <Typography className="text-16 m-12 cursor-pointer">Address</Typography>
            <FormControl className="m-12" sx={{ width: '70%', borderColor: '#94A3B8' }} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-address"
                    value={inputVal.address}
                    onChange={handleChangeInputVal('address')}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'address',
                    }}
                />
            </FormControl>
            <div></div>

            <Button
                className="px-48 text-lg m-12"
                color="secondary"
                variant="contained"
                sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                onClick={() => {onSubmit()}}
            >
                Submit
            </Button>

        </div>
    );
}
