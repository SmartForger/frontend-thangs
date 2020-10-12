import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { AddMenu } from '@components'

const AddContextMenu = ({ folder }) => {
  return (
    <ContextMenu id='Add_Menu'>
      <AddMenu folder={folder} />
    </ContextMenu>
  )
}

export default AddContextMenu
