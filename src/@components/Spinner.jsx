import React from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes rotate': {
      100: { transform: 'rotate(360deg)' },
    },
    '@keyframes dash': {
      0: {
        strokeDasharray: '1, 150',
        strokeDashoffset: '0',
      },
      50: {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-35',
      },
      100: {
        strokeDasharray: '90, 150',
        strokeDashoffset: '-124',
      },
    },

    Spinner: {
      animation: 'rotate 2s linear infinite',
      width: ({ size }) => size,
      height: ({ size }) => size,
      margin: 'auto',
      display: 'block',
    },

    Spinner_path: {
      stroke: theme.variables.colors.mainFontColor || theme.colors.grey[700],
      strokeLinecap: 'round',
      animation: 'dash 1.5s ease-in-out infinite',
    },
  }
})

const Spinner = ({ size = '3rem', ...otherProps }) => {
  const c = useStyles({ size })
  return (
    <svg
      className={c.Spinner}
      {...otherProps}
      viewBox='0 0 50 50'
      data-cy='loading-spinner'
    >
      <circle
        className={c.Spinner_path}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='4'
      />
    </svg>
  )
}

export { Spinner }
