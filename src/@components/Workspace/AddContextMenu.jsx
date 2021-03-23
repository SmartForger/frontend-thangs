import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui'
import { AddMenu } from '@components'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const AddContextMenu = () => {
  const c = useStyles({})

  return (
    <ContextMenu className={c.ContextMenu} id={'Add_Menu'}>
      <AddMenu />
    </ContextMenu>
  )
}

export default AddContextMenu
