import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Card: {
      display: 'flex',
      flexDirection: 'column',
      background: theme.variables.colors.cardBackground,
      boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
      borderRadius: '.5rem',
      height: '100%',
    },
  }
})

const Card = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <div className={classnames(className, c.Card)}>{children}</div>
}

export default Card
