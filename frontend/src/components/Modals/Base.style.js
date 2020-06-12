/* eslint-disable no-param-reassign */
import styled from 'styled-components';
import anime from 'animejs';

import { breakpoint } from '../../_constants/theme.mixins.constants';
import { backgroundColor } from '../../_constants/theme.constants';

const ModalOverlay = styled.div`
  display: ${({ shouldRender }) => (shouldRender ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
`;

const ModalContainer = styled.div`
  display: ${({ shouldRender }) => (shouldRender ? 'flex' : 'none')};
  flex-direction: column;
  background-color: ${backgroundColor};
  padding: 1em;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  will-change: transform;

  width: 500px;

  ${breakpoint.down('m')`
    width: 100%;
    margin: 1em;
  `}

  .header {
  }
  .form-box {
    ${breakpoint.down('m')`
      width: 100%;
    `}

    .buttons-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      // margin-top: 0.75em;
    }
  }
`;

const _onOpen = async (overlayEl, modalEl) => {
  overlayEl.style.opacity = 0;
  modalEl.style.opacity = 0;
  // First, load overlay quickly.
  await anime({
    targets: overlayEl,
    easing: 'linear',
    opacity: [0, 1],
    duration: 50
  }).finished;
  // Then, load modal.
  await anime({
    targets: modalEl,
    easing: 'linear',
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 100
  }).finished;
};

const _onClose = async (overlayEl, modalEl) => {
  return Promise.all([
    anime({
      targets: overlayEl,
      easing: 'linear',
      opacity: [1, 0],
      duration: 100
    }).finished,
    anime({
      targets: modalEl,
      easing: 'linear',
      duration: 100,
      opacity: [1, 0],
      scale: [1, 0.8]
    }).finished
  ]);
};

export { ModalOverlay, ModalContainer, _onOpen, _onClose };
