import theme from "styled-theming";

const ACCENT = "#222";
const DARK = "#111";
const LIGHT = "#fff";
const DARK_ELEMENT = "#333";
const LIGHT_ELEMENT = "#fafafa";
const DARK_OUTLINE = "#606060";
const LIGHT_OUTLINE = "#DCDCDC";

export const mainColor = theme("mode", {
  light: LIGHT,
  dark: DARK
});

export const secondaryColor = theme("mode", {
  light: ACCENT,
  dark: ACCENT
});

export const textColor = theme("mode", {
  light: DARK,
  dark: LIGHT
});

export const unfocusedTextColor = theme("mode", {
  light: DARK_ELEMENT,
  dark: LIGHT_ELEMENT
});

export const backgroundColor = theme("mode", {
  light: LIGHT,
  dark: DARK
});

export const elementBackgroundColor = theme("mode", {
  light: LIGHT_ELEMENT,
  dark: DARK_ELEMENT
});

export const invertedElementBackgroundColor = theme("mode", {
  light: DARK_ELEMENT,
  dark: LIGHT_ELEMENT
});

export const buttonTextColor = theme("mode", {
  light: LIGHT,
  dark: DARK
});

export const borderColor = theme("mode", {
  light: LIGHT_OUTLINE,
  dark: DARK_OUTLINE
});
