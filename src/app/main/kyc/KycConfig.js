import Kyc from './Kyc';
import authRoles from '../../auth/authRoles';

const KycConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'kyc',
            element: <Kyc />,
        },
    ],
};

export default KycConfig;
