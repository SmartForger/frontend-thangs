import React, { useCallback } from 'react'
import { MenuItem } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useOverlay } from '@hooks'
import { SingleLineBodyText, Spacer } from '@components'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    CommentMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: '2',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    CommentMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      outline: 'none',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
  }
})

const CommentMenu = ({ modelId, comment = {} }) => {
  const c = useStyles({})
  const { setOverlay } = useOverlay()

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Edit Model')
      setOverlay({
        isOpen: true,
        template: 'editComment',
        data: {
          modelId,
          comment,
          animateIn: true,
          windowed: true,
        },
      })
    },
    [setOverlay, modelId, comment]
  )

  const handleDelete = useCallback(
    e => {
      e.preventDefault()
      setOverlay({
        isOpen: true,
        template: 'deleteComment',
        data: {
          modelId,
          comment,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [setOverlay, modelId, comment]
  )

  return (
    <div className={c.CommentMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.CommentMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'1rem'} />
      <MenuItem className={c.CommentMenu_Item} onClick={handleDelete}>
        <div>
          <Spacer size={'1.5rem'} />
          <DeleteIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Delete</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'1rem'} />
    </div>
  )
}

export default CommentMenu
