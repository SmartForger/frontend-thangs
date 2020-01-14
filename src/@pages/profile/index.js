import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useTrail} from 'react-spring';

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
  grid-area: header;
`

const SidebarStyled = styled.div`
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
  grid-area: models;
  display: flex;
  flex-flow: row wrap;
`

const Profile = () => {
  const {id} = useParams();
  const mockModels = [
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
   {attachmentName: 'Yourgoy'},
  ]

  const config = { mass: 6, tension: 2000, friction: 95, clamp: true }
  const [trail] = useTrail(mockModels.length,() => ({
    config,
    to: {transform: 'translate(0,0) scale(1)'},
    from: {transform: 'translate(1000%,0) scale(0.6)'}
  }))

  return(
    <ProfileStyle>
      <HeaderStyled />
      <SidebarStyled>
        <SocialStyled>
          <ProfilePicStyled />
          <Button name="Follow" margin="0 0 0 40px" maxWidth="150px" routeTo="/details/7574" />
        </SocialStyled>
      </SidebarStyled>
      <ModelsStyled>
        {trail.map((props, index) => <ModelDisplay style={props} width="185px" height="135px" name={mockModels[index].attachmentName} />)}
      </ModelsStyled>
    </ProfileStyle>
  )
}

export {Profile}