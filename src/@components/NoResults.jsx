import React from 'react'
import { zeroStateText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    NoResults: {
      ...zeroStateText,
      backgroundColor: theme.variables.colors.zeroStateBackground,
      padding: '1rem',
      borderRadius: '.5rem',
      width: '100%',
      boxSizing: 'border-box',
    },
  }
})

export const NoResults = _props => {
  const c = useStyles()
  return <div className={c.NoResults}></div>
}
