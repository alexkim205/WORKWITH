import theme from "styled-theming";
import { darken, lighten } from "polished";

const GREEN = "#1affc4";
const BLACK = "#111";
const PURPLE = "#4922D8";
const WHITE = "#fff";

export const mainColor = theme("mode", {
  light: GREEN,
  dark: GREEN
});

export const secondaryColor = theme("mode", {
  light: PURPLE,
  dark: PURPLE
});

export const textColor = theme("mode", {
  light: BLACK,
  dark: WHITE
});

export const backgroundColor = theme("mode", {
  light: `linear-gradient(45deg, #dbfff6, #ceceff)`,
  dark: `linear-gradient(45deg, #003f2e, #00007e)`
});

export const buttonColor = theme("mode", {
  light: "#00007e",
  dark: "#ceceff"
});

export const buttonTextColor = theme("mode", {
  light: WHITE,
  dark: BLACK
});

export const linkButtonTextColor = theme("mode", {
  light: darken(0.3, GREEN),
  dark: GREEN
});

export const loaderBackgroundColor = theme("mode", {
  // light: "#FFB1A4",
  light: "#00007e",
  dark: darken(0.6, "#ceceff")
});

export const failureColor = theme("mode", {
  light: "#ff3232",
  dark: "#ff3232"
});

export const successColor = theme("mode", {
  light: "#329932",
  dark: "#329932"
});

export const pendingColor = theme("mode", {
  light: "#FFB1A4",
  dark: "#FFB1A4"
});

export const borderColor = theme("mode", {
  light: "#C4C4C4",
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
