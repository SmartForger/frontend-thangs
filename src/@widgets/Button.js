import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';


const BtnStyle = styled.button`
    width: 100%;
    max-width: 100px;
    height: 35px;
    margin: ${props => props.margin || '5px'};
    border: 2px solid transparent;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.secondary};
    font-size: 12px;
    transition: .5s;

    &:hover {
      border: 2px solid ${props => props.theme.primary};
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