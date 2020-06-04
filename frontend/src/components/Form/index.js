import styled, { css } from 'styled-components';
import Text from './Input.Text';
import Error from './Input.Error';
import Label from './Input.Label';

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
  Error,
  Wrapper
};

const Form = {
  Input
};

export default Form;
