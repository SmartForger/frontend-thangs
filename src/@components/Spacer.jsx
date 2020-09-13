import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Spacer: {
      width: ({ size, width }) => size || width || '100%',
      height: ({ size, height }) => size || height || '100%',
    },
  }
})

const Spacer = ({ className, size, width, height }) => {
  const c = useStyles({ size, width, height })
  return <div className={classnames(className, c.Spacer)}></div>
}

export default Spacer
