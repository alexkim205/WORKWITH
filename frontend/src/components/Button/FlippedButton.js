import React, { Fragment, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { Flipped } from "react-flip-toolkit";
import { buttonColor, buttonTextColor } from "../../_constants/theme.constants";

export const Button = styled.button`
  background-color: transparent;
  color: ${buttonTextColor};
  width: 100%;
  height: 100%;
  padding: 0.75em 1.25em;
  border: none;
  margin: auto;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};

  letter-spacing: 1px;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  font-size: 1em;
  font-weight: 600;

  animation-name: ${keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }`};
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  will-change: transform;
`;

const FlippedButtonContainer = styled.div`
  background: ${buttonColor};
  border-radius: 3px;
  border: none;
  // position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Animations */
  animation-name: ${({ flipToBackgroundColorCallback, ...props }) => keyframes`
  from {
    background-color: ${flipToBackgroundColorCallback(props)};
  }
  to {
    background-color: ${buttonColor(props)};
  }`};
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  will-change: transform;
`;

const FlippedButton = ({
  flipId,
  flipToBackgroundColorCallback,
  onClick,
  children,
  ...flipProps
}) => {
  const [buttonPending, setButtonPending] = useState(true);
  const buttonContainerRef = useRef(null);
  const enableClickability = () => setButtonPending(false);

  useEffect(() => {
    const element = buttonContainerRef.current;
    element.addEventListener("animationend", enableClickability);
    return () => {
      element.removeEventListener("animationend", enableClickability);
    };
  }, []);

  return (
    <Fragment>
      <Flipped
        flipId={flipId}
        stagger="field"
        transformOrigin="50% 50%"
        {...flipProps}
      >
        <FlippedButtonContainer
          flipToBackgroundColorCallback={flipToBackgroundColorCallback}
          ref={buttonContainerRef}
        >
          <Flipped inverseFlipId={flipId} transformOrigin="50% 50%">
            <div>
              <Button onClick={onClick} disabled={buttonPending}>
                {children}
              </Button>
            </div>
          </Flipped>
        </FlippedButtonContainer>
      </Flipped>
    </Fragment>
  );
};

FlippedButton.propTypes = {
  flipId: PropTypes.string,
  flipToBackgroundColorCallback: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default FlippedButton;
