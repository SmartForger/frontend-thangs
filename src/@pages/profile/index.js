import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';

import {Button} from '@components';

const ProfileStyle = styled.div`
  display: grid;
  position: fixed;
  width: 88vw;
  height: 90vh;
  top: 10%;
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
`

const Profile = () => {
  const {id} = useParams();
  return(
    <ProfileStyle>
      <HeaderStyled />
      <SidebarStyled>
        <SocialStyled>
          <ProfilePicStyled />
          <Button name="Follow" margin="0 0 0 40px" maxWidth="150px" />
        </SocialStyled>
      </SidebarStyled>
      <ModelsStyled />
    </ProfileStyle>
  )
}

export {Profile}