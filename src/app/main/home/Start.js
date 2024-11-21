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
            <div style={{ position: "relative", zIndex: "1", paddingTop: "16%", width: "100%", height: "100vh" }}>
                <div className='flex ' style={{ width: "100%", justifyContent: "center" }} >
                    <img style={{ width: "46%" }} src="/wallet/assets/images/logo/qdLogo.png" />
                </div>

                <div className='flex justify-center' style={{ width: "100%", justifyContent: "center", marginTop: "30%" }} >
                    <div className='floating' style={{ width: "60%" }} >
                        <img className='animated-image ' src="/wallet/assets/images/login/mokuai.png" />
                    </div>
                </div>

                <div
                    style={{ position: "absolute", bottom: "16%", width: "100%" }}
                >
                    <div className='' style={{ fontSize: "46px", marginLeft: "10%", width: "80%", textAlign: "left", color: "#ffffff", fontWeight: "bold", marginTop: "34%" }} >
                        Global Crypto
                    </div>

                    <div className='' style={{ fontSize: "46px", marginLeft: "10%", width: "80%", textAlign: "left", color: "#ffffff", fontWeight: "bold", marginTop: "0%" }} >
                        Digital banking
                    </div>

                    <div class='console-container ' style={{ marginTop: "5%", paddingLeft: "10%" }} ><span id='qddzj'></span><div class='console-underscore' id='console'>&#95;</div></div>
                </div>

                <div
                    style={{ position: "absolute", bottom: "6%", width: "100%" }}
                >
                    <div
                        className='flex justify-center '
                        onClick={() => { history.push("/wallet/sign-up" + window.location.search); }}
                        style={{ backgroundColor: "#0D9488", fontWeight: "600", color: "#ffffff", width: "80%", margin: "0 auto", borderRadius: "20rem", height: "5.2rem", lineHeight: "5.2rem", textAlign: "center" }}
                    >
                        <img className='mr-10' style={{ marginTop: "14px", width: "24px", height: "24px" }} src="/wallet/assets/images/login/tg.png"></img>
                        <div className='starZi2 ' style={{ fontSize: "17px" }}>Register a new account</div>
                    </div>

                    <div className='flex justify-center'
                        onClick={() => { history.push("/wallet/login" + window.location.search); }}
                        style={{ border: "1px solid #0D9488", margin: "28px auto 0px auto", fontWeight: "600", width: "80%", borderRadius: "20rem", height: "5.2rem", lineHeight: "5.2rem", textAlign: "center" }}
                    >
                        <img className='mr-10' style={{ marginTop: "14px", width: "24px", height: "24px" }} src="/wallet/assets/images/login/my.png"></img>
                        <div style={{ fontSize: "17px" }}>Log in existing account</div>
                    </div>
                </div>


                <div className='flex justify-center' style={{ position: "absolute", bottom: "1%" }} >
                    <img className='mr-16' style={{ width: "12%" }} src="/wallet/assets/images/login/master.png" />
                    <img className='ml-16' style={{ width: "12%" }} src="/wallet/assets/images/login/visa.png" />
                </div>


            </div>
        </div>
    );
}
