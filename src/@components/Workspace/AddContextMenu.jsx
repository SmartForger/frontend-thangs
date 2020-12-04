import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { AddMenu } from '@components'

const AddContextMenu = ({ id = 'Add_Menu', folder, className }) => {
  return (
    <ContextMenu className={className} id={id}>
      <AddMenu folder={folder} />
    </ContextMenu>
  )
}

export default AddContextMenu
