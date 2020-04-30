import React, { useState, useRef } from 'react';
import anime from 'animejs';
import { useLocation, useHistory } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import navbarOptions from './Navbar.options';
import useOutsideClick from '../../_utils/useOutsideClick.util';
import {
  Container,
  Drawer,
  Option,
  FIELD_HEIGHT,
  OPTION_HEIGHT
} from './Navbar.style';

const Navbar = () => {
  const DRAWER_HEIGHT = navbarOptions.length * OPTION_HEIGHT + FIELD_HEIGHT / 2;
  const fieldRef = useRef(null);
  const drawerRef = useRef(null);
  const caretRef = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const animateDrawer = async () => {
    const isClosing = isExpanded;
    setDisabled(true);
    const animDrawer = anime({
      targets: drawerRef.current,
      paddingTop: FIELD_HEIGHT,
      opacity: isClosing ? [1, 0] : [0, 1],
      height: isClosing ? 0 : DRAWER_HEIGHT,
      duration: 120,
      easing: 'easeInSine'
    }).finished;
    const animCaret = anime({
      targets: caretRef.current,
      rotate: isClosing ? [180, 0] : [0, 180],
      duration: 150,
      easing: 'linear'
    }).finished;
    Promise.all([animDrawer, animCaret]);
    setDisabled(false);
  };

  const openDrawer = async () => {
    await animateDrawer();
    setExpanded(true);
  };
  const closeDrawer = async () => {
    await animateDrawer();
    setExpanded(false);
  };

  const onDropdownClick = () => {
    if (isExpanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };
  const onOptionClick = ({ pathname }) => {
    history.push({ pathname });
  };

  // Handle outside click
  useOutsideClick(fieldRef, () => {
    if (isExpanded) {
      closeDrawer();
    }
  });

  return (
    <Container>
      <div className="logo-box">Logo</div>
      <div className="spacer"></div>
      <div
        className="profile"
        ref={fieldRef}
        onClick={disabled ? null : onDropdownClick}
      >
        <div className="avatar"></div>
        <div className="name">Alex</div>
        <div className="icon caret" ref={caretRef}>
          <IoIosArrowDown />
        </div>
        <Drawer ref={drawerRef}>
          {navbarOptions &&
            navbarOptions.map((option, i) => (
              <Option
                key={i}
                isActive={option.pathname === location.pathname}
                className="option"
                onClick={
                  disabled || option.pathname === location.pathname
                    ? null
                    : () => onOptionClick(option)
                }
              >
                {option.value}
              </Option>
            ))}
        </Drawer>
      </div>
    </Container>
  );
};

export default Navbar;
