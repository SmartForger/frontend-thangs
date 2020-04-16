import React, { useState } from 'react';
import styled from 'styled-components';
import { BlockPicker } from 'react-color';

const StyledColorDisplay = styled.div`
    height: 24px;
    width: 32px;
    background: ${props => props.color};
    border-radius: 4px;
    cursor: pointer;

    > div {
        left: 0;
        top: 100%;
        transform: translate(calc(-50% + 16px), 10px);
        display: ${props => (props.visible ? 'absolute' : 'none')};
    }
`;

export function ColorPicker({ color = '#FFFFFF', onChange }) {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        setVisible(!visible);
    };

    const handleChange = (...args) => {
        onChange(...args);
        toggleVisible();
    };

    return (
        <StyledColorDisplay
            color={color}
            onClick={toggleVisible}
            visible={visible}
        >
            <BlockPicker color={color} onChange={handleChange} />
        </StyledColorDisplay>
    );
}
