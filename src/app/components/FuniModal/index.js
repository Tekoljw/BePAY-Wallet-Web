import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './index.css';

const AnimateModal = (props) => {
  const { open, onClose, children, className } = props;
  const nodeRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.getElementsByTagName("body")[0].classList.add("bodyLock");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("bodyLock");
    }
  }, [open]);


  return createPortal(
    <CSSTransition nodeRef={nodeRef} in={open} timeout={200} classNames="animate" unmountOnExit>
      <div ref={nodeRef}>
        <div className="modalOverlay"></div>
        <div className={className + " animateWrapper"}>
          <img src="wallet/assets/images/logo/icon-close.png" className='animate-close-btn' onClick={onClose} alt="close icon" />
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.body,
  );
};
export default AnimateModal;