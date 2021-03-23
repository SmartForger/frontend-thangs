import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => {
  return {
    Card: {
      display: 'flex',
      flexDirection: 'column',
      background: ({ backgroundColor }) =>
        backgroundColor || theme.variables.colors.cardBackground,
      border: `1px solid ${theme.colors.white[800]}`,
      borderRadius: '.5rem',
      height: ({ size }) => size || '14.75rem',
      width: ({ size }) => size || undefined,
    },
  }
})

const Card = ({ children, className, onClick, title, ...props }) => {
  const c = useStyles(props)
  return (
    <div className={classnames(className, c.Card)} onClick={onClick} title={title}>
      {children}
    </div>
  )
}

export default Card
