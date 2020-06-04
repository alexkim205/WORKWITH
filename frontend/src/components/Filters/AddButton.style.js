import styled from 'styled-components';
import {
  buttonTextColor,
  secondaryColor
} from '../../_constants/theme.constants';
import { BaseContainer, FILTER_HEIGHT } from './Base.style';

export default styled(BaseContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${secondaryColor};
  width: ${FILTER_HEIGHT}px;
  height: ${FILTER_HEIGHT}px;

  svg {
    fill: ${buttonTextColor};
    z-index: 2;
    transform: scale(1.5);
  }
`;
