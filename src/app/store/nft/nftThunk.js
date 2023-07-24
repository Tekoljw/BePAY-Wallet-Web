import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import utils from '../../util/tools/utils'
import BN from "bn.js";
import { showMessage } from 'app/store/fuse/messageSlice';

// 去中心化Mint Nft
export const goMintNft = createAsyncThunk(
  'nft/goMintNft',
  async (settings, { dispatch, getState }) => {

    settings = settings || {};
    const userAddress = settings.userAddress || '';
    const nftToken = settings.nftToken || '';
    var mintGas = settings.mintGas || 0;
    const tokenId = settings.tokenId;

    // Nft 合约
    const nftConstruct = utils.contractAbi('GenesisRobotNftToken');
    const nftConstructObj = await utils.contractAt(nftConstruct, nftToken);

    // 转换金额
    console.log('mintGas......', mintGas)
    mintGas = mintGas * 1000
    mintGas = new BN(10).pow(new BN(15)).mul(new BN(mintGas));

    console.log('mintGas......', mintGas)
    console.log('tokenId......', tokenId)
    try {
      // mint
      const mintRes = await nftConstructObj.mintNFT(tokenId, {
        from: userAddress,
        value: mintGas
      })

      console.log('mintRes ====> ', mintRes);
      dispatch(showMessage({ message: 'Nft Mint Success', code: 1 }));
      return true
    } catch (e) {
      console.log(e.message, 'errorMsg')
      dispatch(showMessage({ message: 'Mint error', code: 2 }));
      return false
    }
  }
);

// 获取Mint NFt配置信息
export const getGenesisRobotConfig = createAsyncThunk(
  'nft/getGenesisRobotConfig',
  async (settings, { dispatch, getState }) => {
    const resultData = await React.$api("nft.getGenesisRobotConfig");

    if (resultData.errno === 0) {
      // dispatch(showMessage({ message: 'success' }));
      return resultData.data;
    } else {
      dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
      return false
    }
  }
);

// 中心化Mint Nft
export const mintGenesisRobot = createAsyncThunk(
  'nft/mintGenesisRobot',
  async (settings, { dispatch, getState }) => {

    const data = {
      nftId: settings?.nftId || '',
      tokenId: settings?.tokenId || 0
    }
    const resultData = await React.$api("nft.mintGenesisRobot", data);

    if (resultData.errno === 0) {
      // dispatch(showMessage({ message: 'success' }));
      return resultData.data;
    } else {
      dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
      return false
    }
  }
);

// 获取中心化NFT Mint状态
export const queryContractResult = createAsyncThunk(
  'nft/queryContractResult',
  async (settings, { dispatch, getState }) => {

    const data = {
      queryId: settings?.queryId || ''
    }
    const resultData = await React.$api("nft.queryContractResult", data);

    if (resultData.errno === 0) {
      return resultData.data || '';
    } else {
      dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
      return false
    }
  }
);

// 中心化Nft质押
export const centerNftPool = createAsyncThunk(
    'nft/centerNftPool',
    async (settings, { dispatch, getState }) => {

        const data = {
            activityId: settings?.activityId || '',
            amount: settings?.amount || 0,
            pledgeNftId: settings?.pledgeNftId || '',
        }
        const resultData = await React.$api("activity.participate", data);

        if (resultData.errno === 0) {
            dispatch(showMessage({ message: 'Success', code: 1 }));
            return resultData.data || '';
        } else {
            dispatch(showMessage({ message: resultData.errmsg, code: 2 }));
            return false
        }
    }
);

// 获取nft所有者
export const getOwner = createAsyncThunk(
    'nft/getOwner',

    async (settings, { dispatch, getState }) => {
        const nftToken = settings.nftToken || '';
        const tokenId = settings.tokenId;
        const { user } = getState();

        // Nft 合约
        const nftConstruct = utils.contractAbi('GenesisRobotNftToken');
        const nftConstructObj = await utils.contractAt(nftConstruct, nftToken);
        console.log(nftConstructObj);

        try {
            const owner = (await nftConstructObj.ownerOf(tokenId)).toUpperCase();

            // console.log(owner,'owner.....................');

            let currentUserAddress = user.profile.user.address.toUpperCase();

            if (currentUserAddress === owner) {
                return true
            } else {
                dispatch(showMessage({ message: 'Not the owner of this nft', code: 2 }));
                return false
            }
        } catch (e) {
            console.log(e.message, 'errorMsg')
            dispatch(showMessage({ message: 'Owner error', code: 2 }));
            return false
        }
    }
);

// nft授权转账
export const goCenterTransfer = createAsyncThunk(
    'nft/goCenterTransfer',
    async (settings, { dispatch, getState }) => {
        const { user } = getState();
        const userAddress = user.profile.user.address;
        const nftToken = settings.nftToken || '';
        const toAddress = settings.toAddress || '';
        const tokenId = parseInt(settings.tokenId);

        // Nft 合约
        const nftConstruct = utils.contractAbi('GenesisRobotNftToken');
        const nftConstructObj = await utils.contractAt(nftConstruct, nftToken);

        try {
            const safeTransferFromObj = await nftConstructObj.safeTransferFrom(userAddress, toAddress, tokenId, {
                from: userAddress
            });
            if (safeTransferFromObj.tx) {
                dispatch(showMessage({ message: 'wait......', code: 3 }));
                return safeTransferFromObj.tx
            }
        } catch (e) {
            console.log(e.message, 'errorMsg')
            dispatch(showMessage({ message: 'transfer error', code: 2 }));
            return false
        }
    }
);
