import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const StyledColorDisplay = styled.div`
    cursor: pointer;
    position: relative;
`;

const COLORS = [
    '#dbdbdf',
    '#88888b',
    '#464655',
    '#1cb2f5',
    '#014d7c',
    '#ffbc00',
    '#b18002',
    '#c7eeff',
];

const BlockPickerStyled = styled.div`
    display: ${props => (props.visible ? 'grid' : 'none')};
    background-color: ${props => props.theme.cardBackground};
    position: absolute;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 12px;
    padding: 24px;
    bottom: calc(100% + 24px);
    left: 18px;
    transform: translateX(-50%);
    border-radius: 4px;

    ${props => props.theme.shadow};

    :after {
        content: '';
        position: absolute;
        top: calc(100% - 1px);
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-top: solid 8px ${props => props.theme.cardBackground};
        border-left: solid 6px transparent;
        border-right: solid 6px transparent;
        z-index: 1;
    }
`;

const Color = styled.div`
    cursor: pointer;
    height: 24px;
    width: 24px;
    border-radius: 100%;
    background-color: ${props => props.color};
    box-sizing: border-box;

    ${props =>
        props.isSelected &&
        css`
            border: 1px solid ${props => props.theme.cardBackground};
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
        `};
`;

function BlockPicker({ currentColor, onChange, visible }) {
    return (
        <BlockPickerStyled visible={visible}>
            {COLORS.map((color, idx) => (
                <Color
                    color={color}
                    onClick={() => onChange(color)}
                    isSelected={color === currentColor}
                    key={idx}
                />
            ))}
        </BlockPickerStyled>
    );
}

export function ColorPicker({ color = '#FFFFFF', onChange, children }) {
    const [visible, setVisible] = useState();

    const toggleVisible = () => {
        setVisible(!visible);
    };

    const handleChange = (...args) => {
        onChange(...args);
        toggleVisible();
    };

    return (
        <StyledColorDisplay color={color} onClick={toggleVisible}>
            <BlockPicker
                currentColor={color}
                onChange={handleChange}
                visible={visible}
            />
            {children}
        </StyledColorDisplay>
    );
}
