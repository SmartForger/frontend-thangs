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
    background: ${props => props.theme.primaryButton};
    border-radius: 8px;
    padding: 8px 12px;
    ${primaryButtonText};

    ${props => props.theme.shadow};

    &:disabled {
        ${secondaryButtonText};
        cursor: not-allowed;
        background: ${props => props.theme.primaryButtonDisabledColor};
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
    }

    ${allowCssProp};
`;

const SecondaryBtnStyle = styled(BtnStyle)`
    ${secondaryButtonText};
    background-color: ${props => props.theme.secondaryButton};
`;

const DarkBtnStyle = styled(BtnStyle)`
    ${darkButtonText};
    background-color: ${props => props.theme.deleteButton};
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

export const SecondaryButton = ({
    className,
    onClick = NOOP,
    children,
    css = '',
}) => {
    return (
        <SecondaryBtnStyle className={className} onClick={onClick} css={css}>
            {children}
        </SecondaryBtnStyle>
    );
};

export const DarkButton = ({
    className,
    onClick = NOOP,
    children,
    css = '',
}) => {
    return (
        <DarkBtnStyle className={className} onClick={onClick} css={css}>
            {children}
        </DarkBtnStyle>
    );
};

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
