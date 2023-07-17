import Transfer from './Transfer';
import CancelTransfer from './CancelTransfer';
import authRoles from '../../auth/authRoles';

const TransferConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.home,
    routes: [
        {
            path: 'transfer',
            element: <Transfer />,
        },
        {
            path: 'cancelTransfer',
            element: <CancelTransfer />,
        },
    ],
};

export default TransferConfig;
