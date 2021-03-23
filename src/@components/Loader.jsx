import React from 'react'
import { createUseStyles } from '@physna/voxel-ui'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes loading': {
      '25%': { borderRadius: '0 50% 50% 50%' },
      '50%': { borderRadius: '50% 0 50% 50%' },
      '75%': { borderRadius: '50% 50% 0 50%' },
    },
    Loader: {
      position: 'relative',
      width: '3rem',
      height: '3rem',
      boxShadow: `inset 0 0 0 12px ${theme.colors.gold[500]}`,
      borderRadius: '50% 50% 50% 0',
      animation: '$loading 2s infinite',

      '&:after': {
        content: '"',
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        boxShadow: `inset 0 0 0 12px ${theme.colors.gold[500]}`,
        borderRadius: '50%',
      },
    },
  }
})

const Loader = ({ className }) => {
  const c = useStyles()
  return <div className={classnames(className, c.Loader)} />
}

export default Loader
