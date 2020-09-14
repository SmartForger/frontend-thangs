import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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
      lineHeight: '4rem',
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
      fontWeight: 500,
      lineHeight: '.625rem',
    },
  }
})

export const TitlePrimary = ({ children, className, light }) => {
  const c = useStyles({ light })
  return <h1 className={classnames(className, c.Title, c.TitlePrimary)}>{children}</h1>
}

export const TitleSecondary = ({ children, className, light }) => {
  const c = useStyles({ light })
  return <h2 className={classnames(className, c.Title, c.TitleSecondary)}>{children}</h2>
}

export const TitleTertiary = ({ children, className, light }) => {
  const c = useStyles({ light })
  return <h3 className={classnames(className, c.Title, c.TitleTertiary)}>{children}</h3>
}

export const TitleQuaternary = ({ children, className, light }) => {
  const c = useStyles({ light })
  return <h4 className={classnames(className, c.Title, c.TitleQuaternary)}>{children}</h4>
}