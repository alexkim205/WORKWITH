import styled from 'styled-components';
import anime from 'animejs';
import { PURPLE } from '../../_constants/theme.constants';

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  min-height: 100vh;
  z-index: 3;
  will-change: transform;

  .header {
    background-color: pink;
  }

  .body {
    .notes-container {
      .notes-header {
      }
      .notes-body {
      }
    }
    .social-container {
    }
  }
`;

export const onComplete = async el => {
  await anime({
    targets: el,
    backgroundColor: [PURPLE, '#ffffff'],
    easing: 'easeInSine',
    duration: 200
  }).finished;
};

export const onStart = async el => {
  // eslint-disable-next-line no-param-reassign
  el.style.backgroundColor = PURPLE;
};

export const onExit = async el => {
  await anime({
    targets: el
  }).finished;
};
