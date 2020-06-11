import styled from 'styled-components';
import {
  buttonColor,
  borderColor,
  backgroundColor,
  buttonHoverColor
} from '../../_constants/theme.constants';

const Text = styled.input`
  font-family: 'Ubuntu', sans-serif;
  font-weight: 400;
  box-sizing: border-box;
  display: inline-block;
  background-color: ${backgroundColor};
  border: 2px solid ${borderColor};
  border-radius: 3px;
  padding: 0.8rem 0.8rem;
  font-size: 0.9rem;
  color: black;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border: 2px solid ${buttonHoverColor};
    box-shadow: none;
  }

  &:focus {
    outline: none;
    border: 2px solid ${buttonColor};
  }
`;

export default Text;
