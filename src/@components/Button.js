import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';


const BtnStyle = styled.button`
    width: 100%;
    max-width: 100px;
    height: 35px;
    margin: ${props => props.margin || '5px'};
    border: none;
    border-radius: 0.5rem;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.secondary};
    box-shadow: inset 0 0 0 2px  black;
    font-size: 12px;
    font-family: ${props => props.theme.mainFont};
    transition: .5s;

    &:hover {
      border: 2px solid transparent;
      background-color: ${props => props.theme.secondary};
      color: ${props => props.theme.primary};
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
    const history = useHistory();
    return <BtnStyle {...props} onClick={
      () => {
        if (props.onClick != null) props.onClick();
        if (props.routeTo != null) history.push(props.routeTo);}
      }>{props.name}
      </BtnStyle>
}

export {Button};