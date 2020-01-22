import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useTrail} from 'react-spring';
import {BasicPageStyle} from '@style'
import {Button, TagsBox, Viewer} from '@components';


const StyledDetails = styled(BasicPageStyle)`
  display: grid;
  position: fixed;
  grid-template-columns: 85% 15%;
  grid-template-rows: 10% 75% 15%;
  grid-template-areas: 
  "header  header"
  "viewer  sidebar"
  "footer  footer"
`
const StyledInfo = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  width: 12vw;
  height: 13vw;
  background: white;
  z-index: 1;
  top: 13%;
  right: 16.5%;
  box-shadow: inset 0 0 0 3px black;

  > div {
    margin-left: 1vw;
  }
`

const StyledInteractions = styled.div`
  position: absolute;
  display: flex;
  width: 12vw;
  height: 7vw;
  bottom: 17%;
  right: 16%;
  background: white;
  box-shadow: inset 0 0 0 3px black;
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
  grid-area: viewer;
  pointer-events: none;

  > div {
    pointer-events: all;
  }
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

const StyledInteractionButton = styled.div`
  background: white;
  box-shadow: inset 0 0 0 3px black;
  width: 5vh;
  height: 5vh;
`

// const InteractionDisplay = () 

const Details = () => {
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
      <StyledViewer>
        <StyledInfo>
          <div>Material: <strong>MAT</strong></div>
          <div>Height: <strong>MAT</strong></div>
          <div>Length: <strong>MAT</strong></div>
          <div>Width: <strong>MAT</strong></div>
          <div>Weight: <strong>MAT</strong></div>
          <div>ANSI Compliant: <strong>MAT</strong></div>
        </StyledInfo>
        <StyledInteractions />
        <Viewer url="http://127.0.0.1:8000/model" style={{"grid-area":"viewer"}} />
      </StyledViewer>
      <StyledMenu>
        {trail.map((props, index) => {
          return <Button key={names[index]} name={names[index]} style={props} maxwidth="90%" height="10%" fontSize="2rem"/>
        })}
        <StyledTags>
          <TagsBox width="100%" height="100%" data={tags} />
        </StyledTags> 
      </StyledMenu>
    </StyledDetails>
  )
}

export {Details};
