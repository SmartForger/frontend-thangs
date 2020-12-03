import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { MenuItem } from 'react-contextmenu'
import { createUseStyles } from '@style'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    CommentMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: 2,

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
  const { dispatch } = useStoreon()

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Edit Model')
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'editComment',
        overlayData: {
          modelId,
          comment,
          animateIn: true,
          windowed: true,
        },
      })
    },
    [dispatch, comment, modelId]
  )

  const handleDelete = useCallback(
    e => {
      e.preventDefault()
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'deleteComment',
        overlayData: {
          modelId,
          comment,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [dispatch, comment, modelId]
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
          <SingleLineBodyText>Remove</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'1rem'} />
    </div>
  )
}

export default CommentMenu
