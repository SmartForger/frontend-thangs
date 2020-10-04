import React, { useEffect, useState, useRef } from 'react'
import { Spacer, TitleTertiary, MultiLineBodyText } from '@components'
import { createUseStyles } from '@style'
import loader from '@media/loader.gif'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    LandingCard: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '4.75rem',
      position: 'relative',
    },
    LandingCard_HoverVideo: {
      position: 'absolute',
      bottom: '3rem',
      left: '50%',
      marginLeft: '-200px',
      overflow: 'hidden',
      boxShadow: '0px 8px 20px rgba(0,0,0,0.6)',
      borderRadius: '1rem',
      padding: '.5rem .5rem .25rem .5rem',
      backgroundColor: theme.colors.white[400],
      zIndex: 1,
      opacity: 0,
      transition: 'all 450ms',

      '& video': {
        width: '360px',
        borderRadius: '.5rem',
      },
    },
    LandingCard_HoverVideo__visible: {
      opacity: '1 !important',
      bottom: '6rem !important',
    },
    LandingCard_Text: {
      width: '15.125rem',

      '& h3': {
        color: theme.colors.gold[500],
      },

      '& span': {
        color: theme.colors.white[400],
      },
    },
    LandingCard_Link: {
      textDecoration: 'underline',
      display: 'inline',
      cursor: 'pointer',
    },
  }
})
const noop = () => null
const HoverVideo = ({ c, video, showVideo }) => {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(showVideo)
      if (videoRef.current) videoRef.current.currentTime = 0
    }, 0)
  }, [showVideo])

  return (
    <div
      className={classnames(c.LandingCard_HoverVideo, {
        [c.LandingCard_HoverVideo__visible]: isVisible,
      })}
    >
      <video
        ref={videoRef}
        preload='none'
        autoPlay
        loop
        muted
        playsInline
        poster={loader}
        width={'360px'}
        height={'244px'}
      >
        <source src={video} type='video/mp4' />
      </video>
    </div>
  )
}

const LandingCard = ({ card = {} }) => {
  const { IconComponent, title, linkText, text, callback = noop, hoverVideo } = card
  const c = useStyles({})
  const [showVideo, setShowVideo] = useState(false)

  const handleMouseEnter = () => setShowVideo(true)
  const handleMouseLeave = () => setShowVideo(false)

  return (
    <>
      <Spacer size={'1rem'} />
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={c.LandingCard}
      >
        <Spacer size={'1rem'} />
        <IconComponent />
        <Spacer size={'1rem'} />
        <div className={c.LandingCard_Text}>
          <TitleTertiary>{title}</TitleTertiary>
          <Spacer size={'.5rem'} />
          <MultiLineBodyText>
            <div className={c.LandingCard_Link} onClick={callback}>
              {linkText}
            </div>{' '}
            {text}
          </MultiLineBodyText>
        </div>
        <Spacer size={'1rem'} />
        {hoverVideo && <HoverVideo c={c} video={hoverVideo} showVideo={showVideo} />}
      </div>
    </>
  )
}

export default LandingCard
