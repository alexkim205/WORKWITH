import styled from 'styled-components';
import {
  buttonColor,
  borderColor,
  inputBackgroundColor
} from '../../_constants/theme.constants';

const Text = styled.input`
  font-family: 'Ubuntu', sans-serif;
  font-weight: 300;
  box-sizing: border-box;
  display: inline-block;
  background-color: ${inputBackgroundColor};
  border: 1px solid ${borderColor};
  border-radius: 3px;
  padding: 1em 1.1em;
  font-size: 1em;
  color: black;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background-color: #fff;
    border: 1px solid ${buttonColor};
  }
`;

export default Text;
