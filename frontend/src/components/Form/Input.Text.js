import styled from "styled-components";
import { buttonColor } from "../../_constants/theme.constants";

const Text = styled.input`
  display: inline-block;
  background-color: #f2f2f2;
  border: 2px solid black;
  border-radius: 3px;
  padding: 1em 1.1em;
  font-size: 1em;
  color: black;
  transition: background-color 0.2s ease, border 0.2s ease;

  &:focus {
    outline: none;
    background-color: #ffffff;
    border: 2px solid ${buttonColor};
  }
`;

export default Text;
