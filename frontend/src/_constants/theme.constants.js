import theme from 'styled-theming';
import { darken, lighten } from 'polished';

export const GREEN = '#1affc4';
export const BLACK = '#111';
export const PURPLE = '#4922D8';
export const WHITE = '#fff';
export const ORANGE = '#F87060';
export const LIGHT_GRAY = '#ededed';

export const mainColor = theme('mode', {
  light: GREEN,
  dark: GREEN
});

export const secondaryColor = theme('mode', {
  light: PURPLE,
  dark: PURPLE
});

export const tertiaryColor = theme('mode', {
  light: ORANGE,
  dark: ORANGE
});

export const textColor = theme('mode', {
  light: BLACK,
  dark: WHITE
});

export const textOnDarkColor = theme('mode', {
  light: WHITE,
  dark: BLACK
});

export const backgroundColor = theme('mode', {
  light: WHITE,
  dark: BLACK
});

export const buttonColor = theme('mode', {
  light: '#00007e',
  dark: '#ceceff'
});

export const buttonTextColor = theme('mode', {
  light: WHITE,
  dark: BLACK
});

export const linkButtonTextColor = theme('mode', {
  light: darken(0.3, GREEN),
  dark: GREEN
});

export const highlightLightBackgroundColor = theme('mode', {
  light: LIGHT_GRAY,
  dark: LIGHT_GRAY
});

export const inputBackgroundColor = theme('mode', {
  light: LIGHT_GRAY,
  dark: LIGHT_GRAY
});

export const loaderBackgroundColor = theme('mode', {
  // light: "#FFB1A4",
  light: '#00007e',
  dark: darken(0.6, '#ceceff')
});

export const failureColor = theme('mode', {
  light: '#ff3232',
  dark: '#ff3232'
});

export const successColor = theme('mode', {
  light: '#329932',
  dark: '#329932'
});

export const pendingColor = theme('mode', {
  light: '#FFB1A4',
  dark: '#FFB1A4'
});

export const borderColor = theme('mode', {
  light: '#e0e0e0',
  dark: lighten(0.5, BLACK)
});

export const breakpoints = {
  xxs: 0,
  xs: 380,
  s: 576,
  m: 700,
  l: 992,
  xl: 1200
};

// https://react-spring-visualizer.com/#scale
export const springConfig = {
  noWobble: 'spring(1, 170, 26, 0)',
  gentleWobble: 'spring(2, 200, 20, 0)'
};
