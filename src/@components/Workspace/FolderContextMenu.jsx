import React from 'react'
import { connectMenu, ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@style'
import { FolderMenu } from '@components'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const FolderContextMenu = props => {
  const c = useStyles({})

  const { trigger } = props
  const { folder } = trigger || {}

  return (
    <ContextMenu className={c.ContextMenu} id={'Folder_Menu'}>
      {folder ? <FolderMenu folder={folder} /> : false}
    </ContextMenu>
  )
}

export default connectMenu('Folder_Menu')(FolderContextMenu)
