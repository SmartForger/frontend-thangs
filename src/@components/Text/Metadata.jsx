import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
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
      margin: '0 1rem',

      [md]: {
        margin: 'unset',
      },
    },
    MetadataSecondary: {
      fontSize: '.75rem',
      lineHeight: '1rem',
      display: 'inline-block',
      textAlign: 'center',
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

export const MetadataSecondary = ({ children, className, ...props }) => {
  const c = useStyles()
  return (
    <span className={classnames(className, c.Metadata, c.MetadataSecondary)} {...props}>
      {children}
    </span>
  )
}
