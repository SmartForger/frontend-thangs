import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';


const BtnStyle = styled.div`
    width: 100%;
    max-width: ${props => props.maxWidth || '100px'};
    height: ${props => props.height || '35px'};
    margin: ${props => props.margin || '5px'};
    border: none;
    text-align: center;
    user-select:none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    box-shadow: inset 0 0 0 2px  ${props => props.theme.white};
    font-size: ${props => props.fontSize || '12px'};
    font-weight: 700;
    transition: .5s;

    &:hover {
      
      background-color: ${props => props.theme.primary};
      color: ${props => props.theme.secondary};
    }
    &:active {
      transform: scale(0.95);
    }
  
    &:disabled {
      background-color: gray;
      cursor: not-allowed;
    }
`;

  const Button = (props) => {
    const {
      name,
      onClick,
      routeTo, 
      maxWidth, 
      height, 
      margin,
      fontSize, 
      ...rest //This is just to make eslint chill out
    } = props
    const history = useHistory();
    return <BtnStyle {...props} onClick={
      () => {
        if (onClick != null) props.onClick();
        if (routeTo != null) history.push(routeTo);}
      }>{name}
      </BtnStyle>
}

export {Button};
