import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import anime from "animejs";
import _ from "lodash";
import { IoIosArrowDown } from "react-icons/io";
import { MdSort } from "react-icons/md";

import useOutsideClick from "../../_utils/useOutsideClick.util";
import {
  Container,
  Drawer,
  Option,
  OPTION_HEIGHT,
  DD_HEIGHT
} from "./Dropdown.style";

const Dropdown = ({ name, active, options, selectCallback }) => {
  const DRAWER_HEIGHT = options.length * OPTION_HEIGHT + DD_HEIGHT / 2;
  const fieldRef = useRef(null);
  const styleContainerRef = useRef(null);
  const drawerRef = useRef(null);
  const caretRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const animateDrawer = async () => {
    const isClosing = isExpanded;
    setDisabled(true);
    const animField = anime({
      targets: styleContainerRef.current,
      borderBottomLeftRadius: isClosing ? 50 : 0,
      borderBottomRightRadius: isClosing ? 50 : 0,
      duration: 100,
      easing: isClosing ? "easeInSine" : "easeOutSine"
    }).finished;
    const animDrawer = anime({
      targets: drawerRef.current,
      opacity: isClosing ? [1, 0] : [0, 1],
      height: isClosing ? 0 : DRAWER_HEIGHT,
      duration: 120,
      easing: "easeInSine"
    }).finished;
    const animCaret = anime({
      targets: caretRef.current,
      rotate: isClosing ? [180, 0] : [0, 180],
      easing: "linear",
      duration: 150
    }).finished;
    Promise.all([animField, animDrawer, animCaret]);
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
  const onOptionClick = option => {
    selectCallback({
      [name]: option.name
    });
    closeDrawer();
  };

  // Handle outside click
  useOutsideClick(fieldRef, () => {
    if (isExpanded) {
      closeDrawer();
    }
  });

  return (
    <Container onClick={disabled ? null : onDropdownClick} ref={fieldRef}>
      <div className="style-container" ref={styleContainerRef}></div>
      <div className="active-option">
        <div className="icon filter">
          <MdSort />
        </div>
        <div className="value">{_.find(options, { name: active }).value}</div>
        <div className="icon caret" ref={caretRef}>
          <IoIosArrowDown />
        </div>
      </div>
      <Drawer ref={drawerRef}>
        {options &&
          options.map((option, i) => (
            <Option
              key={i}
              isActive={option.name === active}
              className="option"
              onClick={disabled ? null : () => onOptionClick(option)}
            >
              {option.value}
            </Option>
          ))}
      </Drawer>
    </Container>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string, // key of query parameter to change on toggle
  active: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, value: PropTypes.string })
  ),
  selectCallback: PropTypes.func
};

export default Dropdown;
