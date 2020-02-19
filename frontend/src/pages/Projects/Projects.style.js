import styled from "styled-components";
import { borderColor, secondaryColor } from "../../_constants/theme.constants";
import { breakpoint } from "../../_constants/theme.mixins.constants";

export const Background = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    display: flex;
    flex-direction: row;
    // width: 100%;
    height: 50px;
    padding: 1em;
    border-bottom: 2px solid ${borderColor};

    background-color: pink;
  }
  .spacer {
    transition: 0.2s height;
    height: calc(25%);
    ${breakpoint.down("m")`
      height: 0;
    `}
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

      ${breakpoint.down("m")`
      width: 100%;
      `}

      .toggles {
        background-color: lightblue;
      }

      .search {
        margin-bottom: 2em;
        width: 100%;
        input {
          width: inherit;
          box-sizing: border-box;
          font-size: 1.2em;
          transition: 0.2s font-size;

          ${breakpoint.down("m")`
            font-size: 1.1em;
          `}
          ${breakpoint.down("s")`
            font-size: 1em;
          `}
        }
        &:focus {
          border: 1px solid ${secondaryColor};
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
