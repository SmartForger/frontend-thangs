import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { AddMenu } from '@components'

const AddContextMenu = () => {
  return (
    <ContextMenu id='Add_Menu'>
      <AddMenu />
    </ContextMenu>
  )
}

export default AddContextMenu
