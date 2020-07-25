import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    NoResults: {
      ...theme.mixins.text.zeroStateText,
      backgroundColor: theme.variables.colors.zeroStateBackground,
      padding: '1rem',
      borderRadius: '.5rem',
      width: '100%',
      boxSizing: 'border-box',
      lineHeight: '1.125rem',
    },
  }
})

export const NoResults = ({ children }) => {
  const c = useStyles()
  return <div className={c.NoResults}>{children}</div>
}
