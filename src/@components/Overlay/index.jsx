import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import OverlayPortal from './OverlayPortal'

export * from './OverlayContext'

const useStyles = createUseStyles(_theme => {
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
      transition: 'all 450ms',
      opacity: '0',
      overflowY: 'scroll',
    },
    Overlay__shake: {
      animation: '$shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
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
  smallWidth = false,
  ...props
}) => {
  const c = useStyles({ windowed, animateIn, showPromo, isHidden, dialogue, smallWidth })
  return (
    <OverlayPortal
      className={classnames(className, c.Overlay, {
        [c.Overlay__shake]: shake,
      })}
      {...props}
    />
  )
}
