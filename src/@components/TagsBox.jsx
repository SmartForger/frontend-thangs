import React from 'react';
import styled from 'styled-components';
import {useTrail} from 'react-spring';
import {Tag} from '@components';

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

  const config = { mass: 4, tension: 2000, friction: 95 }
  const [trail, set]= useTrail(data.length,() => ({
   config,
   to: {opacity: 1, transform: 'translate(0,0)'},
   from: {opacity: 0, transform: 'translate(0,1000%)'}
 }))

 const Bounce = () => {
   set({transform:'translate(0,100%)' })
 }
  return(
    <BoxStyle {...props}>
    {/* <button onClick={Bounce}>Bounce</button> */}
      {trail.map((props,index) => <Tag key={index} name={data[index].name} style={props} />)}
    </BoxStyle>
  )
}

export {TagsBox}
