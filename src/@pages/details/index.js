import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';


const StyledDetails = styled.div`
  display: flex;
  position: fixed;
  width: 90vw;
  height: 100vh;
  left: 50%;
  margin-left:-45vw;
  justify-content: center;
  align-items: center;
`

const Details = (props) => {
const {id} = useParams();
  return(
    <StyledDetails>
      <h1>{id}</h1>
    </StyledDetails>
  )
}

export {Details};