import React from 'react'
import { connectMenu, ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui'
import { FileMenu } from '@components'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const FileContextMenu = props => {
  const c = useStyles({})

  const { trigger } = props
  const model = trigger && trigger.model

  return (
    <ContextMenu className={c.ContextMenu} id={'File_Menu'}>
      {model ? <FileMenu model={model} /> : false}
    </ContextMenu>
  )
}

export default connectMenu('File_Menu')(FileContextMenu)
