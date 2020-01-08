import React from 'react';
import styled from 'styled-components';

const StyleCard = styled.div`
  width: ${props => props.size || 200}px;
  height: ${props => props.size || 200}px;
  background: none;
  overflow: hidden;
  border-radius: ${props => props.rounded ? '10%' : 0};
  box-shadow: ${props => props.shadow ? 'rgba(0,0,0,0.8) 0 0 10px' : 'black 0 0 0'};
  border: ${props => props.bordered ? '2px solid black' : 'none'};
  transition: all 0.5s;
  margin: ${props => props.margin || '5px'};

  &:hover {
    transform: ${props => props.hover ? 'scale(1.05)' : 'scale(1)'};
  }
`

const StyleCardHead = styled.div`
  width: 100%;
  height: ${props => props.percentage ? props.percentage : 76}%;
  background: ${props => props.bodyBg || props.theme.white};
  color: ${props => props.bodyColor || props.theme.secondary};
  background-size: contain;
  font-size: ${props => props.fontSize || 1}rem;
`

/// Old background-image:
// background-image:
//   linear-gradient(
//     ${props => props.gradientAngle || '180'}deg, 
//     ${props => props.gradientStart || 'rgba(0,0,0,0)'},
//     ${props => props.gradientEnd || 'rgba(0,0,0,0)'}),

//   ${props => {
//     if (props.imageUrl) return `url(${props.imageUrl})`;
//     if (props.bodyBg) return props.bodyBg;
//     return props.theme.secondary
//   }};

const StyleCardFoot = styled.div`
  width: 100%;
  height: ${props => props.percentage ? 100 - props.percentage : 24}%;
  background: ${props => props.footerBg ? props.footerBg : props.theme.white};
  color: ${props => props.footerColor || props.theme.secondary};
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
 
  padding: ${props => props.size/10 || 20}px;
  font-size: ${props => props.size/200}rem;
`

const DisplayCard = (props) => {
  const {size,
        imageUrl,
        bodyBg,
        bodyColor,
        bodyContent,
        footerBg,
        footerColor,
        footerContent,
        shadow,
        bordered,
        rounded,
        hover,
        percentage} = props;
  return(
    <StyleCard {...props}>
      <StyleCardHead {...props}>
      {bodyContent ? bodyContent : null}
      </StyleCardHead>
      <StyleCardFoot {...props}>
      {footerContent ? footerContent: null}
      </StyleCardFoot>
    </StyleCard>)
}

export {DisplayCard};