import React from 'react';
import { Link } from 'react-router-dom';
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
    background: ${props =>
        props.disabled ? 'gray' : props.theme.primaryButton};
    color: ${props => (props.disabled ? 'darkgray' : props.theme.buttonColor)};
    box-shadow: ${props => props.theme.buttonShadow};
    font-size: ${props => props.fontSize || '12px'};
    font-weight: 700;
    transition: 0.3s;

    &:hover {
        background-color: ${props =>
            props.disabled ? 'gray' : props.theme.primaryButton};
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
    const { name, onClick, routeto, children } = props;

    if (routeto) {
        return (
            <Link to={routeto}>
                <BtnStyle {...props}>{name || children}</BtnStyle>
            </Link>
        );
    }

    return (
        <BtnStyle
            {...props}
            onClick={() => {
                if (onClick != null && !props.disabled) props.onClick();
            }}
        >
            {name || children}
        </BtnStyle>
    );
};

export { Button };
