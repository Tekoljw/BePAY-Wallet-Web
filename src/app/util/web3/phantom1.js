import { EventEmitter, SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import {
    BaseMessageSignerWalletAdapter,
    isIosAndRedirectable,
    isVersionedTransaction,
    scopePollingDetectionStrategy,
    WalletAccountError,
    WalletConnectionError,
    WalletDisconnectedError,
    WalletDisconnectionError,
    WalletError,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletPublicKeyError,
    WalletReadyState,
    WalletSendTransactionError,
    WalletSignMessageError,
    WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import {
    Connection,
    SendOptions,
    Transaction,
    TransactionSignature,
    TransactionVersion,
    VersionedTransaction,
} from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

const isPhantomInstalled = () => {
    try {
        window.phantom?.solana?.isPhantom;
        return true;
    }catch{return false}
};


//建立链接
const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }else{
    //未安装重定向
    alert('phantom not found');
    window.open('https://phantom.app/', '_blank');
    }
};

// 链接
const getRequest = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    try {
        const resp = await provider.request({ method: "connect" });
        // provider.on("connect", () => console.log("connected!"));
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
        // true
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
        //信任链接
        // provider.connect({ onlyIfTrusted: true });
        // window.solana.request({ method: "connect", params: { onlyIfTrusted: true } });
    } catch (err) {
        // { code: 4001, message:'User rejected the request.' }
    }
}

export default {
    isPhantomInstalled,
    getProvider,
    getRequest
}
