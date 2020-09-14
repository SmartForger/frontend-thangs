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
      bottom: '1.5rem',
      background: theme.colors.purple[900],
      boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.2)',
      borderRadius: '.5rem',
      width: '91.5%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '2',
      position: 'fixed',
      height: ({ isOpen }) => (isOpen ? '4.5rem' : 0),
      transition: 'height 0.45s',
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

  return (
    <div className={classnames(c.Snackbar, c.Snackbar__mobileOnly)}>
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
