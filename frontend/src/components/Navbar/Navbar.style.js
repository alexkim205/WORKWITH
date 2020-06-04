import styled from 'styled-components';
import {
  textColor,
  backgroundColor,
  borderColor,
  highlightLightBackgroundColor
} from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

export const FIELD_HEIGHT = 60;
export const OPTION_HEIGHT = 60;

export const Container = styled.div`
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  background-color: ${backgroundColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  border-bottom: 1px solid ${borderColor};

  ${breakpoint.down('m')`
    padding: 1.5em 1em;
  `}

  .logo-box {
  }
  .spacer {
    flex: 1;
  }
  .profile {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    height: ${FIELD_HEIGHT}px;
    padding: 0 1.2em;
    overflow: visible;
    z-index: 2;
    cursor: pointer;

    ${breakpoint.down('m')`
      
    `}

    .avatar {
      height: 2em;
      width: 2em;
      border-radius: 100%;
      background-color: lightblue;
      margin-right: 1em;
    }
    .name {
      font-size: 1.1em;
      font-weight: 1em;
      color: ${textColor};

      ${breakpoint.down('m')`
        font-size: 1.0em;
      `}
    }

    .icon {
      align-items: center;
      display: flex;
      transform-origin: 50% 50%;
      justify-content: center;

      &.caret {
        margin-left: 0.5em;
      }
    }

    svg {
      fill: ${textColor};
    }
  }
`;

export const Drawer = styled.div`
  position: absolute;
  top: 0;
  // padding-top: ${FIELD_HEIGHT}px;
  z-index: 2;
  left: 0px;
  height: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 25px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.20);
`;

export const Option = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 1em 1.2em;
  color: ${textColor};
  font-size: 1em;
  background-color: ${({ isActive, ...props }) =>
    isActive ? highlightLightBackgroundColor(props) : backgroundColor(props)};
  // cursor: ${({ isActive }) => (isActive ? 'normal' : 'pointer')};
  justify-content: flex-start;
  align-items: center;
  height: ${OPTION_HEIGHT}px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-top: 1px solid ${borderColor};
  }
  &:last-child {
    padding-bottom: 2em;
  }
  &:hover {
    background-color: ${highlightLightBackgroundColor};
  }
`;
