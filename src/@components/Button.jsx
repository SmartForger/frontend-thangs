import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Button: {
      border: 'none',
      background: 'none',
      padding: 0,
      outline: 'none',
      cursor: 'pointer',
      lineHeight: '1.125rem',
      '&:disabled': {
        cursor: 'not-allowed',
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
      padding: '.5625rem .75rem',
      backgroundColor: theme.colors.blue[500],
      ...theme.mixins.text.primaryButtonText,

      '&:hover': {
        backgroundColor: theme.colors.blue[700],
      },

      '&:disabled': {
        ...theme.mixins.text.secondaryButtonText,
        cursor: 'not-allowed',
        opacity: '0.8',
        '&:hover': {
          opacity: 1,
        },
      },
    },
    Button__secondary: {
      ...theme.mixins.text.secondaryButtonText,
      backgroundColor: theme.colors.purple[300],
      '&:hover': {
        backgroundColor: theme.colors.purple[500],
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
        backgroundColor: theme.colors.purple[800],
      },
    },
    Button__brand: {
      ...theme.mixins.text.matchingButtonText,
      borderRadius: '.5rem',
      boxShadow: theme.variables.boxShadow,
      backgroundColor: theme.colors.gold[500],
      padding: '.375rem 1rem',
      minWidth: '11.25rem',

      [md]: {
        padding: '.375rem 1.5rem',
      },

      '&:hover': {
        ...theme.mixins.text.matchingButtonHoverText,
        backgroundColor: theme.colors.gold[800],
      },
    },
  }
})

const Button = ({
  children,
  secondary,
  back,
  dark,
  text,
  brand,
  className,
  ...props
}) => {
  const c = useStyles()
  return (
    <button
      className={classnames(className, c.Button, {
        [c.Button__secondary]: secondary || back,
        [c.Button__back]: back,
        [c.Button__dark]: dark,
        [c.Button__notText]: !text,
        [c.Button__brand]: brand,
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
