import { useState, useEffect, default as React, memo, useRef } from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import clsx from "clsx";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Switch from "@mui/material/Switch";
import history from "@history";
import { useSelector, useDispatch } from "react-redux";
import { selectConfig } from "../../store/config";
import { selectUserData } from "../../store/user";
import {
  arrayLookup,
  getOpenAppId,
  getOpenAppIndex,
  getUrlParam, getUserLoginState,
  getUserLoginType,
  canLoginAfterRequest,
  setPhoneTab
} from "../../util/tools/function";
import { updateCurrency, updateWalletDisplay, updateWalletLoading} from "../../store/user";
import { showMessage } from "app/store/fuse/messageSlice";
import { centerGetNftList } from '../../store/wallet/walletThunk';

import "../../../styles/home.css";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import ComingSoon from "../coming-soon/ComingSoon";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  getDecenterWalletBalance,
  bindWallet,
  selNetwork,
  setCurrencySelect,
  getCurrencySelect,
} from "../../store/user/userThunk";
import {
  getCryptoDisplay,
  setCryptoDisplay,
  getWalletDisplay,
  setWalletDisplay,
  getFiatDisplay,
  setCurrencyDisplay,
  getNftDisplay,
  setNftDisplay,
  getNftConfig,
} from "../../store/wallet/walletThunk";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AnimateModal from "../../components/FuniModal";
import AnimateModal2 from "../../components/FuniModal2";
import axios from "axios";
import domain from "../../api/Domain";
import phoneCode from "../../../phone/phoneCode";
import qs from "qs";
import Web3Login from "../login/Web3Login";
import coinbaseWallet from "../../util/web3/coinbase";
import { useTranslation } from "react-i18next";
import openType from './opentype.json'
import { symbol } from "prop-types";
import { Image } from "@mui/icons-material";
import userLoginType from "../../define/userLoginType";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { centerGetTokenBalanceList, userProfile } from "app/store/user/userThunk";
import { centerGetUserFiat } from "app/store/wallet/walletThunk";
import RetiedEmail from "../login/RetiedEmail";
import RetiedPhone from "../login/RetiedPhone";
import ReloginDialog from '../../components/ReloginDialog';
import userLoginState from "../../define/userLoginState";

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const handleCopyText = (text) => {
  var input = document.createElement("input");
  document.body.appendChild(input);
  input.setAttribute("value", text);
  input.select();
  document.execCommand("copy"); // 执行浏览器复制命令
  if (document.execCommand("copy")) {
    document.execCommand("copy");
  }
  document.body.removeChild(input);
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

//从大到小排列
// const sortUseAge = (a, b) => {
//   return b.dollarFiat - a.dollarFiat;
// };



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
    if (dollarFiatB == dollarFiatA) {
      return -1
    }
    return dollarFiatB - dollarFiatA;
  } else if (isPrioritizedBSecond) {
    // 如果只有 b 是第二组优先展示的币种，则将 b 排在前面
    // return 1;
    if (dollarFiatB == dollarFiatA) {
      return -1
    }
    return dollarFiatB - dollarFiatA;
  } else {
    // 如果两个币种都不属于优先展示的币种，则保持原有顺序
    // return 0;
    return dollarFiatB - dollarFiatA;
  }
};

function Wallet(props) {
  const { t } = useTranslation("mainPage");
  const dispatch = useDispatch();
  const [selectedSymbol, setSelectedSymbol] = useState(getUrlParam("symbol"));
  const [walletType, setWalletType] = useState(0);
  const [showType, setShowType] = useState(0);
  const [searchInput, setSearchInput] = useState(false);
  const [isFait, setIsFait] = useState(false);
  const [hideSmall, setHideSmall] = useState(false);
  const config = useSelector(selectConfig);
  const userData = useSelector(selectUserData);
  const loginState = userData.loginState;
  const fiatsData = userData.fiat || [];
  const symbolsData = config.symbols;
  const networks = config.networks || [];
  const paymentFiat = config.payment?.currency;
  const [ranges, setRanges] = useState([
    // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
    t('home_deposite_1'), t('home_deposite_2')
  ]);
  const [walletConnectShow, setWalletConnectShow] = useState(false);
  const [userSetting, setUserSetting] = useState({});
  const [isOpenEye, setIsOpenEye] = useState(false);
  // const walletDisplayData = userData.walletDisplay || [];
  // const walletDisplayData =  [];
  const [walletDisplayData, setwalletDisplayData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [copyTiShi, setCopyTiShi] = useState(false);
  const currentLanguage = useSelector(selectCurrentLanguage);

  useEffect(() => {
    setRanges([t('home_deposite_1'), t('home_deposite_2')]);
  }, [currentLanguage.id]);

  useEffect(() => {
    setwalletDisplayData(userData.walletDisplay);
  }, [userData]);

  const changePhoneTab = (tab) => {
    window.localStorage.setItem('phoneTab', tab);
  }

  //修改渲染过多
  const toRegWallet = (regWalletParam) => {
    if (regWalletParam) {
      return (
        regWalletParam.slice(0, 1).toUpperCase() +
        regWalletParam.slice(1).toLowerCase()
      );
    }
    return regWalletParam;
  };

  const [regWallet, setRegWallet] = useState(
    localStorage.getItem("walletname")
  );
  const [oppenappid, setopenapp] = useState('Funibox Wallet'
    // window.sessionStorage.getItem("openAppId")
  );
  const [walletImage, setWalletImage] = useState("");

  const loginType = getUserLoginType(userData);
  useEffect(() => {
    if (window.sessionStorage.getItem("openAppId")) {
      if (openType.list[0].no == window.sessionStorage.getItem("openAppId")) {
        console.log('');
        setopenapp('Funibet Wallet')
      }
      if (openType.list[1].no == window.sessionStorage.getItem("openAppId")) {
        setopenapp('BeingFi Wallet')
        console.log();
      }
    } else {

    }

  }, [window.sessionStorage.getItem("openAppId")])
  const [walletTypeTab, setwalletTypeTab] = useState(oppenappid, null);
  //修改regWallet
  // useEffect(()=> {
  //     setRegWallet(toRegWallet(userData.profile?.user?.regWallet));
  //     setWalletImage( config.walletConfig[regWallet]?.img);
  //     setwalletTypeTab([
  //             'FuniBox Wallet', 'Metamask'
  //         ])
  // },[userData.profile?.user?.regWallet])

  // setRegWallet(useMemo(
  //     () => {
  //         setWalletImage(config.walletConfig[regWallet]?.img);
  //         setwalletTypeTab([
  //             'FuniBox Wallet', userData.profile?.user?.regWallet
  //         ])
  //         return toRegWallet(userData.profile?.user?.regWallet);
  //     }, [userData.profile?.user?.regWallet]
  // ))

  //end
  const [tabValue, setTabValue] = useState(0);
  const showTypeTab = ["Token", "Fiat", "NFTs"];
  const [walletloginname, setwalletloginname] = useState(
    window.localStorage.getItem("walletname") === "metamask"
      ? "MetaMask"
      : localStorage.getItem("walletname")
  );
  const [doPlus, setDoPlus] = useState(false);
  const [openChangeCurrency, setOpenChangeCurrency] = useState(false);
  const [openChangeNetwork, setOpenChangeNetwork] = useState(false);
  const [decentralized, setDdecentralized] = useState(
    window.localStorage.getItem("isDecentralized")
  );
  // let symbols = [];

  const [symbols, setSymbols] = useState([]);
  const [searchSymbols, setSearchSymbols] = useState([]);

  const [cryptoDisplayData, setCryptoDisplayData] = useState([]);
  const [cryptoDisplayShowData, setCryptoDisplayShowData] = useState([]);

  const [fiatDisplayData, setFiatDisplayData] = useState([]);
  const [fiatDisplayShowData, setFiatDisplayShowData] = useState([]);

  const [nftDisplayData, setNftDisplayData] = useState([]);
  const [nftDisplayShowData, setNftDisplayShowData] = useState([]);

  // const [walletDisplayData, setWalletDisplayData] = useState([]);
  const [walletDisplayShowData, setWalletDisplayShowData] = useState([]);

  const [fiats, setFiats] = useState([]);
  const [searchFiats, setSearchFiats] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [nftBalance, setNftBalance] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [searchNfts, setSearchNfts] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const [walletAmount, setWalletAmount] = useState({});

  const [inputVal, setInputVal] = useState({
    searchText: "",
  });
  let currencyCode = userData.currencyCode || "VND";
  let currencyRate =
    arrayLookup(
      config.payment.currency,
      "currencyCode",
      currencyCode,
      "sellRate"
    ) || 0;

  const currencys = config.payment.currency || [];
  const [decenterSymbols, setDecenterSymbols] = useState([]);
  const [decenterSymbolsSearch, setDecenterSymbolsSearch] = useState([]);
  const [openAnimateModal, setOpenAnimateModal] = useState(false);
  const [cryptoSelect, setCryptoSelect] = useState(0);
  const [fiatSelect, setFiatSelect] = useState(1);
  const [openBindWinow, setOpenBindWinow] = useState(false);
  const [openBindEmail, setOpenBindEmail] = useState(false);
  const [openBindPhone, setOpenBindPhone] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const [openLoginWinow, setOpenLoginWinow] = useState(false);

  const mounted = useRef();
  // let fiats = [];
  const handleChangeInputVal = (prop) => (event) => {
    if (prop === "searchText") {
      let tmpSearchVal = event.target.value;
      setDoPlus(false);
      if (walletType === 0) {
        doSearchData(tmpSearchVal);
      } else if (walletType === 1) {
        doSearch(tmpSearchVal);
      }
    }
    setInputVal({ ...inputVal, [prop]: event.target.value });
  };
  const [totalBalance, setTotalBalance] = useState(0);

  const copyTiShiFunc = () => {
    setCopyTiShi(true)
    setTimeout(() => {
      setCopyTiShi(false)
    }, 800);
  }


  const myFunction = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };

    useEffect(()=>{
        if(!userData.walletLoading){
            setLoadingShow(false);
        }else{
            setLoadingShow(true);
        }
    }, userData.walletLoading)

  // useEffect(() => {
  //   if (symbols.length > 0) {
  //     setLoadingShow(true);
  //   }
  // }, [symbols]);

  useEffect(() => {
    if (userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat > 200) {
      if (userData.profile.user.bindEmail === false && userData.profile.user.bindMobile === false) {
        if (openBindEmail === false && openBindPhone === false) {
          setOpenBindWinow(true);
        }
      }
    } else {
      setOpenBindWinow(false);
    }
  }, [userData.profile]);

  const backPageEvt = () => {
    setOpenBindPhone(false)
    setOpenBindEmail(false);
    dispatch(userProfile())
    myFunction;
  }

  const handleSelectedSymbol = (type, symbol) => {
    setSelectedSymbol(symbol);
    let data = {
      currencyType: type,
      symbol: "",
      fiatCode: "",
    };
    if (type === 1) {
      data.symbol = symbol;
    } else {
      data.fiatCode = symbol;
    }
    let currencydata = {
      currencyType: type,
      currencySymbol: symbol
    }
    // saveSettingSymbol(data);
    // setCurrencySelect(currencydata)
    dispatch(setCurrencySelect(currencydata)).then((res) => {
      dispatch(getCurrencySelect());
    })
  };

  const saveSettingSymbol = async (data) => {
    var openAppId = getOpenAppId();
    var openIndex = getOpenAppIndex();
    const service = axios.create({
      timeout: 50000, // request timeout
    });
    var post = {
      url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/setUserSetting`,
      method: "post",
      data: qs.stringify(data),
      async: true,
    };

    service.interceptors.request.use(
      config => {
        config.headers['Finger-Nft-Token'] = `${window.localStorage.getItem(
          `Authorization-${getOpenAppId()}-${getOpenAppIndex()}`
        ) || ''}`;
        config.headers['Wallet-OpenApp-Id'] = openAppId || '6436951541b60d250c692481';

        config.headers['Wallet-OpenApp-Index'] = openIndex;

        return config;
      },
      err => Promise.reject(err)
    )

    let res = await service(post);
    if (res.data.errno === 0) {
    }

    return false;
  };
  // 全局搜索
  const doSearchData = (searchText) => {
    setSearchData([]);

    if (searchText) {
      setIsSearch(true);
      let tmpSearchArr = [];
      for (var i = 0; i < cryptoDisplayShowData.length; i++) {
        if (
          cryptoDisplayShowData[i].symbol
            .toUpperCase()
            .match(searchText.toUpperCase())
        ) {
          let tmpSymbol = cryptoDisplayShowData[i];
          tmpSymbol.type = "token";
          tmpSearchArr.push(tmpSymbol);
        }
      }

      for (var i = 0; i < fiatDisplayShowData.length; i++) {
        if (
          fiatDisplayShowData[i].currencyCode
            .toUpperCase()
            .match(searchText.toUpperCase())
        ) {
          let tmpCurrency = fiatDisplayShowData[i];
          tmpCurrency.type = "fiat";
          tmpSearchArr.push(tmpCurrency);
        }
      }

      for (var i = 0; i < nftDisplayShowData.length; i++) {
        if (
          nftDisplayShowData[i].symbol
            .toUpperCase()
            .match(searchText.toUpperCase())
        ) {
          let tmpNft = nftDisplayShowData[i];
          tmpNft.type = "nft";
          tmpSearchArr.push(tmpNft);
        }
      }

      setSearchData(tmpSearchArr);
    } else {
      setIsSearch(false);
    }
  };

  const getSettingSymbol = async () => {
    return {}
    var openAppId = getOpenAppId();
    var openIndex = getOpenAppIndex();
    const service = axios.create({
      timeout: 50000, // request timeout
    });
    var post = {
      url: `${domain.FUNIBET_API_DOMAIN}/gamecenter/getUserSetting`,
      method: "post",
      // data: qs.stringify(data),
      async: true,
    };
    service.interceptors.request.use(
      config => {
        config.headers['Finger-Nft-Token'] = `${window.localStorage.getItem(
          `Authorization-${getOpenAppId()}-${getOpenAppIndex()}`
        ) || ''}`;
        config.headers['Wallet-OpenApp-Id'] = openAppId || '6436951541b60d250c692481';

        config.headers['Wallet-OpenApp-Index'] = openIndex;

        return config;
      },
      err => Promise.reject(err)
    )

    let res = await service(post);

    if (res.data.errno === 0) {
      setUserSetting(res.data.data);
      setFiatDisplaySubmit(res.data.data.setting.fiatCode, true)
    }

    return res;
  };

  useEffect(() => {
    if (JSON.stringify(userData.profile) !== '{}') {
      const curLoginType = getUserLoginType(userData);
      if (curLoginType !== userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP) {
        getSettingSymbol().then((res) => {
          var currencyType = res.data?.data?.setting?.currencyType
          if (currencyType) {
            if (currencyType == 1) {
              tmpRanges = [
                t('home_deposite_1'), t('home_deposite_2')
                // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
              ];
              tmpCryptoSelect = 0;
              tmpFiatSelect = 1;
            } else {
              console.log('存在.......');
              var tmpRanges = [
                t('home_deposite_2'), t('home_deposite_1')
                // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
              ];
              var tmpCryptoSelect = 1;
              var tmpFiatSelect = 0;
            }

            setRanges(tmpRanges);
            setCryptoSelect(tmpCryptoSelect);
            setFiatSelect(tmpFiatSelect);
          } else if (curLoginType !== "unknown") {
            var tmpRanges = [
              t('home_deposite_2'), t('home_deposite_1')
              // t('home_deposite_2'), t('home_deposite_1'), t('home_deposite_3')
            ];
            var tmpCryptoSelect = 1;
            var tmpFiatSelect = 0;
            if (userData.profile.wallet?.Crypto < userData.profile.wallet?.Fiat) {
            } else if (userData.profile.wallet?.Crypto > userData.profile.wallet?.Fiat) {
              tmpRanges = [
                t('home_deposite_1'), t('home_deposite_2')
                // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
              ];
              tmpCryptoSelect = 0;
              tmpFiatSelect = 1;
            } else {
              if (curLoginType === "web3_wallet") {
                tmpRanges = [
                  t('home_deposite_1'), t('home_deposite_2')
                  // t('home_deposite_1'), t('home_deposite_2'), t('home_deposite_3')
                ];
                tmpCryptoSelect = 0;
                tmpFiatSelect = 1;
              }
            }
            setRanges(tmpRanges);
            setCryptoSelect(tmpCryptoSelect);
            setFiatSelect(tmpFiatSelect);
          }
        })
      }
    } else { //telegram小程序的标题语言处理
      setRanges([t('home_deposite_1'), t('home_deposite_2')]);
      setWalletConnectShow(true);
    }
    // dispatch(getCurrencySelect());
  }, [userData.profile]);
  // 搜索
  const doSearch = (searchText) => {
    if (showType === cryptoSelect && walletType === 0) {
      if (searchText) {
        setSearchSymbols([]);
        let tmpSearchArr = [];
        for (var i = 0; i < symbols.length; i++) {
          if (symbols[i].symbol.match(searchText.toUpperCase())) {
            tmpSearchArr.push(symbols[i]);
          }
        }
        setSearchSymbols(tmpSearchArr);
      } else {
        setSearchSymbols(symbols);
      }
    } else if (showType === fiatSelect && walletType === 0) {
      if (searchText) {
        setSearchFiats([]);
        let tmpSearchArr = [];
        for (var i = 0; i < fiats.length; i++) {
          if (fiats[i].currencyCode.match(searchText.toUpperCase())) {
            tmpSearchArr.push(fiats[i]);
          }
        }
        setSearchFiats(tmpSearchArr);
      } else {
        setSearchFiats(fiats);
      }
    } else if (showType === 2 && walletType === 0) {
      if (searchText) {
        setSearchNfts([]);
        let tmpSearchArr = [];
        for (var i = 0; i < nftData.length; i++) {
          if (nftData[i].name.toUpperCase().match(searchText.toUpperCase())) {
            tmpSearchArr.push(nftData[i]);
          }
        }
        setSearchNfts(tmpSearchArr);
      } else {
        setSearchNfts(nftData);
      }
    } else if (walletType === 1) {
      if (searchText) {
        setDecenterSymbolsSearch([]);
        let tmpSearchArr = [];
        for (var i = 0; i < decenterSymbols.length; i++) {
          if (decenterSymbols[i].symbol.match(searchText.toUpperCase())) {
            tmpSearchArr.push(decenterSymbols[i]);
          }
        }
        setDecenterSymbolsSearch(tmpSearchArr);
      } else {
        setDecenterSymbolsSearch(decenterSymbols);
      }
    }
  };

  const getUserMoney = (symbol) => {
    let arr = userData?.wallet?.inner || [];
    let balance = arrayLookup(arr, "symbol", symbol, "balance") || 0;
    return balance.toFixed(6);
  };

  const getUserCurrencyMoney = () => {
    let amount = 0;
    let currencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        currencyCode,
        "sellRate"
      ) || 0;
    if (walletType === 0) {
      if (showType === cryptoSelect) {
        let symbolList = {};
        for (let i = 0; i < symbolsData.length; i++) {
          symbolList[symbolsData[i].symbol] = symbolsData[i];
        }
        if (isFait) {
          Object.keys(symbolList).forEach((key) => {
            let symbolRate = symbolList[key].sellRate || 0;
            amount +=
              getUserMoney(symbolList[key].symbol) *
              (symbolRate * currencyRate);
          });
        } else {
          Object.keys(symbolList).forEach((key) => {
            let symbolRate = symbolList[key].sellRate || 0;
            amount +=
              getUserMoney(symbolList[key].symbol) *
              symbolRate;
          });
        }
        setTotalBalance(amount.toFixed(2));
      } else if (showType === fiatSelect) {
        for (let i = 0; i < fiatsData.length; i++) {
          let tmpDollarMoney =
            fiatsData[i]["balance"] / fiatsData[i]["sellRate"];
          if (tmpDollarMoney >= 0) {
            amount += currencyRate * tmpDollarMoney;
          }
        }
        if (!amount) {
          amount = 0;
        }
        setTotalBalance(amount.toFixed(2));
      } else if (showType === 2) {
        setTotalBalance(amount.toFixed(2));
      } else {
        setTotalBalance(amount.toFixed(2));
      }
    } else {
      if (isFait) {
        for (let i = 0; i < decenterSymbols.length; i++) {
          let symbolRate = arrayLookup(symbolsData, "symbol", decenterSymbols[i].symbol, "rate") || 0;
          amount += decenterSymbols[i].balance * (symbolRate * currencyRate);
        }
      } else {
        for (let i = 0; i < decenterSymbols.length; i++) {
          let symbolRate = arrayLookup(symbolsData, "symbol", decenterSymbols[i].symbol, "rate") || 0;
          amount += decenterSymbols[i].balance * symbolRate;
        }
      }

      setTotalBalance(amount.toFixed(2));
    }
  };

  // 初始化TotalBalance
  useEffect(() => {
    getUserCurrencyMoney();
  }, [
    symbolsData,
    userData?.wallet?.inner,
    decenterSymbols,
    decenterSymbolsSearch,
    currencyCode,
    showType,
    walletType,
    currencyCode,
    isFait,
    ranges,
  ]);

  // 美元汇率
  const dollarCurrencyRate =
    arrayLookup(
      config.payment.currency,
      "currencyCode",
      // "USD",
      "VND",
      "sellRate"
    ) || 0;

  // token数据整理
  const symbolsFormatAmount = () => {
    if (symbolsData.length === 0 || !userData?.wallet?.inner) {
      return;
    }

    let displayData = [];
    let tmpCryptoDisplayData = {};
    let tmpSymbolsData = {};
    cryptoDisplayData?.map((item, index) => {
      displayData.push(item.name);
      tmpCryptoDisplayData[item.name] = item;
    });

    symbolsData?.map((item, index) => {
      if (displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
        displayData.push(item.symbol);
      }
      tmpSymbolsData[item.symbol] = item;
    });

    let tmpSymbols = [];
    displayData.forEach((item, index) => {
      // var tmpShow = arrayLookup(cryptoDisplayData, 'name', item, 'show');
      var tmpShow = tmpCryptoDisplayData[item]?.show;
      if (tmpShow === "" || tmpShow === null || tmpShow === undefined) {
        // tmpShow = arrayLookup(symbolsData, 'symbol', item, 'userShow');
        tmpShow = tmpSymbolsData[item]?.userShow;
      }
      if (tmpShow === true) {
        // 兑换成USDT的汇率
        let symbolRate = tmpSymbolsData[item]?.sellRate || 0;
        var balance = getUserMoney(item);
        tmpSymbols.push({
          avatar: tmpSymbolsData[item]?.avatar || "",
          symbol: item,
          balance: balance, // 余额
          dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
          currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
        });
      }
    });

    let tmpDisplaySymbols = [];
    symbolsData.forEach((symbol, index) => {
      // var tmpShow = arrayLookup(cryptoDisplayData, 'name', symbol.symbol, 'show');
      var tmpShow = tmpCryptoDisplayData[symbol.symbol]?.show;
      if (tmpShow === "" || tmpShow === null || tmpShow === undefined) {
        tmpShow = symbol.userShow;
      }

      // 兑换成USDT的汇率
      let symbolRate = symbol.sellRate || 0;
      var balance = getUserMoney(symbol.symbol);
      if (!arrayLookup(tmpDisplaySymbols, "symbol", symbol.symbol, "symbol")) {
        tmpDisplaySymbols.push({
          avatar: symbol.avatar,
          symbol: symbol.symbol,
          balance: balance, // 余额
          dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
          currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币,
          isShow: tmpShow,
        });
      }
    });

    tmpSymbols.sort(sortUseAge);
    setSymbols(tmpSymbols);
    setSearchSymbols(tmpSymbols);
    setCryptoDisplayShowData(tmpDisplaySymbols);
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      setTimeout(() => {
        symbolsFormatAmount();
        if (isSearch) {
          if (walletType === 0) {
            doSearchData(inputVal.searchText);
          } else if (walletType === 1) {
            doSearch(inputVal.searchText);
          }
        }
      }, 0)
    }
  }, [
    symbolsData,
    userData?.wallet?.inner,
    currencyCode,
    isFait,
    cryptoDisplayData,
    showType,
  ]);

  // 讲某个币种排到最前面
  const pinToTopCurrency = (data, currencyCode) => {
    let topData = []
    let otherData = []
    data.length && data.forEach((item, index) => {
      if (item.currencyCode === currencyCode) {
        topData.push(item)
      } else {
        otherData.push(item)
      }
    })

    return [...topData, ...otherData]
  }

  // 法币数据整理
  const fiatsFormatAmount = () => {
    if (
      fiatsData.constructor !== Array ||
      fiatsData.length === 0 ||
      !paymentFiat
    ) {
      return;
    }

    let tmpFiatDisplayData = {};
    let tmpPaymentFiat = {};
    let tmpFiatsData = {};
    let tmpFiats = [];
    let displayFiatData = [];
    fiatDisplayData?.map((item, index) => {
      displayFiatData.push(item.name);
      tmpFiatDisplayData[item.name] = item;
    });
    if (paymentFiat?.length > 0) {
      paymentFiat.map((item, index) => {
        if (
          displayFiatData.indexOf(item.currencyCode) === -1 &&
          item.userShow === true
        ) {
          displayFiatData.push(item.currencyCode);
        }
        tmpPaymentFiat[item.currencyCode] = item;
      });
    }
    fiatsData?.map((item, index) => {
      tmpFiatsData[item.currencyCode] = item;
    });

    displayFiatData.forEach((item) => {
      // var tmpShow = arrayLookup(fiatDisplayData, 'name', item, 'show');
      var tmpShow = tmpFiatDisplayData[item]?.show;
      if (tmpShow === "" || tmpShow === null || tmpShow === undefined) {
        // tmpShow = arrayLookup(paymentFiat, 'currencyCode', item, 'userShow');
        tmpShow = tmpPaymentFiat[item]?.userShow;
      }

      if (tmpShow === true) {
        // let balance = arrayLookup(fiatsData, 'currencyCode', item, 'balance') || 0;
        let balance = tmpFiatsData[item]?.balance || 0;
        tmpFiats.push({
          avatar: tmpPaymentFiat[item]?.avatar || "",
          currencyCode: item,
          balance: balance.toFixed(2),
          dollarFiat:
            balance == 0 ? 0 : balance / tmpPaymentFiat[item]?.sellRate,
        });
      }
    });

    let tmpDisplayFiats = [];
    if (paymentFiat?.length > 0) {
      paymentFiat.map((item, index) => {
        // var tmpShow = arrayLookup(fiatDisplayData, 'name', item.currencyCode, 'show');
        var tmpShow = tmpFiatDisplayData[item.currencyCode]?.show;
        if (tmpShow === "" || tmpShow === null || tmpShow === undefined) {
          tmpShow = item.userShow;
        }

        let balance = tmpFiatsData[item.currencyCode]?.balance || 0;
        tmpDisplayFiats.push({
          avatar: item.avatar,
          currencyCode: item.currencyCode,
          balance: balance.toFixed(2),
          dollarFiat: balance == 0 ? 0 : balance / item.sellRate,
          isShow: tmpShow,
        });
      });
    }

    tmpFiats.sort(sortUseAge);
    // tmpFiats = pinToTopCurrency(tmpFiats, userSetting.setting.fiatCode);

    setFiats(tmpFiats);
    setSearchFiats(tmpFiats);
    setFiatDisplayShowData(tmpDisplayFiats);
  };
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      setTimeout(() => {
        fiatsFormatAmount();
        if (isSearch) {
          if (walletType === 0) {
            doSearchData(inputVal.searchText);
          } else if (walletType === 1) {
            doSearch(inputVal.searchText);
          }
        }
      }, 100)
    }
  }, [fiatsData, currencyCode, showType, fiatDisplayData, ranges]);

  //nft 数据整理
  const nftFormatAmount = () => {
    if (nfts?.length === 0) {
      return;
    }

    let tmpNftBalance = {};
    nftBalance?.forEach((item) => {
      if (tmpNftBalance[item.nftId]) {
        tmpNftBalance[item.nftId] = tmpNftBalance[item.nftId] + 1
      } else {
        tmpNftBalance[item.nftId] = 1
      }
    })

    let tmpNfts = [];
    let tmpNftID = {};
    let displayNftData = [];
    nftDisplayData?.map((item, index) => {
      displayNftData.push(item.name);
    });
    if (nfts?.length > 0) {
      nfts.map((item, index) => {
        tmpNftID[item.symbol] = item.id
        if (
          displayNftData.indexOf(item.symbol) === -1 &&
          item.userShow === true
        ) {
          displayNftData.push(item.symbol);
        }
      });
    }

    displayNftData.forEach((item, index) => {
      var tmpShow = arrayLookup(nftDisplayData, "name", item, "show");
      if (tmpShow === "" || tmpShow === null || tmpShow === undefined) {
        tmpShow = arrayLookup(nfts, "symbol", item, "userShow");
      }

      if (tmpShow === true) {
        tmpNfts.push({
          symbol: item,
          avatar: arrayLookup(nfts, "symbol", item, "avatar") || "",
          name: arrayLookup(nfts, "symbol", item, "name") || "",
          balance: tmpNftBalance[tmpNftID[item]] ?? 0,
          currencyAmount: 0,
          dollarFiat: 0,
        });
      }
    });

    let tmpDisplayNfts = [];
    if (nfts?.length > 0) {
      nfts.map((item, index) => {
        var tmpShow = arrayLookup(nftDisplayData, "name", item.symbol, "show");
        if (tmpShow === "") {
          tmpShow = item.userShow;
        }

        tmpDisplayNfts.push({
          symbol: item.symbol,
          avatar: item.avatar,
          name: item.name,
          balance: tmpNftBalance[item.id] ?? 0,
          currencyAmount: 0,
          dollarFiat: 0,
          isShow: tmpShow,
        });
      });
    }

    tmpNfts.sort(sortUseAge);
    setNftData(tmpNfts);
    setSearchNfts(tmpNfts);
    setNftDisplayShowData(tmpDisplayNfts);
  };
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      setTimeout(() => {
        nftFormatAmount();
        if (isSearch) {
          if (walletType === 0) {
            doSearchData(inputVal.searchText);
          } else if (walletType === 1) {
            doSearch(inputVal.searchText);
          }
        }
      }, 100)

    }
  }, [nfts, showType, nftDisplayData, nftBalance]);

  const initWalletData = () => {
    dispatch(getCryptoDisplay()).then((res) => {
      let result = res.payload;
      setCryptoDisplayData(result?.data);
    });
    dispatch(getFiatDisplay()).then((res) => {
      let result = res.payload;
      setFiatDisplayData(result?.data);
    });
    dispatch(getNftDisplay()).then((res) => {
      let result = res.payload;
      setNftDisplayData(result?.data);
    });
    // console.time('keyxxxx')
    dispatch(getWalletDisplay()).then((res) => {
      // if (res.errno === 0) {
      dispatch(updateWalletDisplay(res));
      // }
      // let result = res.payload;
      // setWalletDisplayData(result.data);
      // console.timeEnd('keyxxxx')
    });

    // 获取nft数据
    // dispatch(getNftConfig()).then((res) => {
    //   let result = res.payload;
    //   setNfts(result?.data);
    // });
    // dispatch(centerGetNftList()).then((res) => {
    //   let result = res.payload;
    //   setNftBalance(result?.inner);
    // })
  };
  useEffect(() => {
    setPhoneTab('wallet');
    setTimeout(() => {
      if (canLoginAfterRequest(userData)) { //登录过以后才会获取余额值
        dispatch(userProfile());
        dispatch(centerGetTokenBalanceList());
        dispatch(centerGetUserFiat()).then(()=> {
          setLoadingShow(false)
          dispatch(updateWalletLoading(false))
        });
      }
    }, 500)
  }, []);

  useEffect(() => {
    if(canLoginAfterRequest(userData)){ //已经进行过登录流程了
      initWalletData();
    }
  }, [loginState]);


  // 去中心化钱包数据整理
  const decenterWalletFormatAmount = async () => {

    let tmpWalletAmount = walletAmount;

    let tmpArr = [];
    // 美元汇率
    let dollarCurrencyRate =
      arrayLookup(
        config.payment.currency,
        "currencyCode",
        // "USD",
        "VND",
        "sellRate"
      ) || 0;

    for await (let symbol of symbolsData) {

      if (symbol.type === 0 || symbol.type === 1) {

        var balance = 0;

        // console.log(symbol.networkId);
        // console.log(userData.userInfo.networkId);


        if (symbol.networkId === userData.userInfo.networkId) {
          if (tmpWalletAmount[symbol.symbol]) {
            balance = tmpWalletAmount[symbol];
          } else {
            let balanceRes = await dispatch(
              getDecenterWalletBalance({
                address: symbol.address,
                decimals: symbol.decimals,
                type: symbol.type,
                symbol: symbol.symbol,
                image: symbol.avatar,
                networkChainId: arrayLookup(networks, 'id', symbol.networkId, 'chainId'),
              })
            );

            // console.log(balanceRes);

            balance = balanceRes.payload || 0;

            tmpWalletAmount[symbol.symbol] = balance;

          }
          // let balanceRes = await dispatch(getDecenterWalletBalance({
          //     address: symbol.address,
          //     decimals: symbol.decimals,
          //     type: symbol.type,
          // }));
        }

        balance = Number(balance).toFixed(6);


        var tmpShow = arrayLookup(
          walletDisplayData,
          "name",
          symbol.symbol,
          "show"
        );

        if (tmpShow === "") {
          tmpShow = symbol.userShow;
        }

        // 兑换成USDT的汇率
        let symbolRate = symbol.sellRate || 0;

        if (!arrayLookup(tmpArr, "symbol", symbol.symbol, "symbol")) {
          tmpArr.push({
            avatar: symbol.avatar,
            rate: symbol.sellRate,
            symbol: symbol.symbol,
            balance: balance, // 余额
            dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(2), // 换算成美元
            currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
            isShow: tmpShow,
          });
        } else {
          if (symbol.networkId === userData.userInfo.networkId) {
            var _index = tmpArr.findIndex(function (event) {
              return event.symbol === symbol.symbol;
            });
            tmpArr[_index] = {
              avatar: symbol.avatar,
              rate: symbol.sellRate,
              symbol: symbol.symbol,
              balance: balance, // 余额
              dollarFiat: (balance * symbolRate * dollarCurrencyRate).toFixed(
                2
              ), // 换算成美元
              currencyAmount: (balance * symbolRate * currencyRate).toFixed(2), // 换算成当前选择法币
              isShow: tmpShow,
            };
          }
        }
      }
    }

    let tmpSymbols = [];
    let displayData = [];
    walletDisplayData?.map((item, index) => {
      if (arrayLookup(tmpArr, "symbol", item, "symbol")) {
        displayData.push(item.name);
      }
    });

    symbolsData.map((item, index) => {
      if (arrayLookup(tmpArr, "symbol", item.symbol, "symbol") && displayData.indexOf(item.symbol) === -1 && item.userShow === true) {
        displayData.push(item.symbol);
      }
    });

    for await (let item of displayData) {
      var tmpShow = arrayLookup(walletDisplayData, "name", item, "show");
      if (tmpShow === "") {
        tmpShow = arrayLookup(symbolsData, "symbol", item, "userShow");
      }
      if (tmpShow === true) {
        tmpSymbols.push({
          symbol: item,
          avatar: arrayLookup(tmpArr, "symbol", item, "avatar"),
          name: arrayLookup(tmpArr, "symbol", item, "name"),
          balance: arrayLookup(tmpArr, "symbol", item, "balance"),
          currencyAmount: arrayLookup(tmpArr, "symbol", item, "currencyAmount"),
          dollarFiat: arrayLookup(tmpArr, "symbol", item, "dollarFiat"),
        });
      }
    }
    tmpSymbols.sort(sortUseAge);
    tmpSymbols = tmpSymbols.filter(i => i.symbol != 'eUSDT')

    setDecenterSymbols(tmpSymbols);
    setDecenterSymbolsSearch(tmpSymbols);
    setWalletDisplayShowData(tmpArr);
    setWalletAmount(tmpWalletAmount);

  };

  useEffect(() => {

    let userBindWallet = userData.userInfo.bindWallet ?? false;
    if (userBindWallet && walletType === 1) {
      if (!mounted.current) {
        mounted.current = true;
      } else {
        decenterWalletFormatAmount();
      }
    }
  }, [walletDisplayData]);

  useEffect(() => {
    if (networks.length > 0) {
      let tmpNetworks = [];
      networks.forEach((item, index) => {
        if (item.networkMode === "Ethereum") {
          tmpNetworks.push({
            id: item.id,
            chainId: item.chainId,
            hotConfigId: item.hotConfigId,
            avatar: item.avatar,
            network: item.network,
            rpc: item.rpc,
            symbol: item.symbol,
            networkMode: item.networkMode,
            networkLen: item.network.length,
          });
        }
      });

      const sortUseLen = (a, b) => {
        return a.networkLen - b.networkLen;
      };

      tmpNetworks.sort(sortUseLen);
      setNetworkData(tmpNetworks);
    }
  }, [networks]);

  // 切换网络
  const changeNetwork = async (network) => {

    console.log(network);

    const networkRes = await dispatch(selNetwork(network));
    if (networkRes.payload) {
      setOpenChangeNetwork(false);
    }
  };

  const changeCurrency = async (currency) => {
    await dispatch(updateCurrency(currency));
    setTimeout(() => {
      setOpenAnimateModal(false);
      // setOpenChangeCurrency(false);
    }, 300);
  };

  const setCryptoDisplaySubmit = (symbol, show) => {
    let tmpCryptoDisplay = [...cryptoDisplayData];
    if (!arrayLookup(tmpCryptoDisplay, "name", symbol, "name")) {
      tmpCryptoDisplay.push({
        name: symbol,
        show: show,
      });
    } else {
      var _index = tmpCryptoDisplay.findIndex(function (event) {
        return event.name === symbol;
      });
      tmpCryptoDisplay[_index] = {
        name: symbol,
        show: show,
      };
    }
    setCryptoDisplayData(tmpCryptoDisplay);
    dispatch(
      setCryptoDisplay({
        symbols: tmpCryptoDisplay,
      })
    ).then((res) => {
      let result = res.payload;
      setCryptoDisplayData(result?.data);
    });
  };

  const setFiatDisplaySubmit = (symbol, show) => {
    let tmpFiatDisplay = [...fiatDisplayData];
    if (!arrayLookup(tmpFiatDisplay, "name", symbol, "name")) {
      tmpFiatDisplay.push({
        name: symbol,
        show: show,
      });
    } else {
      var _index = tmpFiatDisplay.findIndex(function (event) {
        return event.name === symbol;
      });
      tmpFiatDisplay[_index] = {
        name: symbol,
        show: show,
      };
    }
    setFiatDisplayData(tmpFiatDisplay);
    dispatch(
      setCurrencyDisplay({
        symbols: tmpFiatDisplay,
      })
    ).then((res) => {
      let result = res.payload;
      setFiatDisplayData(result?.data);
    });
  };

  const setNftDisplaySubmit = (symbol, show) => {
    let tmpNftDisplay = [...nftDisplayData];
    if (!arrayLookup(tmpNftDisplay, "name", symbol, "name")) {
      tmpNftDisplay.push({
        name: symbol,
        show: show,
      });
    } else {
      var _index = tmpNftDisplay.findIndex(function (event) {
        return event.name === symbol;
      });
      tmpNftDisplay[_index] = {
        name: symbol,
        show: show,
      };
    }
    setNftDisplayData(tmpNftDisplay);
    dispatch(
      setNftDisplay({
        symbols: tmpNftDisplay,
      })
    ).then((res) => {
      let result = res.payload;
      setNftDisplayData(result.data);
    });
  };

  useEffect(() => {
    if (loginType === userLoginType.USER_LOGIN_TYPE_TELEGRAM_WEB_APP) {
      //隐藏导航条
      setWalletConnectShow(true);
    }
  }, [loginType]);

  const setWalletDisplaySubmit = (symbol, show) => {
    let tmpWalletDisplay = [...walletDisplayData];
    if (!arrayLookup(tmpWalletDisplay, "name", symbol, "name")) {
      tmpWalletDisplay.push({
        name: symbol,
        show: show,
      });
    } else {
      var _index = tmpWalletDisplay.findIndex(function (event) {
        return event.name === symbol;
      });
      tmpWalletDisplay[_index] = {
        name: symbol,
        show: show,
      };
    }
    dispatch(updateWalletDisplay(tmpWalletDisplay));
    setwalletDisplayData(tmpWalletDisplay);
    dispatch(
      setWalletDisplay({
        symbols: tmpWalletDisplay,
      })
    ).then((res) => {
      let result = res.payload;
      dispatch(updateWalletDisplay(result.data));
      setwalletDisplayData(result.data);
    });
  };

  // 修改regWallet
  useEffect(() => {
    if (userData.profile?.user?.regWallet) {
      setRegWallet(localStorage.getItem("walletname"));
      setWalletImage(config.walletConfig[regWallet]?.img);
      setwalletTypeTab([oppenappid, userData.profile?.user?.regWallet]);
    }

    // console.log(localStorage.getItem("walletname"),'bitkep登录获取本地存储的token');
    // console.log(localStorage.getItem("walletname"),'metamask登录获取本地存储的token');
    if (localStorage.getItem("walletname")) {
      setwalletTypeTab([
        oppenappid,
        localStorage.getItem("walletname") === "metamask"
          ? "MetaMask"
          : localStorage.getItem("walletname"),
      ],);
    } else {
      setwalletTypeTab([oppenappid, "Wallet Connect"]);
    }
  }, [userData.profile?.user?.regWallet]);

  return (
    <div id="mainWallet" style={{ position: "relative" }}>
      {
        !loadingShow && <motion.div variants={container} initial="hidden" animate="show">
          <Box
            component={motion.div}
            variants={item}
            style={{
              backgroundColor: "#0E1421",
            }}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="pb-12 mt-12"
            >
              {
                !walletConnectShow && <div
                  className="flex justify-center items-center wallet-top radius999"
                >
                  <Tabs
                    component={motion.div}
                    variants={item}
                    value={walletType}
                    onChange={(ev, value) => setWalletType(value)}
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
                    {Object.entries(walletTypeTab).map(([key, label]) => {
                      if (label?.length === regWallet?.length) {
                        if (label == "") {
                          setDdecentralized(-1);
                        }
                        if (decentralized == -1) {
                          return (
                            <Tab
                              className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999"
                              disableRipple
                              key={key}
                              icon={
                                <img
                                  className="mr-8"
                                  width="22"
                                  src="/wallet/assets/images/menu/icon-wallet-active.png"
                                  alt=""
                                />
                              }
                              iconPosition="start"
                              label={"Wallet Connect"}
                              sx={{
                                color: "#FFFFFF",
                                width: "50%",
                              }}
                            />
                          );
                        } else {
                          return (
                            <Tab
                              className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999"
                              disableRipple
                              key={key}
                              icon={
                                <img
                                  className="mr-8"
                                  width="22"
                                  src={(() => {
                                    switch (walletloginname) {
                                      case "BitKeep":
                                        return "/wallet/assets/images/login/icon-right-14.png";
                                      case "MetaMask":
                                        return "/wallet/assets/images/login/icon-right-1.png";
                                      case "WalletConnect":
                                        return "/wallet/assets/images/login/icon-right-5.png";
                                      case "coinbase":
                                        return "/wallet/assets/images/login/icon-right-10.png";
                                      case "TrustWallet":
                                        return "/wallet/assets/images/login/icon-right-12.png";
                                      case "Coinbase":
                                        return "/wallet/assets/images/login/icon-right-4.png";
                                      case "Polygon":
                                        return "/wallet/assets/images/login/icon-right-13.png";
                                      case "Bitski":
                                        return "/wallet/assets/images/login/icon-right-15.png";
                                      case "CLedger":
                                        return "/wallet/assets/images/login/icon-right-16.png";
                                      case "Binance Smart":
                                        return "/wallet/assets/images/login/icon-right-17.png";
                                      case "BeingFi Wallet":
                                        return "/wallet/assets/images/menu/LOGO.png ";
                                      case "value2":
                                        return "";
                                      default:
                                        return "/wallet/assets/images/menu/icon-wallet-active.png ";
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
                              onClick={async () => {
                                // const bindWalletRes = await dispatch(bindWallet());
                                // if (bindWalletRes.payload) {
                                // decenterWalletFormatAmount();
                                // }
                                if (decentralized != -1) {
                                  decenterWalletFormatAmount();
                                }
                              }}
                            />
                          );
                        }
                      } else {
                        return (
                          <Tab
                            className="text-16 font-semibold min-h-28 min-w-64 px-32 mt-4 txtColorTitle text-nowrap opacity-100 zindex radius999"
                            disableRipple
                            key={key}
                            icon={
                              <img
                                className="mr-8"
                                width="22"
                                // src="/wallet/assets/images/logo/loading-img.png"
                                src={(() => {
                                  switch (label) {
                                    case "BitKeep":
                                      return "/wallet/assets/images/login/icon-right-14.png";
                                    case "MetaMask":
                                      return "/wallet/assets/images/login/icon-right-1.png";
                                    case "WalletConnect":
                                      return "/wallet/assets/images/login/icon-right-5.png";
                                    case "coinbase":
                                      return "/wallet/assets/images/login/icon-right-10.png";
                                    case "TrustWallet":
                                      return "/wallet/assets/images/login/icon-right-12.png";
                                    case "Coinbase":
                                      return "/wallet/assets/images/login/icon-right-4.png";
                                    case "Polygon":
                                      return "/wallet/assets/images/login/icon-right-13.png";
                                    case "Bitski":
                                      return "/wallet/assets/images/login/icon-right-15.png";
                                    case "CLedger":
                                      return "/wallet/assets/images/login/icon-right-16.png";
                                    case "Binance Smart":
                                      return "/wallet/assets/images/login/icon-right-17.png";
                                    case "Wallet Connect":
                                      return "/wallet/assets/images/menu/icon-wallet-active.png ";
                                    case "BeingFi Wallet":
                                      return "/wallet/assets/images/menu/LOGO.png ";
                                    default:
                                      return "/wallet/assets/images/logo/loading-img.png ";
                                  }
                                })()}
                                alt=""
                              />
                            }
                            iconPosition="start"
                            label={label}
                            sx={{
                              color: "#FFFFFF",
                              width: "50%",
                            }}
                          />
                        );
                      }
                    })}
                  </Tabs>
                  {/*<div*/}
                  {/*    className={clsx('wallet-top-item py-14 cursor-pointer txtColorTitle', walletType === 'funi' && 'wallet-top-item-active')}*/}
                  {/*    onClick={() => { setWalletType('funi') }}*/}
                  {/*>*/}
                  {/*    FuniBox Wallet*/}
                  {/*</div>*/}
                  {/*<div*/}
                  {/*    className={clsx('wallet-top-item py-14 flex justify-center items-center cursor-pointer txtColorTitle', walletType === 'metamask' && 'wallet-top-item-active')}*/}
                  {/*    onClick={async () => {*/}
                  {/*        const bindWalletRes = await dispatch(bindWallet());*/}
                  {/*        if (bindWalletRes.payload) {*/}
                  {/*            decenterWalletFormatAmount();*/}
                  {/*        }*/}
                  {/*        setWalletType('metamask');*/}
                  {/*    }}*/}
                  {/*>*/}
                  {/*    <img className="mr-8" width="22" src="/wallet/assets/images/connect/metamask.png" alt="" />*/}
                  {/*    Metamask*/}
                  {/*</div>*/}
                </div>
              }
            </motion.div>

            {walletType === 0 && (<motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="pb-6 flex justify-center"
            >
              <div
                className="cardSty"
                style={{ flexWrap: "warp" }}
              >

                <div className="flex justify-between" style={{ marginTop: "6.5%" }}>
                  <div className=" flex px-16 " style={{ width: "70%", height: "3rem" }}>
                    {
                      isOpenEye && <img className="cardImg"
                        src="/wallet/assets/images/withdraw/yan2.png"
                        onClick={() => {
                          setIsOpenEye(!isOpenEye);
                        }}></img>
                    }
                    {
                      !isOpenEye && <img className="cardImg"
                        src="/wallet/assets/images/withdraw/yan.png"
                        onClick={() => {
                          setIsOpenEye(!isOpenEye);
                        }}></img>
                    }
                    <div className="ml-8 walletBalanceZi" style={{ color: "#84A59F" }} >{t("card_10")}</div>
                  </div>
                  <div className="zhangDanXiangQinZi" onClick={() => {
                    changePhoneTab("record");
                    history.push('/wallet/home/record')
                  }} >{t("card_1")}</div>
                </div>

                <div className=" flex items-conter px-16" style={{ width: "100%", marginTop: "1.5rem", justifyContent: "space-between" }}>
                  <div className="flex" style={{ width: "70%" }}>
                    <img className="cardImg mt-3" src="/wallet/assets/images/withdraw/usd.png" onClick={() => {
                      setOpenAnimateModal(true);
                    }}></img>
                    {
                      isOpenEye ? <div className="eyeGongNengZi" style={{ color: "#ffffff" }}>{(userData.profile.wallet?.Crypto + userData.profile.wallet?.Fiat).toFixed(2) ?? '0.00'}</div>
                        : <div className="eyeGongNengZi2 pt-5" style={{ color: "#ffffff" }}>******</div>
                    }
                  </div>
                  <div className="text-16" style={{ width: "30%", textAlign: "center", height: "3rem", lineHeight: "3rem", color: "#3E9178", borderRadius: "99px", background: "#D4FFF3" }} onClick={() => {
                    changePhoneTab("card");
                    history.push('/wallet/home/card')
                  }} >
                    {t("card_2")}
                  </div>
                </div>
              </div>
            </motion.div>)}

            {walletType === 0 && <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="pt-6 pb-5 flex justify-between accountGongNengKuang">
              <div className="accountGongNengDi" onClick={() => {
                changePhoneTab("deposite");
                history.push('/wallet/home/deposite')
              }}>
                <img className="accountGoneNengImg" src="/wallet/assets/images/menu/deposite-active2.png"></img>
                <div className="accountGoneNengZi">{t("card_3")}</div>
              </div>

              <div className="accountGongNengDi" onClick={() => {
                changePhoneTab("withdraw");
                history.push('/wallet/home/withdraw')
              }}>
                <img className="accountGoneNengImg" src="/wallet/assets/images/menu/withdraw-active2.png"></img>
                <div className="accountGoneNengZi">{t("card_4")}</div>
              </div>

              <div className="accountGongNengDi" onClick={() => {
                changePhoneTab("swap");
                history.push('/wallet/home/swap')
              }}>
                <img className="accountGoneNengImg" src="/wallet/assets/images/menu/swap-active2.png"></img>
                <div className="accountGoneNengZi">{t("menu_5")}</div>
              </div>

              <div className="accountGongNengDi" onClick={() => {
                copyTiShiFunc()
                // changePhoneTab("buyCrypto");
                // history.push('/wallet/home/buyCrypto')
              }}>
                <img className="accountGoneNengImg" src="/wallet/assets/images/menu/buyCrypto-active2.png"></img>
                <div className="accountGoneNengZi">{t("card_5")}</div>
              </div>
            </motion.div>
            }

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="px-15 pb-4"
            >
              <Box
                component={motion.div}
                variants={item}
                className="w-full border flex flex-col pt-16"
                sx={{
                  backgroundColor: "#1E293B",
                  border: "none",
                  borderRadius: "1rem"
                }}
              >
                <motion.div variants={container} initial="hidden" animate="show">
                  {walletType === 0 && (
                    <div>
                      <div className="flex justify-between items-center" style={{ marginBottom: "20px", marginLeft: "15px", marginRight: "15px" }}>
                        {searchInput && (
                          <>
                            <FuseSvgIcon
                              className="text-48 cursor-pointer font-medium"
                              size={24}
                              color="action"
                              onClick={() => {
                                setSearchInput(true);
                              }}
                            >
                              feather:search
                            </FuseSvgIcon>
                          </>
                        )}
                        {!searchInput && (
                          <>
                            <FormControl
                              className="wallet-search"
                              sx={{ width: "90%", borderColor: "#94A3B8" }}
                              variant="outlined"
                            >
                              <FuseSvgIcon
                                className="text-48 cursor-pointer font-medium wallet-search-icon"
                                size={24}
                                color="action"
                                onClick={handleChangeInputVal("searchText")}
                              >
                                feather:search
                              </FuseSvgIcon>
                              <OutlinedInput
                                id="outlined-adornment-address outlined-adornment-address-wallet outlined-adornment-address-wallet-input"
                                value={inputVal.searchText}
                                onChange={handleChangeInputVal("searchText")}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "searchText",
                                }}
                                // autoFocus
                                placeholder={t("home_account_2")}
                              // onBlur={() => { setSearchInput(false) }}
                              />
                            </FormControl>
                          </>
                        )}
                        <img
                          width="16"
                          src="wallet/assets/images/wallet/addreduce.png"
                          onClick={() => {
                            setDoPlus(!doPlus);
                          }}
                          className="text-48 cursor-pointer font-medium imgChangeColor"
                          alt="additions and deletions"
                        />
                        {/* <FuseSvgIcon onClick={() => { setDoPlus(!doPlus) }} className="text-48 cursor-pointer font-medium jiaShow" size={24} color="action">feather:plus</FuseSvgIcon> */}
                      </div>
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {/* <Tabs
                        component={motion.div}
                        variants={item}
                        value={showType}
                        onChange={(ev, value) => setShowType(value)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        scrollButtons={false}
                        className="min-h-40 wallet-show-type wallet-show-type-tab ml-16 mr-12 wallet-show-type-radios"
                        classes={{
                          indicator:
                            "flex justify-between bg-transparent w-full h-full",
                        }}
                        TabIndicatorProps={{
                          children: (
                            <Box className="w-full h-full rounded-full huaKuaBgColor" />
                          ),
                        }}
                        sx={{
                          // padding: '1rem 1.2rem',
                          flex: 1,
                        }}
                      >
                        {Object.entries(showTypeTab).map(([key, label]) => (
                          <Tab
                            className="text-14 font-semibold min-w-64 wallet-tab-item txtColorTitle zindex opacity-100"
                            disableRipple
                            key={key}
                            label={label}
                          />
                        ))}
                      </Tabs> */}
                        <Tabs
                          component={motion.div}
                          variants={item}
                          value={tabValue}
                          onChange={(ev, value) => {
                            setTabValue(value)
                            setShowType(value)
                          }}
                          indicatorColor="secondary"
                          textColor="inherit"
                          variant="scrollable"
                          scrollButtons={false}
                          className="tongYongDingBtn1"
                          style={{ width: '50%!import' }}
                          classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                          TabIndicatorProps={{
                            children: (
                              <Box
                                sx={{ bgcolor: 'text.disabled' }}
                                className="w-full h-full rounded-full  huaKuaBgColor2"
                              />
                            ),
                          }}
                          sx={{
                            margin: "1rem 1.2rem",
                          }}
                        >
                          {Object.entries(ranges).map(([key, label]) => (
                            <Tab
                              className="text-14 font-semibold min-h-36 min-w-64 mx4 px-12 opacity1 txtColorTitle zindex"
                              disableRipple
                              key={key}
                              label={label}
                              sx={{
                                color: '#FFFFFF', height: '3.6rem', width: '50%'
                              }}
                            />
                          ))}
                        </Tabs>
                      </motion.div>
                    </div>
                  )}


                  {decentralized != -1 && walletType === 1 && loginType === "web3_wallet" && (
                    <>
                      <div>
                        <div className="px-24 flex justify-between items-center">
                          <FormControl
                            className="wallet-search"
                            sx={{ width: "90%", borderColor: "#94A3B8" }}
                            variant="outlined"
                          >
                            <FuseSvgIcon
                              className="text-48 cursor-pointer font-medium wallet-search-icon"
                              size={24}
                              color="action"
                              onClick={handleChangeInputVal("searchText")}
                            >
                              feather:search
                            </FuseSvgIcon>
                            <OutlinedInput
                              id="outlined-adornment-address outlined-adornment-address-wallet-input-meta"
                              value={inputVal.searchText}
                              onChange={handleChangeInputVal("searchText")}
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                "aria-label": "searchText",
                              }}
                              placeholder={t("home_account_2")}
                            />
                          </FormControl>
                          <img
                            width="16"
                            src="wallet/assets/images/wallet/addreduce.png"
                            onClick={() => {
                              setDoPlus(!doPlus);
                            }}
                            className="text-48 cursor-pointer font-medium imgChangeColor"
                            alt="additions and deletions"
                          />
                          {/* <FuseSvgIcon onClick={() => { setDoPlus(!doPlus) }} className="text-48 cursor-pointer font-medium jiaShow" size={24} color="action">feather:plus</FuseSvgIcon> */}
                        </div>
                      </div>

                      {walletType === 1 && !doPlus && walletType === 1 && (
                        <div
                          className="mt-8 px-24 pb-8"
                        // style={{ borderBottom: '1px solid #374252' }}
                        >
                          {decenterSymbolsSearch.map((row, index) => {
                            if (hideSmall) {
                              return (
                                row.dollarFiat > 0.01 && (
                                  <div
                                    className={clsx(
                                      "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                      selectedSymbol === row.symbol &&
                                      "active-border2"
                                    )}
                                    key={index}
                                  >
                                    <div className="flex px-10 items-center">
                                      <img
                                        style={{ borderRadius: "50%" }}
                                        className="mr-4"
                                        width="24"
                                        src={row.avatar}
                                        alt=""
                                      />
                                      {row.symbol}
                                    </div>
                                    {isFait && (
                                      <div className="px-10">
                                        {row.currencyAmount}
                                      </div>
                                    )}
                                    {!isFait && (
                                      <div className="px-10">{row.balance}</div>
                                    )}
                                  </div>
                                )
                              );
                            } else {
                              return (
                                <div
                                  className={clsx(
                                    "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                    selectedSymbol === row.symbol &&
                                    "active-border2"
                                  )}
                                  key={index}
                                >
                                  <div className="flex px-10 items-center">
                                    <img
                                      style={{ borderRadius: "50%" }}
                                      className="mr-4"
                                      width="24"
                                      src={row.avatar}
                                      alt=""
                                    />
                                    {row.symbol}
                                  </div>
                                  {isFait && (
                                    <div className="px-10">
                                      {row.currencyAmount}
                                    </div>
                                  )}
                                  {!isFait && (
                                    <div className="px-10">{row.balance}</div>
                                  )}
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </>
                  )}
                  {(decentralized == -1 || !decentralized) && walletType === 1 && (
                    <div style={{ margin: "0 auto" }}>
                      <Web3Login />
                    </div>
                  )}

                  {showType === cryptoSelect && walletType === 0 && !doPlus && !isSearch && (
                    <>
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="pb-8"
                      >
                        {searchSymbols.map((row, index) => {
                          if (hideSmall) {
                            return (
                              row.dollarFiat > 0.01 && (
                                <motion.div variants={item}
                                  className={clsx(
                                    "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                    selectedSymbol === row.symbol &&
                                    "active-border2"
                                  )}
                                  onClick={() => {
                                    handleSelectedSymbol(1, row.symbol);
                                  }}
                                  key={index}
                                >
                                  <div className="flex px-10 items-center">
                                    <img style={{ borderRadius: '50%' }} className="mr-4" width="24" src={row.avatar} alt="" />
                                    {row.symbol}
                                  </div>
                                  {isFait && (
                                    <div className="px-10">
                                      {row.currencyAmount}
                                    </div>
                                  )}
                                  {!isFait && (
                                    <div className="px-10">{row.balance}</div>
                                  )}
                                </motion.div>
                              )
                            );
                          } else {
                            return (
                              <motion.div variants={item}
                                className={clsx(
                                  "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                  selectedSymbol === row.symbol &&
                                  "active-border2"
                                )}
                                onClick={() => {
                                  handleSelectedSymbol(1, row.symbol);
                                }}
                                key={index}
                              >
                                <div className="flex px-10 items-center">
                                  <img
                                    style={{ borderRadius: "50%" }}
                                    className="mr-4"
                                    width="24"
                                    src={row.avatar}
                                    alt=""
                                  />
                                  {row.symbol}
                                </div>
                                {isFait && (
                                  <div className="px-10">{row.currencyAmount}</div>
                                )}
                                {!isFait && (
                                  <div className="px-10">{row.balance}</div>
                                )}
                              </motion.div>
                            );
                          }
                        })}
                      </motion.div>
                    </>
                  )}
                </motion.div>
                {showType === fiatSelect && walletType === 0 && !doPlus && !isSearch && (
                  <>
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="mt-8 px-0 pb-8 "
                    >
                      {searchFiats.map((row, index) => {
                        if (hideSmall) {
                          return (
                            row.dollarFiat > 0.01 && (
                              <motion.div variants={item}
                                className={clsx(
                                  "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                  selectedSymbol === row.currencyCode &&
                                  "active-border2"
                                )}
                                onClick={() => {
                                  handleSelectedSymbol(2, row.currencyCode);
                                }}
                                key={index}
                              >
                                <div className="flex px-10 items-center">
                                  <img
                                    style={{ borderRadius: "5px" }}
                                    className="mr-4"
                                    width="24"
                                    src={row.avatar}
                                    alt=""
                                  />
                                  {row.currencyCode}
                                </div>
                                <div className="px-10">{row.balance}</div>
                              </motion.div>
                            )
                          );
                        } else {
                          return (
                            <motion.div variants={item}
                              className={clsx(
                                "flex justify-between items-center py-12 wallet-symbol cursor-pointer",
                                selectedSymbol === row.currencyCode &&
                                "active-border2"
                              )}
                              onClick={() => {
                                handleSelectedSymbol(2, row.currencyCode);
                              }}
                              key={index}
                            >
                              <div className="flex px-10 items-center">
                                <img
                                  style={{ borderRadius: "5px" }}
                                  className="mr-4"
                                  width="24"
                                  src={row.avatar}
                                  alt=""
                                />
                                {row.currencyCode}
                              </div>
                              <div className="px-10">{row.balance}</div>
                            </motion.div>
                          );
                        }
                      })}
                    </motion.div>
                  </>
                )}

                {showType === 2 && walletType === 0 && !doPlus && !isSearch && (
                  <>
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="mt-8 px-24 pb-8"
                    // style={{ borderBottom: '1px solid #374252' }}
                    >
                      {searchNfts.map((row, index) => {
                        if (hideSmall) {
                          return (
                            row.dollarFiat > 0.01 && (
                              <motion.div variants={item}
                                className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                                key={index}
                              >
                                <div className="flex px-8 items-center">
                                  <img
                                    style={{ borderRadius: "50%" }}
                                    className="mr-4"
                                    width="24"
                                    src={row.avatar}
                                    alt=""
                                  />
                                  {row.name}
                                </div>
                                {isFait && (
                                  <div className="px-8">{row.currencyAmount}</div>
                                )}
                                {!isFait && (
                                  <div className="px-8">{row.balance}</div>
                                )}
                              </motion.div>
                            )
                          );
                        } else {
                          return (
                            <motion.div variants={item}
                              className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                              key={index}
                            >
                              <div className="flex px-8 items-center">
                                <img
                                  style={{ borderRadius: "50%" }}
                                  className="mr-4"
                                  width="24"
                                  src={row.avatar}
                                  alt=""
                                />
                                {row.name}
                              </div>
                              {isFait && (
                                <div classNaFiatme="px-8">
                                  {row.currencyAmount}
                                </div>
                              )}
                              {!isFait && (
                                <div className="px-8">{row.balance}</div>
                              )}
                            </motion.div>
                          );
                        }
                      })}
                    </motion.div>
                  </>
                )}
                {/* 修改顶部栏样式 */}
                {walletType === 0 && isSearch && !doPlus && (
                  <>
                    <div
                      className="mt-8 px-24 pb-8 "
                    // style={{backgroundColor:'#334155'}}
                    // style={{ borderBottom: '1px solid  "#0E1421" #374252' }}
                    // style={{backgroundColor:'#334155'}}
                    >
                      {searchData.map((row, index) => {
                        if (row.type === "token") {
                          return (
                            <div
                              className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                              key={index}
                            >
                              <div
                                className="flex px-8 items-center"
                                style={{ width: "15rem" }}
                              >
                                <img
                                  style={{ borderRadius: "50%" }}
                                  className="mr-4"
                                  width="24"
                                  src={row.avatar}
                                  alt=""
                                />
                                {row.symbol}
                              </div>
                              {isFait && (
                                <div className="px-8">{row.currencyAmount}</div>
                              )}
                              {!isFait && (
                                <div className="px-8">{row.balance}</div>
                              )}
                              <div>
                                <Switch
                                  checked={row.isShow}
                                  onChange={() => {
                                    setCryptoDisplaySubmit(
                                      row.symbol,
                                      !row.isShow
                                    );
                                  }}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                          );
                        } else if (row.type === "fiat") {
                          return (
                            <div
                              className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                              key={index}
                            >
                              <div
                                className="flex px-10 items-center"
                                style={{ width: "15rem" }}
                              >
                                <img
                                  style={{ borderRadius: "50%" }}
                                  className="mr-4"
                                  width="24"
                                  src={row.avatar}
                                  alt=""
                                />
                                {row.currencyCode}
                              </div>
                              <div className="px-10">{row.balance}</div>
                              <div>
                                <Switch
                                  checked={row.isShow}
                                  onChange={() => {
                                    setFiatDisplaySubmit(
                                      row.currencyCode,
                                      !row.isShow
                                    );
                                  }}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                          );
                        } else if (row.type === "nft") {
                          return (
                            <div
                              className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                              key={index}
                            >
                              <div
                                className="flex px-8 items-center"
                                style={{ width: "15rem" }}
                              >
                                <img
                                  style={{
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                  }}
                                  className="mr-4"
                                  src={row.avatar}
                                  alt=""
                                />
                                {row.name}
                              </div>
                              {isFait && (
                                <div className="px-10">{row.currencyAmount}</div>
                              )}
                              {!isFait && (
                                <div className="px-10">{row.balance}</div>
                              )}
                              <div>
                                <Switch
                                  checked={row.isShow}
                                  onChange={() => {
                                    setNftDisplaySubmit(row.symbol, !row.isShow);
                                  }}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}

                {/*中心化的token自定义*/}
                {doPlus && showType === cryptoSelect && walletType === 0 && (
                  <div
                    className="mt-8 px-24 pb-8"
                  // style={{ borderBottom: '1px solid #374252' }}
                  >
                    {cryptoDisplayShowData.map((row, index) => {
                      return (
                        <div
                          className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                          key={index}
                        >
                          <div
                            className="flex px-10 items-center"
                            style={{ width: "10rem" }}
                          >
                            <img
                              style={{ borderRadius: "50%" }}
                              className="mr-4"
                              width="24"
                              src={row.avatar}
                              alt=""
                            />
                            {row.symbol}
                          </div>
                          {isFait && (
                            <div className="px-8">{row.currencyAmount}</div>
                          )}
                          {!isFait && <div className="px-10">{row.balance}</div>}
                          <div
                            style={{
                              width: "14rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ color: "#94A3B8" }}>{row.symbol}</span>
                            <Switch
                              checked={row.isShow}
                              onChange={() => {
                                setCryptoDisplaySubmit(row.symbol, !row.isShow);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/*法币自定义*/}
                {doPlus && showType === fiatSelect && walletType === 0 && (
                  <div
                    className="mt-8 px-24 pb-8"
                  // style={{ borderBottom: '1px solid #374252' }}
                  >
                    {fiatDisplayShowData.map((row, index) => {
                      return (
                        <div
                          className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                          key={index}
                        >
                          <div
                            className="flex px-10 items-center"
                            style={{ width: "10rem" }}
                          >
                            <img
                              style={{ borderRadius: "50%" }}
                              className="mr-4"
                              width="24"
                              src={row.avatar}
                              alt=""
                            />
                            {row.currencyCode}
                          </div>
                          <div className="px-10">{row.balance}</div>
                          <div
                            style={{
                              width: "14rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ color: "#94A3B8" }}>
                              {row.currencyCode}
                            </span>
                            <Switch
                              checked={row.isShow}
                              onChange={() => {
                                setFiatDisplaySubmit(
                                  row.currencyCode,
                                  !row.isShow
                                );
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/*nft自定义*/}
                {doPlus && showType === 2 && walletType === 0 && (
                  <div
                    className="mt-8 px-24 pb-8"
                  // style={{ borderBottom: '1px solid #374252' }}
                  >
                    {nftDisplayShowData.map((row, index) => {
                      return (
                        <div
                          className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                          key={index}
                        >
                          <div
                            className="flex  items-center"
                            style={{ width: "15rem" }}
                          >
                            <img
                              style={{
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                              }}
                              className="mr-4"
                              src={row.avatar}
                              alt=""
                            />
                            {row.name}
                          </div>
                          {isFait && <div>{row.currencyAmount}</div>}
                          {!isFait && <div>{row.balance}</div>}
                          <div
                            style={{
                              width: "14rem",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ color: "#94A3B8" }}>{row.symbol}</span>
                            <Switch
                              checked={row.isShow}
                              onChange={() => {
                                setNftDisplaySubmit(row.symbol, !row.isShow);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/*metamask Token自定义*/}
                {decentralized != -1 && doPlus && walletType === 1 && (
                  <div
                    className="mt-8 px-24"
                  // style={{ borderBottom: '1px solid #374252' }}
                  >
                    {walletDisplayShowData.map((row, index) => {
                      return (
                        <div
                          className="flex justify-between items-center py-12 wallet-symbol cursor-pointer"
                          key={index}
                        >
                          <div
                            className="flex px-10 items-center"
                            style={{ width: "15rem" }}
                          >
                            <img
                              style={{
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                              }}
                              className="mr-4"
                              src={row.avatar}
                              alt=""
                            />
                            {row.symbol}
                          </div>
                          {isFait && (
                            <div className="px-10">{row.currencyAmount}</div>
                          )}
                          {!isFait && <div className="px-10">{row.balance}</div>}
                          <div>
                            <Switch
                              checked={row.isShow}
                              onChange={() => {
                                setWalletDisplaySubmit(row.symbol, !row.isShow);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Box>
            </motion.div>

            {decentralized != -1 && loginType === "web3_wallet" && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-24"
                style={{ paddingTop: "1.1rem" }}
              >
                <Box
                  component={motion.div}
                  variants={item}
                  className="w-full rounded-16 border flex flex-col"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  <div className="mt-8 px-24">
                    <div
                      className="flex justify-between items-center my-4 "
                      style={{ height: "2rem" }}
                    >
                      <div>{t("home_account_3")} </div>

                      <div
                        className="mr-8 flex items-center"
                        style={{ color: "#ffffff" }}
                      >
                        {(isFait || showType === fiatSelect) && (
                          <div
                            onClick={() => {
                              // setOpenChangeCurrency(true)
                              setOpenAnimateModal(true);
                            }}
                            className="px-20 py-4 flex items-center justify-center mr-24 cursor-pointer txtColorTitleSmall"
                            style={{
                              background: "#0e1421",
                              borderRadius: "8px",
                              height: "3rem",
                              padding: "0 1rem 0 0.8rem",
                            }}
                          >
                            <img
                              className=""
                              style={{
                                width: "20px",
                                borderRadius: "3px",
                                marginRight: "1.2rem",
                              }}
                              src={arrayLookup(
                                currencys,
                                "currencyCode",
                                userData.currencyCode,
                                "avatar"
                              )}
                              alt=""
                            />
                            {userData.currencyCode}
                          </div>
                        )}

                        {totalBalance}
                      </div>
                    </div>
                    {showType !== fiatSelect && (
                      <div className="flex justify-between items-center my-4">
                        <div>{t("home_account_4")} </div>
                        <div className="huaDongM">
                          <Switch
                            checked={isFait}
                            onChange={() => {
                              setIsFait(!isFait);
                              getUserCurrencyMoney();
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-center my-4"
                      style={{ marginTop: "-1rem" }}
                    >
                      <div>{t("home_account_5")}</div>
                      <div className="huaDongM">
                        <Switch
                          checked={hideSmall}
                          onChange={() => {
                            setHideSmall(!hideSmall);
                            document
                              .getElementsByClassName("FusePageCarded-content")[0]
                              ?.scrollIntoView();
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/*<div className="mt-8 px-24">*/}
                  {/*    <FormControl sx={{ width: '100%' }} variant="outlined">*/}
                  {/*        <OutlinedInput*/}
                  {/*            disabled={true}*/}
                  {/*            id="outlined-adornment-weight"*/}
                  {/*            value="bc1qzm9ln6...kufte65t0pyh"*/}
                  {/*            endAdornment={<InputAdornment position="end">*/}
                  {/*                <IconButton*/}
                  {/*                    aria-label="toggle password visibility"*/}
                  {/*                    onClick={() => {*/}
                  {/*                        handleCopyText('bc1qzm9ln6...kufte65t0pyh')*/}
                  {/*                    }}*/}
                  {/*                    edge="end"*/}
                  {/*                >*/}
                  {/*                    <img src="wallet/assets/images/deposite/copy.png" alt=""/>*/}
                  {/*                </IconButton>*/}
                  {/*            </InputAdornment>}*/}
                  {/*            aria-describedby="outlined-weight-helper-text"*/}
                  {/*            inputProps={{*/}
                  {/*                'aria-label': 'weight',*/}
                  {/*            }}*/}
                  {/*        />*/}
                  {/*    </FormControl>*/}
                  {/*</div>*/}
                  {/* search区域 */}
                  {decentralized != -1 && walletType === 1 && (
                    <div
                      className="mt-8 px-24 flex justify-between items-center "
                      style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                      }}
                    >
                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        onClick={() => {
                          setOpenChangeNetwork(true);
                        }}
                      >
                        <img
                          className="mr-4"
                          style={{ height: "80%" }}
                          src="wallet/assets/images/deposite/bnb.png"
                          alt=""
                        />
                        Network
                      </Button>


                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        variant="outlined"
                        onClick={() => {
                          dispatch(
                            showMessage({ message: t('error_9'), code: 3 })
                          );
                          setTimeout(() => {
                            setDdecentralized(-1);
                            window.localStorage.setItem("isDecentralized", -1);
                            // window.location.reload()
                            window.localStorage.setItem("walletname", "");
                          }, 1000);
                        }}
                      >
                        {t("home_wallet_9")}
                      </Button>
                    </div>
                  )}
                </Box>
              </motion.div>
            )}
            {decentralized != -1 && loginType !== "web3_wallet" && walletType == 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="px-15 mb-36"
                style={{ paddingTop: "1rem" }}
              >
                <Box
                  component={motion.div}
                  variants={item}
                  className="w-full border flex flex-col shouYeYuanJiao"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  <div className="mt-8 px-10">
                    <div
                      className="flex justify-between items-center my-4 "
                      style={{ height: "2rem" }}
                    >
                      <div>{t("home_account_3")} </div>

                      <div
                        className="mr-8 flex items-center"
                        style={{ color: "#ffffff" }}
                      >
                        {(isFait || showType === fiatSelect) && (
                          <div
                            onClick={() => {
                              // setOpenChangeCurrency(true)
                              setOpenAnimateModal(true);
                            }}
                            className="px-20 py-4 flex items-center justify-center mr-24 cursor-pointer txtColorTitleSmall"
                            style={{
                              background: "#0e1421",
                              borderRadius: "8px",
                              height: "3rem",
                              padding: "0 1rem 0 0.8rem",
                            }}
                          >
                            <img
                              className=""
                              style={{
                                width: "20px",
                                borderRadius: "3px",
                                marginRight: "1.2rem",
                              }}
                              src={arrayLookup(
                                currencys,
                                "currencyCode",
                                userData.currencyCode,
                                "avatar"
                              )}
                              alt=""
                            />
                            {userData.currencyCode}
                          </div>
                        )}

                        {totalBalance}
                      </div>
                    </div>
                    {showType !== fiatSelect && (
                      <div className="flex justify-between items-center my-4">
                        <div>{t("home_account_4")} </div>
                        <div className="huaDongM">
                          <Switch
                            checked={isFait}
                            onChange={() => {
                              setIsFait(!isFait);
                              getUserCurrencyMoney();
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-center my-4"
                      style={{ marginTop: "-1rem" }}
                    >
                      <div>{t("home_account_5")}</div>
                      <div className="huaDongM">
                        <Switch
                          checked={hideSmall}
                          onChange={() => {
                            setHideSmall(!hideSmall);
                            document
                              .getElementsByClassName("FusePageCarded-content")[0]
                              ?.scrollIntoView();
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/*<div className="mt-8 px-24">*/}
                  {/*    <FormControl sx={{ width: '100%' }} variant="outlined">*/}
                  {/*        <OutlinedInput*/}
                  {/*            disabled={true}*/}
                  {/*            id="outlined-adornment-weight"*/}
                  {/*            value="bc1qzm9ln6...kufte65t0pyh"*/}
                  {/*            endAdornment={<InputAdornment position="end">*/}
                  {/*                <IconButton*/}
                  {/*                    aria-label="toggle password visibility"*/}
                  {/*                    onClick={() => {*/}
                  {/*                        handleCopyText('bc1qzm9ln6...kufte65t0pyh')*/}
                  {/*                    }}*/}
                  {/*                    edge="end"*/}
                  {/*                >*/}
                  {/*                    <img src="wallet/assets/images/deposite/copy.png" alt=""/>*/}
                  {/*                </IconButton>*/}
                  {/*            </InputAdornment>}*/}
                  {/*            aria-describedby="outlined-weight-helper-text"*/}
                  {/*            inputProps={{*/}
                  {/*                'aria-label': 'weight',*/}
                  {/*            }}*/}
                  {/*        />*/}
                  {/*    </FormControl>*/}
                  {/*</div>*/}
                  {/* search区域 */}
                  {decentralized != -1 && walletType === 1 && (
                    <div
                      className="mt-8 px-24 flex justify-between items-center"
                      style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                      }}
                    >
                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        onClick={() => {
                          setOpenChangeNetwork(true);
                        }}
                      >
                        <img
                          className="mr-4"
                          style={{ height: "80%" }}
                          src="wallet/assets/images/deposite/bnb.png"
                          alt=""
                        />
                        Network
                      </Button>
                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        variant="outlined"
                        onClick={() => {
                          dispatch(
                            showMessage({ message: t('error_9'), code: 3 })
                          );
                          setTimeout(() => {
                            setDdecentralized(-1);
                            window.localStorage.setItem("isDecentralized", "-1");
                            // window.location.reload()
                            window.localStorage.setItem("walletname", "");
                          }, 1000);
                        }}
                      >
                        {t("home_wallet_9")}
                      </Button>
                    </div>
                  )}
                </Box>
              </motion.div>
            )}
            {decentralized == -1 && walletType == 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-24"
                style={{ paddingTop: "1.1rem" }}
              >
                <Box
                  component={motion.div}
                  variants={item}
                  className="w-full rounded-16 border flex flex-col"
                  sx={{
                    backgroundColor: "#1E293B",
                    border: "none",
                  }}
                >
                  <div className="mt-8 px-24">
                    <div
                      className="flex justify-between items-center my-4 "
                      style={{ height: "2rem" }}
                    >
                      <div>{t("home_account_3")} </div>

                      <div
                        className="mr-8 flex items-center"
                        style={{ color: "#ffffff" }}
                      >
                        {(isFait || showType === fiatSelect) && (
                          <div
                            onClick={() => {
                              // setOpenChangeCurrency(true)
                              setOpenAnimateModal(true);
                            }}
                            className="px-20 py-4 flex items-center justify-center mr-24 cursor-pointer txtColorTitleSmall"
                            style={{
                              background: "#0e1421",
                              borderRadius: "8px",
                              height: "3rem",
                              padding: "0 1rem 0 0.8rem",
                            }}
                          >
                            <img
                              className=""
                              style={{
                                width: "20px",
                                borderRadius: "3px",
                                marginRight: "1.2rem",
                              }}
                              src={arrayLookup(
                                currencys,
                                "currencyCode",
                                userData.currencyCode,
                                "avatar"
                              )}
                              alt=""
                            />
                            {userData.currencyCode}
                          </div>
                        )}

                        {totalBalance}
                      </div>
                    </div>
                    {showType !== fiatSelect && (
                      <div className="flex justify-between items-center my-4">
                        <div>{t("home_account_4")} </div>
                        <div className="huaDongM">
                          <Switch
                            checked={isFait}
                            onChange={() => {
                              setIsFait(!isFait);
                              getUserCurrencyMoney();
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-center my-4"
                      style={{ marginTop: "-1rem" }}
                    >
                      <div>{t("home_account_5")}</div>
                      <div className="huaDongM">
                        <Switch
                          checked={hideSmall}
                          onChange={() => {
                            setHideSmall(!hideSmall);
                            document
                              .getElementsByClassName("FusePageCarded-content")[0]
                              ?.scrollIntoView();
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/*<div className="mt-8 px-24">*/}
                  {/*    <FormControl sx={{ width: '100%' }} variant="outlined">*/}
                  {/*        <OutlinedInput*/}
                  {/*            disabled={true}*/}
                  {/*            id="outlined-adornment-weight"*/}
                  {/*            value="bc1qzm9ln6...kufte65t0pyh"*/}
                  {/*            endAdornment={<InputAdornment position="end">*/}
                  {/*                <IconButton*/}
                  {/*                    aria-label="toggle password visibility"*/}
                  {/*                    onClick={() => {*/}
                  {/*                        handleCopyText('bc1qzm9ln6...kufte65t0pyh')*/}
                  {/*                    }}*/}
                  {/*                    edge="end"*/}
                  {/*                >*/}
                  {/*                    <img src="wallet/assets/images/deposite/copy.png" alt=""/>*/}
                  {/*                </IconButton>*/}
                  {/*            </InputAdornment>}*/}
                  {/*            aria-describedby="outlined-weight-helper-text"*/}
                  {/*            inputProps={{*/}
                  {/*                'aria-label': 'weight',*/}
                  {/*            }}*/}
                  {/*        />*/}
                  {/*    </FormControl>*/}
                  {/*</div>*/}
                  {/* search区域 */}
                  {decentralized != -1 && walletType === 1 && (
                    <div
                      className="mt-8 px-24 flex justify-between items-center"
                      style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                      }}
                    >
                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        onClick={() => {
                          setOpenChangeNetwork(true);
                        }}
                      >
                        <img
                          className="mr-4"
                          style={{ height: "80%" }}
                          src="wallet/assets/images/deposite/bnb.png"
                          alt=""
                        />
                        Network
                      </Button>
                      <Button
                        className="foxBtn"
                        style={{
                          width: "36%",
                          margin: ".5rem 0",
                          borderRadius: "8px",
                          backgroundColor: "#1F2A3C",
                        }}
                        variant="outlined"
                        onClick={() => {
                          dispatch(
                            showMessage({ message: t('error_9'), code: 3 })
                          );
                          setTimeout(() => {
                            setDdecentralized(-1);
                            window.localStorage.setItem("isDecentralized", -1);
                            // window.location.reload()
                            window.localStorage.setItem("walletname", "");
                          }, 1000);
                        }}
                      >
                        {t("home_wallet_9")}
                      </Button>
                    </div>
                  )}
                </Box>
              </motion.div>
            )}


            {/*切换法币*/}
            <AnimateModal
              className="faBiDi"
              open={openAnimateModal}
              onClose={() => setOpenAnimateModal(false)}
              style={{ maxWidth: "360px" }}
            >
              <div
                className="dialog-animate-box faBiBoxDi "
                style={{ overflowY: "scroll", overflowX: "hidden" }}
              >
                <Box
                  className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidth"
                  sx={{
                    backgroundColor: "#1e293b",
                    padding: "1.5rem",
                    overflow: "hidden",

                  }}
                >
                  <Typography
                    className="text-14 font-medium"
                    style={{ marginBottom: "2rem", color: "#94a3b8" }}
                  >
                    {t("home_wallet_11")}
                  </Typography>
                  <div className="dialog-select-fiat">
                    {currencys.map((row, index) => {
                      return (
                        <div
                          className="dialog-select-fiat-item border-r-5 flex items-center justify-start txtColorTitleSmall"
                          key={index}
                          onClick={() => {
                            changeCurrency(row.currencyCode);
                          }}
                        >
                          <img
                            src={arrayLookup(
                              currencys,
                              "currencyCode",
                              row.currencyCode,
                              "avatar"
                            )}
                            className="dialog-select-fiat-icon border-r-5"
                            alt=""
                          />
                          <Typography className="text-14">
                            {row.currencyCode}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                </Box>

              </div>
            </AnimateModal>


            {/*切换网路*/}
            <BootstrapDialog
              onClose={() => {
                setOpenChangeNetwork(false);
              }}
              aria-labelledby="customized-dialog-title"
              open={openChangeNetwork}
              className="dialog-container "
            >
              <DialogContent dividers className="netWorkDi">
                <div className=" ">
                  <Typography
                    id="customized-dialog-title"
                    className="text-24 px-16 dialog-title-text netWorkTxtWh"
                  >
                    &nbsp;
                    <img
                      src="wallet/assets/images/logo/icon-close.png"
                      className="dialog-close-btn"
                      onClick={() => {
                        setOpenChangeNetwork(false);
                      }}
                      alt="close icon"
                    />
                  </Typography>


                  <Box className="dialog-content dialog-content-select-network-height">
                    <Box
                      className="dialog-content-inner dialog-content-select-network-width"
                      sx={{
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        className="text-14 font-medium border-r-5 netWorkBannerWh"
                        style={{
                          marginBottom: "1.5rem",
                          padding: "1.5rem",
                          backgroundColor: "#1e293b",
                          color: "#94a3b8",
                        }}
                      >
                        You are currently browsing on the{" "}
                        <span style={{ color: "#16c2a3" }}>Etherenum</span>{" "}
                        network.
                      </Typography>


                      <div className="dialog-select-network flex flex-wrap justify-between">
                        {networkData.map((row, index) => {
                          return (
                            <div
                              className="dialog-select-network-item border-r-5 flex items-center justify-start txtColorTitleSmall"
                              key={index}
                              onClick={() => {
                                changeNetwork(row);
                              }}
                            >
                              <img
                                src={row.avatar}
                                className="dialog-select-fiat-icon border-r-5"
                                alt=""
                              />
                              <Typography className="text-14 text-nowrap">
                                {row.network}
                              </Typography>
                            </div>
                          );
                        })}
                      </div>
                    </Box>
                  </Box>
                </div>
              </DialogContent>
            </BootstrapDialog>


            <BootstrapDialog
              onClose={() => {
                setCopyTiShi(false)
              }}
              aria-labelledby="customized-dialog-title "
              open={copyTiShi}
              className="dialog-container copyTiShiW"
            >
              <div style={{ textAlign: "center", padding: "1rem 1rem 1rem 1rem" }}>
                {t('card_197')}
              </div>
            </BootstrapDialog>

            <AnimateModal2
              className="faBiDiCard tanChuanDiSe"
              open={openBindWinow}
              onClose={() => setOpenBindWinow(false)}
            >
              <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                <div className='TanHaoCardZi '>
                  {t('kyc_26')}
                </div>
              </div>

              <Box
                className="dialog-content-inner dialog-content-select-fiat-width border-r-10 boxWidthCard flex justify-center"
                sx={{
                  backgroundColor: "#2C394D",
                  padding: "1.5rem",
                  overflow: "hidden",
                  margin: "0rem auto 0rem auto"
                }}
              >
                <div className="danChuangTxt ">
                  {t('wallet_31')}
                </div>
              </Box>

              <div className='flex mt-16 mb-28 px-15 justify-between' >
                <LoadingButton
                  disabled={false}
                  className="boxCardBtn"
                  color="secondary"
                  loading={false}
                  variant="contained"
                  onClick={() => {
                    setOpenBindEmail(true);
                    setOpenBindWinow(false)
                  }}
                >
                  {t('signIn_5')}
                </LoadingButton>


                <LoadingButton
                  disabled={false}
                  className="boxCardBtn"
                  color="secondary"
                  loading={false}
                  variant="contained"
                  onClick={() => {
                    setOpenBindPhone(true);
                    setOpenBindWinow(false)
                  }}
                >
                  {t('kyc_56')}
                </LoadingButton>
              </div>
            </AnimateModal2>

           <ReloginDialog openLoginWinow={ openLoginWinow } closeLoginWindow={()=>{ setOpenLoginWinow(false) }} ></ReloginDialog>

            {openBindEmail && <div style={{ position: "absolute", width: "100%", height: `${document.getElementById('mainWallet').offsetHeight}px`, top: "0%", zIndex: "998", backgroundColor: "#0E1421" }} >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className='mt-12'
                id="topGo"
              >
                <div className='flex mb-10' onClick={() => {
                  setOpenBindEmail(false);
                  myFunction;
                  backPageEvt();
                }}   >
                  <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                </div>
                <RetiedEmail backPage={() => backPageEvt()} />
                <div style={{ height: "5rem" }}></div>
              </motion.div>
            </div>}

            {openBindPhone && <div style={{ position: "absolute", width: "100%", height: `${document.getElementById('mainWallet').offsetHeight}px`, top: "0%", zIndex: "998", backgroundColor: "#0E1421" }} >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className='mt-12'
                id="topGo"
              >
                <div className='flex mb-10' onClick={() => {
                  setOpenBindPhone(false);
                  myFunction;
                  backPageEvt();
                }}   >
                  <img className='cardIconInFoW' src="wallet/assets/images/card/goJianTou.png" alt="" /><span className='zhangDanZi'>{t('kyc_24')}</span>
                </div>
                <RetiedPhone backPage={() => backPageEvt()} />
                <div style={{ height: "5rem" }}></div>
              </motion.div>
            </div>}

          </Box>
        </motion.div >
      }
      {
        loadingShow &&
        <div style={{ position: "absolute", width: "100%", height: "100vh", zIndex: "100", backgroundColor: "#0E1421" }}>
          <div className="loadingChuang1">
            <div className="loadingChuangTiao1"></div>
            <div className="loadingChuangTiao2"></div>
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

          <div className="loadingChuang1">
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

export default React.memo(Wallet);
