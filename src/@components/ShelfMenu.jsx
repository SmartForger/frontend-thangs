import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Shelf: {
      position: 'absolute',
      background: theme.color.grey,
      width: '17vw',
      right: '5vw',
      borderBottom: `2px solid ${theme.color.darkgrey}`,
      transform: ({ open }) => (open ? 'translateY(-1vh)' : 'translateY(-90vh)'),
      transition: '0.5s all',
      zIndex: 9,
    },
    ShelfButton: {
      background: theme.color.grey,
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
        background: theme.color.darkgrey,
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
    <div className={c.ShelfButton} open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </div>
  )
}

export { Shelf, ShelfButton }
