import React from 'react';
import styled from 'styled-components';

const DotsLoader = ({
    height = "20px",
    circleSize = 5,
    circlesGap= 10,
    showShadow = false,
}) => {
  return (
    <StyledWrapper height={height} circleSize={circleSize} circlesGap={circlesGap} showShadow={showShadow}>
      <div className="wrapper">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="shadow" />
        <div className="shadow" />
        <div className="shadow" />
      </div>
    </StyledWrapper>
  );
  
}
const StyledWrapper = styled.div`
  .wrapper {
    width: 200px;
    height: ${({ height }) => height};
    position: relative;
    z-index: 1;
  }

  .circle {
    width: ${({ circleSize }) => circleSize}px;
    height: ${({ circleSize }) => circleSize}px;
    position: absolute;
    border-radius: 50%;
    background-color: #fff;
    left: 0%;
    top: 10px;
    transform-origin: 70%;
    animation: circle7124 .5s alternate infinite ease;
  }

  @keyframes circle7124 {
    0% {
      top: 20px;
      height: ${({ circleSize }) => circleSize / 4}px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.5);
    }

    40% {
      height: ${({ circleSize }) => circleSize}px;
      border-radius: 50%;
      transform: scaleX(1);
    }

    100% {
      top: 0%;
    }
  }

  .circle:nth-child(2) {
    left: ${({ circlesGap }) => circlesGap}px;
    animation-delay: .2s;
  }

  .circle:nth-child(3) {
    left: ${({ circlesGap }) => circlesGap+=circlesGap}px;
    right: 15%;
    animation-delay: .3s;
  }

  .shadow {
    width: ${({ circleSize }) => circleSize-2}px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.9);
    position: absolute;
    top: 22px;
    transform-origin: 50%;
    z-index: -1;
    left: 0%;
    filter: blur(1px);
    animation: shadow046 .5s alternate infinite ease;
    display: ${({ showShadow }) => showShadow ? "inline" : "none"};
  }

  @keyframes shadow046 {
    0% {
      transform: scaleX(1.5);
    }

    40% {
      transform: scaleX(1);
      opacity: .7;
    }

    100% {
      transform: scaleX(.2);
      opacity: .4;
    }
  }

  .shadow:nth-child(4) {
    left: ${({ circlesGap }) => circlesGap}px;
    animation-delay: .2s
  }

  .shadow:nth-child(5) {
    left: ${({ circlesGap }) => circlesGap+=circlesGap}px;
    animation-delay: .3s;
  }
`;


export default DotsLoader;
