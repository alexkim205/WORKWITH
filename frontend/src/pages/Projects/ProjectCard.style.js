/* eslint-disable no-param-reassign */
import styled from 'styled-components';
import anime from 'animejs';
import { displayOptions } from './Projects.options';
import {
  secondaryColor,
  textOnDarkColor,
  backgroundColor,
  textColor
} from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

export const CARD_SPACING = 1.2; // em

export const Card = styled.li`
  box-sizing: border-box;
  position: relative;
  color: ${textOnDarkColor};
  border-radius: 5px;
  margin-right: ${CARD_SPACING}em;
  margin-bottom: ${CARD_SPACING}em;
  background-color: ${secondaryColor};
  // background-color: ${backgroundColor};
  // color: ${textColor};
  overflow: hidden;
  // box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  will-change: transform;
  cursor: pointer;
  // transition: 0.2s margin-bottom;

  ${({ display }) => {
    if (display === displayOptions.grid) {
      return `
      // 4 columns
      width: calc((100% / 4) - (${CARD_SPACING * 3}em / 4));
      padding-bottom: calc((100% / 4) - (${CARD_SPACING * 3}em / 4));
      &:nth-child(3n) {
        margin-right: ${CARD_SPACING}em;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }

      // 3 columns
      ${breakpoint.down('s')`
        width: calc((100% / 3) - (${CARD_SPACING * 2}em / 3));
        padding-bottom: calc((100% / 3) - (${CARD_SPACING * 2}em / 3));
        margin-right: ${CARD_SPACING}em;
        &:nth-child(2n) {
          margin-right: ${CARD_SPACING}em;       
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      `.join('')}

      // 2 columns
      // ${breakpoint.down('s')`
      //   width: calc((100% / 2) - (${CARD_SPACING * 1}em / 2));
      //   padding-bottom: calc((100% / 2) - (${CARD_SPACING * 1}em / 2));
      //   margin-right: ${CARD_SPACING}em;
      //   &:nth-child(4n), &:nth-child(3n) {
      //     margin-right: ${CARD_SPACING}em;    
      //   }
      //   &:nth-child(2n) {
      //     margin-right: 0;
      //   }
      // `.join('')}

      // // 1 column and row
      // ${breakpoint.down('xs')`
      //   width: 100%;
      //   padding-bottom: 0;
      //   margin-right: 0 !important;
      // `.join('')}
      // `;
    }
    return `
      width: 100%;
      margin-right: 0 !important;
      margin-bottom: ${CARD_SPACING / 1.5}em;

      ${breakpoint.down('s')`
        margin-bottom: ${CARD_SPACING / 2}em;
      `.join('')}
    `;
  }}

  .card-content {
    font-family: 'Ubuntu', sans-serif;
    font-weight: 300;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transition: 0.2s padding;
    will-change: transform;

    ${({ display }) => {
      if (display === displayOptions.grid) {
        return `
        position: absolute;
        padding: 1em;
        `;
      }
      return `
        position: relative;
        padding: 1em;

        ${breakpoint.down('s')`
          padding: 0.9em;
        `.join('')}
      `;
    }}

    .card-title {
      font-size: 0.9em;
      letter-spacing: 0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.2s all;
      will-change: transform;
      margin-bottom: 0.3em;

      ${breakpoint.down('s')`
        font-size: 0.8em;
      `}
    }

    .card-subtitle {
      font-size: 0.8em;
      letter-spacing: 0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.2s all;
      will-change: transform;

      ${breakpoint.down('s')`
        font-size: 0.7em;
      `}
    }
  }

  .ur-icon {
    position: relative;
    top: 1em;
    right: 1em;
  }
`;

export const _onExit = (el, i, removeElement) => {
  anime({
    targets: el,
    opacity: 0,
    scale: 0.9,
    easing: 'easeOutSine',
    duration: 300,
    delay: i * 20,
    complete: removeElement
  });
};

export const _onAppear = el => {
  el.style.opacity = 1;
  // anime({
  //   targets: el,
  //   opacity: [0, 1],
  //   scale: [0.9, 1],
  //   easing: 'easeInSine',
  //   duration: 300,
  //   delay: i * 20
  // });
};

export const _onStart = (el, { previous, current }) => {
  // Hide fade elements - project to projects animation

  if (previous.location.pathname !== current.location.pathname) {
    // Card should fade only if transitioning between pages.
    [...el.querySelectorAll('[data-fade-in]')].forEach(fadeEl => {
      // eslint-disable-next-line no-param-reassign
      fadeEl.style.opacity = '0';
    });
  }
};

export const _onComplete = (el, { previous, current }) => {
  // Fade in on animation complete - project to projects animation

  if (previous.location.pathname !== current.location.pathname) {
    // Card should fade only if transitioning between pages.
    anime({
      targets: [...el.querySelectorAll('[data-fade-in]')],
      opacity: [0, 1],
      translateY: [15, 0],
      delay: (_fadeEl, i) => i * 250,
      easing: 'easeInSine',
      duration: 250
    });
  }
};

// export const _shouldFlip = (prev, curr) => {
//   const sort1 = curr.location.search.match(/sort=([^&]+)/);
//   curr.location.search.match(/sort=([^&]+)/)[1];
//   const sort2 = prev.location.search.match(/sort=([^&]+)/);
//   prev.location.search.match(/sort=([^&]+)/)[1];
//   return sort1 === sort2;
// };
