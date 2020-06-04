import styled, { css } from 'styled-components';

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.375rem;
  margin-bottom: 0.75em;
  word-wrap: break-word;
  font-weight: 400;

  svg {
    margin-right: 0.35em;
  }

  ${({ center }) =>
    center
      ? css`
          text-align: center;
        `
      : css`
          text-align: left;
        `}
`;

export default Label;
