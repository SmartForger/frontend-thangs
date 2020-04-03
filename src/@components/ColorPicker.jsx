import React, { useState } from 'react';
import styled from 'styled-components';
import { BlockPicker } from 'react-color';

const StyledColorDisplay = styled.div`
    height: 75px;
    width: 75px;
    box-shadow: ${props => (props.newDesign ? 'none' : 'inset 0 0 0 5px black')}
    background: ${props => props.color};

    > div {
        left: 0;
        top: 100%;
        transform: translate(calc(-50% + 37px), 10px);
        display: ${props => (props.visible ? 'absolute' : 'none')};
    }
`;

const ColorPicker = ({ color = '#FFFFFF', onChange, newDesign }) => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        console.log('Visible Toggled');
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
            newDesign
        >
            <BlockPicker color={color} onChange={handleChange} />
        </StyledColorDisplay>
    );
};

export { ColorPicker };
