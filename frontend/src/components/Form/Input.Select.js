/* eslint-disable no-console */
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  buttonColor,
  borderColor,
  backgroundColor,
  buttonHoverColor,
  pillBackgroundColor,
  pillFailureBackgroundColor
} from '../../_constants/theme.constants';

const SelectContainer = styled(CreatableSelect)`
  * {
    font-family: 'Ubuntu', sans-serif;
    font-weight: 400;
  }

  .react-select__control {
    box-sizing: border-box;
    background-color: ${backgroundColor};
    border: 2px solid ${borderColor};
    border-radius: 3px;
    color: black;
    transition: all 0.2s ease;
    width: 100%;
    padding: 0.1rem;

    &:hover {
      border: 2px solid ${buttonHoverColor};
      box-shadow: none;
    }

    &.react-select__control--is-focused {
      outline: none;
      border: 2px solid ${buttonColor};
      box-shadow: none;
    }

    .react-select__value-container {
      padding: 0;

      .react-select__placeholder {
        font-size: 0.9em;
        padding-left: 0.8rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .css-b8ldur-Input {
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        padding-left: 0.8rem;
        font-size: 0.9rem;
        margin: 0.1rem 0;
      }

      .react-select__multi-value {
        padding: 0.6rem 1.15rem 0.6rem 1.15rem;
        margin: 0.1rem 0.1rem;
        border-radius: 50px;
        // margin: 0.2rem 0.2rem;

        .react-select__multi-value__label {
          padding: 0;
          font-size: 0.9rem;
        }
        .react-select__multi-value__remove {
          padding: 0;
          margin-left: 0.3em;
        }
      }
    }

    .react-select__indicators {
      .react-select__indicator-separator {
        margin: 0.3em 0;
        width: 2px;
        background-color: ${borderColor};
      }
      .react-select__indicator {
        padding: 0.5em;
      }
    }
  }
`;

const animatedComponents = makeAnimated();

const MultiValue = props => (
  <animatedComponents.MultiValue {...props} cropWithEllipsis={false} />
);

const Select = ({
  name,
  options,
  control,
  checkValid = () => true,
  ...inputProps
}) => {
  const [localOptions, setLocalOptions] = useState(options);

  const handleChange = ([newValue, actionMeta]) => {
    console.group('Value Changed');
    console.log(newValue, actionMeta);
    console.groupEnd();
  };

  const createOption = label => ({ label, value: label });

  const handleCreate = inputValue => {
    this.setState({ isLoading: true });
    console.group('Option created');
    setLocalOptions([...localOptions, createOption(inputValue)]);
  };

  return (
    <Controller
      name={name}
      as={SelectContainer}
      // onFocus={() => selectRef.current.focus()}
      options={localOptions}
      control={control}
      className="react-select-container"
      classNamePrefix="react-select"
      components={{ ...animatedComponents, MultiValue }}
      // closeMenuOnSelect={false}
      isMulti
      isClearable
      isCreatable
      onChange={handleChange}
      createOption={handleCreate}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        multiValue: (base, { data }) => ({
          ...base,
          backgroundColor: checkValid(data)
            ? pillBackgroundColor
            : pillFailureBackgroundColor
        }),
        menu: base => ({ ...base, fontSize: '0.9rem' })
      }}
      {...inputProps}
    />
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  control: PropTypes.object.isRequired,
  checkValid: PropTypes.func
};

Select.displayName = 'Input.Select';

export default Select;
