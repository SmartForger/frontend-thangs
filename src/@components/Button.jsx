import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { animated } from 'react-spring';

const BtnStyle = styled(animated.button)`
    width: 100%;
    max-width: ${props => props.maxwidth || '100px'};
    height: ${props => props.height || '35px'};
    margin: ${props => props.margin || '5px'};
    border: none;
    text-align: center;
    user-select: none;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props => (props.disabled ? 'gray' : props.theme.primary)};
    color: ${props => props.theme.white};
    box-shadow: inset 0 0 0 2px ${props => props.theme.white};
    font-size: ${props => props.fontSize || '12px'};
    font-weight: 700;
    transition: 0.5s;

    &:hover {
        background-color: ${props =>
            props.disabled ? 'gray' : props.theme.primary};
        color: ${props =>
            props.disabled ? props.theme.white : props.theme.secondary};
    }
    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        background-color: gray;
        cursor: not-allowed;
    }
`;

const Button = props => {
    const { name, onClick, routeto } = props;
    const history = useHistory();
    return (
        <BtnStyle
            {...props}
            onClick={() => {
                if (onClick != null && !props.disabled) props.onClick();
                if (routeto != null) history.push(routeto);
            }}
        >
            {name}
        </BtnStyle>
    );
};

export { Button };
