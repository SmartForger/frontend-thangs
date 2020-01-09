import React from 'react';
import styled from 'styled-components';
import {Button} from '@components';

const BoxStyle = styled.div`
  width: ${props => props.width || '400px'};
  height: ${props => props.height || '400px'};
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  background: ${props => props.theme.white};
`

const TagsBox = (props) => {
  const {data} = props;
  return(
    <BoxStyle {...props}>
      {data.map((i,index) => <Button key={index} maxWidth="25%" height="25px" name={i.name} />)}
    </BoxStyle>
  )
}

export {TagsBox}
