import styled from "styled-components";
import { secondaryColor } from "../../_constants/theme.constants";

const Icon = styled.button`
  background: ${({ active, ...props }) =>
    active ? secondaryColor(props) : "transparent"};
  color: ${({ active, ...props }) =>
    active ? "white" : secondaryColor(props)};
  position: relative;
  z-index: ${({ active }) => (active ? 2 : 1)};
  border: 1px solid black;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  &:nth-of-type(1) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
  &:nth-of-type(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  svg:nth-of-type(2) {
    margin-left: 0.5rem;
  }
  &:hover {
    background-color: ${({ active, ...props }) =>
      active ? secondaryColor(props) : "#f1f1f1"};
  }
`;

export default Icon;
