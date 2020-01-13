import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';

import {Button, ModelDisplay} from '@components';

const ProfileStyle = styled.div`
  display: grid;
  position: fixed;
  width: 88vw;
  height: 90vh;
  top: 8%;
  left: 50%;
  margin-left:-44vw;
  grid-template-rows: 5% 30% 65%;
  grid-template-columns: 30% 70%;
  grid-template-areas:
  ". ."
  "header header"
  "sidebar models"
`

const HeaderStyled = styled.div`
  background: blue;
  grid-area: header;
`

const SidebarStyled = styled.div`
  background: rebeccapurple;
  grid-area: sidebar;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
`

const SocialStyled = styled.div`
  width: 600px;
  height: 300px;  
  display: flex;
  flex-flow: row nowrap;
  align-items: center;  
  margin-top: -40%;
  z-index: 1;
  pointer-events: none;

  > * {
    pointer-events: all;
  }
`

const ProfilePicStyled = styled.div`
  background: grey;
  border-radius: 50%;
  height: 250px;
  width: 250px;
  margin-left: 75px;
`

const ModelsStyled = styled.div`
  background: orange;
  grid-area: models;
  display: flex;
  flex-flow: row wrap;
`

const Profile = () => {
  const {id} = useParams();
  const mockModels = [
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
    'GGsdg',
  ]
  return(
    <ProfileStyle>
      <HeaderStyled />
      <SidebarStyled>
        <SocialStyled>
          <ProfilePicStyled />
          <Button name="Follow" margin="0 0 0 40px" maxWidth="150px" />
        </SocialStyled>
      </SidebarStyled>
      <ModelsStyled>
        {mockModels.map((i) => <ModelDisplay width="185px" height="135px" name={i} />)}
      </ModelsStyled>
    </ProfileStyle>
  )
}

export {Profile}