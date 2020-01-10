import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useTransition, useTrail} from 'react-spring';

import {Button, TagsBox} from '@components'


const StyledDetails = styled.div`
  display: grid;
  position: fixed;
  width: 88vw;
  height: 90vh;
  top: 10%;
  left: 50%;
  margin-left:-44vw;
  grid-template-columns: 85% 15%;
  grid-template-rows: 10% 75% 15%;
  grid-template-areas: 
  "header  header"
  "viewer  sidebar"
  "footer  footer"
`

const StyledHeader = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 0 0 8%;

  > h1,h3 {
    margin: 0 30px;
  }
`

const Vl = styled.div`
  height: 85%;
  border-left: 2px solid ${props => props.theme.black};
`

const StyledViewer = styled.div`
  display: flex;
  box-shadow: inset 0 0 0 5px black;
  background: ${props => props.theme.primary};
  grid-area: viewer;
`

const StyledMenu = styled.div`
  display: flex;
  flex-flow: column nowrap;
  grid-area: sidebar;
  padding: 5%;
  justify-content: flex-start;
  align-items: center;
`

const StyledTags = styled.div`
  background: green;
  width: 90%;
  height: 50%;
  margin-top: 5%;
`

const Details = (props) => {
const {id} = useParams();

const tags = [
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
  {name: 'Yormy'},
]

 const names = [
   {name:'Download'},
   {name: 'Share'},
   {name: 'Match'},
   {name: 'Identify'}
 ]


const transitions = useTransition(names, name => name.name, {
  from: {transform: 'translate(0,-500px)', opacity: 0},
  enter: {transform: 'translate(0,0)', opacity: 1},
  leave: {transform: 'translate(0,-500px)', opacity: 0},
})
  return(
    <StyledDetails>
      <StyledHeader>
        <h1>Model Name</h1>
        <Vl />
        <h3>Uploaded by</h3>
      </StyledHeader>
      <StyledViewer />
      <StyledMenu>
        {transitions.map(({name, props, key}) =>
        <Button key={key} style={props} name={names[key].name} maxWidth="90%" height="10%" fontSize="2rem"/>)}
        {/* <Button name="Download" maxWidth="90%" height="10%" fontSize="2rem"/>
        <Button name="Share" maxWidth="90%" height="10%" fontSize="2rem"/>
        <Button name="Match" maxWidth="90%" height="10%" fontSize="2rem"/>
        <Button name="Identify" maxWidth="90%" height="10%" fontSize="2rem"/> */}
        <StyledTags>
          <TagsBox width="100%" height="100%" data={tags} />
        </StyledTags> 
      </StyledMenu>
    </StyledDetails>
  )
}

export {Details};
