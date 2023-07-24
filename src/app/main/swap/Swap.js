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
  getSwapCrypto,
} from "../../store/swap/swapThunk";
import { useDispatch, useSelector } from "react-redux";

import "../../../styles/home.css";
import StyledAccordionSelect from "../../components/StyledAccordionSelect";
import { arrayLookup } from "../../util/tools/function";
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
  const symbols = config.symbols;
  const symbolsData = config.symbols;
  const networks = config.networks;
  const fiatData = useSelector(selectUserData).fiat;
  const userData = useSelector(selectUserData);
  const walletData = useSelector(selectUserData).wallet;
  const cryptoDisplayData = useSelector(selectUserData).cryptoDisplay;
  const [expanded, setExpanded] = useState(null);
  const [symbolWallet, setSymbolWallet] = useState([]);
  const [currencyCode, setCurrencyCode] = useState(
    fiatData[0]?.currencyCode || "USD"
  );
  // const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [hasData, setHasData] = useState(false);
  const [formatSymbol, setFormatSymbol] = useState("");
  const [priceData, setPriceData] = useState({
    pair: "",
    price: "",
    qty_base: "",
    qty_quote: "",
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
    amount: 0.0,
  });
  const { t } = useTranslation("mainPage");
  const walletTypeTab = [
    // t("home_wallet_1"),
    oppenappid,
    decentralized == -1 ? 'Wallet Connect' : `${regWallet ?? "Wallet Connect"}`,
  ];

  useEffect(() => {
    if (window.sessionStorage.getItem("openAppId")) {
      if (openType.list[0].no == window.sessionStorage.getItem("openAppId")) {
        console.log('');
        setopenapp('Funibet Wallet')
      }
      if (openType.list[1].no == window.sessionStorage.getItem("openAppId")) {
        setopenapp('BeingFi Wallet')
      }
    }

  }, [window.sessionStorage.getItem("openAppId")])




  const handleChangeInputVal = (prop, value) => (event) => {
    console.log(event.target.value);
    console.log(
      arrayLookup(symbolWallet, "symbol", symbol, "balance"),
      "balance......"
    );
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
  // const symbolsFormatAmount = () => {
  //     let tmpSymbols = [];
  //     let currencyRate = arrayLookup(config.payment.currency, 'currencyCode', currencyCode, 'exchangeRate') || 0;
  //     // 美元汇率
  //     let dollarCurrencyRate = arrayLookup(config.payment.currency, 'currencyCode', 'USD', 'exchangeRate') || 0;
  //     cryptoDisplayData.forEach((i)=>{
  //         if(i.show){
  //             let item = symbolsData.find(sub=>sub.symbol===i.name)||i;
  //             if(item.symbol) {
  //                 let newItem = toNewItem(item,currencyRate,dollarCurrencyRate);
  //                 tmpSymbols.push(newItem);
  //             }
  //
  //         }
  //     })
  //
  //     symbolsData.forEach(item=>{
  //         if(item.userShow && !tmpSymbols.find(i=>i.symbol===item.symbol)){
  //             let newItem = toNewItem(item,currencyRate,dollarCurrencyRate);
  //             tmpSymbols.push(newItem);
  //         }
  //     })
  //     setSymbolWallet(tmpSymbols);
  // };

  const symbolsFormatAmount = () => {
    let currencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        currencyCode,
        "exchangeRate"
      ) || 0;
    let displayData = [];
    cryptoDisplayData?.map((item, index) => {
      displayData.push(item.name);
    });
    symbolsData.map((item, index) => {
      if (displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
        displayData.push(item.symbol);
      }
    });
    let tmpSymbols = [];
    // 美元汇率
    let dollarCurrencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        "USD",
        "exchangeRate"
      ) || 0;
    displayData.forEach((item, index) => {
      var tmpShow = arrayLookup(cryptoDisplayData, "name", item, "show");
      if (tmpShow === "") {
        tmpShow = arrayLookup(symbolsData, "symbol", item, "userShow");
      }
      if (tmpShow === true) {
        // 兑换成USDT的汇率
        let symbolRate = arrayLookup(symbolsData, "symbol", item, "rate") || 0;
        var balance = getUserMoney(item);
        tmpSymbols.push({
          avatar: arrayLookup(symbolsData, "symbol", item, "avatar") || "",
          symbol: item,
          balance: balance, // 余额
          dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
          currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
          tradeLock:
            arrayLookup(walletData.inner, "symbol", item, "tradeLock") || 0,
          withdrawLock:
            arrayLookup(walletData.inner, "symbol", item, "withdrawLock") || 0,
        });
      }
    });
    const sortUseAge = (a, b) => {
      const prioritizedSymbolsFirst = ['eUSGT', 'USGT', 'BGT', 'eBGT'];
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
    console.log(tmpSymbols, 'tmpNetData......');
    tmpSymbols.sort(sortUseAge)
    setSymbolWallet(tmpSymbols.filter(i => i.symbol !== 'eUSGT'));
  };
  const getUserMoney = (symbol) => {
    let arr = userData.wallet.inner || [];
    let balance = arrayLookup(arr, "symbol", symbol, "balance") || 0;
    return balance.toFixed(6);
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
    console.log(regWallet);
    dispatch(
      getSwapPrice({
        srcSymbol: symbol,
        dstSymbol: formatSymbol,
        amount: inputVal.amount,
      })
    ).then((res) => {
      let result = res.payload;
      if (result) {
        setPriceData(result.data);
        dispatch(
          getSwapCrypto({
            srcSymbol: symbol,
            dstSymbol: formatSymbol,
            amount: inputVal.amount,
          })
        );
      }
    });
  };
  useEffect(() => {
    setHasData(
      symbolWallet.length === 0 && symbolsData.length > 0 && networks.length > 0
    );
  }, [cryptoDisplayData, symbolsData, networks]);

  useEffect(() => {
    hasData && symbolsFormatAmount();
  }, [hasData]);

  useEffect(() => {
    dispatch(getSwapConfig()).then((res) => {
      res.errno === 0 && dispatch(setSwapConfig(res));
    });
  }, []);

  useEffect(() => {
    if (userData.profile?.user?.regWallet) {
      setRegWallet(toRegWallet(userData.profile?.user?.regWallet));
    }
  }, [userData.profile?.user?.regWallet]);

  return (
    <div>
      <div
        className="flex justify-center items-center wallet-top radius999"
        style={{ marginBottom: "16px" }}
      >
        <Tabs
          component={motion.div}
          variants={item}
          value={walletType}
          onChange={(ev, value) => {
            setWalletType(value);
          }}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="wallet-show-type"
          classes={{
            indicator:
              "flex justify-between bg-transparent w-full h-full min-h-28 radius999",
          }}
          TabIndicatorProps={{
            children: (
              <Box className="w-full h-full rounded-full huaKuaBgColor0 min-h-28 radius999" />
            ),
          }}
          sx={{
            // padding: '1rem 1.2rem',
            flex: 1,
          }}
        >

          {walletTypeTab.map((key, label) => {

            if (label == 0) {
              return (
                <Tab
                  style={{ fontSize: '1.4rem' }}
                  className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "
                  disableRipple
                  key={key}
                  icon={
                    <img
                      className="mr-8"
                      width="22"
                      src="/assets/images/logo/loading-img.png"
                      alt=""
                    />
                  }
                  iconPosition="start"
                  label={key}
                  sx={{
                    color: "#FFFFFF",
                    width: "50%",
                  }}
                />
              );

            } else {
              if (decentralized == 1) {
                return (
                  <Tab
                    style={{ fontSize: '1.4rem' }}
                    className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "
                    disableRipple
                    key={key}
                    icon={
                      <img
                        className="mr-8"
                        width="22"
                        src={(() => {
                          switch (walletloginname) {
                            case "BitKeep":
                              return "/assets/images/login/icon-right-14.png";
                            case "MetaMask":
                              return "/assets/images/login/icon-right-1.png";
                            case "WalletConnect":
                              return "/assets/images/login/icon-right-5.png";
                            case "coinbase":
                              return "/assets/images/login/icon-right-10.png";
                            case "TrustWallet":
                              return "/assets/images/login/icon-right-12.png";
                            case "Coinbase":
                              return "/assets/images/login/icon-right-4.png";
                            case "Polygon":
                              return "/assets/images/login/icon-right-13.png";
                            case "Bitski":
                              return "/assets/images/login/icon-right-15.png";
                            case "CLedger":
                              return "/assets/images/login/icon-right-16.png";
                            case "Binance Smart":
                              return "/assets/images/login/icon-right-17.png";
                            case "BeingFi Wallet":
                              return "/assets/images/menu/LOGO.png ";
                            default:
                              return "/assets/images/menu/icon-wallet-active.png ";
                          }
                        })()}
                        alt=""
                      />
                    }
                    iconPosition="start"
                    label={walletloginname}
                    sx={{
                      color: "#FFFFFF",
                      width: "50%",
                    }}
                  />
                );
              } else {
                return (
                  <Tab
                    style={{ fontSize: '1.4rem' }}
                    className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999 "
                    disableRipple
                    key={key}
                    icon={
                      <img
                        className="mr-8"
                        width="22"
                        src="/assets/images/menu/icon-wallet-active.png"
                        alt=""
                      />
                    }
                    iconPosition="start"
                    label={'Wallet Connect'}
                    sx={{
                      color: "#FFFFFF",
                      width: "50%",
                    }}
                  />
                );
              }
            }
          })}
        </Tabs>
      </div>
      {walletType === 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="p-24 swap-container"
          style={{ paddingTop: 0, paddingBottom: 0 }}
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
            className="w-full rounded-16 border flex flex-col"
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
            {/* <StyledAccordion */}
            {/*     component={motion.div} */}
            {/*     variants={item} */}
            {/*     classes={{ */}
            {/*         root: 'FaqPage-panel shadow', */}
            {/*     }} */}
            {/*     expanded={expanded === 1} */}
            {/*     onChange={toggleAccordion(1)} */}
            {/* > */}
            {/*     <AccordionSummary */}
            {/*         expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>} */}
            {/*     > */}
            {/*         <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}> */}
            {/*             <div className="flex items-center"> */}
            {/*                 <img style={{ */}
            {/*                     width: '3rem' */}
            {/*                 }} src="assets/images/deposite/bnb.png" alt=""/> */}
            {/*                 <div className="px-12 font-medium"> */}
            {/*                     <Typography className="text-16 font-medium">BNB</Typography> */}
            {/*                     <Typography className="text-14" style={{color: '#94A3B8'}}>Binance Coin</Typography> */}
            {/*                 </div> */}
            {/*             </div> */}
            {/*             <div style={{marginLeft: 'auto'}}> */}
            {/*                 <div className="px-12 font-medium" style={{textAlign: 'right'}}> */}
            {/*                     <Typography className="text-16 font-medium">0.00000001</Typography> */}
            {/*                     <Typography className="text-14" style={{color: '#94A3B8'}}>$12.00</Typography> */}
            {/*                 </div> */}
            {/*             </div> */}
            {/*         </div> */}
            {/*     </AccordionSummary> */}

            {/*     <AccordionDetails> */}
            {/*     </AccordionDetails> */}
            {/* </StyledAccordion> */}
          </Box>

          <div className="flex items-center justify-content-center -mb-56 -mt-4 position-re">
            <div className="cursor-pointer swap-btn flex items-center justify-content-center">
              {/* <FuseSvgIcon className="list-item-icon" color="action" size={52}> */}
              {/*material-twotone:transform*/}
              {/* material-twotone:import_export */}
              {/* </FuseSvgIcon> */}
              <img src="assets/images/swap/arrow-down.png" alt="" />
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
            {symbolWallet.length > 0 && (
              <StyledAccordionSelect
                symbol={symbolWallet}
                currencyCode="USD"
                setSymbol={setFormatSymbol}
              />
            )}
            {/* <StyledAccordion */}
            {/*     component={motion.div} */}
            {/*     variants={item} */}
            {/*     classes={{ */}
            {/*         root: 'FaqPage-panel shadow', */}
            {/*     }} */}
            {/*     expanded={expanded === 2} */}
            {/*     onChange={toggleAccordion(2)} */}
            {/* > */}
            {/*     <AccordionSummary */}
            {/*         expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>} */}
            {/*     > */}
            {/*         <div className="flex items-center py-4 flex-grow" style={{width: '100%'}}> */}
            {/*             <div className="flex items-center"> */}
            {/*                 <img style={{ */}
            {/*                     width: '3rem' */}
            {/*                 }} src="assets/images/deposite/usd.png" alt=""/> */}
            {/*                 <div className="px-12 font-medium"> */}
            {/*                     <Typography className="text-18 font-medium">BNB</Typography> */}
            {/*                     <Typography className="text-14" style={{color: '#94A3B8'}}>Binance Coin</Typography> */}
            {/*                 </div> */}
            {/*             </div> */}
            {/*             <div style={{marginLeft: 'auto'}}> */}
            {/*                 <div className="px-12 font-medium" style={{textAlign: 'right'}}> */}
            {/*                     <Typography className="text-18 font-medium">0.00000001</Typography> */}
            {/*                     <Typography className="text-14" style={{color: '#94A3B8'}}>$12.00</Typography> */}
            {/*                 </div> */}
            {/*             </div> */}
            {/*         </div> */}
            {/*     </AccordionSummary> */}

            {/*     <AccordionDetails> */}
            {/*     </AccordionDetails> */}
            {/* </StyledAccordion> */}
          </Box>

          <Typography
            className="text-20 font-medium my-16 color-76819B"
            style={{ position: "relative", top: "0.8rem" }}
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
              {/* <OutlinedInput
                            id="outlined-adornment-address send-tips-container-address"
                            value={inputVal.amount}
                            onChange={handleChangeInputVal('amount')}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'address',
                            }}
                        /> */}
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
            {/* <Typography className="my-8 text-16 color-ffffff text-center" style={{ color: '#7e8c9f', marginTop: '3.3rem', marginBottom: '1.3rem' }}>
                        Accessed 11 Exchange platforms:
                    </Typography>
                    <div className="my-8">
                        <div className="flex items-center justify-content-center">
                            <img className="mx-4 swap-img" src="assets/images/swap/1.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/2.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/3.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/4.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/5.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/6.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/7.png" alt="" />
                        </div>
                        <div className="flex items-center justify-content-center my-12">
                            <img className="mx-4 swap-img" src="assets/images/swap/8.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/9.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/10.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/11.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/12.png" alt="" />
                            <img className="mx-4 swap-img" src="assets/images/swap/13.png" alt="" />
                        </div>
                    </div> */}

            <Button
              style={{ width: "63%", margin: "2.9rem auto", display: "block" }}
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
        userData.profile?.loginType != 1 && (
          <>
            {" "}
            <Web3Login />
          </>
        )}
    </div>
  );
}

export default React.memo(Swap);
