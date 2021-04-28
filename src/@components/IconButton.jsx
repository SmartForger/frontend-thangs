import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

import { ContainerColumn, Spacer } from '@components'

const noop = () => undefined

const useStyles = createUseStyles(theme => {
  return {
    IconButton: {
      display: 'flex',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      background: theme.colors.white[900],

      '& svg': {
        minWidth: '2rem',
      },
    },
    IconButton_HoverBackground: {
      background: 'transparent',
      '&:hover': {
        background: theme.colors.white[900],
      },
    },
  }
})

const IconButton = ({ children, className, isHoverable = false, onClick = noop }) => {
  const c = useStyles({})

  return (
    <ContainerColumn
      className={classnames(className, c.IconButton, {
        [c.IconButton_HoverBackground]: isHoverable,
      })}
      onClick={onClick}
    >
      <Spacer size='0.5rem' />
      {children}
      <Spacer size='0.5rem' />
    </ContainerColumn>
  )
}

export default IconButton
