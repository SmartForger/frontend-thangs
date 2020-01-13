import React from 'react';
import styled from 'styled-components';


const TagStyled = styled.div`
  width: fit-content;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.secondary};
  margin: ${props => props.margin || '2px'};
  user-select: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: 0.2s all;

  &:hover{
    background: ${props => props.theme.secondary};
    color: ${props => props.theme.primary};
    transform: scale(1.05)
  }
`

const Tag = (props) => {
  const {name} = props;
  return(
  <TagStyled {...props}>
    {name}
  </TagStyled>)
}

export {Tag};