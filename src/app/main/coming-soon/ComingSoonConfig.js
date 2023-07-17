import ComingSoon from './ComingSoon';
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



i18next.addResourceBundle('en', 'mainPage', en);
// i18next.addResourceBundle('zh', 'mainPage', zh);
i18next.addResourceBundle('in', 'mainPage', hi);
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

const ComingSoonConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    // auth: authRoles.home,
    routes: [
        {
            path: 'coming-soon',
            element: <ComingSoon />,
        },
    ],
};

export default ComingSoonConfig;
