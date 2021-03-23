import React from 'react'
import { connectMenu, ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { FolderMenuInvite } from '@components'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const FolderInviteContextMenu = props => {
  const c = useStyles({})

  const { trigger } = props
  const { folder, members } = trigger || {}

  return (
    <ContextMenu className={c.ContextMenu} id={'Folder_Invite_Menu'}>
      {folder ? <FolderMenuInvite folder={folder} members={members} /> : false}
    </ContextMenu>
  )
}

export default connectMenu('Folder_Invite_Menu')(FolderInviteContextMenu)
