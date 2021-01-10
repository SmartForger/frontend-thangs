import React, { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useOverlay } from '@hooks'
import OverlayPortal from './OverlayPortal'

export * from './OverlayContext'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    '@keyframes shake': {
      '10%, 90%': {
        transform: 'translate3d(-1px, 0, 0)',
      },
      '20%, 80%': {
        transform: 'translate3d(2px, 0, 0)',
      },
      '30%, 50%, 70%': {
        transform: 'translate3d(-4px, 0, 0)',
      },
      '40%, 60%': {
        transform: 'translate3d(4px, 0, 0)',
      },
    },
    Overlay: {
      position: 'relative',
      overflowY: 'hidden scroll',
      overflowX: 'hidden',
      outline: 'none',
      width: '100%',
      height: '100%',
      display: ({ isHidden }) => (isHidden ? 'none' : 'flex'),
      alignItems: 'center',
    },
    Overlay_CloseButton: {
      position: 'absolute',
      right: '3rem',
      top: '3rem',
      cursor: 'pointer',
      zIndex: 2,
    },
    Overlay_Content: {
      ...theme.mixins.scrollbar,
      height: '100%',
      width: '100%',
      backgroundColor: theme.colors.white[300],
      overflow: 'visible',

      [md]: {
        height: 'auto',
        width: ({ dialogue }) => (dialogue ? 'unset' : '90%'),
        maxWidth: ({ windowed, showPromo, smallWidth }) =>
          smallWidth ? '22.875rem' : showPromo && windowed ? '45.75rem' : '32rem',
        paddingTop: '2rem',
        margin: '0 auto',
        transition: 'all 450ms',
        opacity: ({ animateIn }) => (animateIn ? 0 : 1),
        top: ({ animateIn }) => (animateIn ? '30px' : 0),
        backgroundColor: 'unset',
      },
    },
    Overlay_Content__visible: {
      opacity: '1 !important',
      top: '0 !important',
    },
    Overlay__shake: {
      animation: '$shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
    },
    Overlay_blur: {
      filter: 'blur(4px)',
      OFilter: 'blur(4px)',
      MsFilter: 'blur(4px)',
      MozFilter: 'blur(4px)',
      WebkitFilter: 'blur(4px)',
    },
  }
})
export const Overlay = ({
  className,
  windowed = false,
  animateIn = false,
  showPromo = false,
  shake = false,
  isHidden,
  dialogue,
  scrollTop = true,
  smallWidth = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const c = useStyles({ windowed, animateIn, showPromo, isHidden, dialogue, smallWidth })
  useEffect(() => {
    if (scrollTop) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
    setTimeout(() => {
      setIsVisible(true)
    }, 0)
  }, [scrollTop])

  return (
    <OverlayPortal
      className={classnames(className, c.Overlay, {
        [c.Overlay__shake]: shake,
      })}
      {...props}
    />
  )
}
