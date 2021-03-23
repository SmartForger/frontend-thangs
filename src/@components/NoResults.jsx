import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    NoResults: {
      ...theme.text.zeroStateText,
      backgroundColor: theme.colors.white[800],
      padding: '1rem',
      borderRadius: '.5rem',
      width: '100%',
      boxSizing: 'border-box',
      lineHeight: '1.125rem',
    },
  }
})

const NoResults = ({ children, className }) => {
  const c = useStyles()
  return <div className={classnames(className, c.NoResults)}>{children}</div>
}

export default NoResults
