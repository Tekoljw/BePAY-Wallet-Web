import UniSwapPage from './UniSwapPage';
import authRoles from '../../auth/authRoles';


const UniSwapConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'uniswap',
            element: <UniSwapPage />,
        },
    ],
};

export default UniSwapConfig;
