import React, { useCallback } from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Shelf: {
      position: 'absolute',
      background: theme.colors.grey,
      width: '17vw',
      right: '5vw',
      borderBottom: `2px solid ${theme.colors.darkgrey}`,
      transform: ({ open }) => (open ? 'translateY(-1vh)' : 'translateY(-90vh)'),
      transition: '0.5s all',
      zIndex: 9,
    },
    ShelfButton: {
      background: theme.colors.grey,
      width: '3rem',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',

      '& > div': {
        width: '1rem',
        height: '1rem',
        background: theme.colors.darkgrey,
        borderRadius: '50%',
        transition: 'all 0.3s linear',
      },
    },
  }
})

const Shelf = ({ open, children }) => {
  const c = useStyles({ open })
  return (
    <div className={c.Shelf} open={open}>
      {children}
    </div>
  )
}

const ShelfButton = ({ open, setOpen }) => {
  const c = useStyles({ open })
  return (
    <div
      className={c.ShelfButton}
      open={open}
      onClick={useCallback(() => setOpen(!open), [open, setOpen])}
    >
      <div />
      <div />
      <div />
    </div>
  )
}

export { Shelf, ShelfButton }
