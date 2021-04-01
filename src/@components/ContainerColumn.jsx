import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    ContainerColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: ({ alignItems }) => alignItems,
      justifyContent: ({ justifyContent }) => justifyContent,
      width: ({ fullWidth }) => fullWidth && '100%',
    },
  }
})

const noop = () => null

const ContainerColumn = ({
  className,
  children,
  alignItems = 'normal',
  justifyContent = 'normal',
  fullWidth,
  onClick = noop,
  elementRef,
}) => {
  const c = useStyles({ alignItems, justifyContent, fullWidth })

  return (
    <div
      className={classnames(className, c.ContainerColumn)}
      onClick={onClick}
      ref={elementRef}
    >
      {children}
    </div>
  )
}

export default ContainerColumn
