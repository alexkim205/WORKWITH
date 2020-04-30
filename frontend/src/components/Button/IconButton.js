import styled from 'styled-components';
import { tertiaryColor } from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

const IconButton = styled.button`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-items: center;
  border-radius: 50px;
  background-color: transparent;
  z-index: 0;
  cursor: pointer;
  margin-left: 1em;
  color: ${tertiaryColor};

  ${breakpoint.down('m')`
    font-size: 0.9em;
  `}
`;

export default IconButton;
