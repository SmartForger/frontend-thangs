import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Card: {
      display: 'flex',
      flexDirection: 'column',
      background: theme.variables.colors.cardBackground,
      border: `1px solid ${theme.colors.white[700]}`,
      borderRadius: '.5rem',
      height: '14.75rem',
    },
  }
})

const Card = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <div className={classnames(className, c.Card)}>{children}</div>
}

export default Card
