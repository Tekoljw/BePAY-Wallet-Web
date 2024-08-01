import '../../../styles/home.css';
import '../../../styles/activity.css';
import utils from "../../util/tools/utils";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useState, useEffect, forwardRef, default as React } from "react";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import history from "@history";
import { useDispatch, useSelector } from "react-redux";
import AwardPop from "../../components/AwardPop";
import { selectUserProperties } from "app/store/user/userProperties";



function Spin(props) {
  const { t } = useTranslation("mainPage");
  const dispatch = useDispatch();
  const [turnConfig, setTurnConfig] = useState([]);
  const [turnRecord, setTurnRecord] = useState({});
  const [offOn, setOffOn] = useState(false);
  const [userTurnTimes, setUserTurnTime] = useState(1);
  const [spinRewardBalance, setSpinRewardBalance] = useState({
    balance: 0,
    symbol: "USDT",
  });
  const userProperties = useSelector(selectUserProperties);
  const [vipConfig, setVipConfig] = useState({});
  const [chargeTotal, setChargeTotal] = useState(0);
  const [betTotal, setBetTotal] = useState(0);
  const [vipLevel, setVipLevel] = useState(0);
  const [vipExperience, setVipExperience] = useState(0.0);


  const [popAward, setPopAward] = useState(false);
  const [vipActive, setVipActive] = useState(0);
  const vipImgList = [
    {
      turnBackGround: "https://scource-static.funibet.com/funibet/images/nav/diPan2.png",
      turnPointerImg: "https://scource-static.funibet.com/funibet/images/nav/diPan0.png",
      turnTipImg: "https://scource-static.funibet.com/funibet/images/nav/diPan5.png",
      src1: "https://scource-static.funibet.com/funibet/images/nav/san1.png",
      src2: "https://scource-static.funibet.com/funibet/images/nav/san2.png",
      turnBackGroundColor: "#653120",
    },

    {
      turnBackGround: "https://scource-static.funibet.com/funibet/images/nav/diPan2_1.png",
      turnPointerImg: "https://scource-static.funibet.com/funibet/images/nav/diPan0.png",
      turnTipImg: "https://scource-static.funibet.com/funibet/images/nav/diPan5_1.png",
      src1: "https://scource-static.funibet.com/funibet/images/nav/san1.png",
      src2: "https://scource-static.funibet.com/funibet/images/nav/san2.png",
      turnBackGroundColor: "#A03426",
    },

    {
      turnBackGround: "https://scource-static.funibet.com/funibet/images/nav/diPan2_2.png",
      turnPointerImg: "https://scource-static.funibet.com/funibet/images/nav/diPan0_1.png",
      turnTipImg: "https://scource-static.funibet.com/funibet/images/nav/diPan5_2.png",
      src1: "https://scource-static.funibet.com/funibet/images/nav/san3.png",
      src2: "https://scource-static.funibet.com/funibet/images/nav/san4.png",
      turnBackGroundColor: "#9856F5",
    },

  ];

  // VIP等级

  // const handleGetVIPConfig = () => {
  //   dispatch(getVIPConfig()).then((res) => {
  //     let result = res.payload;
  //     if (result) {
  //       let tmpConfig = {};
  //       result.map((item) => {
  //         tmpConfig[item.VIPLevel] = item;
  //       });
  //       setVipConfig(tmpConfig);
  //     }
  //   });
  // };



  // 转盘记录
  // const handleGetTurnRecord = () => {
  //   dispatch(getTurnRecord()).then((res) => {
  //     let result = res.payload;
  //     setTurnRecord(result);
  //   });
  // };

  // 转动转盘

  // const handleDoTurn = async () => {
  //   let res = await dispatch(doTurn());
  //   let result = res.payload;
  //   if (result.RemainTimes <= 0) {
  //     notSpinClick();
  //   }
  //   setUserTurnTime(result.RemainTimes);
  //   setSpinRewardBalance({
  //     balance: result.AwardCashCouponNum / 100,
  //     symbol: "USDT",
  //   });
  //   dispatch(getUserSetting({
  //     callback: () => { }
  //   }));
  //   return result;
  // };

  // 可选中状态
  const canSpinClick = () => {
    var divDom = document.getElementById("spin-div-rata");
    var aDom = document.getElementById("spin-a-rata");

    if (divDom && aDom) {
      divDom.classList.remove("btn-disable");
      aDom.classList.remove("spin-a-rata-disable");
    }
  };

  // 不可选中状态
  const notSpinClick = () => {
    var divDom = document.getElementById("spin-div-rata");
    var aDom = document.getElementById("spin-a-rata");

    if (divDom && aDom) {
      divDom.classList.add("btn-disable");
      aDom.classList.add("spin-a-rata-disable");
    }
  };

  const spinRata = async () => {
    // 可以直接打开奖励这两行
    // setPopAward(true);
    // return

    if (userTurnTimes <= 0) {
      return false;
    }

    // 正在转动
    if (offOn) {
      return false;
    }

    // 真正会去调用接口

    // let doTurnResult = await handleDoTurn();
    // if (!doTurnResult) {
    //   return false;
    // }

    // 测试数据

    let doTurnResult = {
        ItemID: 5
    };

    var oTurntable = document.getElementById("spin");
    var cat = 22.5; //总共12个扇形区域，每个区域约30度
    var num = 0; //转圈结束后停留的度数
    if (!offOn) {
      oTurntable.style.transition = "all 4s";
      oTurntable.style.transform = "rotate(0deg)";
      setOffOn(true);
      ratating();
    }

    function ratating() {
      var timer = null;
      var rdm = 0; //随机度数
      clearInterval(timer);
      timer = setInterval(function () {
        let rewardKey = turnConfig
          .map((item) => item.itemID)
          .indexOf(doTurnResult.ItemID);
        console.log(Math.floor(rdm / 360), "rewardKey......");
        if (Math.floor(rdm / 360) < 3) {
          rdm = Math.floor(0.5 * 3600) - cat * rewardKey;
        } else {
          oTurntable.style.transform = "rotate(" + rdm + "deg)";
          clearInterval(timer);
          setTimeout(function () {
            setOffOn(false);
            num = rdm % 360;
            setTimeout(() => {
              setPopAward(true);
            }, 600);
          }, 4000);
        }
      }, 30);
    }
  };

  const IntNum = (moneyNum) => {
    let returnNum = 0.0;
    if (moneyNum < 10) {
      returnNum = moneyNum.toFixed(6);
    } else if (moneyNum >= 10) returnNum = moneyNum.toFixed(5);
    else if (moneyNum >= 100) returnNum = moneyNum.toFixed(4);
    else if (moneyNum >= 1000) returnNum = moneyNum.toFixed(3);
    else if (moneyNum >= 10000) returnNum = moneyNum.toFixed(2);
    else if (moneyNum >= 100000) returnNum = moneyNum.toFixed(1);
    else if (moneyNum >= 1000000) returnNum = moneyNum.toFixed(0);
    return returnNum;
  };

  const backVipCommission = () => {
    let level = 0;
    let plus = 0;
    if (vipActive === 0) {
      level = vipLevel;
    } else if (vipActive === 1) {
      level = vipLevel + 1;
    } else if (vipActive === 2) {
      level = vipLevel + 2;
    }

    if (level > 0) {
      plus = vipConfig[level]?.TurntablePlus || 0;
    }
    return {
      level: level,
      plus: plus,
    };
  };

  const handleChangeExperience = () => {
    if (chargeTotal > 0) {
      let experience = 0;
      if (betTotal == 0) {
        setVipExperience(experience);
        return;
      }
      if (parseInt(chargeTotal) > parseInt(betTotal)) {
        experience = betTotal;
      } else if (parseInt(chargeTotal) <= parseInt(betTotal)) {
        experience = chargeTotal;
      }
      setVipExperience(experience);
    }
  };

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  const [isMoveShow, setIsMoveShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMoveShow(true);
      var oTurntable = document.getElementById("spin");
      oTurntable.classList.remove("spinZhuanPanFangDa");
    }, 700);
  }, []);

  useEffect(() => {
    if (userProperties?.properties?.TurntableRemain) {
      canSpinClick();
      setUserTurnTime(userProperties.properties.TurntableRemain);
    } else {
      notSpinClick();
    }

  }, [userProperties, isMoveShow, vipActive]);

  useEffect(() => {
    handleChangeExperience();
  }, [chargeTotal, betTotal]);

  useEffect(() => { }, []);

  return (
    <>
      <Box
        className="imgHidden marginJuZhong funbetTxt "
        style={{ height: "100%", width: "100%", maxWidth: "360px" }}
      >
        <div
          className="spinDi2 positionAb spinZhuanPanFangDa"
          style={{
            backgroundImage: "url('https://scource-static.funibet.com/funibet/images/nav/diPan2.png')",
            top: "30px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            margin: "0px auto",
          }}
        ></div>
        <div
          id="spin"
          className="spinDi1 positionAb spinZhuanPanFangDa"
          style={{
            top: "52px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            margin: "0 auto",
          }}
        >
          <div className="" style={{ marginLeft: "200px", marginTop: "100px" }}>
            <div
              className=" flex width-100 align-item rotate270"
              style={{
                justifyContent: "end",
                margin: "-60px 0px 0px -96px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate292-5"
              style={{
                justifyContent: "end",
                margin: "-22px 0px 0px -58px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className="flex width-100 align-item rotate315"
              style={{
                justifyContent: "end",
                margin: "-6px 0px 0px -24px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate337-5"
              style={{
                justifyContent: "end",
                margin: "6px 0px 0px -2px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item"
              style={{
                justifyContent: "end",
                margin: "12px 0px 0px 6px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate22-5"
              style={{
                justifyContent: "end",
                margin: "10px 0px 0px -2px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate45"
              style={{
                justifyContent: "end",
                margin: "5px 0px 0px -24px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate67-5"
              style={{
                justifyContent: "end",
                margin: "-6px 0px 0px -58px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate90"
              style={{
                justifyContent: "end",
                margin: "-22px 0px 0px -96px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate112-5"
              style={{
                justifyContent: "end",
                margin: "-36px 0px 0px -134px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate135"
              style={{
                justifyContent: "end",
                margin: "-48px 0px 0px -168px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate157-5"
              style={{
                justifyContent: "end",
                margin: "-60px 0px 0px -190px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate180"
              style={{
                justifyContent: "end",
                margin: "-68px 0px 0px -198px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate202-5"
              style={{
                justifyContent: "end",
                margin: "-68px 0px 0px -190px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate225"
              style={{
                justifyContent: "end",
                margin: "-60px 0px 0px -168px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>

            <div
              className=" flex width-100 align-item rotate247-5"
              style={{
                justifyContent: "end",
                margin: "-50px 0px 0px -136px",
                color: "#ffffff",
              }}
            >
              <div className="text-13 fontBold">
                0.0
              </div>
              <img
                className="height-28 ml-4 borderRadius spinIconShadow"
                src="wallet/assets/images/symbol/USGT.PNG"
              ></img>
            </div>
          </div>
        </div>

        <div
          className="positionAb spinZhuanPanFangDa"
          style={{ top: "30px", bottom: "0px", left: "160px", right: "0px" }}
        >
          <img className="" src={vipImgList[vipActive].turnPointerImg}></img>
        </div>

        <img
          className="spinDi3 positionAb btnPointer spinZhuanPanFangDa"
          style={{ top: "159px", bottom: "0px", left: "130px", right: "0px" }}
          src="wallet/assets/images/nav/zhiZhen.png"
        ></img>
        <img
          className={clsx(
            "spinZhuanBtnImgX positionAb Zindex txtBrightness btnPointer ")}
          style={{ top: "159px", bottom: "0px", left: "128px", right: "0px",zIndex:"9999" }}
          onClick={() => {
            spinRata();
          }}
          src="wallet/assets/images/nav/spinZi1.png"
        ></img>
        <img
          className="spinDi7 positionAb activityMoveRight"
          style={{
            top: "344px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            width: "338px",
            height: "80px",
          }}
          src={vipImgList[vipActive].turnTipImg}
        ></img>

        <div
          className="spinDi4 positionAb spinZhuanPanFangDa"
          style={{
            top: "30px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            margin: "0 auto",
          }}
        >
          <img className="sanImg" src={vipImgList[vipActive].src1}></img>
        </div>
        <div
          className="spinDi4 positionAb spinZhuanPanFangDa"
          style={{
            top: "30px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            margin: "0 auto",
          }}
        >
          <img className="sanImg1" src={vipImgList[vipActive].src2}></img>
        </div>

        {isMoveShow && (
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={item}
              className="mt-4 "
              style={{ paddingTop: "415px" }}
            >
              {vipActive === 0 ? (
                <div className="containerSpinBtn  align-item flex justifyContent">
                  <div className="btn " id="spin-div-rata">
                    <a
                      id="spin-a-rata"
                      className="titleTxt"
                      onClick={() => {
                        spinRata();
                      }}
                      style={{ fontSize: "20px", color: "#ffffff" }}
                    >
                      {/* {t("home_Times")} */}
                      times 1
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  className="borderRadius-5 spin-vip promotion-list1"
                  style={{
                    background: "#151617",
                    height: "72px",
                    overflow: "hidden",
                    margin: "4px auto"
                  }}
                >
                  <div className="">
                    <img
                      className="spin-vip-img"
                      src="wallet/assets/images/index/vip1.png"
                    />
                    <div className="spin-vip-text spin-vip-img text-align" style={{ color: "#ffffff" }}>
                      VIP{vipLevel}
                    </div>
                  </div>
                  <div style={{ width: "240px" }}>
                    <div className="spin-vip-2 font-weight500 VipBgDiColor fontBold borderRadius  text-align position-relative">
                      <div
                        className="spin-vip-2 font-weight500 VipBgDiColor fontBold borderRadius  text-align positionAb"
                        style={{
                          background: "#FFC600",
                          width: 0,
                          marginTop: 0,
                        }}
                      ></div>
                      <div style={{ position: "absolute", left: "0px", right: "0px" }}>
                        0
                      </div>
                    </div>
                    <div className="spin-vip-3  text-align colorGameListTitle">
                      总奖金
                      <span className="txtColor">$100</span>
                    </div>
                  </div>

                  <div className="">
                    <img
                      className="spin-vip-img"
                      src="wallet/assets/images/index/vip1.png"
                    />
                    <div className="spin-vip-text spin-vip-img text-align " style={{ color: "#ffffff" }}>
                      VIP2
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div
              variants={item}
              className="spinDi10 spin-bottom flex justify-between items-center p-4 "
            >
              <div className="spin-bonus flex justify-center flex-wrap items-center py-8 ">
                <div className='mr-10'>
                  {/* {t("home_SPINBONUSTOTAL")} */}
                  总奖励
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "#E9D317",
                    fontWeight: "800",
                  }}
                >
                  0.0
                </div>
              </div>
              <div className="spin-bonus px-6 py-8 flex">
                <div className="spin-user-avatar" style={{ minWidth: "28px" }}>
                  <img
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                    }}
                    src="wallet/assets/images/symbol/1.png"
                  />
                </div>
                <div className="spin-record ml-6">
                  <div style={{ color: "#8997B9" }}>
                    奖励
                  </div>
                  <div>
                    胜利
                    <span style={{ color: "#45CB1D" }}>
                      0
                    </span>
                    &nbsp;
                    <span style={{ color: "#ffffff" }}>USDT</span> <br />
                    <span
                      style={{
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#FF5AC4",
                        fontWeight: "600",
                      }}
                    >
                      SPIN
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </Box>

      <AwardPop
        open={popAward}
        onClose={() => {
          setPopAward(false);
          var oTurntable = document.getElementById("spin");
          oTurntable.style.transition = "all 0s";
          oTurntable.style.transform = "rotate(0deg)";
        }}
        symbol={1}
        symbolImg={"wallet/assets/images/symbol/USD.png"}
        balance={1.00}
      />
      
    </>
  );
}
export default Spin;
