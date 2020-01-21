import theme from "styled-theming";
import { darken } from "polished";

const ACCENT = "#1affc4";
const DARK = "#111";
const LIGHT = "#fff";

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

export const backgroundColor = theme("mode", {
  light: `linear-gradient(45deg, #dbfff6, #ceceff)`,
  dark: `linear-gradient(45deg, #003f2e, #00007e)`
});

export const buttonColor = theme("mode", {
  light: "#00007e",
  dark: "#ceceff"
});

export const buttonTextColor = theme("mode", {
  light: "#fff",
  dark: "#000"
});

export const linkButtonTextColor = theme("mode", {
  light: darken(0.3, ACCENT),
  dark: ACCENT
});

export const loaderBackgroundColor = theme("mode", {
  light: "#FFB1A4",
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
  light: "#023f92",
  dark: "#023f92"
});
