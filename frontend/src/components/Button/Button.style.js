import styled from 'styled-components';

import { breakpoint } from '../../_constants/theme.mixins.constants';
import {
  buttonColor,
  buttonTextColor,
  linkButtonTextColor,
  tertiaryColor
} from '../../_constants/theme.constants';

const StyledButtonBase = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;

  background-color: transparent;
  border-radius: 3px;
  border: none;
  padding: 0.75em 1.25em;
  margin: 0.8em auto;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};

  letter-spacing: 1px;
  font-family: 'Poppins', sans-serif;
  font-size: 1em;
  ${breakpoint.down('m')`
    font-size: 0.9em;
  `}

  &:focus {
    outline: none;
  }
`;

export const StyledFormButton = styled(StyledButtonBase)`
  background-color: ${buttonColor};
  text-transform: uppercase;
  font-weight: 600;
  color: ${buttonTextColor};

  transition: 0.2s all;
`;

export const StyledModalButton = styled(StyledButtonBase)`
  background-color: ${buttonColor};
  font-weight: normal;
  color: ${buttonTextColor};
  margin: 0;

  transition: 0.2s all;
`;

export const StyledLinkButton = styled(StyledButtonBase)`
  color: ${linkButtonTextColor};
  text-decoration: underline;
  font-size: 0.9em;
  padding: 0.2em;
  margin: 0.2em;
  ${breakpoint.down('m')`
    font-size: 0.85em;
  `}
`;

export const StyledIconButton = styled(StyledButtonBase)`
  padding: 0.75em;
  margin: 0.8em;
  color: ${tertiaryColor};
`;
