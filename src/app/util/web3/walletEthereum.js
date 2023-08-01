import { EthereumProvider } from '@walletconnect/ethereum-provider';
const ether = async () => {
    const regWallet = localStorage.getItem('walletname');

    const WalletConnectprovider = await EthereumProvider.init({
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
    
    switch (regWallet) {
        case 'metamask':
            return window.ethereum;
            break;
        case 'coinbase':
            var initCoinbase = await coinbaseWallet.initCoinbase();
            return initCoinbase;
            break;
        case 'trustWallet':
            var injectedProvider = await trustProvider.getTrustWalletInjectedProvider();
            return injectedProvider;
            break;
        case 'BitKeep':
            return window.bitkeep && window.bitkeep.ethereum;
            break;
        case 'WalletConnect' :
            return WalletConnectprovider;
            break;

            
    };
};
export default{
    ether
}