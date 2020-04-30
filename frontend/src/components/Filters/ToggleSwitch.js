import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import {
  Container,
  SelectorCircle,
  LEFT_LEFT_OFFSET,
  RIGHT_LEFT_OFFSET
} from './ToggleSwitch.style';

const ToggleSwitch = ({ name, icons, active, toggleCallback }) => {
  const selectorCircleRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const isLeftActive = () => active === icons.left.name;

  const animateSelector = async () => {
    const leftFromToOffset = isLeftActive(active)
      ? [LEFT_LEFT_OFFSET, RIGHT_LEFT_OFFSET]
      : [RIGHT_LEFT_OFFSET, LEFT_LEFT_OFFSET];
    setDisabled(true);
    await anime({
      targets: selectorCircleRef.current,
      left: leftFromToOffset,
      duration: 200,
      easing: 'easeInOutSine'
    }).finished;
    setDisabled(false);
  };

  const onClick = () => {
    const toggleTo = isLeftActive() ? icons.right.name : icons.left.name;
    toggleCallback({
      [name]: toggleTo
    });
    animateSelector();
  };

  return (
    <Container onClick={disabled ? null : onClick}>
      <div className="left">{icons.left.icon}</div>
      <div className="right">{icons.right.icon}</div>
      <SelectorCircle
        ref={selectorCircleRef}
        isLeftActive={isLeftActive()}
      ></SelectorCircle>
    </Container>
  );
};

ToggleSwitch.propTypes = {
  name: PropTypes.string, // key of query parameter to change on toggle
  icons: PropTypes.shape({
    left: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.node
    }),
    right: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.node
    })
  }),
  active: PropTypes.string,
  toggleCallback: PropTypes.func
};

export default ToggleSwitch;
