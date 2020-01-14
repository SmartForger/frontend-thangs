import React from 'react';
import styled from 'styled-components';
import {animated} from 'react-spring';

const ModelDisplayStyled = styled(animated.div)`
  width: ${props => props.width || '400px'};
  height: ${props => props.height || '300px'};
  background: ${props => props.imgURL || props.theme.white};
  margin: ${props => props.margin || '10px'};
  background-repeat: no-repeat;
  border-radius: 2%;
  text-align: center;
  box-shadow: inset 0 0 0 3px black;
  transition: all 0.2s;
  user-select: none;
  cursor: pointer;

  > span {
    position: relative;
    top: 105%;
  }

  &:hover {
    transform: scale(0.90)
  }
`

const ModelDisplay = (props) => {
  const {name} = props;
  return (
    <ModelDisplayStyled {...props}>
<span>{name}</span>
    </ModelDisplayStyled>
  );
}

export {ModelDisplay};