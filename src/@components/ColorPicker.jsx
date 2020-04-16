import React, { useState } from 'react';
import styled from 'styled-components';
import { BlockPicker } from 'react-color';

const StyledColorDisplay = styled.div`
    cursor: pointer;
    position: relative;

    > .color-picker {
        left: 0;
        top: 100%;
        transform: translate(calc(-50% + 16px), 10px);
        position: absolute !important;
        display: ${props => (props.visible ? 'block' : 'none')};
    }
`;

export function ColorPicker({ color = '#FFFFFF', onChange, children }) {
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
            <BlockPicker
                color={color}
                onChange={handleChange}
                className="color-picker"
            />
            {children}
        </StyledColorDisplay>
    );
}
