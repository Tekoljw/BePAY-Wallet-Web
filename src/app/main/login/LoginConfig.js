import Login from './Login';
import Forgot from './Forgot';
import ResetPass from './ResetPass';
import RetiedPhone from './RetiedPhone'
import RetiedEmail from './RetiedEmail'
import authRoles from '../../auth/authRoles';

const LoginConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.onlyGuest,
    routes: [
        {
            path: 'login',
            element: <Login />,
        },
        {
            path: 'forgot',
            element: <Forgot />,
        },
        {
            path: 'reset-pass',
            element: <ResetPass />,
        },
        {
            path: 're-tied-phone',
            element: <RetiedPhone />,
        },
        {
            path: 're-tied-email',
            element: <RetiedEmail />,
        }
    ],
};

export default LoginConfig;
