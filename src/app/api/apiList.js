export default {
    config: {
        fetch: {
            url: "/config/fetch",
            method: "post",
        },
        gasTracker: {
            url: "/config/gasTracker",
            method: "post",
        },
        menuList: {
            url: "/menu/list",
            method: "post",
        },
        getIPExtendInfo: {
            url: "/mobile/getIPExtendInfo",
            method: "post",
        }
    },


    user: {
        setbanner: {
            url: "/user/setbanner",
            method: "post",
        },
        login: {
            url: "/user/login",
            method: "post",
        },
        stat: {
            url: "/user/stat",
            method: "post",
        },
        reload: {
            url: "/user/reload",
            method: "post",
        },
        profile: {
            url: "/user/profile",
            method: "post",
        },
        setprofile: {
            url: "/user/setprofile",
            method: "post",
        },
        info: {
            url: "/user/info",
            method: "post",
        },
        match: {
            url: "/user/match",
            method: "post",
        },
        listbyaddr: {
            url: "/user/listbyaddr",
            method: "post",
        },
        contract: {
            url: "/user/contract",
            method: "post",
        },
        onsales: {
            url: "/user/onsales",
            method: "post",
        },
        collections: {
            url: "/user/collections",
            method: "post",
        },
        listcontract: {
            url: "/user/listcontract",
            method: "post",
        },
        created: {
            url: "/user/created",
            method: "post",
        },
        like: {
            url: "/user/like",
            method: "post",
        },
        following: {
            url: "/user/following",
            method: "post",
        },
        follows: {
            url: "/user/follows",
            method: "post",
        },
        bid: {
            url: "/user/bid",
            method: "post",
        },
        listmygame: {
            url: "/user/listmygame",
            method: "post",
        },
        checkLoginState:{
            url: "/user/checkLoginState",
            method: "post",
        },
        chain: {
            url: "/mobile/networks",
            method: "post",
        },
        selectnetwork: {
            url: "/mobile/selNetwork",
            method: "post",
        },
        sendSms: {
            url: "/mobile/sendSms",
            method: "post",
        },
        sendEmail: {
            url: "/mobile/sendValidate",
            method: "post",
        },
        bindPhone: {
            url: "/mobile/bindPhone",
            method: "post",
        },
        bindEmail: {
            url: "/mobile/bindEmail",
            method: "post",
        },
        register: {
            url: "/mobile/register",
            method: "post",
        },
        facebookLogin: {
            url: "/mobile/facebookLogin",
            method: "post",
        },
        telegramLogin: {
            url: "/mobile/telegramLogin",
            method: "post",
        },
        telegramWebAppLogin: {
            url: "/mobile/telegramWebAppLogin",
            method: "post",
        },
        googleLogin: {
            url: "/mobile/googleLogin",
            method: "post",
        },
        emailRegister: {
            url: "/email/register",
            method: "post",
        },
        mobileLogin: {
            url: "/mobile/login",
            method: "post",
        },
        resetPass: {
            url: "/mobile/resetPass",
            method: "post",
        },
        changePass: {
            url: "/mobile/changepass",
            method: "post",
        },
        bindWallet:{
            url: "/mobile/bindWallet",
            method: "post",
        },
        changePhone: {
            url: "/mobile/changePhone",
            method: "post",
        },
        changeEmail: {
            url: "/mobile/changeEmail",
            method: "post",
        }
    },

    security: {
        getQRText: {
            url: "/security/gauth/getQRText",
            method: "post",
        },
        verifyGAuth: {
            url: "/security/gauth/verifyGAuth",
            method: "post",
        },
        setKey: {
            url: "/security/session/setKey",
            method: "post",
        },
        setPaymentPassword: {
            url: "/security/payPassword/setPaymentPassword",
            method: "post",
        },
        verifyPaymentPassword: {
            url: "/security/payPassword/verifyPaymentPassword",
            method: "post",
        },
        updatePaymentPassword: {
            url: "/security/payPassword/updatePaymentPassword",
            method: "post",
        }
    },

    bank: {
        listBank: {
            url: "/bank/listBank",
            method: "post",
        }
    },

    transfer: {
        records: {
            url: "/transfer/records",
            method: "post",
        },
        sendTips: {
            url: "/transfer/sendTips",
            method: "post",
        }
    },

    paytoken: {
        list: {
            url: "/paytoken/list",
            method: "post",
        },
        address: {
            url: "/paytoken/address",
            method: "post",
        },
    },

    dapp: {
        sign: {
            url: "/dapp/sign",
            method: "post",
        },
    },

    borrow: {
        config: {
            url: "/borrow/config",
            method: "post",
        },
        getOrderList: {
            url: "/borrow/getOrderList",
            method: "post",
        },
        afterBorrowToken: {
            url: "/borrow/afterBorrowToken",
            method: "post",
        },
        afterRepayToken: {
            url: "/borrow/afterRepayToken",
            method: "post",
        },
        directRepayToken: {
            url: "/borrow/directRepayToken",
            method: "post",
        },
    },

    pool:{
        config: {
            url: "/pool/config",
            method: "post",
        },
        getOrderList: {
            url: "/pool/getOrderList",
            method: "post",
        },
        directPoolToken: {
            url: "/pool/directPoolToken",
            method: "post",
        },
        afterPoolToken: {
            url: "/pool/afterPoolToken",
            method: "post",
        },
        takeBackPoolToken: {
            url: "/pool/takeBackPoolToken",
            method: "post",
        },
    },

    storage: {
        list: {
            url: "/storage/list",
            method: "post",
        },
        upload: {
            url: "/storage/upload",
            method: "post",
        },
        read: {
            url: "/storage/read",
            method: "post",
        },
        update: {
            url: "/storage/update",
            method: "post",
        },
        delete: {
            url: "/storage/delete",
            method: "post",
        },
        multiupload: {
            url: "/storage/multiupload",
            method: "post",
        },
    },

    payment: {
        config: {
            url: "/payment/config",
            method: "post",
        },

        makeOrder: {
            url: "/payment/makeOrder",
            method: "post",
        },

        kycInfo : {
            url: "/payment/kycInfo",
            method: "post",
        },

        kycUpdate: {
            url: "/payment/kycUpdate",
            method: "post",
            json: true,
        },

        kycSubmit: {
            url: "/payment/kycSubmit",
            method: "post",
        },

        LegendTrading : {
            config: {
                url: "/payment/LegendTrading/config",
                method: "post",
            },

            paymentOption: {
                url: "/payment/LegendTrading/fiatPaymentOptions",
                method: "post",
            },

            cryptoTarget: {
                url: "/payment/LegendTrading/fiatCryptoTarget",
                method: "post",
            }
        },

        FaTPay : {
            config: {
                url: "/payment/FaTPay/config",
                method: "post",
                json: true,
            },

            paymentOption: {
                url: "/payment/FaTPay/fiatPaymentOptions",
                method: "post",
            },

            cryptoTarget: {
                url: "/payment/FaTPay/fiatCryptoTarget",
                method: "post",
            },
        },

        StarPay : {
            config: {
                url: "/payment/StarPay/config",
                method: "post",
                json: true,
            },

            paymentOption: {
                url: "/payment/StarPay/fiatPaymentOptions",
                method: "post",
            },

            cryptoTarget: {
                url: "/payment/StarPay/fiatCryptoTarget",
                method: "post",
            },
        },

        manualCryptoNotify: {
            url: "/payment/manualCryptoNotify",
            method: "post",
        },

        makeWithdrawOrder: {
            url: "/payment/makeWithdrawOrder",
            method: "post",
        },
        fiatWithdrawFee: {
            url: "/payment/fiatWithdrawFee",
            method: "post",
        },

        payoutBank: {
            url: "/payment/payoutBank",
            method: "post",
        },

        payoutPayWays: {
            url: "/payment/payoutPayWays",
            method: "post",
        }

},

    wallet:{
        centerGetTokenBalanceList: {
            url: "/wallet/centerGetTokenBalanceList",
            method: "post",
        },
        tokenTransfer: {
            url: "/wallet/tokenTransfer",
            method: "post",
        },
        getTokenOrderInfo: {
            url: "/wallet/getTokenOrderInfo",
            method: "post",
        },
        getUserFiat: {
            url: "/wallet/getUserFiat",
            method: "post",
        },
        getWalletAddressConfig: {
            url: "/wallet/getWalletAddressConfig",
            method: "post",
        },
        getWalletAddress: {
            url: "/wallet/getWalletAddress",
            method: "post",
        },
        addOrQueryAddressDesc: {
            url: "/wallet/addOrQueryAddressDesc",
            method: "post",
        },
        checkWalletAddress: {
            url: "/wallet/checkWalletAddress",
            method: "post",
        },
        getWithDrawConfig: {
            url: "/wallet/getWithDrawConfig",
            method: "post",
        },
        evalTokenTransferFee: {
            url: "/wallet/evalTokenTransferFee",
            method: "post",
        },
        getTransferStats: {
            url: "/wallet/getTransferStats",
            method: "post",
        },
        cryptoWithdrawFee: {
            url: "/wallet/cryptoWithdrawFee",
            method: "post",
        },
    },

    account:{
        setCurrencySelect : {
            url: "/account/setCurrencySelect",
            method: "post",
        },
        getCurrencySelect : {
            url: "/account/getCurrencySelect",
            method: "post",
        },
        getCryptoDisplay : {
            url: "/account/getCryptoDisplay",
            method: "post",
        },
        getWalletDisplay: {
            url: "/account/getWalletDisplay",
            method: "post",
        },
        removeHistoryAddress: {
            url: "/account/removeHistoryAddress",
            method: "post"
        },
        getCurrencyDisplay: {
            url: "/account/getCurrencyDisplay",
            method: "post",
        },
        getNftDisplay: {
            url: "/account/getNftDisplay",
            method: "post",
        },
        getWithdrawHistoryAddress:{
            url: "/account/getWithdrawHistoryAddress",
            method: "post",
        },
        getSendTipsHistoryAddress:{
            url: "/account/getSendTipsHistoryAddress",
            method: "post",
        },
        setCryptoDisplay:{
            url: "/account/setCryptoDisplay",
            method: "post",
            json: true,
        },
        setWalletDisplay:{
            url: "/account/setWalletDisplay",
            method: "post",
            json: true,
        },
        setCurrencyDisplay:{
            url: "/account/setCurrencyDisplay",
            method: "post",
            json: true,
        },
        setNftDisplay:{
            url: "/account/setNftDisplay",
            method: "post",
            json: true,
        },
    },

    swap : {
        config: {
            url: "/swap/config",
            method: "post",
        },

        price: {
            url: "/swap/price",
            method: "post",
        },

        crypto: {
            url: "/swap/crypto",
            method: "post",
        },

        fiat: {
            url: "/swap/Fiat",
            method: "post",
        },

        orderDetail: {
            url: "/swap/orderDetail",
            method: "post",
        },
    },

    activity: {
        afterActive: {
            url: "/activity/volunteer/afterActive",
            method: "post",
        },
        directActive: {
            url: "/activity/volunteer/directActive",
            method: "post",
        },
        releaseActive: {
            url: "/activity/volunteer/releaseActive",
            method: "post",
        },
        participate: {
            url: "/activity/nftPledge/participate",
            method: "post",
        }
    },

    nft: {
        config: {
            url: "/nft/support/config",
            method: "post",
        },
        centerGetNftList: {
            url: "/nft/centerGetNftList",
                method: "post",
        },
        evalWithdrawFee: {
            url: "/nft/evalWithdrawFee",
            method: "post",
        },
        withdraw: {
            url: "/nft/withdraw",
            method: "post",
        },
        getGenesisRobotConfig: {
            url: "/nft/support/getGenesisRobotConfig",
            method: "post",
        },
        mintGenesisRobot: {
            url: "/nft/mintGenesisRobot",
            method: "post",
        },
        queryContractResult: {
            url: "/nft/queryContractResult",
            method: "post",
        },
    },

    credit: {
        config: {
            url: "/credit/config",
            method: "post",
        },
        getUserCreditCard: {
            url: "/credit/getUserCreditCard",
            method: "post",
        },
        applyCreditCard: {
            url: "/credit/applyCreditCard",
            method: "post",
        },
        creditCardUpdate: {
            url: "/credit/creditCardUpdate",
            method: "post",
        },
        confirmCardholderIdentity: {
            url: "/credit/confirmCardholderIdentity",
            method: "post",
        },
        creditActive: {
            url: "/credit/creditActive",
            method: "post",
        },
        creditCardFiatDeposit: {
            url: "/credit/creditCardFiatDeposit",
            method: "post",
        },
        creditCardCryptoDeposit: {
            url: "/credit/creditCardCryptoDeposit",
            method: "post",
        },
        creditCardFiatWithdraw: {
            url: "/credit/creditCardFiatWithdraw",
            method: "post",
        },
        creditCardCryptoWithdraw: {
            url: "/credit/creditCardCryptoWithdraw",
            method: "post",
        },
    },

    log: {
        logInfo: {
            url: "/logSystem/logInfo",
            method: "post",
        },
        logError: {
            url: "/logSystem/logError",
            method: "post",
        },
    }
};
