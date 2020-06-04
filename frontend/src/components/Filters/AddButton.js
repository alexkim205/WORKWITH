import React from 'react';
import PropTypes from 'prop-types';
import { IoMdAdd } from 'react-icons/io';

import Container from './AddButton.style';

const AddButton = ({ onClick }) => {
  // const _onMouseOver = e => {
  //   anime({
  //     targets: e.currentTarget,
  //     easing: 'easeInSine',
  //     duration: 100,
  //     scale: 1.05
  //   });
  // };
  // const _onMouseOut = e => {
  //   anime({
  //     targets: e.currentTarget,
  //     easing: 'easeInSine',
  //     duration: 100,
  //     scale: 1
  //   });
  // };

  return (
    <Container
      onClick={onClick}
      // onMouseOver={_onMouseOver}
      // onMouseOut={_onMouseOut}
    >
      <IoMdAdd />
    </Container>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func
};

export default AddButton;
