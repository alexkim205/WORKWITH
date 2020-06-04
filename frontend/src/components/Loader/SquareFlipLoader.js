import styled, { keyframes } from 'styled-components';

import { secondaryColor } from '../../_constants/theme.constants';

const flip = keyframes`
  0% { -webkit-transform: perspective(120px) }
  50% { -webkit-transform: perspective(120px) rotateY(180deg) }
  100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
`;

const SquareFlipLoader = styled.div`
  width: 1em;
  height: 1em;
  margin: 0.5em;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || secondaryColor};

  -webkit-animation: ${flip} 1.2s infinite ease-in-out;
  animation: ${flip} 1.2s infinite ease-in-out;
`;

export default SquareFlipLoader;
