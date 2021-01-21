import React from 'react'
import { ActionMenu } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as DotStackIcon } from '../../../@svg/dot-stack-icon.svg'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    CommentsActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    CommentsActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    CommentsActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    CommentsActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const options = [
  {
    label: 'Edit',
    Icon: EditIcon,
    value: 'edit',
  },
  {
    label: 'Delete',
    Icon: DeleteIcon,
    value: 'delete',
  },
]

const noop = () => null

const CommentsTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.CommentsActionMenu_ClickableButton} onClick={onClick}>
      <DotStackIcon />
    </div>
  )
}

const CommentsActionMenu = ({ modelId, comment, onChange = noop }) => {
  return (
    <ActionMenu
      MenuComponentProps={{
        modelId,
        comment,
        onChange,
        actionBarTitle: 'Select action',
        options,
      }}
      TargetComponent={CommentsTarget}
    />
  )
}

export default CommentsActionMenu
