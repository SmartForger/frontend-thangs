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
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: 50% 50%;
  grid-template-areas:
  "icon title"
  "icon description" 
`

const SlideIconStyle = styled.img`
  border-radius: ${props => props.rounded ? 50 : 0}%;
  box-shadow: inset 0 0 0 2px black;
  background: green;
  grid-area: icon;
  justify-self: center;
  align-self: center;
  width: 75px;
  height: 75px;
`

const SlideTitleStyle = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  background: red;
  grid-area: title;
  align-self: end;
`

const SlideDescriptionStyle = styled.div`
  font-weight: 100;
  font-size: 0.75rem;
  background: blue;
  grid-area: description;
`

const SlidesFooterStyle = styled.div`

`


const Slide = (props) => {
  const {height, title, description, icon, rounded} = props

  return (
    <SlideStyle slideHeight={height}>
        <SlideIconStyle src={icon} rounded={rounded} alt="an icon" size={height/2}/>
        <SlideTitleStyle>
          {title}
        </SlideTitleStyle>
        <SlideDescriptionStyle>
          {description}
        </SlideDescriptionStyle>
      </SlideStyle>
  )
}


const Slides = (props) => {
  const {data,footerContent,rounded} = props;
  const slideAmount = props.data.length || 3;
  const slideHeight = 90/slideAmount;

  return (
  <SlidesContainerStyle>
    {data ? 
    data.map(i => (
      <Slide 
        height={slideHeight} 
        title={i.title} 
        description={i.description} 
        icon={i.icon} 
        rounded={rounded}
      />
    )): null}
    <SlidesFooterStyle>
      {footerContent}
    </SlidesFooterStyle>
  </SlidesContainerStyle>)

}

export {Slides};