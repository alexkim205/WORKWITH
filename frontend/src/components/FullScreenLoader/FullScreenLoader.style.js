import React from "react";
import styled, { keyframes } from "styled-components";

import {
  loaderBackgroundColor,
  failureColor,
  successColor,
  pendingColor
} from "../../_constants/theme.constants";

export const InverseContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 0 0;
  overflow: hidden;

  background-color: ${loaderBackgroundColor};

  /* Animations */
  animation-name: ${({ backgroundColorCallback, ...props }) => keyframes`
  from {
    z-index: 2;
    background-color: ${backgroundColorCallback(props)};    
  }
  to {
    z-index: 1;
    background-color: ${loaderBackgroundColor(props)};    
  }`};
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  will-change: transform;
`;

export const Content = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;

  > span {
    margin-left: 1em;
    font-size: 6em;
    color: white;
    letter-spacing: 2px;
    font-weight: 700;
    font-family: "Poppins", sans-serif;
    text-transform: uppercase;
  }
`;

const StyledBlob = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  ${({ pending, success, failure, ...props }) => {
    if (pending) {
      return `fill: ${pendingColor(props)}`;
    }
    if (success) {
      return `fill: ${successColor(props)}`;
    }
    if (failure) {
      return `fill: ${failureColor(props)}`;
    }
    return `fill: white`;
  }}
  animation: ${({ pending }) =>
    !pending
      ? `none`
      : keyframes`
0%, 100%   { transform: scale(1)   translate(10px, -30px); }
38%, 40%  { transform: scale(0.8, 1) translate(90vw, 50vh) rotate(180deg); }
78%, 80%  { transform: scale(1.3) translate(0vw, 60vh) rotate(-40deg); }
`} 10s ease-in-out infinite;
  width: ${({ large }) => (large ? "150vmax" : "50vmax")};
  transform-origin: 50% 50%;
`;

export const Blob = props => (
  <StyledBlob {...props}>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
      <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
    </svg>
  </StyledBlob>
);
