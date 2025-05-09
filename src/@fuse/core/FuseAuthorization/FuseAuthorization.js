import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { PureComponent } from 'react';
import { matchRoutes } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import history from '@history';

let loginRedirectUrl = null;

class FuseAuthorization extends PureComponent {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/';
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, userRole } = props;
    const { pathname } = location;

    const matchedRoutes = matchRoutes(state.routes, pathname);

    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true,
    };
  }

  redirectRoute() {
    let { location, userRole } = this.props;
    const { pathname } = location;
    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;


    let token = `${window.localStorage.getItem(
        `Authorization-${window.sessionStorage.getItem('openAppId') || 0}-${window.sessionStorage.getItem('openIndex') || 0}`
    ) || ''}`;
    // userRole = userRole || (token ? 'home': '');
    console.log(userRole, 'userRole.......')
    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      setTimeout(() => history.push('/wallet/login'), 0);
      loginRedirectUrl = pathname;
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
