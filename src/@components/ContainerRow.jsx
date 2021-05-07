import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    ContainerRow: {
      alignItems: ({ alignItems }) => alignItems,
      display: 'flex',
      flexDirection: ({ reverse }) => (reverse ? 'row-reverse' : 'row'),
      flexWrap: ({ wrap }) => wrap,
      justifyContent: ({ justifyContent }) => justifyContent,
      width: ({ fullWidth }) => fullWidth && '100%',
    },
  }
})

const noop = () => null

const ContainerRow = ({
  alignItems = 'normal',
  children,
  className,
  elementRef,
  fullWidth,
  justifyContent = 'normal',
  onClick = noop,
  reverse,
  wrap = 'nowrap',
  style,
}) => {
  const c = useStyles({ alignItems, justifyContent, fullWidth, wrap, reverse })

  return (
    <div
      className={classnames(className, c.ContainerRow)}
      onClick={onClick}
      ref={elementRef}
      style={style}
    >
      {children}
    </div>
  )
}

export default ContainerRow
