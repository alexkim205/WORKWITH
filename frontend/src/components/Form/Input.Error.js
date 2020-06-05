import styled, { css } from 'styled-components';
import { failureColor } from '../../_constants/theme.constants';

const Error = styled.div`
  font-size: 0.75em;
  min-height: 1.2em;
  word-wrap: break-word;
  color: ${failureColor};
  padding-left: 0.2em;

  ${({ center }) =>
    center
      ? css`
          text-align: center;
          margin-top: 4px;
          margin-bottom: 4px;
        `
      : css`
          text-align: left;
          margin-top: 2px;
          margin-bottom: 4px;
        `}
`;

export default Error;
