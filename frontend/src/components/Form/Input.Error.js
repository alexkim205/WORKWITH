import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { failureColor } from '../../_constants/theme.constants';

const Container = styled.div`
  font-size: 0.75em;
  height: 15px;
  word-wrap: break-word;
  text-align: left;
  color: ${failureColor};
  margin-top: 2px;
  padding-left: 0.2em;
`;

const Error = ({ children }) => <Container>{children}</Container>;

Error.propTypes = {
  children: PropTypes.node
};

export default Error;
