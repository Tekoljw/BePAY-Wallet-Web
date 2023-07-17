import FaTPayBuyPage from './FaTPayBuyPage';
import authRoles from '../../auth/authRoles';

const FaTPayBuyConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'fatpaybuy',
            element: <FaTPayBuyPage />,
        },
    ],
};

export default FaTPayBuyConfig;
