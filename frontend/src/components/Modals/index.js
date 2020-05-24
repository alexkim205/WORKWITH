import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalContainer, ModalOverlay, _onOpen, _onClose } from './Base.style';

const Modal = ({ isOpen: shouldOpen, hide, children }) => {
  const [shouldRender, setRender] = useState(false);
  const modalRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    const animateModal = async () => {
      // Close to open
      if (shouldOpen && !shouldRender) {
        // Display modal first
        setRender(shouldOpen);
        // Then animate
        await _onOpen(overlayRef.current, modalRef.current);
      }
      // Open to close
      else if (!shouldOpen && shouldRender) {
        // Animate first
        await _onClose(overlayRef.current, modalRef.current);
        // Then hide modal.
        setRender(shouldOpen);
      }
    };
    animateModal();
  }, [shouldOpen]);

  const _handleOutsideClick = e => {
    e.preventDefault();
    hide();
  };
  const _handleModalClick = e => {
    e.stopPropagation();
  };

  return createPortal(
    <ModalOverlay
      ref={overlayRef}
      shouldRender={shouldRender}
      onClick={_handleOutsideClick}
    >
      <ModalContainer
        ref={modalRef}
        shouldRender={shouldRender}
        onClick={_handleModalClick}
        aria-modal
        aria-hidden
      >
        <button onClick={hide}>Close</button>
        {children}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
