import BuyPage from './BuyPage';
import authRoles from '../../auth/authRoles';

const BuyConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'buy',
            element: <BuyPage />,
        },
    ],
};

export default BuyConfig;
