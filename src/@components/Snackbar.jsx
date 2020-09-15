import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import { ReactComponent as SnackbarUploadIcon } from '@svg/snackbar-upload.svg'
import classnames from 'classnames'
import * as types from '../@constants/storeEventTypes'
import Button from './Button'

const INIT_LEFT = 16
const SWIPE_START_LEFT = 80
const LEFT_TRANSITION = 'left 0.45s'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Snackbar: {
      display: 'flex',
      flexDirection: 'row',
      bottom: ({ isOpen }) => (isOpen ? '1.5rem' : '-5rem'),
      background: theme.colors.purple[900],
      boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.2)',
      borderRadius: '.5rem',
      zIndex: '2',
      position: 'absolute',
      width: '91.5%',
      height: '4.5rem',
      transition: 'bottom 0.45s',
    },
    Snackbar__mobileOnly: {
      [md]: {
        display: 'none',
      },
    },
    Snackbar_Link: {
      ...theme.mixins.text.snackbarLinkText,
    },
    Snackbar_Text: {
      margin: '.75rem 0 .75rem 1rem',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      letterSpacing: '-0.02em',
      color: theme.colors.white[100],
    },
    Snackbar_UploadIcon: {
      margin: '1.75rem 1rem 1.75rem 1.2rem',
    },
  }
})

const Snackbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const c = useStyles({ isOpen })
  const { dispatch } = useStoreon()
  const snackbarRef = useRef(null)
  const snackBarMoveData = useRef({ xStart: undefined })

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 500)
  }, [])

  const onTouchStart = event => {
    const { pageX: touchX } = event.touches[0]
    snackBarMoveData.current = {
      xStart: touchX,
    }
  }

  const onTouchMove = event => {
    const { pageX: touchX } = event.touches[0]
    const { xStart } = snackBarMoveData.current
    const nextLeft = touchX - xStart

    // Left swipe only:
    if (nextLeft < INIT_LEFT) {
      snackbarRef.current.style.left = `${nextLeft}px`
    }
  }

  const onTouchEnd = () => {
    if (parseFloat(snackbarRef.current.style.left) < -SWIPE_START_LEFT){
      snackbarRef.current.style.transition = LEFT_TRANSITION 
      snackbarRef.current.style.left = '-100vw'
    } else {
      snackbarRef.current.style.left = `${INIT_LEFT}px` 
    }
    snackBarMoveData.current = {}
  }

  return (
    <div
      ref={snackbarRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={classnames(c.Snackbar, c.Snackbar__mobileOnly)}
    >
      <div className={c.Snackbar_Text}>
        <Button
          text
          inline
          onClick={e => {
            e.preventDefault()
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'searchByUpload',
            })
          }}
        >
          <span className={c.Snackbar_Link}>Upload</span>
        </Button>{' '}
        your model to find ones with related geometry.
      </div>
      <div className={classnames(c.Snackbar_UploadIcon)}>
        <SnackbarUploadIcon />
      </div>
    </div>
  )
}

export default Snackbar
