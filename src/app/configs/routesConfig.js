import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import HomeConfig from '../main/home/HomeConfig';
import AccountConfig from '../main/account/AccountConfig';
import LoginConfig from "../main/login/LoginConfig";
import KycConfig from "../main/kyc/KycConfig";
import BuyConfig from "../main/buy/BuyConfig";
import TransferConfig from "../main/transfer/TransferConfig";
import FaTPayBuyConfig from "../main/buy/FaTPayBuyConfig";
import UniSwapConfig from "../main/swap/UniSwapConfig";
import ComingSoonConfig from '../main/coming-soon/ComingSoonConfig';

const routeConfigs = [
    HomeConfig,
    ExampleConfig,
    SignOutConfig,
    SignInConfig,
    SignUpConfig,
    LoginConfig,
    AccountConfig,
    KycConfig,
    BuyConfig,
    FaTPayBuyConfig,
    UniSwapConfig,
    TransferConfig,
    ComingSoonConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/home" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
