import React from 'react';
import styled from 'styled-components';
import {DisplayCard, Spinner} from '@components';

const HomeBodyStyle = styled.div`
  position: fixed;
  width: 85vw;
  height: 98vh;
  left: 50%;
  margin-left:-42.5vw;
  background: ${props => props.theme.primary};
  border-radius: 0 0 10px 10px;
`

const CardRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 40%;
  top: 57%;

`

const Home = () => {
  return(
    <HomeBodyStyle>
      <CardRow>
        <DisplayCard percentage="20" bodyContent="Most Viewed" fontSize="2" shadow size="300" />
        <DisplayCard percentage="20" bodyContent="View Designs" fontSize="2" shadow size="300" />
        <DisplayCard percentage="20" bodyContent="Community" fontSize="2" shadow size="300" />
        <DisplayCard percentage="20" bodyContent="News" fontSize="2" shadow size="300" />
      </CardRow>
    </HomeBodyStyle>
  )
}

export {Home};