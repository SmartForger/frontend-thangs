import styled, { css } from 'styled-components';
import {
    primaryButtonText,
    secondaryButtonText,
    darkButtonText,
    linkText,
    matchingButtonText,
    matchingButtonHoverText,
} from '@style/text';
import {
    BLUE_2,
    BLUE_4,
    BLACK_4,
    GREY_3,
    GREY_7,
    YELLOW_1,
    YELLOW_3,
} from '@style/colors';

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
    background-color: ${GREY_3};
    &:hover {
        background-color: ${GREY_7};
    }
`;

export const BackButton = styled(SecondaryButton)`
    width: 48px;
    height: 48px;
    border-radius: 48px;
    padding: 0;
    margin-right: 16px;
`;

export const DarkButton = styled.button`
    ${BtnStyle};
    ${darkButtonText};
    ${props => props.theme.shadow};
    background-color: ${GREY_7};

    &:hover {
        background-color: ${BLACK_4};
    }
`;

export const Button = styled.button`
    ${BtnStyle};
    ${primaryButtonText};
    background-color: ${BLUE_2};
    ${props => props.theme.shadow};

    &:hover {
        background-color: ${BLUE_4};
    }

    &:disabled {
        ${secondaryButtonText};
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
    padding: 6px 24px 6px 32px;
    background-color: ${YELLOW_1};

    &:hover {
        ${matchingButtonHoverText};
        background-color: ${YELLOW_3};
    }
`;
