import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNftConfig, centerGetNftList, getWalletAddress } from "app/store/wallet/walletThunk";
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import FuseLoading from "@fuse/core/FuseLoading";
import { styled } from "@mui/material/styles";
import { getUrlParam } from "../../util/tools/function";
import { getUserData } from "app/store/user/userThunk";
import { showMessage } from "app/store/fuse/messageSlice";
import { useTranslation } from "react-i18next";
import { centerNftPool, getOwner, goCenterTransfer } from "app/store/nft/nftThunk";

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
function NftPool(props) {
    const dispatch = useDispatch();
    const activityId = getUrlParam('activityId');
    const stakeNftId = getUrlParam('nftId');
    const [nftConfig, setNftConfig] = useState({});
    const [nftWallet, setNftWallet] = useState({});
    const [nftBalance, setNftBalance] = useState({});
    const [nftId, setNftId] = useState(stakeNftId);
    const [amount, setAmount] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [openChangeNetwork, setOpenChangeNetwork] = useState(false);
    const [isConfirmTransfer, setIsConfirmTransfer] = useState(false);
    const { t } = useTranslation('mainPage');
    // 切换NFT
    const handleChangeNft = (event) => {
        if (nftConfig[event.target.value]) {
            setNftId(event.target.value);
        }
    };

    // 获取NFT数据
    const getNftConfigData = () => {
        dispatch(getNftConfig()).then(res => {
            let result = res.payload;
            if (result && result.data) {
                let tmpNftConfig = {};
                result.data.map(item => {
                    if (stakeNftId) {
                        if (item.id == stakeNftId) {
                            tmpNftConfig[item.id] = item;
                        }
                    } else {
                        tmpNftConfig[item.id] = item;
                    }

                })
                setNftConfig(tmpNftConfig);
                if (!nftId) {
                    setNftId(tmpNftConfig[Object.keys(tmpNftConfig)[0]].id);
                }
            }
        })
    }

    // 获取用户Nft钱包数据
    const getNftWalletData = () => {
        dispatch(centerGetNftList()).then(res => {
            let result = res.payload;
            if (result) {
                setNftWallet(result.inner);
                let tmpNftBalance = {};
                result.inner.forEach((item) => {
                    if (item.frozen === 0) {
                        if (tmpNftBalance[item.nftId]) {
                            tmpNftBalance[item.nftId] = tmpNftBalance[item.nftId] + 1
                        } else {
                            tmpNftBalance[item.nftId] = 1
                        }
                    }
                })
                setNftBalance(tmpNftBalance);
            }
        })
    }

    // 授权转账
    const doTransfer = (param) => {
        dispatch(getWalletAddress({
            walletName: 'DeFi',
        })).then(res => {
            let result = res.payload;
            if (result) {
                dispatch(goCenterTransfer({
                    toAddress: result.data,
                    tokenId: param.tokenId,
                    nftToken: param.nftToken
                })).then((transferRes) => {
                    let transferResult = transferRes.payload;
                    if (transferResult) {
                        setIsConfirmTransfer(true);
                        console.log(transferResult);
                    }
                })
            }
        })
    }

    // 质押
    const handleSubmit = () => {
        dispatch(centerNftPool({
            activityId: activityId,
            amount: amount,
            pledgeNftId: nftId
        })).then((res) => {
            let result = res.payload;
            if (result) {
                window.parent.postMessage(JSON.stringify({
                    'action': 'closeIframe',
                }), '*')
                console.log(result);
            }
        })
    }


    useEffect(() => {
        dispatch(getUserData());
        getNftConfigData();
        getNftWalletData();
    }, []);

    useEffect(() => {
        if (isConfirmTransfer) {
            let timer = setInterval(() => {
                dispatch(centerGetNftList()).then(res => {
                    let result = res.payload;
                    setNftWallet(result.inner);
                    let tmpNftBalance = {};
                    result.inner.forEach((item) => {
                        if (item.frozen === 0) {
                            if (tmpNftBalance[item.nftId]) {
                                tmpNftBalance[item.nftId] = tmpNftBalance[item.nftId] + 1
                            } else {
                                tmpNftBalance[item.nftId] = 1
                            }
                        }

                        if (item.nftId == nftId && item.tokenId == tokenId) {
                            setOpenChangeNetwork(false);
                            dispatch(showMessage({ message: 'success', code: 1 }));
                            setIsConfirmTransfer(false);
                            clearInterval(timer);
                        }
                    })
                });
            }, 10000);
        }
    }, [isConfirmTransfer]);
    return (
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
                            value={nftId}
                            onChange={handleChangeNft}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="MuiSelect-icon"
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
                <FormControl sx={{ width: '100%', borderColor: '#94A3B8' }} variant="outlined">
                    <OutlinedInput
                        id="outlined-adornment-address send-tips-container-amount"
                        value={amount}
                        error={(parseInt(amount) > parseInt(nftBalance[nftId] || 0)) ? true : false}
                        onChange={(event) => {
                            setAmount(event.target.value);
                            // let changeValue = parseInt(event.target.value || 0);
                            // if (nftBalance[nftId] >= changeValue) {
                            //     setAmount(event.target.value);
                            // }
                        }}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                            'aria-label': 'amount',
                        }}
                        type="number"
                        placeholder={'Please input amount'}
                    />
                </FormControl>

            </motion.div>


            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mb-24"
                style={{ padding: '0 1.5rem 0 1.5rem' }}
            >
                <div className=' flex px-8' style={{ height: "24px", lineHeight: "24px", fontSize: "16px" }} >
                    <div>
                    {t('home_deposite_33')}
                    </div>

                    <div className='ml-8'>
                        {nftBalance[nftId] || 0}
                    </div>

                    <div className='ml-8'>
                        <img width={24} style={{ borderRadius: "6px" }} src={nftConfig[nftId]?.avatar} />
                    </div>
                </div>
            </motion.div>


            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mb-24 optpass"
                style={{ padding: '0 1.5rem 0 1.5rem', justifyContent: "space-between" }}
            >
                <Button
                    className=' text-lg  btnColorTitleBig'
                    color="secondary"
                    variant="contained"
                    sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                    style={{ width: '45%', height: '4rem', display: 'block', fontSize: '2rem', lineHeight: 'initial' }}
                    onClick={() => { setOpenChangeNetwork(true) }}
                >
                   {t('home_deposite_31')}
                </Button>
                <Button
                    className='px-48 text-lg  btnColorTitleBig'
                    color="secondary"
                    variant="contained"
                    sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                    style={{ width: '45%', height: '4rem', display: 'block', fontSize: '2rem', lineHeight: 'initial' }}
                    onClick={() => { handleSubmit() }}
                >
                    {t('home_deposite_32')}
                </Button>
            </motion.div>



            <BootstrapDialog
                onClose={() => {
                    setOpenChangeNetwork(false);
                }}
                aria-labelledby="customized-dialog-title"
                open={openChangeNetwork}
                className="dialog-container "
            >
                <DialogContent dividers className="netWorkDi" style={{ height: "300px" }}>
                    <div className="dialog-box ">
                        <Typography
                            id="customized-dialog-title"
                            className="text-24 px-16 dialog-title-text netWorkTxtWh"
                        >
                            &nbsp;
                            <img
                                src="wallet/assets/images/logo/icon-close.png"
                                className="dialog-close-btn"
                                onClick={() => {
                                    setOpenChangeNetwork(false);
                                }}
                                alt="close icon"
                            />
                        </Typography>

                        <Box className=" dialog-content-select-network-height " style={{ width: "100%", height: "auto" }} >
                            <div style={{ fontSize: "22px" }}>
                                {t('home_deposite_30')}
                            </div>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '100%', margin: "20px auto 40px auto" },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <div>
                                    <TextField
                                        disabled={isConfirmTransfer}
                                        id="outlined-multiline-flexible"
                                        label="Token"
                                        multiline
                                        maxRows={4}
                                        value={tokenId}
                                        onChange={(event) => {
                                            setTokenId(event.target.value);
                                        }}
                                    />
                                </div>
                            </Box>

                            {isConfirmTransfer ? (
                                <FuseLoading />
                            ) : (
                                <Button
                                    className='px-48  text-lg btnColorTitleBig'
                                    color="secondary"
                                    variant="contained"
                                    sx={{ backgroundColor: '#0D9488', color: '#ffffff' }}
                                    style={{ width: '70%', height: '4rem', display: 'block', fontSize: '2rem', margin: "0 auto", lineHeight: 'initial' }}
                                    onClick={() => {
                                        let nftAddress = nftConfig[nftId]?.address
                                        // let nftAddress = '0x1b704281eCbbE12e9ED68931d606a8A5dEAA6B06'
                                        dispatch(getOwner({
                                            nftToken: nftAddress,
                                            tokenId: tokenId
                                        })).then((res) => {
                                            if (res.payload) {
                                                doTransfer({
                                                    tokenId: tokenId,
                                                    nftToken: nftAddress,
                                                });
                                            }
                                        })
                                    }}
                                >
                                    {t('kyc_23')}
                                </Button>
                            )}
                        </Box>
                    </div>
                </DialogContent>
            </BootstrapDialog>



        </div>
    )
}

export default React.memo(NftPool);
