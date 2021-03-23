import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'
import { LabelText } from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Button: {
      alignItems: 'center',
      backgroundColor: theme.colors.gold[500],
      border: 'none',
      borderRadius: '.5rem',
      color: theme.colors.black[500],
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      outline: 'none',
      padding: '.75rem 1rem',
      textAlign: 'center',
      userSelect: 'none',
      whiteSpace: 'nowrap',

      '&:hover': {
        backgroundColor: theme.colors.gold[700],
      },

      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.8',
        '&:hover': {
          opacity: '1',
        },
      },
    },
    Button__secondary: {
      backgroundColor: theme.colors.white[900],
      '&:hover': {
        backgroundColor: theme.colors.grey[100],
      },
    },
    Button__tertiary: {
      backgroundColor: 'transparent',
      color: theme.colors.black[500],

      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }
})

const Button = ({
  children,
  className,
  secondary = false,
  tertiary = false,
  ...props
}) => {
  const c = useStyles()
  return (
    <button
      className={classnames(className, c.Button, {
        [c.Button__secondary]: secondary,
        [c.Button__tertiary]: tertiary,
      })}
      {...props}
    >
      <LabelText>{children}</LabelText>
    </button>
  )
}

export default Button
