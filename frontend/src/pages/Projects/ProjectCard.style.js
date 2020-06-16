/* eslint-disable no-param-reassign */
import styled, { css } from 'styled-components';
import anime from 'animejs';
import { displayOptions } from './Projects.options';
import {
  secondaryColor,
  textOnDarkColor
} from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

export const CARD_SPACING = 1.2; // em

const projectPathnameRegex = /^\/project\/[\w\d]+/;

export const Card = styled.li`
  box-sizing: border-box;
  position: relative;
  color: ${textOnDarkColor};
  border-radius: 5px;
  margin-right: ${CARD_SPACING}em;
  margin-bottom: ${CARD_SPACING}em;
  background-color: ${secondaryColor};
  overflow: hidden;
  will-change: transform;
  cursor: pointer;

  ${({ display, pending }) => {
    if (display === displayOptions.grid) {
      if (pending) {
        return css`
          width: 0;
          margin: 0;
          padding: 0;
        `;
      }

      return css`
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
    // Else display is list
    if (pending) {
      return css`
        height: 0;
        margin: 0;
        padding: 0;
      `;
    }
    return css`
      width: 100%;
      height: ${pending ? 0 : 'auto'};
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
        return css`
          position: absolute;
          padding: 1em;
        `;
      }
      return css`
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
  // console.log('exiting');

  anime({
    targets: el,
    opacity: 0,
    scale: 0.9,
    easing: 'easeOutSine',
    duration: 200,
    delay: i * 10,
    complete: removeElement
  });
};

export const _onAppear = (el, i) => {
  // Don't appear if going to project page.
  // console.log('appearing');
  // el.style.opacity = 1;
  anime({
    targets: el,
    opacity: [0, 1],
    scale: [0.5, 1],
    easing: 'easeInSine',
    duration: 200,
    delay: i * 10
  });
};

export const _onStart = (el, { previous, current }) => {
  // Hide fade elements - project to projects animation

  if (previous.location.pathname !== current.location.pathname) {
    // console.log('starting');
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
    // console.log('complete');
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

export const _shouldFlip = (previous, current) => {
  if (previous.location.pathname === current.location.pathname) {
    // If initial filtering (/projects --> /projects?filter=...) don't flip.
    if (previous.location.search === '') {
      return false;
    }
    // Else, pathnames must be /projects but search filters are different
    return true;
  }

  // If return to projects from project, we should flip card.
  if (projectPathnameRegex.test(previous.location.pathname)) {
    return true;
  }
  return false;
};
