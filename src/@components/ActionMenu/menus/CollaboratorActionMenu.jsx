import React from 'react'
import { ActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    CollaboratorActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    CollaboratorActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    CollaboratorActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    CollaboratorActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const options = [
  {
    label: 'Delete',
    Icon: DeleteIcon,
    value: 'delete',
  },
]

const noop = () => null

const CollaboratorTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.CollaboratorActionMenu_ClickableButton} onClick={onClick}>
      <DotStackIcon />
    </div>
  )
}

const CollaboratorActionMenu = ({ onChange = noop }) => {
  return (
    <ActionMenu
      MenuComponentProps={{
        onChange,
        actionBarTitle: 'Select action',
        options,
        tabletLayout: false,
      }}
      TargetComponent={CollaboratorTarget}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default CollaboratorActionMenu
