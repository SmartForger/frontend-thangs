import React, { useEffect, useState } from 'react'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import { ReactComponent as SnackbarUploadIcon } from '@svg/snackbar-upload.svg'
import classnames from 'classnames'
import * as types from '../@constants/storeEventTypes'
import Button from './Button'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Snackbar: {
      display: 'flex',
      flexDirection: 'row',
      bottom: ({ isOpen }) => (isOpen ? '1.5rem' : '-5rem'),
      left: 'calc(50vw - 45.75%)',
      background: theme.colors.purple[900],
      boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.2)',
      borderRadius: '.5rem',
      width: '91.5%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '2',
      position: 'fixed',
      height: '4.5rem',
      transition: 'left 0.45s, bottom 0.45s',
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

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 500)
  }, [])

  const onTouchStart = event => {
    const { pageX } = event.touches[0]
    const starLeftPosition = (window.screen.width * 4.25) / 100
    const leftTouchPosition = pageX - starLeftPosition
    const snackbar = document.getElementById('snackbar')
    const onTouchMove = event => {
      const newLeftPosition = event.touches[0].pageX
      if (newLeftPosition < starLeftPosition) {
        snackbar.style.left = -leftTouchPosition + 'px'
      }
    }
    const onTouchEnd = () => {
      const currentLeftPosition = snackbar.style.left
      if (starLeftPosition - parseFloat(currentLeftPosition) >= 100) {
        snackbar.style.left = '-100vw'
      } else {
        snackbar.style.left = starLeftPosition + 'px'
      }
      document.removeEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
    }
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)
  }

  return (
    <div
      id='snackbar'
      onTouchStart={onTouchStart}
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
