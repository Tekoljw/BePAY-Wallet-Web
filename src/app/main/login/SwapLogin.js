import loginWays from "./loginWays";
import { useDispatch } from "react-redux";
import React from 'react'
import { doLogin } from "../../store/user/userThunk";
import { motion } from 'framer-motion';


const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};



function SwapLogin() {

    const dispatch = useDispatch();
    const urlParam = new URL(window.location.href);
    const pathname = urlParam?.pathname  //account
    // const metamaskLogin = () => {
    //     dispatch(doLogin({pathname}))
    // };
    const checkWallet = (e, id) => {
        // console.log(id);
        if (id === 0 || id === 4) {
            dispatch(doLogin({ pathname, id }));
        }
    }

    return (
        <div className="flex justify-center items-center flex-wrap mb-16" style={{
            marginInline: "1.5rem",
            padding: "1.5rem",
            background: '#1E293B',
            borderRadius: '1rem'
        }}>
            <motion.div
                variants={container}
                initial="hidden"
                className=""
                animate="show"
                style={{ background: '#334155', width: "100%", borderRadius: "1rem" }}>
                {
                    loginWays.list.map((way, index) => {
                        const balckimg = way.id === 0 || way.id === 4;
                        return (
                            <motion.div
                                variants={item}
                                className={`login-right-btns-item text-16 flex items-center justify-start txtColorTitleSmall ${balckimg == true ? '' : 'blackimg'}`}
                                key={index}
                                style={{ margin: "1.5rem auto" }}
                                // onClick={() => {
                                //     way.id === 0 && metamaskLogin();
                                //     // way.id === 13 && metamaskLogin();
                                // }}
                                onClick={(e) => checkWallet(e, way.id)}
                            >
                                <img className='login-way-img' src={`/wallet/assets/images/login/${way.src}.png`} alt="" />
                                <span className='login-way-name'>{way.name}</span>
                            </motion.div>
                        )
                    })
                }
            </motion.div>
        </div>
    );
}

export default React.memo(SwapLogin);

