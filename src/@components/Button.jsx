import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { animated } from 'react-spring';

const allowCssProp = props => (props.css ? props.css : '');

const BtnStyle = styled(animated.button)`
    width: ${props => props.width || '100%'};
    max-width: ${props => props.maxwidth || '114px'};
    border: none;
    text-align: center;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.primaryButton};
    color: ${props => props.theme.primaryButtonText};
    font-weight: 500;
    transition: 0.3s;
    border-radius: 8px;
    padding: 8px 12px;

    ${props => props.theme.shadow};

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        cursor: not-allowed;
        background: ${props => props.theme.primaryButtonDisabledColor};
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
    }

    ${allowCssProp};
`;

const NOOP = () => null;

export const Button = React.forwardRef((props, ref) => {
    const { name, onClick = NOOP, routeto, children } = props;

    if (routeto) {
        return (
            <Link to={routeto}>
                <BtnStyle {...props}>{name || children}</BtnStyle>
            </Link>
        );
    }

    return (
        <BtnStyle {...props} onClick={onClick} ref={ref}>
            {name || children}
        </BtnStyle>
    );
});
