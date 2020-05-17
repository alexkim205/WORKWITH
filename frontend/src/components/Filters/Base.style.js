import styled from 'styled-components';
import { tertiaryColor } from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

export const FILTER_HEIGHT = 45;

export const BaseContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-items: center;
  border-radius: 50px;
  background-color: ${tertiaryColor};
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  height: ${FILTER_HEIGHT}px;
  z-index: 0;
  cursor: pointer;
  margin-left: 1em;

  ${breakpoint.down('m')`
    font-size: 0.9em;
  `}
`;
