import React,{ useState, useEffect, useRef } from 'react';
import { getUserData } from 'app/store/user/userThunk';
import { useDispatch } from 'react-redux';
import { goMintNft, getGenesisRobotConfig, mintGenesisRobot, queryContractResult  } from 'app/store/nft/nftThunk';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { getWalletAddress } from 'app/store/wallet/walletThunk';
import { loadCss as loadingCss } from '../../util/tools/utils';

function MintNft(props) {
  const dispatch = useDispatch();

  const [ userData, setUserData ] = useState({});

  const [ nftConfig, setNftConfig ] = useState({});
  const [ contractToken, setContractToken ] = useState('0x1b704281eCbbE12e9ED68931d606a8A5dEAA6B06');
  const [ mintGas, setMintGas ] = useState(0);
  const [ alreadyMintNum, setAlreadyMintNum ] = useState(0);
  const [ allMintNum, setAllMintNum ] = useState(0);
  const [ mintPrice, setMintPrice ] = useState(0);
  const [ mintNum, setMintNum ] = useState(1);
  const [ mintClick, setMintClick ] = useState(true);

  // Load CSS
  const loadCss = () => {
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/animate.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/bootstrap.min.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/off-canvas.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/responsive.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/sc-spacing.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/style.css');
    loadingCss('https://scource-static.funibet.com/css/nft-beingfi/swiper.css');
  }

  // 获取配置
  const getConfig = () => {
    console.log(userData, 'userData......')
    dispatch(getGenesisRobotConfig()).then((res) => {
      res = res.payload
      if (res && res[0]) {
        var tmpNftConfig = {}
        // if (userData.loginType == 1) {
        //   console.log(userData.loginType, 'userData.loginType')
        //   tmpNftConfig = res[0]
        // } else {
        //   console.log(userData.loginType, 'userData.loginType22222')
        //   tmpNftConfig = res[1]
        // }

        tmpNftConfig = res[0]

        setAlreadyMintNum(tmpNftConfig.currentSupply)
        if (tmpNftConfig.stage === 1) {
          setMintGas(0)
          setMintPrice(0)
        } else if (tmpNftConfig.stage === 2) {
          setMintGas(tmpNftConfig.stageTwoMintFee)
          setMintPrice(tmpNftConfig.stageTwoMintFee)
        } else if (tmpNftConfig.stage === 3) {
          setMintGas(tmpNftConfig.stageThreeMintFee)
          setMintPrice(tmpNftConfig.stageThreeMintFee)
        }
        setAllMintNum(tmpNftConfig.totalSupply)
        setContractToken(tmpNftConfig.contractAddress)
        setNftConfig(tmpNftConfig)
      }

      console.log(res, 'config......')
    })
    return
  }

  // 执行中心化mint
  const doMintGenesisRobot = async (param) => {
    var res = await dispatch(mintGenesisRobot(param))
    res = res.payload

    return res
  }

  // 查询mint状态
  const getMintGenesisRobot = async (queryId) => {
    var mintStatusRes = await dispatch(queryContractResult({
      queryId
    }))
    mintStatusRes = mintStatusRes.payload

    return mintStatusRes
  }

  
  // 提示信息
  const showMsg = (code, num, msg) => {
    if (code === 1) {
      dispatch(showMessage({ message: msg ?? `successfully mint ${num}`, code: 1 }))
    } else {
      dispatch(showMessage({ message: t('error_2'), code: 2 }))
    }
  }

  // nft mint
  const onMint = async () => {
    console.log(userData.loginType)
    var currentTime = parseInt(new Date().getTime() / 1000);
    if (nftConfig.stageStart <= currentTime && currentTime <= (parseInt(nftConfig.stageStart) + parseInt(nftConfig.stageTime))) {
      if (mintNum <= 0) {
        showMsg(2, '', 'Quantity error')
        return
      }

      if (!mintClick) {
        showMsg(2, '', 'In mint')
        return
      }

      setMintClick(false);
      // 去中心化钱包
      if (userData.loginType == 1) {
        var res = await dispatch(goMintNft({
          userAddress: userData.user.address,
          nftToken: contractToken,
          mintGas: mintGas * mintNum,
          tokenId: mintNum
        }))

        res = res.payload
        console.log('res => ', res)
        setMintClick(true)
      } else { // 中心化mint
        dispatch(getWalletAddress({
          walletName: 'DeFi'
        })).then((walletRes) => {
          walletRes = walletRes.payload
          console.log('walletRes => ', walletRes)

          doMintGenesisRobot({
            nftId: nftConfig.id,
            tokenId: mintNum
          }).then((res) => {
            console.log(res, 'queryId......')
            let timer = setInterval(async () => {
              var res = await getMintGenesisRobot(res);
              if (res === false) {
                showMsg(2)
                clearInterval(timer)
                setMintClick(true)
              } else if (res != '') {
                showMsg(1, mintNum)
                clearInterval(timer)
                setMintClick(true)
              }
            }, 5000)
          }).catch((e) => {
            console.log(e, 'error......')
            showMsg(2)
            setMintClick(true)
          })
        }).catch((e) => {
          console.log(e, 'get address error......')
          showMsg(2)
          setMintClick(true)
        })
      }
    } else {
      showMsg(2, '', 'Not in time period')
    }
  }
  // const onMint = async () => {
  //   console.log(userData.loginType)
  //   var currentTime = parseInt(new Date().getTime() / 1000);
  //   if (nftConfig.stageStart <= currentTime && currentTime <= (parseInt(nftConfig.stageStart) + parseInt(nftConfig.stageTime))) {
  //     if (mintNum <= 0) {
  //       console.log('数量不能为0......')
  //       return
  //     }
  //
  //     if (!mintClick) {
  //       console.log('正在mint......')
  //       return
  //     }
  //
  //     setMintClick(false);
  //     // 去中心化钱包
  //     if (userData.loginType == 1) {
  //       for (var i = 0; i < mintNum; i++) {
  //         var res = await dispatch(goMintNft({
  //           userAddress: userData.user.address,
  //           nftToken: contractToken,
  //           mintGas: mintGas,
  //         }))
  //
  //         res = res.payload
  //         console.log('res => ', res)
  //         if (!res) {
  //           break;
  //         }
  //       }
  //       setMintClick(true)
  //     } else { // 中心化mint
  //       dispatch(getWalletAddress({ walletName: 'DeFi' })).then((walletRes) => {
  //         walletRes = walletRes.payload
  //         console.log('walletRes => ', walletRes)
  //
  //         var tmpHash = [];
  //         // [
  //         //   { queryId: '', hash: '' }
  //         // ]
  //
  //         let timer = setInterval(async () => {
  //           let hashLen = tmpHash.length
  //           // 第一次mint
  //           if (hashLen === 0) {
  //             var res = await doMintGenesisRobot({
  //               nftId: nftConfig.id
  //             })
  //             if (!res) {
  //               showMsg(2)
  //               clearInterval(timer)
  //               setMintClick(true)
  //             } else {
  //               tmpHash.push({
  //                 queryId: res,
  //                 hash: ''
  //               })
  //             }
  //           } else {
  //             let tmpMintData = tmpHash[hashLen - 1]
  //             if (tmpMintData.hash === '') {
  //               var res = await getMintGenesisRobot(tmpMintData.queryId);
  //               if (res === false) {
  //                 if ((hashLen - 1) === 0) {
  //                   showMsg(2)
  //                 } else {
  //                   showMsg(1, hashLen - 1)
  //                 }
  //                 clearInterval(timer)
  //                 setMintClick(true)
  //               } else {
  //                 if (res != '') {
  //                   tmpHash[hashLen - 1].hash = res
  //                 }
  //               }
  //             } else {
  //               // 如果mint到了最后一个,且查询到了hash,则全部执行完毕
  //               if (hashLen === mintNum) {
  //                 showMsg(1, hashLen)
  //                 clearInterval(timer)
  //                 setMintClick(true)
  //               } else {
  //                 var res = await doMintGenesisRobot({
  //                   nftId: nftConfig.id
  //                 })
  //                 if (!res) {
  //                   if ((hashLen - 1) === 0) {
  //                     showMsg(2)
  //                   } else {
  //                     showMsg(1, hashLen - 1)
  //                   }
  //                   clearInterval(timer)
  //                   setMintClick(true)
  //                 } else {
  //                   tmpHash.push({
  //                     queryId: res,
  //                     hash: ''
  //                   })
  //                 }
  //               }
  //             }
  //           }
  //         }, 5000)
  //       })
  //     }
  //   } else {
  //     console.log('不在时间段内......')
  //   }
  // }

  useEffect(() => {
    // 获取用户数据
    dispatch(getUserData()).then((res) => {
      res = res.payload
      if (res && res.errno == 0) {
        const userRes = res.data
        setUserData(userRes)
      }
    })
    loadCss();
  }, []);

  // 获取到用户信息后,去获取config
  useEffect(() => {
    if (JSON.stringify(userData) != "{}") {
      getConfig();
    }
  }, [userData]);

  return (
    <>
      <div className="mint_modal">
        <div className=" " id="mintModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" style={{margin: 'auto'}}>
            <div className="modal-content">
              <div className="modal_overlay2">
                <div className="modal_header">
                  <h2>Collect YOUR NFT before end</h2>
                  <button data-bs-dismiss="modal" aria-label="Close">
                    <span className="clossbtn_bg"><i className="fa-solid fa-xmark"></i></span>
                  </button>
                </div>
                <div className="modal_body text-center">
                  <div className="mint_img">
                    <img src="assets/beingfi/images/icon/blind-box.png" style={{margin: "0 auto"}} alt="img" />
                  </div>
                  <div className="mint_count_list">
                    <ul>
                      <li>
                        <h5>Remaining</h5>
                        <h5>{alreadyMintNum}/<span>{allMintNum}</span></h5>
                      </li>
                      <li>
                        <h5>Price</h5>
                        <h5>{mintPrice} ETH</h5>
                      </li>
                      <li>
                        <h5>Quantity</h5>
                        <div className="mint_quantity_sect">
                          <button onClick={() => {
                            let tmpMintNum = (mintNum - 1) <= 0 ? 0 : (mintNum - 1)
                            setMintNum(tmpMintNum);
                          }}>-</button>
                          <input type="text" id="quantity" value={mintNum}/>
                            <button onClick={() => {
                              let maxNum = 1
                              let tmpMintNum = mintNum + 1
                              if (nftConfig.stage === 1) {
                                maxNum = 2
                              } else if (nftConfig.stage === 2) {
                                maxNum = 3
                              } else if (nftConfig.stage === 3) {
                                maxNum = nftConfig.totalSupply - nftConfig.currentSupply
                              }
                              if (tmpMintNum <= maxNum) {
                                setMintNum(tmpMintNum);
                              }
                            }}>
                              +
                            </button>
                        </div>
                        <h5><span>{(mintPrice * mintNum).toFixed(6)}</span> ETH</h5>
                      </li>

                    </ul>
                  </div>
                  {!mintClick && <FuseLoading />}
                  {mintClick && <button
                    className="modal_mint_btn hov_shape_show"
                    style={{
                      color: '#ffffff'
                    }}
                    onClick={() => {
                      onMint()
                    }}
                  >
                    MINT NOW
                    <span className="hov_shape1">
                      <img src="assets/beingfi/images/icon/hov_shape_L_dark.svg" alt="" />
                    </span>
                    <span className="hov_shape2">
                      <img src="assets/beingfi/images/icon/hov_shape_L_dark.svg" alt="" />
                    </span>
                  </button>}

                  {/* <h6>Presale & Whitelist : Soldout</h6> */}
                </div>
                <div className="modal_bottom_shape">
                  <span className="modal_bottom_shape_left">
                    <img src="assets/beingfi/images/icon/hov_shape_L.svg" alt="" />
                  </span>
                  <span className="modal_bottom_shape_right">
                    <img src="assets/beingfi/images/icon/hov_shape_L.svg" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(MintNft);
