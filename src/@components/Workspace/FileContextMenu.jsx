import React from 'react'
import { ContextMenu } from 'react-contextmenu'
import { FileMenu } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    ContextMenu: {
      zIndex: 1,
    },
  }
})

const FileContextMenu = ({ folder, model, id, postId = '', type }) => {
  const c = useStyles({})
  return (
    <ContextMenu className={c.ContextMenu} id={`File_Menu_${id}${postId}`}>
      <FileMenu folder={folder} model={model} id={id} type={type} />
    </ContextMenu>
  )
}

export default FileContextMenu
