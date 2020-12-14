import React, { useEffect, useState, useRef } from 'react'
import ReactModal from 'react-modal'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import * as types from '@constants/storeEventTypes'

ReactModal.setAppElement('#root')

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
      height: '100%',
      width: '100%',
      backgroundColor: theme.colors.white[300],
      overflow: 'auto',

      [md]: {
        height: 'auto',
        width: ({ dialogue }) => (dialogue ? 'unset' : '90%'),
        maxWidth: ({ windowed, showPromo }) =>
          showPromo && windowed ? '45.75rem' : '28.75rem',
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
  }
})
const noop = () => null
const Overlay = ({
  children,
  className,
  onOverlayClose = noop,
  windowed = false,
  animateIn = false,
  showPromo = false,
  shake = false,
  isHidden,
  dialogue,
  scrollTop = true,
  ...props
}) => {
  const overlayRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const { dispatch } = useStoreon()
  // useExternalClick(overlayRef, () => dispatch(types.CLOSE_OVERLAY))
  const c = useStyles({ windowed, animateIn, showPromo, isHidden, dialogue })
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
    <ReactModal
      className={classnames(className, c.Overlay, { [c.Overlay__shake]: shake })}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: windowed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
        },
      }}
      {...props}
    >
      <div
        className={c.Overlay_CloseButton}
        onClick={() => {
          onOverlayClose()
          dispatch(types.CLOSE_OVERLAY)
        }}
      >
        {!windowed && <ExitIcon />}
      </div>
      <div
        className={classnames(c.Overlay_Content, {
          [c.Overlay_Content__visible]: isVisible,
        })}
        ref={overlayRef}
      >
        {children}
      </div>
    </ReactModal>
  )
}

export default Overlay
