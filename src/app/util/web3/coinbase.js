import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Web3 from 'web3'
const APP_NAME = 'Funibox'
const APP_LOGO_URL = 'https://example.com/logo.png'
// const DEFAULT_ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/<YOUR_INFURA_API_KEY>'
const DEFAULT_ETH_JSONRPC_URL = 'https://rpc.funibox.com'
const DEFAULT_CHAIN_ID = 1337

const initCoinbase = async () => {
    let coinbaseWallet =
           new CoinbaseWalletSDK({
            appName: APP_NAME,
            appLogoUrl: APP_LOGO_URL,
            darkMode: false
        });
        let ethereum = await coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
        return ethereum
}
export default {
    initCoinbase
}