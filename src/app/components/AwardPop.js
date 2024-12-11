import { useTranslation } from "react-i18next";
import clsx from 'clsx';
import { useState, useEffect, forwardRef, default as React } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimateModal from "./FuniModal";
import Box from '@mui/material/Box';
import FuseLoading from '@fuse/core/FuseLoading';



function AwardPop(props) {
    const { open, onClose, symbol, symbolImg, balance } = props;
    const { t } = useTranslation('mainPage');
    const [clickShow, setClickShow] = useState(false);

    useEffect(() => {

        if (document.getElementById('bounty-num') && !clickShow && balance > 0) {
            document.getElementById('button-party').addEventListener("click", function (e) {
                e.preventDefault();
            });
        }
    });
    return (
        <AnimateModal className="spinTanChuang" closeClass="displayNone" open={open} onClose={onClose}>
            <div className="spinDi8 ">
                <div>
                    <Box className="text-align  titleTxt2">
                        <div style={{ fontSize: "32px", color: "#ffc600" }} >奖励</div>
                        {/* <img className="mt-16" src={symbolImg} id="test-click" /> */}
                        <img className="" style={{ margin: "1.6rem auto" }} src="wallet/assets/images/symbol/USD.png" id="test-click" />
                        <div className='text-44 fontBold mt-4 flex justify-center items-center' style={{ color: "#ffffff" }} >+&nbsp;{ balance }</div>
                        <div className='mt-2'>
                            <div id="button-party" className={clsx("containerSpinBtn align-item flex justifyContent ", clickShow && 'displayNone')} onClick={() => {
                                setClickShow(true);
                                setTimeout(() => {
                                    setClickShow(false);
                                    onClose()
                                }, 1500)
                            }}>
                                <div className="btn"><a style={{ fontSize: "20px", color: "#ffffff" }}>领取</a></div>
                            </div>
                            <div className={clsx("mt-28 displayNone", clickShow && 'displayBlock')}>
                                <FuseLoading />
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
        </AnimateModal>

    );
}
export default AwardPop;


