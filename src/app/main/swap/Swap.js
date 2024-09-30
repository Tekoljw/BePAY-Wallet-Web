import { useState, useEffect, default as React, memo, useRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import clsx from "clsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import UniSwapPage from "./UniSwapPage";
import openType from '../wallet/opentype.json'
import {
  getSwapConfig,
  getSwapPrice,
  getSwapCrypto, getSwapFiat,
} from "../../store/swap/swapThunk";
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/home.css";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { arrayLookup, setPhoneTab, getNowTime } from "../../util/tools/function";
import { selectConfig, setSwapConfig } from "app/store/config";
import { selectUserData } from "app/store/user";
import { getCryptoDisplay } from "app/store/wallet/walletThunk";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import MobileDetect from "mobile-detect";
import { updateCryptoDisplay } from "../../store/user";
import Wallet from "../wallet/Wallet";
import { Routes, Route, useLocation } from "react-router-dom";
import Tab from "@mui/material/Tab";
import { bindWallet } from "../../store/user/userThunk";
import Tabs from "@mui/material/Tabs";
import Web3Login from "../login/Web3Login";
import { useTranslation } from "react-i18next";
import el from "date-fns/esm/locale/el/index.js";
import zhHK from "date-fns/locale/zh-HK";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { centerGetTokenBalanceList } from "app/store/user/userThunk";
import { centerGetUserFiat } from "app/store/wallet/walletThunk";
import { showMessage } from 'app/store/fuse/messageSlice';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: 0,
  border: "none",
  borderRadius: "8px!important",
  backgroundColor: "#1E293B!important",
  marginBottom: 24,
  "&:before": {
    display: "none",
  },
  "&:first-of-type": {},
  "&:last-of-type": {
    marginBottom: 0,
  },
}));

function Swap() {
  const [walletloginname, setwalletloginname] = useState(
    window.localStorage.getItem("walletname") === "metamask"
      ? "MetaMask"
      : localStorage.getItem("walletname")
  );
  const [walletType, setWalletType] = useState(0);
  const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();
  const mounted = useRef();

  const dispatch = useDispatch();
  const config = useSelector(selectConfig);
  const swapData = config.swapConfig;
  const symbolsData = config.symbols;
  const fiatsData = config.payment?.currency;
  const networks = config.networks;
  const cryptoDisplayData = useSelector(selectUserData).cryptoDisplay;
  const [expanded, setExpanded] = useState(null);
  const [symbolWallet, setSymbolWallet] = useState([]);
  const [openSuccessWindow, setOpenSuccessWindow] = useState(false);
  // const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [hasData, setHasData] = useState(false);
  const [zhuanQuan, setZhuanQuan] = useState(true);
  const [tiJiaoState, setTiJiaoState] = useState(0);
  const [formatSymbol, setFormatSymbol] = useState("");
  const [fiatData, setFiatData] = useState([]);
  const [walletData, setWalletData] = useState([]);
  let userData = useSelector(selectUserData);
  // const fiatData = useSelector(selectUserData).fiat;
  // const walletData = useSelector(selectUserData).wallet;
  const [currencyCode, setCurrencyCode] = useState(fiatData[0]?.currencyCode || "USD");
  const [loadingShow, setLoadingShow] = useState(false);

  const [priceData, setPriceData] = useState({
    pair: "",
    price: "",
    qty_base: "",
    qty_quote: "",
  });

  const [lookData, setLookData] = useState({
    newNum: "",
    id: "",
    fee: ""
  });

  //获取图片
  const toRegWallet = (regWalletParam) => {
    if (regWalletParam) {
      return (
        regWalletParam.slice(0, 1).toUpperCase() +
        regWalletParam.slice(1).toLowerCase()
      );
    }
    return regWalletParam;
  };

  const closePinFunc = () => {
    document.getElementById('PINSty').classList.remove('PinMoveAni');
    document.getElementById('PINSty').classList.add('PinMoveOut');
    setTimeout(() => {
      setOpenSuccessWindow(false);
      setZhuanQuan(true);
      setTiJiaoState(0);
      lookData.id = "";
      lookData.newNum = "";
      lookData.fee = "";
    }, 300);
  };

  const openPinFunc = () => {
    setOpenSuccessWindow(true);
    setTimeout(() => {
      document.getElementById('PINSty').classList.add('PinMoveAni');
    }, 0);
  };

  const [decentralized, setDdecentralized] = useState(
    localStorage.getItem("isDecentralized")
  );

  const [regWallet, setRegWallet] = useState(
    window.localStorage.getItem("walletname")
  );

  const [oppenappid, setopenapp] = useState('Funibox Wallet'
    // window.sessionStorage.getItem("openAppId")
  );

  const walletImage = config.walletConfig[regWallet]?.img || "";
  const [inputVal, setInputVal] = useState({
    amount: "",
  });

  const { t } = useTranslation("mainPage");
  const walletTypeTab = [
    // t("home_wallet_1"),
    oppenappid,
    decentralized == -1 ? 'Wallet Connect' : `${regWallet ?? "Wallet Connect"}`,
  ];

  const [swapCoinConfig, setSwapCoinConfig] = useState({});

  useEffect(() => {
    if (window.sessionStorage.getItem("openAppId")) {
      if (openType.list[0].no == window.sessionStorage.getItem("openAppId")) {
        setopenapp('Funibet Wallet')
      }
      if (openType.list[1].no == window.sessionStorage.getItem("openAppId")) {
        setopenapp('BeingFi Wallet')
      }
    }
  }, [window.sessionStorage.getItem("openAppId")])

  const handleChangeInputVal = (prop, value) => (event) => {
    if (
      Number(event.target.value) >
      Number(arrayLookup(symbolWallet, "symbol", symbol, "balance"))
    ) {
      console.log(">");
    }
    setInputVal({ ...inputVal, [prop]: value ?? event.target.value });
  };
  const handleChangeInputValEdit = (prop, value) => {
    setInputVal({ ...inputVal, [prop]: value });
  };

  const toggleAccordion = (panel) => (event, _expanded) => {
    setExpanded(_expanded ? panel : false);
  };


  function toNewItem(item, currencyRate, dollarCurrencyRate) {
    // 兑换成USDT的汇率
    let symbolRate = item.rate || 0;
    let balance = getUserMoney(item);

    return {
      avatar: item.avatar || "",
      symbol: item.symbol,
      balance: balance, // 余额
      dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
      currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
      tradeLock: item.tradeLock || 0,
      withdrawLock: item.withdrawLock || 0,
    };
  }

  function ismore(inputVal) {
    if (
      Number(inputVal) >
      Number(arrayLookup(symbolWallet, "symbol", symbol, "balance"))
    ) {
      return true;
    } else return false;
  }


  // 整理symbol数据
  const arrangeSymbolAmountData = (data) => {
    let currencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        currencyCode,
        "exchangeRate"
      ) || 0;

    // 美元汇率
    let dollarCurrencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        "USD",
        "exchangeRate"
      ) || 0;

    let resultSymbolData = [];

    data.forEach((item, index) => {
      // 兑换成USDT的汇率
      let symbolRate = arrayLookup(symbolsData, "symbol", item, "rate") || arrayLookup(fiatsData, "currencyCode", item, "exchangeRate") || 0;
      var balance = getUserMoney(item);
      resultSymbolData.push({
        avatar: arrayLookup(symbolsData, "symbol", item, "avatar") || arrayLookup(fiatsData, "currencyCode", item, "avatar") || "",
        symbol: item,
        balance: balance, // 余额
        dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
        currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
        tradeLock:
          arrayLookup(walletData.inner, "symbol", item, "tradeLock") || 0,
        withdrawLock:
          arrayLookup(walletData.inner, "symbol", item, "withdrawLock") || 0,
      });
    });
    return resultSymbolData
  }


  // 整理symbol数据
  const arrangeSymbolAmountDataFrom = (data) => {

    let currencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        currencyCode,
        "exchangeRate"
      ) || 0;

    // 美元汇率
    let dollarCurrencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        "USD",
        "exchangeRate"
      ) || 0;

    let resultSymbolDataFormat = {};

    Object.keys(data)?.forEach((item, index) => {
      let resultSymbolData = [];
      data[item].forEach((item, index) => {
        // 兑换成USDT的汇率
        let symbolRate = arrayLookup(symbolsData, "symbol", item.quote_coin, "rate") || arrayLookup(fiatsData, "currencyCode", item.quote_coin, "exchangeRate") || 0;
        var balance = getUserMoney(item.quote_coin);

        resultSymbolData.push({
          avatar: arrayLookup(symbolsData, "symbol", item.quote_coin, "avatar") || arrayLookup(fiatsData, "currencyCode", item.quote_coin, "avatar") || "",
          symbol: item.quote_coin,
          balance: balance, // 余额
          dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
          currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
          tradeLock:
            arrayLookup(walletData.inner, "symbol", item.quote_coin, "tradeLock") || 0,
          withdrawLock:
            arrayLookup(walletData.inner, "symbol", item.quote_coin, "withdrawLock") || 0,
        });
      });

      resultSymbolDataFormat[item] = resultSymbolData;
    });
    return resultSymbolDataFormat
  }


  const symbolsFormatAmount = async () => {

    let displayData = [];
    let tmpCoinData = {};
    let tmpCoinFiatData = {};
    await Object.keys(swapData)?.map((item) => {
      if (arrayLookup(symbolsData, "symbol", swapData[item].base_coin, "symbol") || arrayLookup(fiatData, 'currencyCode', swapData[item].base_coin, 'currencyCode')) {
        if (displayData.indexOf(swapData[item].base_coin) == -1) {
          displayData.push(swapData[item].base_coin);
          tmpCoinData[swapData[item].base_coin] = [swapData[item]]
        } else {
          tmpCoinData[swapData[item].base_coin].push(swapData[item])
        }
      }
    });

    let tmpSymbols = [];
    tmpSymbols = arrangeSymbolAmountData(displayData);

    let tmpSwapSymbols = {};
    tmpSwapSymbols = arrangeSymbolAmountDataFrom(tmpCoinData);
    setSwapCoinConfig(tmpSwapSymbols);

    const sortUseAge = (a, b) => {
      const prioritizedSymbolsFirst = ['eUSDT', 'USDT', 'BGT', 'eBGT'];
      const prioritizedSymbolsSecond = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'PAX', 'GUSD', 'USDD'];

      // 检查币种是否属于优先展示的币种
      const isPrioritizedAFirst = prioritizedSymbolsFirst.includes(a.symbol);
      const isPrioritizedBFirst = prioritizedSymbolsFirst.includes(b.symbol);
      const isPrioritizedASecond = prioritizedSymbolsSecond.includes(a.symbol);
      const isPrioritizedBSecond = prioritizedSymbolsSecond.includes(b.symbol);

      // 获取币种 a 和币种 b 的 dollarFiat 值
      const dollarFiatA = parseFloat(a.dollarFiat);
      const dollarFiatB = parseFloat(b.dollarFiat);

      if (isPrioritizedAFirst && isPrioritizedBFirst) {
        // 如果两个币种都属于第一组优先展示的币种，则比较它们的 dollarFiat 值进行排序
        return dollarFiatB - dollarFiatA;
      } else if (isPrioritizedAFirst) {
        // 如果只有 a 是第一组优先展示的币种，则将 a 排在前面
        return -1;
      } else if (isPrioritizedBFirst) {
        // 如果只有 b 是第一组优先展示的币种，则将 b 排在前面
        return 1;
      } else if (isPrioritizedASecond && isPrioritizedBSecond) {
        // 如果两个币种都属于第二组优先展示的币种，则比较它们的 dollarFiat 值进行排序
        return dollarFiatB - dollarFiatA;
      } else if (isPrioritizedASecond) {
        // 如果只有 a 是第二组优先展示的币种，则将 a 排在前面
        // return -1;
        return dollarFiatB - dollarFiatA;
      } else if (isPrioritizedBSecond) {
        // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
        // return 1;
        return dollarFiatB - dollarFiatA;
      } else {
        // 如果两个币种都不属于优先展示的币种，则保持原有顺序
        // return 0;
        return dollarFiatB - dollarFiatA;
      }
    };

    const sortUseLen = (a, b) => {
      return a.networkLen - b.networkLen;
    };

    let tmpNetworks = {};

    tmpSymbols.forEach((item, index) => {
      var tmpNetId = [];
      var tmpNetData = [];
      symbolsData.map((symbolData) => {
        if (
          tmpNetId.indexOf(symbolData.networkId) === -1 &&
          symbolData.symbol === item.symbol
        ) {
          tmpNetId.push(symbolData.networkId);
        }
      });

      for (var i = 0; i < tmpNetId.length; i++) {
        if (arrayLookup(networks, "id", tmpNetId[i], "symbol")) {
          tmpNetData.push({
            id: tmpNetId[i],
            symbol: arrayLookup(networks, "id", tmpNetId[i], "symbol"),
            avatar: arrayLookup(networks, "id", tmpNetId[i], "avatar"),
            network: arrayLookup(networks, "id", tmpNetId[i], "network"),
            text: 1,
            desc: 2,
            networkLen:
              arrayLookup(networks, "id", tmpNetId[i], "network").length || 0,
          });
        }
      }
      tmpNetData.sort(sortUseLen);
      tmpNetworks[item.symbol] = tmpNetData;
    });

    tmpSymbols.sort(sortUseAge)
    setSymbolWallet(
      tmpSymbols.filter(i => i.symbol !== 'eUSDT')
    );

  };



  const getUserMoney = (symbol) => {
    let arr = userData.wallet.inner || [];
    let fiatArr = userData.fiat || [];
    let balance = arrayLookup(arr, "symbol", symbol, "balance") || 0;
    if (balance > 0) {
      return balance.toFixed(6);
    } else {
      balance = arrayLookup(fiatArr, "currencyCode", symbol, "balance") || 0;
      return balance.toFixed(2);
    }
  };

  const [percentage, setPercentage] = useState("");
  const handleClick = (index) => {
    setPercentage(index);
    let tmpAmount = 0;
    let allAmount = arrayLookup(symbolWallet, "symbol", symbol, "balance") || 0;
    switch (index) {
      case 1:
        tmpAmount = allAmount * 0.25;
        break;
      case 2:
        tmpAmount = allAmount * 0.5;
        break;
      case 3:
        tmpAmount = allAmount * 0.75;
        break;
      case 4:
        tmpAmount = allAmount;
        break;
    }
    handleChangeInputValEdit("amount", tmpAmount);
  };

  const onSubmit = () => {
    if(inputVal.amount == 0) {
      showMessage({ message: 'Amount must be greater than 0', code: 2 })
      return
    }
    openPinFunc();
    if (arrayLookup(symbolsData, "symbol", symbol, "symbol")) {
      dispatch(
        getSwapPrice({
          srcSymbol: symbol,
          dstSymbol: formatSymbol,
          amount: inputVal.amount,
        })
      ).then((res) => {
        let result = res.payload;
        if (result && result.errno === 0) {
          let qty_base = result.data.qty_base;
          let qty_quote = result.data.qty_quote;
          if (result.data.pair !== (symbol + formatSymbol)) {
            qty_base = result.data.qty_quote;
          } else {
            qty_quote = result.data.qty_base;
          }
          setPriceData(result.data);
          dispatch(
            getSwapCrypto({
              srcSymbol: symbol,
              dstSymbol: formatSymbol,
              amount: inputVal.amount,
              priceId: result.data.price_id ?? '',
              qtyBase: qty_base,
              qtyQuote: qty_quote,
              price: result.data.price ?? 0,
            })
          ).then((res) => {
            let result2 = res.payload
            if (result2 && result2.errno === 0) {
              lookData.id = result2.data.orderId;
              lookData.newNum = result2.data.targetAmount;
              lookData.fee = result2.data.premium;
              setTimeout(() => {
                setZhuanQuan(false);
                setTiJiaoState(1);
                dispatch(centerGetTokenBalanceList());
                dispatch(centerGetUserFiat());
                setTimeout(() => {
                  // userData = useSelector(selectUserData);
                  symbolsFormatAmount();
                }, 1000)
              }, 1200);
            } else {
              setTimeout(() => {
                setZhuanQuan(false);
                setTiJiaoState(2);
              }, 1200);
              if (result2.errmsg.includes("daily swap amount limit")) {
                dispatch(showMessage({ message: t('card_221'), code: 2 }));
              }
            }
          });
        }
      });
    } else {
      dispatch(
        getSwapFiat({
          srcSymbol: symbol,
          dstSymbol: formatSymbol,
          amount: inputVal.amount,
        })
      ).then((res) => {
        let result = res.payload
        lookData.id = result.data.orderId;
        lookData.newNum = (result.data.targetAmount).toFixed(2);
        lookData.fee = (result.data.premium).toFixed(6);
        if (result && result.errno === 0) {
          setTimeout(() => {
            setZhuanQuan(false);
            setTiJiaoState(1);
          }, 1200);
        } else {
          setTimeout(() => {
            setZhuanQuan(false);
            setTiJiaoState(2);
          }, 1200);
        }
      });
    }
  };


  useEffect(() => {
    setHasData(
      symbolWallet.length === 0 && symbolsData.length > 0 && networks.length > 0
    );
  }, [cryptoDisplayData, symbolsData, networks]);

  useEffect(() => {
    hasData && symbolsFormatAmount();
  }, [hasData, swapData]);

  useEffect(() => {
    setLoadingShow(false)
    setPhoneTab('swap');
    dispatch(getSwapConfig()).then((res) => {
      setLoadingShow(false)
      res.payload?.errno === 0 && dispatch(setSwapConfig(res.payload));
    });
  }, []);

  useEffect(() => {
    if (userData.profile?.user?.regWallet) {
      setRegWallet(toRegWallet(userData.profile?.user?.regWallet));
    }
  }, [userData.profile?.user?.regWallet]);

  useEffect(() => {
    setFormatSymbol('');
    if (swapCoinConfig[symbol]) {
      setFormatSymbol(swapCoinConfig[symbol][0].symbol);
    }
  }, [symbol]);

  return (
    <div>
          { !loadingShow && <div className='mt-12'>
            {/*<div*/}
            {/*  className="flex justify-center items-center wallet-top radius999"*/}
            {/*  style={{ marginBottom: "12px" }}*/}
            {/*>*/}
            {/*  <Tabs*/}
            {/*    component={motion.div}*/}
            {/*    variants={item}*/}
            {/*    value={walletType}*/}
            {/*    onChange={(ev, value) => {*/}
            {/*      setWalletType(value);*/}
            {/*    }}*/}
            {/*    indicatorColor="secondary"*/}
            {/*    textColor="inherit"*/}
            {/*    variant="scrollable"*/}
            {/*    scrollButtons={false}*/}
            {/*    className="wallet-show-type"*/}
            {/*    classes={{*/}
            {/*      indicator:*/}
            {/*        "flex justify-between bg-transparent w-full h-full min-h-28 radius999",*/}
            {/*    }}*/}
            {/*    TabIndicatorProps={{*/}
            {/*      children: (*/}
            {/*        <Box className="w-full h-full rounded-full huaKuaBgColor0 min-h-28 radius999" />*/}
            {/*      ),*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*      // padding: '1rem 1.2rem',*/}
            {/*      flex: 1,*/}
            {/*    }}*/}
            {/*  >*/}

            {/*    {walletTypeTab.map((key, label) => {*/}

            {/*      if (label == 0) {*/}
            {/*        return (*/}
            {/*          <Tab*/}
            {/*            style={{ fontSize: '1.4rem' }}*/}
            {/*            className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "*/}
            {/*            disableRipple*/}
            {/*            key={key}*/}
            {/*            icon={*/}
            {/*              <img*/}
            {/*                className="mr-8"*/}
            {/*                width="22"*/}
            {/*                src="/wallet/assets/images/logo/loading-img.png"*/}
            {/*                alt=""*/}
            {/*              />*/}
            {/*            }*/}
            {/*            iconPosition="start"*/}
            {/*            label={key}*/}
            {/*            sx={{*/}
            {/*              color: "#FFFFFF",*/}
            {/*              width: "50%",*/}
            {/*            }}*/}
            {/*          />*/}
            {/*        );*/}

            {/*      } else {*/}
            {/*        if (decentralized == 1) {*/}
            {/*          return (*/}
            {/*            <Tab*/}
            {/*              style={{ fontSize: '1.4rem' }}*/}
            {/*              className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "*/}
            {/*              disableRipple*/}
            {/*              key={key}*/}
            {/*              icon={*/}
            {/*                <img*/}
            {/*                  className="mr-8"*/}
            {/*                  width="22"*/}
            {/*                  src={(() => {*/}
            {/*                    switch (walletloginname) {*/}
            {/*                      case "BitKeep":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-14.png";*/}
            {/*                      case "MetaMask":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-1.png";*/}
            {/*                      case "WalletConnect":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-5.png";*/}
            {/*                      case "coinbase":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-10.png";*/}
            {/*                      case "TrustWallet":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-12.png";*/}
            {/*                      case "Coinbase":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-4.png";*/}
            {/*                      case "Polygon":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-13.png";*/}
            {/*                      case "Bitski":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-15.png";*/}
            {/*                      case "CLedger":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-16.png";*/}
            {/*                      case "Binance Smart":*/}
            {/*                        return "/wallet/assets/images/login/icon-right-17.png";*/}
            {/*                      case "BeingFi Wallet":*/}
            {/*                        return "/wallet/assets/images/menu/LOGO.png ";*/}
            {/*                      default:*/}
            {/*                        return "/wallet/assets/images/menu/icon-wallet-active.png ";*/}
            {/*                    }*/}
            {/*                  })()}*/}
            {/*                  alt=""*/}
            {/*                />*/}
            {/*              }*/}
            {/*              iconPosition="start"*/}
            {/*              label={walletloginname}*/}
            {/*              sx={{*/}
            {/*                color: "#FFFFFF",*/}
            {/*                width: "50%",*/}
            {/*              }}*/}
            {/*            />*/}
            {/*          );*/}
            {/*        } else {*/}
            {/*          return (*/}
            {/*            <Tab*/}
            {/*              style={{ fontSize: '1.4rem' }}*/}
            {/*              className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "*/}
            {/*              disableRipple*/}
            {/*              key={key}*/}
            {/*              icon={*/}
            {/*                <img*/}
            {/*                  className="mr-8"*/}
            {/*                  width="22"*/}
            {/*                  src="/wallet/assets/images/menu/icon-wallet-active.png"*/}
            {/*                  alt=""*/}
            {/*                />*/}
            {/*              }*/}
            {/*              iconPosition="start"*/}
            {/*              label={'Wallet Connect'}*/}
            {/*              sx={{*/}
            {/*                color: "#FFFFFF",*/}
            {/*                width: "50%",*/}
            {/*              }}*/}
            {/*            />*/}
            {/*          );*/}
            {/*        }*/}
            {/*      }*/}
            {/*    })}*/}
            {/*  </Tabs>*/}
            {/*</div>*/}

            {walletType === 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="swap-container"
                style={{ paddingInline: "1.5rem " }}
              >
                <div
                  className="mb-16 flex items-center justify-between color-76819B"
                  style={{ marginBottom: "0.6rem" }}
                >
                  <Typography className="text-20">{t("home_wallet_13")}</Typography>
                  <div className="text-14 flex" style={{ color: "#FFFFFF" }}>
                    <Typography
                      className={clsx(
                        "cursor-pointer text-14 mx-8 txtColorTitle",
                        percentage === 1 && "colro-12C1A2"
                      )}
                      onClick={() => {
                        handleClick(1);
                      }}
                    >
                      25%
                    </Typography>
                    <Typography
                      className={clsx(
                        "cursor-pointer text-14 mx-8 txtColorTitle",
                        percentage === 2 && "colro-12C1A2"
                      )}
                      onClick={() => {
                        handleClick(2);
                      }}
                    >
                      50%
                    </Typography>
                    <Typography
                      className={clsx(
                        "cursor-pointer text-14 mx-8 txtColorTitle",
                        percentage === 3 && "colro-12C1A2"
                      )}
                      onClick={() => {
                        handleClick(3);
                      }}
                    >
                      75%
                    </Typography>
                    <Typography
                      className={clsx(
                        "cursor-pointer text-14 mx-8 txtColorTitle",
                        percentage === 4 && "colro-12C1A2"
                      )}
                      onClick={() => {
                        handleClick(4);
                      }}
                    >
                      100%
                    </Typography>
                  </div>
                </div>

                <Box
                  className="w-full rounded-16 border flex flex-col "
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  {symbolWallet.length > 0 && (
                    <StyledAccordionSelect
                      symbol={symbolWallet}
                      currencyCode="USD"
                      setSymbol={setSymbol}
                    />
                  )}
                </Box>

                <div className="flex items-center justify-content-center -mb-56 -mt-4 position-re">
                  <div className="cursor-pointer swap-btn flex items-center justify-content-center">
                    <img src="wallet/assets/images/swap/arrow-down.png" alt="" />
                  </div>
                </div>

                <Typography
                  className="text-20 font-medium my-16 color-76819B"
                  style={{ position: "relative", top: "0.8rem" }}
                >
                  {t("home_wallet_14")}
                </Typography>
                <Box
                  className="w-full rounded-16 border flex flex-col"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  {swapCoinConfig[symbol]?.length > 0 && (
                    <StyledAccordionSelect
                      symbol={swapCoinConfig[symbol]}
                      currencyCode="USD"
                      setSymbol={setFormatSymbol}
                    />
                  )}
                </Box>

                <Typography
                  className="text-20 font-medium my-16 color-76819B"
                  style={{ position: "relative", top: "0.1rem" }}
                >
                  {t("home_withdraw_3")}{" "}
                </Typography>
                <Box
                  className="w-full rounded-16 border flex flex-col"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  <FormControl
                    sx={{ width: "100%", borderColor: "#1E293B" }}
                    variant="outlined"
                  >
                    <TextField
                      error={ismore(inputVal.amount)}
                      helperText={
                        ismore(inputVal.amount) ? t('home_deposite_28') : ""
                      }
                      type="number"
                      step="0.000001"
                      id="outlined-adornment-address send-tips-container-address"
                      value={inputVal.amount}
                      onChange={handleChangeInputVal("amount")}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "address",
                      }}
                    />
                  </FormControl>
                </Box>

                <Typography
                  className="my-8 text-14 color-76819B text-center"
                  style={{ margin: "1.5rem 0" }}
                >
                  {t("home_wallet_15")}
                  <span className="color-ffffff">
                    &nbsp; {inputVal.amount}
                    {symbol} &nbsp;
                  </span>
                  {t("home_wallet_16")}
                </Typography>

                <Box
                  className="w-full rounded-16 border flex flex-col my-16"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                  style={{ marginTop: 0 }}
                >
                  <StyledAccordion
                    component={motion.div}
                    variants={item}
                    classes={{
                      root: "FaqPage-panel shadow",
                    }}
                    expanded={expanded === 2}
                    onChange={toggleAccordion(2)}
                  >
                    <div
                      className="items-center p-12 flex-grow"
                      style={{ width: "100%" }}
                    >
                      <div className="flex items-center my-4">
                        <div className="px-12 font-medium color-76819B">
                          <Typography className="text-14 font-medium">
                            {t("home_wallet_17")}:
                            <span className="color-ffffff">
                              {priceData.qty_base} {symbol} ~ {priceData.qty_quote}{" "}
                              {formatSymbol}
                            </span>
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center my-4">
                        <div className="px-12 font-medium color-76819B">
                          <Typography className="text-14 font-medium">
                            {t("home_wallet_18")}:
                            <span className="color-ffffff">0.5%</span>
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center my-4">
                        <div className="px-12 font-medium color-76819B">
                          <Typography className="text-14 font-medium">
                            {t("home_wallet_19")}:
                            <span className="color-ffffff">0 {symbol}</span>
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center my-4">
                        <div className="px-12 font-medium color-76819B">
                          <Typography className="text-14 font-medium">
                            {t("home_wallet_20")}:
                            <span className="color-ffffff">0</span>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </StyledAccordion>
                </Box>

                <Box component={motion.div} variants={item}>
                  <Button
                    style={{ width: "100%", margin: "2.9rem auto", display: "block" }}
                    disabled={ismore(inputVal.amount)}
                    className="m-28 px-48 text-lg btnColorTitleBig"
                    color="secondary"
                    variant="contained"
                    sx={{ backgroundColor: "#0D9488", color: "#ffffff" }}
                    onClick={() => {
                      onSubmit();
                    }}
                  >
                    {t("home_wallet_21")}
                  </Button>
                </Box>
              </motion.div>
            )}
            {decentralized != -1 && walletType == 1 && (
              <Routes>
                <Route index element={<UniSwapPage />} />
              </Routes>
            )}
            {decentralized == -1 && walletType !== 0 && (
              <>
                <Web3Login />
              </>
            )}
            {decentralized != -1 &&
              walletType == 1 &&
              userData.profile?.loginType !== "web3_wallet" && (
                <>
                  {" "}
                  {/*<Web3Login />*/}
                </>
              )}

            <BootstrapDialog
              onClose={() => {
                closePinFunc();
              }}
              aria-labelledby="customized-dialog-title"
              open={openSuccessWindow}
              className="dialog-container"
            >
              <div id="PINSty" className="PINSty" style={{ bottom: "0%" }}>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  style={{}}
                >
                  <div className='dialog-box'>
                    <Typography id="customized-dialog-title" className="text-24 dialog-title-text" style={{ textAlign: "center", marginTop: "10px" }}>{t('menu_5')}
                      <img src="wallet/assets/images/logo/icon-close.png" className='dialog-close-btn' onClick={() => {
                        closePinFunc();
                      }} />
                    </Typography>
                  </div>

                  <div className='daGouDingWei' style={{ position: "relative" }}>
                    <motion.div variants={item} className=' daGouDingWei1' style={{ position: "absolute", width: "100px", height: "100px", paddingTop: "10px" }}>
                      <div className='daGouDingWei1' style={{ position: "absolute" }}>
                        {
                          !(tiJiaoState === 2) && <img style={{ margin: "0 auto", width: "60px", height: "60px" }} src='wallet/assets/images/wallet/naoZhong2.png'></img>
                        }
                        {
                          tiJiaoState === 2 && <img style={{ margin: "0 auto", width: "60px", height: "60px" }} src='wallet/assets/images/wallet/naoZhong2_1.png'></img>
                        }
                      </div>
                      <div className='daGouDingWei1' style={{ marginLeft: "58px", position: "absolute" }}>
                        {
                          zhuanQuan && <img className='chuKuanDongHua' style={{ width: "22px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong3.png'></img>
                        }
                        {
                          !zhuanQuan && tiJiaoState === 1 && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong4.png'></img>
                        }
                        {
                          !zhuanQuan && tiJiaoState === 2 && <img className='daGouFangDa' style={{ width: "23px", height: "23px" }} src='wallet/assets/images/wallet/naoZhong5.png'></img>
                        }
                      </div>
                    </motion.div>
                  </div>

                  <div style={{ margin: "0 auto", textAlign: "center", marginTop: "84px", height: "23px", fontSize: "16px", color: "#2ECB71" }}>
                    {
                      tiJiaoState === 1 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px" }}>
                        ● {t('errorMsg_1')}
                      </motion.div>
                    }
                    {
                      tiJiaoState === 2 && !zhuanQuan && <motion.div variants={item} style={{ height: "23px", lineHeight: "23px", color: "#EE124B" }}>
                        ● {t('error_36')}
                      </motion.div>
                    }
                  </div>
                  <motion.div variants={item} style={{ margin: "0 auto", textAlign: "center", marginTop: "8px", fontSize: "24px" }}> {lookData.newNum} {formatSymbol}</motion.div>
                  <motion.div variants={item} className='mx-20  mt-24' style={{ borderTop: "1px solid #2C3950" }}>
                  </motion.div>
                  <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                    <div style={{ color: "#888B92" }}>{t('home_Type')}</div>
                    <div>{formatSymbol}</div>
                  </motion.div>

                  {
                    <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                      <div style={{ color: "#888B92" }}>{t('card_184')}</div>
                      <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}> {inputVal.amount} {symbol}</div>
                    </motion.div>
                  }

                  <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                    <div style={{ color: "#888B92" }}>{t('home_borrow_18')}</div>
                    <div>{lookData.fee} {formatSymbol} </div>
                  </motion.div>

                  {
                    <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                      <div style={{ color: "#888B92" }}>{t('home_ID')}</div>
                      <div style={{ width: "70%", wordWrap: "break-word", textAlign: "right" }}>{lookData.id}</div>
                    </motion.div>
                  }

                  <motion.div variants={item} className='flex justify-content-space px-20 mt-24' >
                    <div style={{ color: "#888B92" }}>{t('home_Time')}</div>
                    <div>{getNowTime()}</div>
                  </motion.div>
                  <div className="mb-24"></div>
                </motion.div>
              </div>
            </BootstrapDialog>

          </div>
          }
          {
                loadingShow &&
                <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                    </div>

                    <div className="loadingChuang1">
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>
                        <div className="loadingChuangTiao1"></div>
                        <div className="loadingChuangTiao2"></div>

                    </div>
                </div>
            }
    </div>
  );
}

export default React.memo(Swap);
