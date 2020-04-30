/* eslint-disable no-param-reassign */

import styled from 'styled-components';
import anime from 'animejs';

export const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .form-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em 2em;
    width: 300px;
    z-index: 0;

    .form {
      .fields-box {
      }
      .button-box {
        margin-top: 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;

const FIELD_HEIGHT = 71;

export const _onFieldExit = async (
  el,
  i,
  removeElement,
  bgEls = [],
  shouldAnimate = true
) => {
  // Wrapper shouldn't exit
  if (!shouldAnimate) {
    return;
  }
  // Wrapper should exit
  bgEls.forEach(bgEl => {
    bgEl.style.height = `${FIELD_HEIGHT}px`;
  });
  await anime({
    targets: el,
    delay: 100 * i,
    translateX: [0, 250],
    opacity: [1, 0],
    duration: 200,
    easing: 'easeOutSine'
  }).finished;
  await removeElement();
  await anime({
    targets: bgEls,
    height: [FIELD_HEIGHT, 0], // don't exit if register state
    delay: 100 * i,
    duration: 200,
    easing: 'easeOutSine'
  }).finished;
};

export const _onFieldAppear = async (
  el,
  i,
  bgEls = [],
  shouldAnimate = true
) => {
  // Wrapper shouldn't appear
  if (!shouldAnimate) {
    return;
  }
  // Wrapper should appear
  bgEls.forEach(bgEl => {
    bgEl.style.height = '0px';
  });
  await anime({
    targets: bgEls,
    height: [0, FIELD_HEIGHT],
    duration: 200,
    delay: 100 * i,
    easing: 'easeInSine'
  }).finished;
  await anime({
    targets: el,
    opacity: [0, 1],
    delay: 100 * i,
    translateX: [250, 0],
    duration: 250,
    easing: 'easeInSine'
  }).finished;
};
