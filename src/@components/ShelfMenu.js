import React from 'react';
import styled from 'styled-components';

const ButtonStyle = styled.div`
  background: ${props => props.theme.grey};
  width: 50px;
  height: 100%;
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;

  & > div {
    width: 1rem;
    height: 1rem;
    background: ${props => props.theme.darkgrey};
    border-radius: 50%;
    transition: all 0.3s linear;
    
`

const ShelfStyle = styled.div`
  position: absolute;
  background: ${props => props.theme.grey};
  width: 17vw;
  height: 90vh;
  right: 7.5vw;
  border-bottom: 2px solid ${props => props.theme.darkgrey};
  transform: ${props => props.open ? 'translateY(-1vh)' : 'translateY(-80vh)'};
  transition: 0.5s all;
  z-index: 9;
`

const Shelf = ({open, children}) => {
  return(
    <ShelfStyle open={open}>
      {children}
    </ShelfStyle>
  )
}

const ShelfButton = ({open,setOpen}) => {
  return (
    <ButtonStyle open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </ButtonStyle>
  )
}

export {Shelf, ShelfButton};