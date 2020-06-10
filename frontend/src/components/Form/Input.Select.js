import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import {
//   buttonColor,
//   borderColor,
//   backgroundColor,
//   inputBackgroundColor
// } from '../../_constants/theme.constants';

// const SelectContainer = styled.select`
//   font-family: 'Ubuntu', sans-serif;
//   font-weight: 300;
//   box-sizing: border-box;
//   display: inline-block;
//   background-color: ${inputBackgroundColor};
//   border: 1px solid ${borderColor};
//   border-radius: 3px;
//   padding: 1em 1.1em;
//   font-size: 0.9em;
//   color: black;
//   transition: all 0.2s ease;
//   width: 100%;

//   // option {
//   //   background-color: red;
//   //   padding: 1em;
//   // }

//   &:hover {
//     background-color: ${backgroundColor};
//   }

//   &:focus {
//     outline: none;
//     background-color: ${backgroundColor};
//     border: 1px solid ${buttonColor};
//   }
// `;

const animatedComponents = makeAnimated();

const Select = ({ name, options, control, ...inputProps }) => {
  const selectRef = useRef();
  return (
    <Controller
      as={<CreatableSelect ref={selectRef} />}
      name={name}
      onFocus={() => selectRef.current.focus()}
      options={options}
      control={control}
      components={animatedComponents}
      closeMenuOnSelect={false}
      isMulti
      {...inputProps}
    />
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  control: PropTypes.func.isRequired
};

Select.displayName = 'Input.Select';

export default Select;
