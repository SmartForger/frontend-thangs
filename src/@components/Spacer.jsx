import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Spacer: {
      width: ({ mobileSize, size, width }) => mobileSize || size || width || '100%',
      height: ({ mobileSize, size, height }) => mobileSize || size || height || '100%',

      [md]: {
        width: ({ size, width }) => size || width || '100%',
        height: ({ size, height }) => size || height || '100%',
      },
    },
  }
})

const Spacer = ({ className, size, width, height, mobileSize }) => {
  const c = useStyles({ size, width, height, mobileSize })
  return <div className={classnames(className, c.Spacer)}></div>
}

export default Spacer
