import styled from 'styled-components';
import {
  tertiaryColor,
  backgroundColor
} from '../../_constants/theme.constants';
import { BaseContainer, FILTER_HEIGHT } from './Base.style';

export const SWITCH_HEIGHT = FILTER_HEIGHT;
export const SWITCH_WIDTH = 2 * SWITCH_HEIGHT;
export const SWITCH_PADDING = 7;
export const SELECTOR_DIAMETER = SWITCH_HEIGHT - 2 * SWITCH_PADDING;
export const LEFT_LEFT_OFFSET = SWITCH_PADDING;
export const RIGHT_LEFT_OFFSET =
  SWITCH_WIDTH - SWITCH_PADDING - SELECTOR_DIAMETER;

export const Container = styled(BaseContainer)`
  width: ${SWITCH_WIDTH}px;
  height: ${SWITCH_HEIGHT}px;

  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${SWITCH_WIDTH / 2}px;
    height: ${SWITCH_HEIGHT}px;

    svg {
      fill: ${tertiaryColor};
      z-index: 2;
      transform: scale(1.5);
    }
  }
`;

export const SelectorCircle = styled.div`
  position: absolute;
  border-radius: 50px;
  z-index: 1;
  top: ${SWITCH_PADDING}px;
  left: ${({ isLeftActive }) =>
    isLeftActive ? LEFT_LEFT_OFFSET : RIGHT_LEFT_OFFSET}px;
  width: ${SELECTOR_DIAMETER}px;
  height: ${SELECTOR_DIAMETER}px;
  background-color: ${backgroundColor};
  will-change: transform;
`;
