import styled from 'styled-components';
import Text from './Input.Text';
import Error from './Input.Error';

const Wrapper = styled.div`
  margin: 0.3em auto 0em auto;
  overflow: hidden;
  will-change: transform;
  // ${({ visible }) => (visible ? 'height: 71px;' : '')}
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
