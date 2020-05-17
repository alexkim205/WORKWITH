import styled from 'styled-components';
import { lighten } from 'polished';
import {
  tertiaryColor,
  textOnDarkColor
} from '../../_constants/theme.constants';
import { BaseContainer, FILTER_HEIGHT } from './Base.style';

export const DD_HEIGHT = FILTER_HEIGHT;
export const OPTION_HEIGHT = FILTER_HEIGHT;

export const Container = styled(BaseContainer)`
  position: relative;
  height: ${DD_HEIGHT}px;
  padding: 0 1.2em;
  overflow: visible;
  z-index: 1;

  .style-container {
    position: absolute;
    top: ${DD_HEIGHT / 2}px;
    left: 0;
    right: 0;
    height: ${DD_HEIGHT / 2}px;
    background-color: ${tertiaryColor}
    z-index: -1;
    transform-origin: 0 0;
    border-radius: 50px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .active-option {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    .value {
      text-align: center;
      min-width: 75px; 
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${textOnDarkColor};
      font-weight: 600;
    }
    
    svg {
      fill: ${textOnDarkColor};
    }

    .icon {
      align-items: center;
      display: flex;
      transform-origin: 50% 50%;
      justify-content: center;
      
      &.caret {
        margin-left: 0.5em;
      }
  
      &.filter {
        margin-right: 0.5em;
      }
    }
  }
`;

export const Drawer = styled.div`
  position: absolute;
  top: ${DD_HEIGHT / 2}px;
  padding-top: ${DD_HEIGHT / 2}px;
  z-index: -2;
  left: 0px;
  height: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    ${tertiaryColor} 0%,
    ${tertiaryColor} 60%,
    ${props => lighten(0.09, tertiaryColor(props))} 100%
  );
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 25px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const Option = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0.5em 1.2em;
  color: ${textOnDarkColor};
  font-size: 1em;
  background-color: ${({ isActive }) =>
    isActive ? 'rgba(0, 0, 0, 0.1)' : 'auto'};
  justify-content: center;
  align-items: center;
  height: ${OPTION_HEIGHT}px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    padding-top: 0.5em;
  }
  &:last-child {
    padding-bottom: 0.5em;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
