import React from 'react'
import { connectMenu, ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { AddMenu } from '@components'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const AddContextMenu = props => {
  const c = useStyles({})

  const { trigger } = props
  const { folder } = trigger || {}

  return (
    <ContextMenu className={c.ContextMenu} id={'Add_Menu'}>
      <AddMenu folder={folder} />
    </ContextMenu>
  )
}

export default connectMenu('Add_Menu')(AddContextMenu)
