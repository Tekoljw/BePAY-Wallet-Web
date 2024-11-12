import { useState, useEffect, default as React, memo, useRef } from "react";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import "../../styles/home.css";
import AnimateModal2 from "../components/FuniModal2";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";

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


function ReloginDialog( props, ref ) {
  const { t } = useTranslation("mainPage");
  const dispatch = useDispatch();
  const [loadingShow, setLoadingShow] = useState(false);


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
            <AnimateModal2
              className="faBiDiCard tanChuanDiSe"
              open={props.openLoginWinow}
              onClose={() => props.closeLoginWindow() }
            >
              <div className='flex justify-center mb-16' style={{ width: "100%" }}>
                <img src="wallet/assets/images/card/tanHao.png" className='TanHaoCard' />
                <div className='TanHaoCardZi '>
                  {t('signIn_1')}
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
                  {t('login_1')}
                </div>
              </Box>

              <div className='flex mt-16 mb-28 px-15 justify-center' >
                <LoadingButton
                  disabled={false}
                  className="boxCardBtn"
                  color="secondary"
                  loading={false}
                  variant="contained"
                  onClick={() => {
                    props.closeLoginWindow()
                  }}
                >
                  {t('home_borrow_17')}
                </LoadingButton>
              </div>
            </AnimateModal2>

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

export default React.memo(ReloginDialog);
