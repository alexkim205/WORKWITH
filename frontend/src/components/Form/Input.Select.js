import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  buttonColor,
  borderColor,
  backgroundColor,
  inputBackgroundColor
} from '../../_constants/theme.constants';

const SelectContainer = styled.select`
  font-family: 'Ubuntu', sans-serif;
  font-weight: 300;
  box-sizing: border-box;
  display: inline-block;
  background-color: ${inputBackgroundColor};
  border: 1px solid ${borderColor};
  border-radius: 3px;
  padding: 1em 1.1em;
  font-size: 0.9em;
  color: black;
  transition: all 0.2s ease;
  width: 100%;

  option {
    background-color: red;
    padding: 1em;
  }

  &:hover {
    background-color: ${backgroundColor};
  }

  &:focus {
    outline: none;
    background-color: ${backgroundColor};
    border: 1px solid ${buttonColor};
  }
`;

const Select = ({ options }) => {
  return (
    <SelectContainer>
      {options &&
        options.map(({ _id, email, name }, i) => (
          <option key={i} value={_id}>
            {name ? `${name} (${email})` : email}
          </option>
        ))}
    </SelectContainer>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string.isRequired
    })
  )
};

export default Select;
