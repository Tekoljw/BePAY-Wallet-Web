import React from "react";
import Web3 from "web3";
import coinbaseWallet from "./coinbase.js";
import trustProvider from "../../util/web3/trustwallet";
import { useSelector } from "react-redux";
import { selectUserData } from "app/store/user";
import { getTrustWalletInjectedProvider } from "./trustwallet.js";
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ChargingStationRounded } from "@mui/icons-material";

import { EthereumProvider } from '@walletconnect/ethereum-provider';





const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

  
const connectWeb3 = async (name) => {
  var error = "";
  var injectedProvider = "";
  var connected = "";
  var accounts = "";
  var networkId = "";
  //   var chainId =''
  if (name === "metamask") {
    if (window.ethereum.isMetaMask) {
      try {
        // const isMetaMask = (ethereum) => {
        //     // Identify if Trust Wallet injected provider is present.
        //     const MetaMask = !!ethereum.isMetaMask;
        //     return MetaMask;
        //   };
        // const getMetaEther = () =>{
        //     if (isMetaMask(window.ethereum)) {
        //     return window.ethereum;
        //   }
        // }
        // const window.ethereum = await getMetaEther();
        if (window.ethereum._state && !window.ethereum._state.initialized) {
          location.reload();
          return { error: "ethereum is uninitialized" };
        }
        var t = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (!t) {
          error = "MetaMask enable Error";
          return { error };
        }
        var web3 = new Web3(window.ethereum);

        // console.log(web3);
        
        window.wallet = web3;

        let networkId = await promisify((cb) => web3.eth.getChainId(cb));

        var coinbase = await promisify((cb) => web3.eth.getCoinbase(cb));
        // window.ethereum.once("accountsChanged", this.accountsChanged);
        window.ethereum.on("chainChanged", () => {
          // console.log(111111)
        });

        // window.ethereum.on("disconnect", this.disconnect);
        let walletType = "metamask";
        // console.log(networkId, coinbase);
        return { networkId, coinbase, walletType };
      } catch (e) {
        error = e.message;
      }
    } else {
      error = "MetaMask not Install";
    }
    return { error };
  }
  
  else if (name === "Coinbase") {
    // console.log('11111111111')
    try {
      // let coinbaseInit = await coinbaseWallet.initCoinbase();
      // let web3 = new Web3(coinbaseInit);
      // window.wallet = web3;
      // var networkId = await promisify((cb) => web3.eth.getChainId(cb));
      // // var address = await promisify((cb) => web3.eth.getCoinbase(cb));
      // // var networkId = 1;
      // var address = await coinbaseInit.request({
      //   method: "eth_requestAccounts",
      // });
      // let walletType = "coinbase";
      // return { networkId, coinbase: address[0], walletType };
      if (window.ethereum._state && !window.ethereum._state.initialized) {
        location.reload();
        return { error: "ethereum is uninitialized" };
      }
      var t = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!t) {
        error = "MetaMask enable Error";
        return { error };
      }
      var web3 = new Web3(window.ethereum);
      window.wallet = web3;

      let networkId = await promisify((cb) => web3.eth.getChainId(cb));
      var coinbase = await promisify((cb) => web3.eth.getCoinbase(cb));

      window.ethereum.on("chainChanged", () => {
        // console.log(111111)
      });

      let walletType = "Coinbase";
      return { networkId, coinbase, walletType };

    } catch (e) {
      error = e.message;
    }
  } 

  else if (name === "trustWallet") {
    try {
      //  Create WalletConnect Provider
      // const provider = new WalletConnectProvider({
      //   // infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
      // });

      //  Enable session (triggers QR Code modal)
      // await provider.enable();
      // const web3 = new Web3(provider);
      // Subscribe to accounts change





      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider
        },
      };

      const web3Modal = new Web3Modal({
        providerOptions, // required
      });
      // const provider = await web3Modal.connect();
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.mycustomnode.com",
          // ...
        },

      });
      await provider.enable();

      const newWeb3 = new Web3(provider);
      const accounts = await newWeb3.eth.getAccounts();
      window.wallet = newWeb3;
      // console.log(newWeb3, 'newweb3,,,,,,');



      // console.log(accounts, 'accounts......')
      // console.log(provider, 'provider......')
      // console.log(web3Modal, 'WalletConnectProvider......')


      // const connector = new WalletConnect({
      //   bridge: "https://bridge.walletconnect.org", // Required
      //   qrcodeModal: QRCodeModal,
      // });

      // // console.log(connector, 'connector......')
      // let web3 = new Web3(connector);
      // window.wallet = web3;

      // console.log(web3, "web3111.....");

      // // Check if connection is already established
      // if (!connector.connected) {
      //   // create new session
      //   connector.createSession();
      // }

      // // Subscribe to connection events
      // connector.on("connect", (error, payload) => {
      //   console.log("进入", payload);
      //   if (error) {
      //     throw error;
      //   }

      //   // Get provided accounts and chainId
      //   var { accounts, chainId } = payload.params[0];
      //   // console.log(accounts, chainId);
      //   return { chainId:1, coinbase:"0xC4e8f0c11a2361eC587696939B2Fc63608BF884C", walletType: "trustWallet" };
      // });
      // connector.on("session_update", (error, payload) => {
      //   if (error) {
      //     throw error;
      //   }

      //   // Get updated accounts and chainId
      //   const { accounts, chainId } = payload.params[0];
      // });

      // connector.on("disconnect", (error, payload) => {
      //   if (error) {
      //     throw error;
      //   }

      //   // Delete connector
      // });

      return {
        chainId: 1,
        coinbase: accounts[0],
        walletType: "trustWallet",
      };
    } catch (e) {
      console.error(e);
      if (e.code === 4001) {
        console.error("User denied connection.");
      }
      console.log(e, "errrrrrrrrr");
    }
  } 

   else if (name === "BitKeep" ){

    const provider = window.bitkeep && window.bitkeep.ethereum;

    await provider.request({ method: 'eth_requestAccounts' });

    // console.log(provider);

    var web3 = new Web3(provider);
        
    window.wallet = web3;

    let networkId = await promisify((cb) => web3.eth.getChainId(cb));

    var coinbase = await promisify((cb) => web3.eth.getCoinbase(cb));

    return { networkId, coinbase, name };
   }
    
   else if (name === "Bitski"){

   } 
   else if(name === "WalletConnect"){


    const provider = await EthereumProvider.init({
      projectId:'f52eb6556997b1ef13ad7fc8ac632ca6',
      showQrModal: true,
      qrModalOptions: {themeMode:"light"},
      chains: [1],
      methods: ["eth_sendTransaction", "personal_sign"],
      events: ["chainChanged", "accountsChanged"],
      metadata: {
        name: "My Dapp",
        description: "My Dapp description",
        url: "https://my-dapp.com",
        icons: ["https://my-dapp.com/logo.png"],
      },
    });

    console.log(provider);

    
    await provider.connect();
    console.log(provider);

    const result = await provider.request({method:'eth_requestAccounts'});
    
    var web3 = new Web3(provider);

    console.log(web3);

    window.wallet = web3;

    let networkId = await promisify((cb) => web3.eth.getChainId(cb));

    console.log(networkId);

    let coinbase = result[0];
    return {networkId,coinbase,name}
}

  else {
    error = "";
  }

  return { error };
};

const checkWeb3 = () => {
  // console.log(window.ethereum.isConnected());
  return window.ethereum && window.ethereum.isConnected();
};

const getChainId = async () => {
  if (window.ethereum) {
    var web3 = new Web3(window.ethereum);
    var chainId = await promisify((cb) => web3.eth.getChainId(cb));
    return chainId || "";
  }
  return "";
};

const chainChanged = () => {
  // console.log(11)
};

const loginWallet = async (address) => {
  const state = React.$store.getState();
  let timestamp = parseInt(new Date().getTime() / 1000);
  let loginMessage = state.config.system.loginMessage;
  var message = loginMessage + " " + timestamp;

  console.log(address);
  console.log(message);

  try {
    let signature = await sign(message, address);


    if (signature.error) return signature;

    return {
      signature: signature,
      timestamp: timestamp,
    };
  } catch (e) {
    return { error: e.message };
  }
};

const sign = async (message, address) => {

  var web3 = window.wallet;

  try {
    address = web3.utils.toChecksumAddress(address);

    var signature = await promisify((cb) =>
      web3.eth.personal.sign(message,address,cb)
    );

    return signature;
  } catch (e) {
    return {error: e.message};
  }
};

const getWeb3 = async () => {

  if (!window.wallet) {
    const state = React.$store.getState();
    // const regWallet = state.user.profile?.user?.regWallet;

    const regWallet = window.localStorage.getItem("walletname") || state.user.profile?.user?.regWallet || 'metamask';

    await connectWeb3(regWallet);
    
    return window.wallet

  }
  return window.wallet;
};

export default {
  connectWeb3,
  checkWeb3,
  getWeb3,
  sign,
  loginWallet,
  getChainId,
  // web3wallet,
  // core
};
