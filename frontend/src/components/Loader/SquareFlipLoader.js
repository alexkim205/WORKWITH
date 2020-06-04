import React from 'react';
import styled, { keyframes } from 'styled-components';

const flip = keyframes`
  0% { -webkit-transform: perspective(120px) }
  50% { -webkit-transform: perspective(120px) rotateY(180deg) }
  100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
`;

const Container = styled.div`
  width: 40px;
  height: 40px;
  background-color: #333;

  -webkit-animation: ${flip} 1.2s infinite ease-in-out;
  animation: ${flip} 1.2s infinite ease-in-out;
`;

const SquareFlipLoader = () => <Container></Container>;

export default SquareFlipLoader;
