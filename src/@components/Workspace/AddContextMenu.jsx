import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { AddMenu } from '@components'

const AddContextMenu = ({ folder, className }) => {
  return (
    <ContextMenu className={className} id='Add_Menu'>
      <AddMenu folder={folder} />
    </ContextMenu>
  )
}

export default AddContextMenu
