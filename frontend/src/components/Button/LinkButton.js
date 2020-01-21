import styled from "styled-components";
import { linkButtonTextColor } from "../../_constants/theme.constants";

const LinkButton = styled.button`
  background-color: transparent;
  border-radius: 3px;
  margin: 0.8em auto;
  border: none;
  outline: none;
  cursor: pointer;

  letter-spacing: 1px;
  font-family: "Poppins", sans-serif;
  color: ${linkButtonTextColor};
  text-decoration: underline;
`;

export default LinkButton;
