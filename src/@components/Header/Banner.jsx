import React, { useEffect, useState } from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Banner: {},
    Banner_TopRow: {
      background: theme.colors.gold[500],
      height: ({ isOpen }) => (isOpen ? '2rem' : 0),
      transition: 'height 0.15s',
    },
    Banner_TopRowText: {
      fontWeight: 600,
      lineHeight: '1.5rem',
      textAlign: 'center',
      color: theme.colors.black[500],
      padding: '.25rem 0',
    },
  }
})

const Banner = props => {
  const [isOpen, setIsOpen] = useState(false)
  const c = useStyles({ isOpen })
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.Banner_TopRow}>
      <div className={c.Banner_TopRowText}>{props.children}</div>
    </div>
  )
}

export default Banner
