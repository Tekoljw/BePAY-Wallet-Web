import * as React from 'react';
import utils from '../../util/tools/utils';
import { useEffect } from "react";
import history from "@history";



export default function test() {
    useEffect(() => {
        // window.localStorage.setItem('redirectGuide', true);
        try {
            utils.consoleText(['Safe & Fast manage crypto assets', 'Crypto & Fiat swap in anytime', 'VISA & Master crypto bank card', 'Current interest up to 5%', 'Mining governance tokens'], 'qddzj', ['#31D4CA', '#5AF4BE', '#069FC9', '#14C2A3', '#5AF4BE', '#5AF4BE'])
            utils.appendScript('https://static-scource.funibet.com/funibox/js/three.min.js', true)
            utils.appendScript('https://static-scource.funibet.com/funibox/js/TweenMax.min.js', true)
            setTimeout(() => {
                utils.appendScript('https://static-scource.funibet.com/funibox/js/cc.js', true)
            }, 100);
            return () => {
                utils.removeScript('https://static-scource.funibet.com/funibox/js/three.min.js')
                utils.removeScript('https://static-scource.funibet.com/funibox/js/TweenMax.min.js')
                utils.removeScript('https://static-scource.funibet.com/funibox/js/cc.js')
                // document.getElementById("my-three-js-canvas").remove()
            }
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <div id="kkqd" class="">
            <div style={{ position: "relative", zIndex: "1", marginTop: "40%", width: "100%" }}>
                <div className='flex' style={{ width: "100%", justifyContent: "center" }} >
                    <img style={{ width: "60%" }} src="/wallet/assets/images/logo/qdLogo.png" />
                </div>
                <div className='text-24 px-32' style={{ width: "100%", textAlign: "center", color: "#ffffff", fontWeight: "bold", marginTop: "25%" }} >
                    Global Crypto Bank
                </div>
                <div class='console-container mt-40 px-28'><span id='qddzj'></span><div class='console-underscore' id='console'>&#95;</div></div>
                <div
                    className='flex justify-center'
                >
                    <img className='mr-16' style={{ width: "20%" }} src="/wallet/assets/images/login/master.png" />
                    <img className='ml-16' style={{ width: "20%" }} src="/wallet/assets/images/login/visa.png" />
                </div>
                <div
                    className='flex justify-between px-32 mt-60'
                    style={{}}
                >
                    <div
                        onClick={() => {
                            history.push("/wallet/sign-up" + window.location.search);
                        }}
                        style={{ backgroundColor: "#14C2A3", fontWeight: "600", color: "#ffffff", width: "44%", borderRadius: "0.6rem", height: "4rem", lineHeight: "4rem", textAlign: "center" }}
                    >
                        Sign
                    </div>
                    <div
                        onClick={() => {
                            history.push("/wallet/login" + window.location.search);
                        }}
                        style={{ backgroundColor: "#14C2A3", fontWeight: "600", color: "#ffffff", width: "44%", borderRadius: "0.6rem", height: "4rem", lineHeight: "4rem", textAlign: "center" }}
                    >
                        Login</div>
                </div>
            </div>
        </div>
    );
}
