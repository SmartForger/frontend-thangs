import React, {useState} from 'react';
import styled from 'styled-components';
import {DisplayCard} from '../../widgets';

const HomeBodyStyle = styled.div`
  position: fixed;
  width: 85vw;
  height: 98vh;
  left: 50%;
  margin-left:-42.5vw;
  background: ${props => props.theme.primary};
`

const CardRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 40%;
  top: 60%;

`

const Home = () => {
  return(
    <HomeBodyStyle>
      <CardRow>
        <DisplayCard percentage="100" shadow size="250" />
        <DisplayCard percentage="100" shadow size="250" />
        <DisplayCard percentage="100" shadow size="250" />
        <DisplayCard percentage="100" shadow size="250" />
      </CardRow>
    </HomeBodyStyle>
  )
}

export {Home};