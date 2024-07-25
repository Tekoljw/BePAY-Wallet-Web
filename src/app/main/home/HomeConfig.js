import { lazy } from 'react';
import Home from './Home';
import Test from './Test';
import Start from './Start';
import TransferBgt from './TransferBgt';
import MintNft from '../nft/MintNft';
import NftPool from '../nft/NftPool';
import authRoles from '../../auth/authRoles';
import i18next from 'i18next';
import en from '../../lang/en';
// import zh from '../../lang/zh';
import ae from '../../lang/ae';
import bd from '../../lang/bd';
import br from '../../lang/br';
import cn from '../../lang/cn';
import de from '../../lang/de';
import es from '../../lang/es';
import fi from '../../lang/fi';
import fr from '../../lang/fr';
import hk from '../../lang/hk';
import id from '../../lang/id';
import hi from '../../lang/in';
import jp from '../../lang/jp';
import kr from '../../lang/kr';
import mld from '../../lang/mld';
import my from '../../lang/my';
import ph from '../../lang/ph';
import pl from '../../lang/pl';
import th from '../../lang/th';
import tmr from '../../lang/tmr';
import tr from '../../lang/tr';
import vn from '../../lang/vn';
import ru from '../../lang/ru';
import mintNft from "../nft/MintNft";
import mm from '../../lang/mm';
import pak from '../../lang/pak';


i18next.addResourceBundle('en', 'mainPage', en);
// i18next.addResourceBundle('zh', 'mainPage', zh);
i18next.addResourceBundle('hi', 'mainPage', hi);
i18next.addResourceBundle('ae', 'mainPage', ae);
i18next.addResourceBundle('bd', 'mainPage', bd);
i18next.addResourceBundle('br', 'mainPage', br);
i18next.addResourceBundle('cn', 'mainPage', cn);
i18next.addResourceBundle('de', 'mainPage', de);
i18next.addResourceBundle('es', 'mainPage', es);
i18next.addResourceBundle('fi', 'mainPage', fi);
i18next.addResourceBundle('fr', 'mainPage', fr);
i18next.addResourceBundle('hk', 'mainPage', hk);
i18next.addResourceBundle('id', 'mainPage', id);
i18next.addResourceBundle('jp', 'mainPage', jp);
i18next.addResourceBundle('kr', 'mainPage', kr);
i18next.addResourceBundle('mld', 'mainPage', mld);
i18next.addResourceBundle('my', 'mainPage', my);
i18next.addResourceBundle('ph', 'mainPage', ph);
i18next.addResourceBundle('pl', 'mainPage', pl);
i18next.addResourceBundle('th', 'mainPage', th);
i18next.addResourceBundle('tmr', 'mainPage', tmr);
i18next.addResourceBundle('tr', 'mainPage', tr);
i18next.addResourceBundle('vn', 'mainPage', vn);
i18next.addResourceBundle('ru', 'mainPage', ru);
i18next.addResourceBundle('mm', 'mainPage', mm);
i18next.addResourceBundle('pak', 'mainPage', pak);

const HomeConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'home',
            element: <Home />,
            children: [
                {
                    // path: 'wallet',
                    index: true,
                    element: lazy(() => import('../deposite/Deposite')),
                },
                {
                    path: 'deposite',
                    element: lazy(() => import('../deposite/Deposite')),
                },
                {
                    path: 'withdraw',
                    element: lazy(() => import('../withdraw/Withdraw')),
                },
                {
                    path: 'card',
                    element: lazy(() => import('../card/Card')),
                },
                {
                    path: 'buyCrypto',
                    element: lazy(() => import('../buy/Buy')),
                },
                {
                    path: 'swap',
                    element: lazy(() => import('../swap/Swap')),
                },
                {
                    path: 'borrow',
                    element: lazy(() => import('../borrow/Borrow')),
                },
                {
                    path: 'pools',
                    element: lazy(() => import('../pool/Pool')),
                },
                {
                    path: 'earn',
                    element: lazy(() => import('../earn/Earn')),
                },
                {
                    path: 'c2c',
                    element: lazy(() => import('../coming-soon/ComingSoon')),
                },
                {
                    path: 'nft',
                    element: lazy(() => import('../coming-soon/ComingSoon')),
                },
                {
                    path: 'record',
                    element: lazy(() => import('../record/Record')),
                },
                {
                    path: 'security',
                    element: lazy(() => import('../security/Security')),
                },
                {
                    path: 'wallet',
                    element: lazy(() => import('../wallet/Wallet')),
                },


            ]
        },
        {
            path: 'test',
            element: <Test />,
        },
        {
            path: 'start',
            element: <Start />,
        },
        {
            path: 'transferbgt',
            element: <TransferBgt />,
        },
        {
            path: 'nft',
            element: <NftPool />,
            children: [
                {
                    path: 'nftPool',
                    element: lazy(() => import('../nft/NftPool')),
                }
            ]
        },
        {
            path: 'mintNft',
            element: <MintNft />,
        },
    ],
};

export default HomeConfig;
