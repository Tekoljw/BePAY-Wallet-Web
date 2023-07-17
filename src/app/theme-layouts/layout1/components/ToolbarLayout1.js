import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NotificationPanelToggleButton from '../../shared-components/notificationPanel/NotificationPanelToggleButton';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';
import NavigationSearch from '../../shared-components/NavigationSearch';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import ChatPanelToggleButton from '../../shared-components/chatPanel/ChatPanelToggleButton';
import MobileDetect from 'mobile-detect';

function ToolbarLayout1(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);

  const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx('flex relative z-20 shadow-md', props.className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64">
          <div className="flex flex-1 px-16">
            {config.navbar.display && config.navbar.position === 'left' && (
              <>
                <Hidden smDown={isMobileMedia ? false : true} lgDown={!isMobileMedia ? false : true}>
                  {(config.navbar.style === 'style-3' ||
                    config.navbar.style === 'style-3-dense') && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}

                  {config.navbar.style === 'style-1' && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>

                <Hidden smUp={isMobileMedia ? false : true} lgUp={!isMobileMedia ? false : true}>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}

            {/*<Hidden lgDown>*/}
            {/*  <NavigationShortcuts />*/}
            {/*</Hidden>*/}
            <Hidden>
              <img src="assets/images/logo/funihash-logo.png" className="funihash-logo" alt=""/>
            </Hidden>
          </div>

          <div className="flex items-center px-8 h-full overflow-x-auto">
            <LanguageSwitcher />

            <AdjustFontSize />

            <FullScreenToggle />

            <NavigationSearch />

            <Hidden smUp={isMobileMedia ? false : true} lgUp={!isMobileMedia ? false : true}>
              <ChatPanelToggleButton />
            </Hidden>

            <QuickPanelToggleButton />

            <NotificationPanelToggleButton />

            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === 'right' && (
            <>
              <Hidden smDown={isMobileMedia ? false : true} lgDown={!isMobileMedia ? false : true}>
                {!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}
              </Hidden>

              <Hidden smUp={isMobileMedia ? false : true} lgUp={!isMobileMedia ? false : true}>
                <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
