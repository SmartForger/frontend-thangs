import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useTransition, useTrail} from 'react-spring';

import {Button, TagsBox} from '@components'


const StyledDetails = styled.div`
  width: ${props => props.theme.pageWidth};
  height: ${props => props.theme.pageHeight};
  top: ${props => props.theme.pageTop};
  left: ${props => props.theme.pageLeft};
  margin-left: ${props => props.theme.pageMarginLeft};
  display: grid;
  position: fixed;
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
  {name: 'Grimgooorsh'},
  {name: 'AB'},
  {name: 'Longish'},
  {name: 'Real long Tag'},
  {name: 'Screw'},
  {name: 'Bolt'},
  {name: 'Automotive'},
  {name: 'Clasp'},
  {name: 'Physna'},
  {name: 'Thangs.com'},
  {name: 'Boat'},
  {name: 'Trucks'},
  {name: 'Civil Engineering'},
  {name: '3D Printing'},
  {name: 'Yormy'},
]

 const names = [
 'Download',
 'Share',
  'Match',
 'Identify'
 ]

 const config = { mass: 5, tension: 2000, friction: 200 }
 const trail= useTrail(names.length,{
   config,
   to: {opacity: 1, transform: 'translate(0,0)'},
   from: {opacity: -2, transform: 'translate(300%,0)'}
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
        {trail.map((props, index) => {
          return <Button key={names[index]} name={names[index]} style={props} maxWidth="90%" height="10%" fontSize="2rem"/>
        })}
        <StyledTags>
          <TagsBox width="100%" height="100%" data={tags} />
        </StyledTags> 
      </StyledMenu>
    </StyledDetails>
  )
}

export {Details};
