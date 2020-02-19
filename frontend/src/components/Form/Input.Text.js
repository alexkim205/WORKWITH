import styled from "styled-components";
import { buttonColor, borderColor } from "../../_constants/theme.constants";

const Text = styled.input`
  font-family: "Ubuntu", sans-serif;
  font-weight: 300;
  display: inline-block;
  background-color: #f2f2f2;
  border: 1px solid ${borderColor};
  border-radius: 3px;
  padding: 1em 1.1em;
  font-size: 1em;
  color: black;
  transition: background-color 0.2s ease, border 0.2s ease;

  &:focus {
    outline: none;
    background-color: #ffffff;
    border: 1px solid ${buttonColor};
  }
`;

export default Text;
