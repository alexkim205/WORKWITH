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

    form {
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

export const _onButtonExit = async formEl => {
  await anime({
    targets: [...formEl.querySelectorAll('[data-button-fade]')],
    translateY: [0, -10],
    opacity: [1, 0],
    easing: 'easeOutSine',
    delay: (_fadeEl, i) => i * 180,
    duration: 150
  }).finished;
};

export const _onButtonEnter = async formEl => {
  await anime({
    targets: [...formEl.querySelectorAll('[data-button-fade]')],
    translateY: [-10, 0],
    opacity: [0, 1],
    easing: 'easeInSine',
    delay: (_fadeEl, i) => i * 180,
    duration: 150
  }).finished;
};

export const _onFieldExit = async formEl => {
  await anime({
    targets: [...formEl.querySelectorAll('[data-field-fade]')],
    opacity: [1, 0],
    height: [FIELD_HEIGHT, 0],
    easing: 'easeOutSine',
    delay: (_fadeEl, i) => i * 180,
    duration: 150
  }).finished;
};

export const _onFieldEnter = async formEl => {
  await anime({
    targets: [...formEl.querySelectorAll('[data-field-fade]')],
    opacity: [0, 1],
    height: [0, FIELD_HEIGHT],
    easing: 'easeInSine',
    delay: (_fadeEl, i) => i * 180,
    duration: 150
  }).finished;
};
