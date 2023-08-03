import loginWays from "./loginWays";
import { useDispatch } from "react-redux";
import React from 'react'
import { doLogin, bindWallet } from "../../store/user/userThunk";


function Web3Login() {
    
    const dispatch = useDispatch();
    const urlParam = new URL(window.location.href);
    const pathname =urlParam?.pathname  //account

    // const metamaskLogin = () => {
    //     dispatch(doLogin({pathname}))
        
    // };

    const checkWallet = async (e,id)=>{
        // console.log(id);
        const bindWalletRes = await dispatch(bindWallet());
        if (bindWalletRes.payload) {
            dispatch(doLogin({pathname,id}))
        }
        
    }
    
    return (
        <div className="flex justify-center items-center flex-wrap mx-24 mb-16 pt-16  " style={{
            background: '#334155',
            borderRadius: '15px'
        }}>
            {
                loginWays.list.map((way, index) => {
                    const balckimg = way.id === 0 || way.id === 13 ;
                    return (
                        <div
                        
                        className={`mx-8 login-right-btns-item text-16 flex items-center justify-start txtColorTitleSmall ${balckimg == true ? '' : 'blackimg'}`}
                          key={index}
                            // onClick={() => {
                            //     way.id === 0 && metamaskLogin();
                            //     // way.id === 13 && metamaskLogin();
                            // }}
                                onClick={(e)=>checkWallet(e,way.id)}

                        >
                            <img  className='login-way-img'  src={`/assets/images/login/${way.src}.png`} alt="" />
                            <span className='login-way-name'>{way.name}</span>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default React.memo(Web3Login);

