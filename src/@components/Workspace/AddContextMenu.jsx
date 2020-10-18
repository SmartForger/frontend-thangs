import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { AddMenu } from '@components'
import { track } from '@utilities/analytics'

const AddContextMenu = ({ folder }) => {
  track('Add Context Menu Open', { folder })
  return (
    <ContextMenu id='Add_Menu'>
      <AddMenu folder={folder} />
    </ContextMenu>
  )
}

export default AddContextMenu
