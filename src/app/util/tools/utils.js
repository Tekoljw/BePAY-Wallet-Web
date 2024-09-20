import truffle_contract from "@truffle/contract";
import utils_web3 from "../web3"
import { resolve } from "url";

// 获取智能合约内容
const contractAbi = (type) => {
    let file = null;
    switch(type) {
        case "USGT":
            file = require('../abi/USGT.json');
            break;
        case "GameBanker":
            file = require('../abi/GameBanker.json');
            break;
        case "PoolForToken":
            file = require('../abi/PoolForToken.json');
            break;
        case "GenesisRobotNftToken":
            file = require('../abi/GenesisRobot.json');
            break;
    }

    return file || {};
}

// const contractAt = async (abi, address, onlyRead) => {
//     let contract = truffle_contract(abi);
//     var web3 = utils_web3.getWeb3();
//     contract.setProvider(web3.currentProvider);
//     console.log(contract.at(''))
//     try {
//
//     } catch (e) {
//         console.log(e.message);
//         return { error: e.message };
//     }
// }
async function contractAt(abi, address, onlyRead){

    let contract = truffle_contract(abi);

    var web3 = await utils_web3.getWeb3();

    console.log(web3.currentProvider);

    contract.setProvider(web3.currentProvider);

    console.log(contract);

    try {
        // if(!onlyRead){
        //     var lastBlock = await web3.eth.getBlockNumber();
        
        //     var gasTracker = store.state.gasTracker;
        //     if(gasTracker &&
        //         parseFloat(gasTracker.lastBlock) > (parseFloat(lastBlock - 50))
        //     ){
        //         contract.defaults({
        //             gasPrice: gasTracker.medium,
        //         });
        //     }else{
        //         var gasPrice = await web3.eth.getGasPrice();
        //         contract.defaults({
        //             gasPrice: gasPrice,
        //         });
        //     }
        // }
        if(address){
            return contract.at(address);
        }else{
            return contract;
        }
    } catch (e) {
        return { error: e.message };
    }
}

export const isScriptLoad = (scriptToLoad) => {
    let allsuspects=document.getElementsByTagName("script");
    for (let i=allsuspects.length; i>=0; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute("src")!==null
        && allsuspects[i].getAttribute("src").indexOf(`${scriptToLoad}`) !== -1 ) {
            return true;
        }
    }
    return false;
}

export const appendScript = async(scriptToAppend, isAsync) => {
  return new Promise((resolve, reject)=>{
    if(!isScriptLoad(scriptToAppend)) {
        const script = document.createElement("script");
        script.src = scriptToAppend;
        script.async = (isAsync == undefined || isAsync == true) ? true : false ;
        document.body.appendChild(script);
        resolve(true)
    }
  })
}



export const consoleText = (words, id, colors) => {
  return new Promise((resolve, reject)=>{
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
    if (colors === undefined) colors = ['#fff'];
    var visible = true;
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id)
    target.setAttribute('style', 'color:' + colors[0])
    window.setInterval(
      function () {
        if (letterCount === 0 && waiting === false) {
          waiting = true;
          target.innerHTML = words[0].substring(0, letterCount)
          window.setTimeout(function () {
            var usedColor = colors.shift();
            colors.push(usedColor);
            var usedWord = words.shift();
            words.push(usedWord);
            x = 1;
            target.setAttribute('style', 'color:' + colors[0])
            letterCount += x;
            waiting = false;
            resolve(true)
          }, 1000)
        } else if (letterCount === words[0].length + 1 && waiting === false) {
          waiting = true;
          window.setTimeout(function () {
            x = -1;
            letterCount += x;
            waiting = false;
            resolve(true)
          }, 1000)
        } else if (waiting === false) {
          target.innerHTML = words[0].substring(0, letterCount)
          letterCount += x;
          resolve(true)
        }
      }, 120)

      window.setInterval(function () {
        if (visible === true) {
          con.className = 'console-underscore hiddenDz'
          visible = false;
        } else {
          con.className = 'console-underscore'
          visible = true;
        }
        resolve(true)
      }, 400)
    })
  }


export const loadCss = (url) => {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
}

export const removeScript = (scriptToRemove) => {
    let allsuspects=document.getElementsByTagName("script");
  
    for (let i=allsuspects.length; i>=0; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute("src")!==null
        && allsuspects[i].getAttribute("src").indexOf(`${scriptToRemove}`) !== -1 ) {
            allsuspects[i].parentNode.removeChild(allsuspects[i])
        }
    }
}

export default {
    contractAbi,
    contractAt,
    appendScript,
    consoleText,
    removeScript,
    loadCss,
}
