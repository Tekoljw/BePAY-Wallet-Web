
const ether = async () => {
    const regWallet = localStorage.getItem('walletname');
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
           

    };
};
export default{
    ether
}