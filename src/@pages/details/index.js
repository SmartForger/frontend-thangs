import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';


const StyledDetails = styled.div`
  display: grid;
  position: fixed;
  width: 85vw;
  height: 90vh;
  top: 10%;
  left: 50%;
  margin-left:-42.5vw;
  grid-template-columns: 85% 15%;
  grid-template-rows: 10% 75% 15%;
  grid-template-areas: 
  "header header"
  "viewer sidebar"
  "footer footer"
`

const StyledViewer = styled.div`
  display: flex;
  background: blue;
  grid-area: viewer;
`

const Details = (props) => {
const {id} = useParams();
  return(
    <StyledDetails>
      <StyledViewer />
    </StyledDetails>
  )
}

export {Details};
