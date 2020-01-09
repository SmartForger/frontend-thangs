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
  background: ${props => props.headerBg || props.theme.white};
  color: ${props => props.headerColor || props.theme.secondary};
  background-size: contain;
  font-size: ${props => props.fontSize || 1}rem;
  padding: 0 5%;
`

/// Old background-image:
// background-image:
//   linear-gradient(
//     ${props => props.gradientAngle || '180'}deg, 
//     ${props => props.gradientStart || 'rgba(0,0,0,0)'},
//     ${props => props.gradientEnd || 'rgba(0,0,0,0)'}),

//   ${props => {
//     if (props.imageUrl) return `url(${props.imageUrl})`;
//     if (props.headerBg) return props.headerBg;
//     return props.theme.secondary
//   }};

const StyleCardBody = styled.div`
  width: 100%;
  height: ${props => props.percentage ? 100 - props.percentage : 24}%;
  background: ${props => props.bodyBg ? props.bodyBg : props.theme.white};
  color: ${props => props.bodyColor || props.theme.secondary};
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.size/200}rem;
`

const DisplayCard = (props) => {
  const {size,
        imageUrl,
        headerBg,
        headerColor,
        headerContent,
        bodyBg,
        bodyColor,
        shadow,
        bordered,
        rounded,
        hover,
        percentage,
        children,
        ...rest //this makes eslint chill out
      } = props;
  return(
    <StyleCard {...props}>
      <StyleCardHead {...props}>
      {headerContent ? headerContent : null}
      </StyleCardHead>
      <StyleCardBody {...props}>
      {children ? children: null}
      </StyleCardBody>
    </StyleCard>)
}

export {DisplayCard};
