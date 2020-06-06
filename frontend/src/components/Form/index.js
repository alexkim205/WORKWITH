import styled, { css } from 'styled-components';
import Text from './Input.Text';
import Error from './Input.Error';
import Label from './Input.Label';
import Select from './Input.Select';

const Wrapper = styled.div`
  // overflow: hidden;
  will-change: transform;
  ${({ isHidden }) =>
    isHidden
      ? css`
          height: 0;
        `
      : null}
`;

export const Input = {
  Label,
  Text,
  Select,
  Error,
  Wrapper
};

const Form = {
  Input
};

export default Form;
