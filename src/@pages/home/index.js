import React from 'react';
import styled from 'styled-components';
import {DisplayCard, Spinner, Slides} from '@components';

const HomeBodyStyle = styled.div`
  position: fixed;
  width: 85vw;
  height: 98vh;
  left: 50%;
  margin-left:-42.5vw;
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

  const fakeData = [
    {
      title: "eyy man",
      description: "yooo dude",
      icon: "Woops"
    },
    {
      title: "eyy man",
      description: "yooo dude",
      icon: "Woops"
    },
    {
      title: "eyy man",
      description: "yooo dude",
      icon: "Woops"
    }
  ]
  return(
    <HomeBodyStyle>
      <CardRow>
        <DisplayCard percentage="10" headerContent="Most Viewed" fontSize="2" shadow size="300">
          <Slides data={fakeData} />
        </DisplayCard>
        <DisplayCard percentage="20" headerContent="View Designs" fontSize="2" shadow size="300" />
        <DisplayCard percentage="20" headerContent="Community" fontSize="2" shadow size="300" />
        <DisplayCard percentage="20" headerContent="News" fontSize="2" shadow size="300" />
      </CardRow>
    </HomeBodyStyle>
  )
}

export {Home};