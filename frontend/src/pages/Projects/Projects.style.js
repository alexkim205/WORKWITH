import styled from 'styled-components';
import { secondaryColor } from '../../_constants/theme.constants';
import { breakpoint } from '../../_constants/theme.mixins.constants';

export const Background = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  .spacer {
    transition: 0.2s height;
    height: calc(5%);
    /* ${breakpoint.down('m')`
      height: 0;
    `} */
  }
  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;

    .box {
      background-color: white;
      box-sizing: border-box;
      padding: 1em;
      transition: 0.2s width;
      width: 600px;
      height: 100%;

      ${breakpoint.down('m')`
      width: 100%;
      `}

      .toggles {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-bottom: 1.5em;

        ${breakpoint.down('m')`
          margin-bottom: 1em;
        `}
      }

      .search {
        margin-bottom: 2em;
        width: 100%;
        input {
          width: inherit;
          font-size: 1.2em;

          ${breakpoint.down('m')`
            font-size: 1.1em;
          `}
          ${breakpoint.down('s')`
            font-size: 1em;
          `}
        }
        &:focus {
          border: 1px solid ${secondaryColor} !important;
        }
      }
    }
  }
`;

export const StyledProjects = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;
