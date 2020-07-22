import React from 'react'
import { animated } from 'react-spring'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Tag: {
      width: 'fit-content',
      background: theme.colors.grey[500],
      color: theme.color.secondary,
      margin: '2px',
      padding: '4px',
      userSelect: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: '0.2s all',

      '&:hover': {
        background: theme.color.secondary,
        color: theme.color.secondary,
        transform: 'scale(1.05)',
      },
    },
  }
})

const Tag = ({ children }) => {
  const c = useStyles()
  return <animated.div className={c.Tag}>{children}</animated.div>
}

export { Tag }
