import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import FusePageSimpleSidebarContent from './FusePageSimpleSidebarContent';
import MobileDetect from 'mobile-detect';

const FusePageSimpleSidebar = forwardRef((props, ref) => {
  const isMobileMedia = new MobileDetect(window.navigator.userAgent).mobile();

  const { open, position, variant, rootRef } = props;

  const [isOpen, setIsOpen] = useState(open);

  useImperativeHandle(ref, () => ({
    toggleSidebar: handleToggleDrawer,
  }));

  const handleToggleDrawer = useCallback((val) => {
    setIsOpen(val);
  }, []);

  useEffect(() => {
    handleToggleDrawer(open);
  }, [handleToggleDrawer, open]);

  return (
    <>
      <Hidden smUp={variant === 'permanent' && (isMobileMedia ? false : true)} lgUp={variant === 'permanent' && (!isMobileMedia ? false : true)}>
        <SwipeableDrawer
          variant="temporary"
          anchor={position}
          open={isOpen}
          onOpen={(ev) => {}}
          onClose={() => props?.onClose()}
          disableSwipeToOpen
          classes={{
            root: clsx('FusePageSimple-sidebarWrapper', variant),
            paper: clsx(
              'FusePageSimple-sidebar',
              variant,
              position === 'left' ? 'FusePageSimple-leftSidebar' : 'FusePageSimple-rightSidebar'
            ),
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          // container={rootRef.current}
          BackdropProps={{
            classes: {
              root: 'FusePageSimple-backdrop',
            },
          }}
          style={{ position: 'absolute' }}
        >
          <FusePageSimpleSidebarContent {...props} />
        </SwipeableDrawer>
      </Hidden>

      {variant === 'permanent' && (
        <Hidden smDown={isMobileMedia ? false : true} lgDown={!isMobileMedia ? false : true}>
          <Drawer
            variant="permanent"
            anchor={position}
            className={clsx(
              'FusePageSimple-sidebarWrapper',
              variant,
              isOpen ? 'opened' : 'closed',
              position === 'left' ? 'FusePageSimple-leftSidebar' : 'FusePageSimple-rightSidebar'
            )}
            open={isOpen}
            onClose={props?.onClose}
            classes={{
              paper: clsx('FusePageSimple-sidebar border-0', variant),
            }}
          >
            <FusePageSimpleSidebarContent {...props} />
          </Drawer>
        </Hidden>
      )}
    </>
  );
});

FusePageSimpleSidebar.defaultProps = {
  open: true,
};

export default FusePageSimpleSidebar;
