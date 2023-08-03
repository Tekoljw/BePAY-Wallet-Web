import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import "../../../styles/home.css";
import history from "@history";

import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";

import utils from "../../util/tools/utils";

import { selectUserData } from "../../store/user";
import { darkTheme, SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
//导入钱包ethereun
import coinbaseWallet from "../../util/web3/coinbase";
import WalletConnectProvider from "@walletconnect/web3-provider";
import SwapLogin from "../login/SwapLogin";


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

function UniSwapPage() {
  const state = history.location.state;

  const userData = useSelector(selectUserData);
  // const regWallet = userData.profile?.user?.regWallet;
  const regWallet = localStorage?.getItem('walletname')

  const dispatch = useDispatch();
  const config = useSelector(selectConfig);

  // 依赖模块
  // npm i --save @uniswap/widgets
  // npm i --save @walletconnect/ethereum-provider
  // https://docs.uniswap.org/sdk/widgets/swap-widget

  const [provider, setProvider] = useState({});
  const [isInit, setIsInit] = useState(false);

  const[jsonRpcUrlMap,setjsonRpc] = useState('');

  // const getWeb3Provider =  () => {
  //     if (state && state.provider) {
  //         return state.provider;
  //     }
  //     var initCoinbase =  coinbaseWallet.initCoinbase();
  //     // 根据regWallet更改对接的ethereum
  //     switch (regWallet) {
  //         case 'metamask':
  //             return window.ethereum;
  //             break;
  //         case 'coinbase':
  //             var initCoinbase =  coinbaseWallet.initCoinbase();
  //             return initCoinbase;
  //             break;
  //     }

  // };


  const getCoinbaseProvider = async () => {
    var initCoinbase = await coinbaseWallet.initCoinbase();
    setProvider(initCoinbase);
    setIsInit(true);
  };
  const getTrustWalletProvide = async () => {
    var initTrustWallet = new WalletConnectProvider({
      rpc: {
        1: "https://mainnet.mycustomnode.com",
        // ...
      },
    });
    // await provider.enable();
    setProvider(initTrustWallet);
    setIsInit(true);
  };

  useEffect(() => {


     let  res =    window.localStorage.getItem("walletname");

    console.log(res);

    if (res === "metamask"){

      setIsInit(true);
    }else {
      setIsInit(false)
    }


    
    // let metamask = new Web3(window.ethereum);

  //  console.log(window.ethereum.getBlockNumber);
    //  console.log(metamask);


    // switch (regWallet) {
    //   case "metamask":
    //     setProvider(window.ethereum);
    //     // setProvider(metamask);
    //     setIsInit(true);
    //     break;
    //   case "coinbase":
    //     getCoinbaseProvider();
    //     break;
    //   case "trustWallet":
    //     getTrustWalletProvide();
    //     break;
    //   case "BitKeep":
    //     // setProvider(window.bitkeep && window.bitkeep.ethereum);
    //     setProvider(metamask);
    //     // setProvider(bitkeep);
    //     // setProvider(metamask)
    //     setIsInit(true);
    //     // setjsonRpc(bitkeep.rpc.rpcUrl);

    //     break;
    // }


  }, [regWallet]);

  return (
    <div>
      {/*head*/}
      <motion.div variants={container} initial="hidden" animate="show">
        {isInit && (
          <Box component={motion.div} variants={item}>
            <div className="Uniswap">

              <SwapWidget width="100%" theme={darkTheme}  />
              
            </div>

          </Box>
        )}

        {
          !isInit && (
            <Box component={motion.div} variants={item}>
           
                <SwapLogin />

          </Box>
          )
        }
      </motion.div>
    </div>
  );
}

export default React.memo(UniSwapPage);
