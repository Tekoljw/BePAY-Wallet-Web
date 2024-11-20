import * as React from 'react';
import utils from '../../util/tools/utils';
import { useEffect } from "react";
import history from "@history";



export default function start() {

    useEffect(() => {
        Promise.all([utils.consoleText(['Safe & Fast manage crypto assets', 'Crypto & Fiat swap in anytime', 'VISA & Master crypto bank card', 'Current interest up to 5%', 'Mining governance tokens'], 'qddzj', ['#31D4CA', '#5AF4BE', '#069FC9', '#14C2A3', '#5AF4BE', '#5AF4BE']), utils.appendScript('https://static-scource.funibet.com/funibox/js/three.min.js', true), utils.appendScript('https://static-scource.funibet.com/funibox/js/TweenMax.min.js', true)]).then((resArr) => {
            utils.appendScript('https://static-scource.funibet.com/funibox/js/cc.js', true)
            return () => {
                utils.removeScript('https://static-scource.funibet.com/funibox/js/cc.js')
                utils.removeScript('https://static-scource.funibet.com/funibox/js/three.min.js')
                utils.removeScript('https://static-scource.funibet.com/funibox/js/TweenMax.min.js')
                // document.getElementById("my-three-js-canvas").remove()
            }
        })
    }, [])

    return (
        <div id="kkqd" class="">
            <div style={{ position: "relative", zIndex: "1", marginTop: "36%", width: "100%" }}>
                <div className='flex ' style={{ width: "100%", justifyContent: "center" }} >
                    <img style={{ width: "68%" }} src="/wallet/assets/images/logo/qdLogo.png" />
                </div>
                <div className='px-32 starZi' style={{ fontSize: "28px", width: "100%", textAlign: "center", color: "#ffffff", fontWeight: "bold", marginTop: "34%" }} >
                    Global Crypto Bank
                </div>
                <div class='console-container px-28' style={{ marginTop: "12%" }} ><span id='qddzj'></span><div class='console-underscore' id='console'>&#95;</div></div>

                <div className='flex justify-center' >
                    <img className='mr-16' style={{ width: "20%" }} src="/wallet/assets/images/login/master.png" />
                    <img className='ml-16' style={{ width: "20%" }} src="/wallet/assets/images/login/visa.png" />
                </div>
                <div
                    className='flex justify-between px-32 mt-60'
                    style={{}}
                >
                    <div
                        className='flex justify-center starBtnColor1'
                        onClick={() => { history.push("/wallet/sign-up" + window.location.search); }}
                        style={{ fontWeight: "600", color: "#ffffff", width: "45%", borderRadius: "10rem", height: "3.8rem", lineHeight: "3.8rem", textAlign: "center" }}
                    >
                        <img className='mt-9 mr-9' style={{ width: "20px", height: "20px" }} src="/wallet/assets/images/login/tg.png"></img>
                        <div>Sign up</div>
                    </div>
                    <div className='flex justify-center'
                        onClick={() => { history.push("/wallet/login" + window.location.search); }}
                        style={{ backgroundColor: "#ffffff", fontWeight: "600", width: "45%", borderRadius: "10rem", height: "3.8rem", lineHeight: "3.8rem", textAlign: "center" }}
                    >
                        <div className='starZi2 mr-9'>Login</div>
                        <img className='mt-9' style={{ width: "20px", height: "20px" }} src="/wallet/assets/images/login/my.png"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}
