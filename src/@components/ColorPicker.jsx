import React, {useState} from 'react';
import styled from 'styled-components';
import {BlockPicker} from 'react-color';

const StyledColorDisplay = styled.div`
  height: 75px;
  width: 75px;
  box-shadow: inset 0 0 0 5px black;
  background: ${props => props.color};

  > div {
    left: 400px;
    display: ${props => props.visible ? 'absolute' : 'none' };
  }
`

const ColorPicker = ({color="#FFFFFF", onChange}) => {
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    console.log("Visible Toggled")
    setVisible(!visible)
  }

  const handleChange = (...args) => {
    onChange(...args);
    toggleVisible();
  }

  return (
    <StyledColorDisplay color={color} onClick={toggleVisible} visible={visible}>
      <BlockPicker color={color}  onChange={handleChange}/> 
    </StyledColorDisplay>
  )
}

export {ColorPicker}