import React from 'react';
import styled from 'styled-components';

const SlidesContainerStyle = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

const SlideStyle = styled.div`
  width: 100%;
  height: ${props => props.slideHeight || 30}%;
`

const SlideIconStyle = styled.div`

`

const SlideTitleStyle = styled.div`

`

const SlideDescriptionStyle = styled.div`

`

const SlidesFooterStyle = styled.div`

`



const Slides = (props) => {
  const {data,icon,title,description,footerContent} = props;
  const slideAmount = props.data.length || 3;
  const slideHeight = 90/slideAmount;

  return (
  <SlidesContainerStyle>
    {props.data ? 
    data.forEach(i => {
      <SlideStyle slideHeight={slideHeight}>
        <SlideIconStyle image={icon}/>
        <SlideTitleStyle>
          {title}
        </SlideTitleStyle>
        <SlideDescriptionStyle>
          {description}
        </SlideDescriptionStyle>
        
      </SlideStyle>
    }): null}
    <SlidesFooterStyle>
      {footerContent}
    </SlidesFooterStyle>
  </SlidesContainerStyle>)

}