import React from 'react';
import styled from 'styled-components';

const TextInputStyled = styled.input`
  width: 20%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1.5rem;
`

const TextInput = (props) => {
  return(
    <TextInputStyled {...props}/>
  )
}

export {TextInput};