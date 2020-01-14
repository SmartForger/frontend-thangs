import React from 'react';
import styled from 'styled-components';
import {DisplayCard, Spinner, Slides, ModelDisplay} from '@components';

const HomeBodyStyle = styled.div`
  position: fixed;
  width: ${props => props.theme.pageWidth};
  height: ${props => props.theme.pageHeight};
  top: ${props => props.theme.pageTop};
  left: ${props => props.theme.pageLeft};
  margin-left: ${props => props.theme.pageMarginLeft};
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
  top: 47%;
`


const Home = () => {

  const modelData = [
    {
      title: "Fancy Screw",
      owner: "CarlCPhysna",
      icon: "Woops"
    },
    {
      title: "Engine Block",
      owner: "ColinCPhysna",
      icon: "Woops"
    },
    {
      title: "Cool Chair",
      owner: "Info@physna.com",
      icon: "Woops"
    }
  ]

  const userData = [
    {
      title: "CarlCPhysna",
      owner: ""
    },
    {
      title: "ColinCPhysna",
      owner: ""
    },
    {
      title: "Info@physna.com",
      owner: ""
    }
  ]

  const newsData = [
    {
      title: "Big news whoa",
      owner: "lorem ipsum lorem ipsum"
    },
    {
      title: "More news? thank you!",
      owner: "lorem ipsum lorem ipsum"
    },
    {
      title: "No news",
      owner: "lorem ipsum lorem ipsum"
    }
  ]
  return(
    <HomeBodyStyle>
      <CardRow>
        <DisplayCard percentage="10" headerContent="Most Viewed" fontSize="2" shadow size="300">
          <Slides data={modelData} prefix="Uploaded By"/>
        </DisplayCard>
        <DisplayCard percentage="10" headerContent="View Designs" fontSize="2" shadow size="300">
          <Slides data={modelData} prefix="Uploaded By" />
        </DisplayCard>
        <DisplayCard percentage="10" headerContent="Community" fontSize="2" shadow size="300">
          <Slides data={userData}  prefix="a user you could connect with" rounded/>
        </DisplayCard>
        <DisplayCard percentage="10" headerContent="News" fontSize="2" shadow size="300">
          <Slides data={newsData}  text/>
        </DisplayCard>
      </CardRow>
    </HomeBodyStyle>
  )
}

export {Home};