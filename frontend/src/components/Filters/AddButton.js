import React from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { IoMdAdd } from 'react-icons/io';

import Container from './AddButton.style';

const AddButton = ({ onClick }) => {
  const _onMouseOver = e => {
    anime({
      targets: e.currentTarget,
      scale: {
        value: 1.05,
        duration: 500
      }
    });
  };
  const _onMouseOut = e => {
    anime({
      targets: e.currentTarget,
      scale: {
        value: 1,
        duration: 500
      }
    });
  };

  return (
    <Container
      onClick={onClick}
      onMouseOver={_onMouseOver}
      onMouseOut={_onMouseOut}
    >
      <IoMdAdd />
    </Container>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func
};

export default AddButton;
