import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { failureColor } from '../../_constants/theme.constants';

const Container = styled.div`
  font-size: 0.75em;
  height: 15px;
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

const Error = ({ children, ...otherProps }) => (
  <Container {...otherProps}>{children}</Container>
);

Error.propTypes = {
  children: PropTypes.node
};

export default Error;
