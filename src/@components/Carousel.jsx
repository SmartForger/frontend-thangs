import React, { useCallback, useState } from 'react'
import LandingCard from '@components/LandingCard'
import Spacer from '@components/Spacer'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import loader from '@media/loader.gif'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { lg },
  } = theme
  return {
    Carousel_Wrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    Carousel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'left',
      alignItems: 'center',

      [lg]: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: '2.25rem',
      },
    },
    Carousel_CardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: 'rgba(0,0,0,.1)',
        [lg]: {
          backgroundColor: 'transparent',
          cursor: 'inherit',
        },
      },
    },
    Carousel_CardWrapper__selected: {
      borderRadius: '.5rem',
      backgroundColor: 'rgba(0,0,0,.19)',

      [lg]: {
        backgroundColor: 'transparent',
      },
    },
    Carousel_HoverVideo: {
      padding: '.5rem .5rem .25rem .5rem',
      backgroundColor: theme.colors.white[400],
      borderRadius: '1rem',
      height: '15.5rem',
      display: 'none',
      maxWidth: '20rem',
      maxHeight: '14rem',
      '& video': {
        borderRadius: '.5rem',
      },

      [lg]: {
        display: 'none',
      },
    },
    Carousel_HoverVideo__selected: {
      display: 'block',
      [lg]: {
        display: 'none',
      },
    },
  }
})

const Carousel = ({ className, cards = [] }) => {
  const c = useStyles({})
  const [video, setShowVideo] = useState(cards[0].hoverVideo)
  const [selected, setSelected] = useState(cards[0].title)
  const handleClick = useCallback(({ title, videoSrc }) => {
    setSelected(title)
    setShowVideo(videoSrc)
  }, [])

  return (
    <>
      <div className={classnames(className, c.Carousel_Wrapper)}>
        <ul className={classnames(c.Carousel)}>
          {cards.map((card, ind) => {
            return (
              <li
                className={classnames(c.Carousel_CardWrapper, {
                  [c.Carousel_CardWrapper__selected]: selected === card.title,
                })}
                key={`CarouselCard_${ind}`}
              >
                <LandingCard card={card} handleClick={handleClick} />
              </li>
            )
          })}
        </ul>
        <Spacer size='1rem' />
        {cards.map((card, ind) => {
          return (
            <div
              key={`CarouselVideo_${ind}`}
              className={classnames(c.Carousel_HoverVideo, {
                [c.Carousel_HoverVideo__selected]: selected === card.title,
              })}
            >
              {selected === card.title && (
                <video
                  preload='none'
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={loader}
                  width={'100%'}
                  height={'100%'}
                >
                  <source src={card.hoverVideo} type='video/mp4' />
                </video>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Carousel
