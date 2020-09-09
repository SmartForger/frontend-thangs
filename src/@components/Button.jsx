import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Button: {
      display: 'flex',
      textAlign: 'center',
      border: 'none',
      background: 'none',
      padding: 0,
      outline: 'none',
      cursor: 'pointer',
      lineHeight: '1.125rem',
      '&:disabled': {
        cursor: 'not-allowed',
      },
      whiteSpace: 'nowrap',
      '& > svg': {
        marginRight: '.5rem',
      },
    },
    Button__notText: {
      border: 'none',
      textAlign: 'center',
      userSelect: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '.5rem',
      padding: '.75rem 1rem',
      backgroundColor: theme.colors.gold[500],
      ...theme.mixins.text.primaryButtonText,

      '&:hover': {
        backgroundColor: theme.colors.gold[700],
      },

      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.8',
        '&:hover': {
          opacity: 1,
        },
      },
    },
    Button__secondary: {
      ...theme.mixins.text.secondaryButtonText,
      backgroundColor: theme.colors.white[900],
      '&:hover': {
        backgroundColor: theme.colors.grey[100],
      },
    },
    Button__tertiary: {
      padding: '.75rem 1rem',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    Button__back: {
      width: '3rem',
      height: '3rem',
      borderRadius: '3rem',
      padding: 0,
      marginRight: '1rem',
    },
    Button__dark: {
      ...theme.mixins.text.darkButtonText,
      backgroundColor: theme.colors.purple[500],
      '&:hover': {
        backgroundColor: theme.colors.purple[700],
      },
    },
    Button__light: {
      color: theme.colors.purple[900],
      fontWeight: 600,
      backgroundColor: theme.colors.grey[100],
      '&:hover': {
        backgroundColor: theme.colors.grey[300],
      },
    },
    Button__inline: {
      display: 'inline',
    },
    Button__small: {
      fontSize: '.75rem',
      lineHeight: '.75rem',
      padding: '.625rem 1rem',
    },
    Button__icon: {
      padding: '.75rem',
      '& > svg': {
        margin: 0,
      },
    },
  }
})

const Button = ({
  back,
  children,
  className,
  dark,
  light,
  icon,
  inline,
  secondary,
  tertiary,
  small,
  text,
  ...props
}) => {
  const c = useStyles()
  return (
    <button
      className={classnames(className, c.Button, {
        [c.Button__back]: back,
        [c.Button__dark]: dark,
        [c.Button__light]: light,
        [c.Button__icon]: icon,
        [c.Button__inline]: inline,
        [c.Button__notText]: !text,
        [c.Button__secondary]: secondary || back,
        [c.Button__tertiary]: tertiary,
        [c.Button__small]: small,
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
