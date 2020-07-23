import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Card: {
      display: 'flex',
      flexDirection: 'column',
      background: theme.colors.cardBackground,
      boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
      borderRadius: '.5rem',
      height: '100%',
    },
  }
})

export const Card = props => {
  const c = useStyles(props)
  return <div className={c.Card}></div>
}
