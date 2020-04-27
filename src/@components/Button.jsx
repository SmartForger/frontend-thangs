import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    primaryButtonText,
    secondaryButtonText,
    darkButtonText,
    linkText,
} from '@style/text';

const allowCssProp = props => (props.css ? props.css : '');

const BtnStyle = styled.button`
    border: none;
    text-align: center;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    padding: 8px 12px;

    ${props => props.theme.shadow};

    &:disabled {
        cursor: not-allowed;
    }

    ${allowCssProp};
`;

export const SecondaryButton = styled(BtnStyle)`
    ${secondaryButtonText};
    background-color: ${props => props.theme.secondaryButton};
`;

export const DarkButton = styled(BtnStyle)`
    ${darkButtonText};
    background-color: ${props => props.theme.deleteButton};
`;

const NOOP = () => null;

export const Button = styled(BtnStyle)`
    background: ${props => props.theme.primaryButton};
    ${primaryButtonText};
    &:disabled {
        ${secondaryButtonText};
        background: ${props => props.theme.primaryButtonDisabledColor};
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
    }
`;

const TextButtonStyled = styled.button`
    ${linkText};
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    ${allowCssProp};
`;

export function TextButton({ onClick = NOOP, children, css }) {
    return (
        <TextButtonStyled onClick={onClick} css={css}>
            {children}
        </TextButtonStyled>
    );
}
