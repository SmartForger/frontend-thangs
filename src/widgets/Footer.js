import React from 'react';
import styled from 'styled-components';

const FooterStyle = styled.div`
  width: 25vw;
  height: 5vh;
  left: 50%;
  margin-left:-12.5vw;
  position: fixed;
  bottom: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1;
  Text-align: center;
`
const Footer = ({children}) => {
  return (
    <FooterStyle>
      {children}
    </FooterStyle>
  )
}

export {Footer};