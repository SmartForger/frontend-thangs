import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    ContainerRow: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: ({ wrap }) => wrap,
      alignItems: ({ alignItems }) => alignItems,
      justifyContent: ({ justifyContent }) => justifyContent,
      width: ({ fullWidth }) => fullWidth && '100%',
    },
  }
})

const noop = () => null

const ContainerRow = ({
  className,
  children,
  alignItems = 'normal',
  justifyContent = 'normal',
  wrap = 'nowrap',
  fullWidth,
  onClick = noop,
  elementRef,
}) => {
  const c = useStyles({ alignItems, justifyContent, fullWidth, wrap })

  return (
    <div
      className={classnames(className, c.ContainerRow)}
      onClick={onClick}
      ref={elementRef}
    >
      {children}
    </div>
  )
}

export default ContainerRow
