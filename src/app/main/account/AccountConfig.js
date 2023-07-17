import Account from './Account';
import authRoles from '../../auth/authRoles';

const AccountConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'account',
            element: <Account />,
        },
    ],
};

export default AccountConfig;
