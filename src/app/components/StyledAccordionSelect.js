import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from "react-redux";
import { selectConfig } from "../store/config";
import { selectUserData } from '../store/user';
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { arrayLookup } from "../util/tools/function";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as _ from 'lodash'

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
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

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function StyledAccordionSelect(props) {
    const currencyCode = props.currencyCode ?? '';
    const symbol = props.symbol ?? [];
    const isSetAmount = props.isSetAmount ?? false;
    const isExpand = props.expand ?? false;
    const formControlSx = props.formControlSx ?? {};
    const config = useSelector(selectConfig);
    const userConfig = useSelector(selectUserData);
    const [selected, setSelected] = useState(0);
    const [inputVal, setInputVal] = useState({
        amount: 0.00000000
    });

    if (symbol.length === 0) {
        return <></>
    }
    const [symbolName, setSymbolName] = useState(arrayLookup(config.symbols, 'symbol', symbol[selected]?.symbol, 'name'));
    const [expanded, setExpanded] = useState(isExpand);
    const [rateArr, setRateArr] = useState([]);

    const toggleAccordion = (panel) => (event, _expanded) => {
        setExpanded(_expanded ? panel : false);
    };

    const handleChangeInputVal = (prop) => (event) => {
        setInputVal({ ...inputVal, [prop]: event.target.value });
        if (isSetAmount && props.setAmount) {
            props.setAmount(event.target.value)
        }
    };
    const currenyBalance = (currentSymbol, currentBalance) => {
        const symbolRate = arrayLookup(config.symbols, 'symbol', currentSymbol, 'sellRate');
        const currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'sellRate');
        return currencyCode + ' ' + (currentBalance * (symbolRate * currencyRate)).toFixed(2)
    };

    const currenyPaytoken = (currentSymbol, currentBalance) => {
        const symbolRate = _.get(_.find(rateArr, {key: currentSymbol }), 'rate', 0);
        const currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'sellRate');
        return (currentBalance * symbolRate).toFixed(2)
    };

    const assembleRateChange = () => {
        const symbolArrRate = _.map(config.symbols, ( symbol )=> { return { key: symbol.symbol, rate: symbol.sellRate} });
        const fiatArrRate = _.map(userConfig.fiat, (fa)=> { return {key: fa.currencyCode, rate: (1/fa.sellRate).toFixed(20)}});
        setRateArr([...symbolArrRate, ...fiatArrRate]);
    }


    useEffect(() => {
        if (!Array.isArray(symbol)) {
            throw new Error('symbol is not an Array')
        }
        if (symbol.length === 0) {
            throw new Error('invalid parameter \'symbol\'')
        }
    }, []);
    useEffect(() => {
        if (props.setSymbol) {
            props.setSymbol(symbol[selected]?.symbol || '');
        }
        if (props.setAmount) {
            props.setAmount(symbol[selected]?.balance || 0);
        }
        // console.log(symbol);
        assembleRateChange();
        setSymbolName(arrayLookup(config.symbols, 'symbol', symbol[selected]?.symbol, 'name'));


    }, [selected, symbol]);


    const handleChange = (event) => {
        setSelected(event.target.value);
    };
    // function remove(symbol,item){
    //     var newarr = [];
    //     for(var i=0;i<symbol.length;i++){
    //         if(arr[i] != item){
    //             newarr.push(symbol[i]);
    //         }
    //     }
    //     return newarr;
    // }
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="select-fieldset-noborder"
        >
            <FormControl sx={{
                m: 1,
                minWidth: "100%",
                margin: 0,
                border: 'none',
                borderRadius: '8px!important',
                backgroundColor: '#1E293B',
                '&:before': {
                    display: 'none',
                },
                '&:first-of-type': {},
                '&:last-of-type': {
                    marginBottom: 0,
                },
                ...formControlSx
            }}
            >
                <Select
                    value={selected}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    className="MuiSelect-icon BtcHeight"
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
                    {symbol.map((row, index) => {
                        return (

                            <MenuItem
                                key={index}
                                value={index}
                            >
                                <div
                                    key={index}
                                    className="flex items-center py-4 flex-grow"
                                    style={{ width: '100%' }}
                                >
                                    <div className="flex items-center">
                                        <img style={{
                                            width: '3rem',
                                            borderRadius: '50%'
                                        }} src={row.avatar} alt="" />
                                        <div className="px-12 font-medium">
                                            <Typography className="text-16 font-medium">{row.symbol}</Typography>
                                            <Typography className="text-14" style={{ color: '#94A3B8' }}>{ currencyCode }</Typography>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <div className="px-12 font-medium" style={{ textAlign: 'right' }}>
                                            <Typography className="text-16 font-medium">{Number(row.balance) ? Number(row.balance): '0.00'}</Typography>
                                            {currencyCode && <Typography className="text-14" style={{ color: '#94A3B8' }}>{currenyPaytoken(row.symbol, row.balance)}</Typography>}

                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            {/*
            <StyledAccordion
                component={motion.div}
                variants={item}
                classes={{
                    root: 'FaqPage-panel shadow',
                }}
                expanded={expanded === true}
                onChange={toggleAccordion(true)}
            >
                <AccordionSummary
                    expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}
                >
                    <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}>
                        <div className="flex items-center">
                            <img style={{
                                width: '3rem'
                            }} src={arrayLookup(config.symbols, 'symbol', symbol[selected].symbol, 'avatar')} alt=""/>
                            <div className="px-12 font-medium">
                                <Typography className="text-16 font-medium">{symbol[selected].symbol}</Typography>
                                <Typography className="text-12" style={{color: '#94A3B8'}}>{symbolName}</Typography>
                            </div>
                        </div>
                        <div style={{marginLeft: 'auto'}}>
                            <div className="px-12 font-medium" style={{textAlign: 'right'}}>
                                <Typography className="text-16 font-medium">{symbol[selected].balance}</Typography>
                                {currencyCode && <Typography className="text-12" style={{color: '#94A3B8'}}>{currenyBalance()}</Typography>}

                            </div>
                        </div>
                    </div>
                </AccordionSummary>

                <AccordionDetails>
                    {isSetAmount && <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined" className="mb-12">
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            value={inputVal.amount}
                            onChange={handleChangeInputVal('amount')}
                            // endAdornment={<InputAdornment position="end">Max</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'amount',
                            }}
                            type="number"
                        />
                    </FormControl>}
                    <div
                        style={{
                            flexWrap: 'wrap',
                        }}
                        className='flex items-center justify-between'
                    >
                        {symbol.map((row, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        width: '30%',
                                        margin: '.8rem 1.5%',
                                        textAlign: 'center',
                                        border: '1px solid #2DD4BF',
                                        borderRadius: '8px'
                                    }}
                                    className="my-8 cursor-pointer"
                                    onClick={() => setSelected(index)}
                                >
                                    <Typography className="text-16 font-medium">{row.symbol}</Typography>
                                    <Typography className="text-12" style={{color: '#94A3B8'}}>{row.balance}</Typography>
                                </div>
                            )
                        })}
                    </div>

                </AccordionDetails>
            </StyledAccordion>
            */}
        </motion.div>
    )
}

export default StyledAccordionSelect;
