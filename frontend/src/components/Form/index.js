import styled, { css } from 'styled-components';
import Text from './Input.Text';
import Error from './Input.Error';

const Wrapper = styled.div`
  overflow: hidden;
  will-change: transform;
  ${({ isHidden }) =>
    isHidden
      ? css`
          height: 0;
        `
      : null}
`;

export const Input = {
  Text,
  Error,
  Wrapper
};

const Form = {
  Input
};

export default Form;
