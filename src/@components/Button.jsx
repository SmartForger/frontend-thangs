import styled, { css } from 'styled-components';
import {
    primaryButtonText,
    secondaryButtonText,
    darkButtonText,
    linkText,
    matchingButtonText,
} from '@style/text';

const allowCssProp = props => (props.css ? props.css : '');

const BtnStyle = css`
    border: none;
    text-align: center;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    padding: 8px 12px;

    &:disabled {
        cursor: not-allowed;
    }

    ${allowCssProp};
`;

export const SecondaryButton = styled.button`
    ${BtnStyle};
    ${secondaryButtonText};
    background-color: ${props => props.theme.secondaryButton};
`;

export const DarkButton = styled.button`
    ${BtnStyle};
    ${darkButtonText};
    ${props => props.theme.shadow};
    background-color: ${props => props.theme.deleteButton};
`;

export const Button = styled.button`
    ${BtnStyle};
    ${primaryButtonText};
    background: ${props => props.theme.primaryButton};
    ${props => props.theme.shadow};

    &:disabled {
        ${secondaryButtonText};
        background: ${props => props.theme.primaryButtonDisabledColor};
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
    }
`;

export const TextButton = styled.button`
    ${linkText};
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    ${allowCssProp};
`;

export const BrandButton = styled.button`
    ${BtnStyle};
    ${matchingButtonText};
    ${props => props.theme.shadow};
    background-color: ${props => props.theme.brandColor};
    padding: 6px 24px 6px 32px;
`;
