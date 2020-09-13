import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Metadata: {
      ...theme.text.metadataBase,
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      color: theme.colors.grey[300],
    },
    MetadataPrimary: {
      fontSize: '1rem',
      lineHeight: '1rem',
    },
    MetadataSecondary: {
      fontSize: '.75rem',
      lineHeight: '.75rem',
    },
  }
})

export const MetadataPrimary = ({ children, className }) => {
  const c = useStyles()
  return (
    <span className={classnames(className, c.Metadata, c.MetadataPrimary)}>
      {children}
    </span>
  )
}

export const MetadataSecondary = ({ children, className }) => {
  const c = useStyles()
  return (
    <span className={classnames(className, c.Metadata, c.MetadataSecondary)}>
      {children}
    </span>
  )
}
