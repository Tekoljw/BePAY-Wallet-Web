import FuseDialog from '@fuse/core/FuseDialog';
import { styled } from '@mui/material/styles';
import FuseMessage from '@fuse/core/FuseMessage';
import FuseSuspense from '@fuse/core/FuseSuspense';
import AppContext from 'app/AppContext';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import SettingsPanel from '../shared-components/SettingsPanel';
import ToolbarLayout1 from './components/ToolbarLayout1';

const Root = styled('div')(({ theme, config }) => ({
  ...(config.mode === 'boxed' && {
    clipPath: 'inset(0)',
    maxWidth: `${config.containerWidth}px`,
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  ...(config.mode === 'container' && {
    '& .container': {
      maxWidth: `${config.containerWidth}px`,
      width: '100%',
      margin: '0 auto',
    },
  }),
}));

function Layout1(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const appContext = useContext(AppContext);
  const { routes } = appContext;

  return (
    <Root id="fuse-layout" config={config} className="w-full flex">
      <div className="flex flex-auto min-w-0">
        <main id="fuse-main" className="flex flex-col flex-auto min-h-full min-w-0 relative z-10">
          {/*<div className="sticky top-0 z-99">*/}
          {/*  <SettingsPanel />*/}
          {/*</div>*/}
          {/*<ToolbarLayout1 className={config.toolbar.style === 'fixed' && 'sticky top-0'} />*/}
          <div className="flex flex-col flex-auto min-h-0 relative z-10" style={{ backgroundColor: "#0E1421" }}>
            <FuseDialog />

            <FuseSuspense>{useRoutes(routes)}</FuseSuspense>

            {props.children}
          </div>
        </main>
      </div>
      <FuseMessage />
    </Root>
  );
}

export default memo(Layout1);
