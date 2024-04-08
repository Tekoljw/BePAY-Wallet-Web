import { useState, useEffect } from 'react';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useDispatch, useSelector} from "react-redux";
import {
    centerGetTokenBalanceList, getUserData
} from '../../store/user/userThunk';
import StyledAccordionSelect from '../../components/StyledAccordionSelect';
import Wallet from '../wallet/Wallet'
import {getContactAddress, getSymbols, paymentConfig} from "../../store/config/configThunk";
import {getBorrowConfig} from "../../store/borrow/borrowThunk";
import {getPoolConfig} from "../../store/pool/poolThunk";
import {centerGetUserFiat, getWithdrawTransferStats} from "../../store/wallet/walletThunk";
import MobileDetect from "../home/Home";
import {selectUserData} from "../../store/user";
import {selectConfig} from "../../store/config";
import web3 from "../../util/web3";
import {arrayLookup} from "../../util/tools/function";
import { showMessage } from 'app/store/fuse/messageSlice';
import {requestUserLoginData} from "../../util/tools/loginFunction";




function AccountPage(props) {
    const dispatch = useDispatch();
    const userData = useSelector(selectUserData);
    const config = useSelector(selectConfig);
    const networks = config.networks || [];
    useEffect(() => {
        let userBindWallet = userData.userInfo.bindWallet ?? false;
        if (userBindWallet) {
            web3.getChainId().then((res) => {
                if (networks.length > 0 && res) {
                    let tmpNetworkId = arrayLookup(networks, 'chainId', res, 'id');
                    // if (!tmpNetworkId) {
                    //     dispatch(showMessage({ message: t('error_3'), code: 2 }));
                    // }
                }

                if (window.ethereum) {
                    window.ethereum.on("chainChanged", (chainId) => {
                        let network = chainId.toString();
                        let tmpNetworkId = arrayLookup(networks, 'chainId', network, 'id');
                        // if (networks.length > 0 && !tmpNetworkId) {
                        //     dispatch(showMessage({ message: t('error_3'), code: 2 }));
                        // }
                    });
                }
            })
        }
    }, [config.networks]);

    useEffect(() => {
        requestUserLoginData();
    }, []);
    return (
        <Wallet />
    );
}


export default AccountPage;
