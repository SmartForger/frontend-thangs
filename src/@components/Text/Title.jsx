import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  return {
    Title: {
      ...theme.text.titleBase,
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      color: ({ light }) => (light ? theme.colors.white[100] : theme.colors.black[500]),
    },
    TitlePrimary: {
      fontSize: '4rem',
      lineHeight: '5.25rem',
    },
    TitleSecondary: {
      fontSize: '2.25rem',
      lineHeight: '2.25rem',
    },
    TitleTertiary: {
      fontSize: '1.125rem',
      lineHeight: '.75rem',
    },
    TitleQuaternary: {
      fontSize: '.875rem',
      fontWeight: '500',
      lineHeight: '.625rem',
    },
  }
})

export const TitlePrimary = ({ children, className, light, title }) => {
  const c = useStyles({ light })
  return (
    <h1 className={classnames(className, c.Title, c.TitlePrimary)} title={title}>
      {children}
    </h1>
  )
}

export const TitleSecondary = ({ children, className, light, title }) => {
  const c = useStyles({ light })
  return (
    <h2 className={classnames(className, c.Title, c.TitleSecondary)} title={title}>
      {children}
    </h2>
  )
}

export const TitleTertiary = ({ children, className, light, title }) => {
  const c = useStyles({ light })
  return (
    <h3 className={classnames(className, c.Title, c.TitleTertiary)} title={title}>
      {children}
    </h3>
  )
}

export const TitleQuaternary = ({ children, className, light, title }) => {
  const c = useStyles({ light })
  return (
    <h4 className={classnames(className, c.Title, c.TitleQuaternary)} title={title}>
      {children}
    </h4>
  )
}
