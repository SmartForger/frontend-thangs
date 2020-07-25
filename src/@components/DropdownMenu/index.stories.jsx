import React from 'react'
import { action } from '@storybook/addon-actions'
import { DropdownMenu, DropdownItem } from './'
import { ReactComponent as UploadModelToFolderIcon } from '../../@svg/upload-model-to-folder-icon.svg'
import { ReactComponent as NewFolderIcon } from '../../@svg/folder-plus-icon.svg'
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg'
import { ReactComponent as ModelSquareIcon } from '../../@svg/model-square-icon.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    DropdownMenu: {
      margin: 'auto',
    },
    DropdownMenu_ModelSquareIcon: {
      marginLeft: '-3px',
      marginRight: '11px !important',
    },
  }
})

export default {
  title: 'DropdownMenu',
  component: DropdownMenu,
}

export const WithOnlyTextUncontrolled = () => {
  const c = useStyles()
  return (
    <div>
      <DropdownMenu className={c.DropdownMenu} noIcons>
        <DropdownItem to='/'>Invite users</DropdownItem>
        <DropdownItem to='/'>Edit Profile</DropdownItem>
        <DropdownItem to='/'>Liked Models</DropdownItem>
      </DropdownMenu>
    </div>
  )
}

export const WithOnlyTextControlledOpen = () => {
  const c = useStyles()
  return (
    <div>
      <DropdownMenu className={c.DropdownMenu} noIcons isOpen={true}>
        <DropdownItem to='/'>Invite users</DropdownItem>
        <DropdownItem to='/'>Edit Profile</DropdownItem>
        <DropdownItem to='/'>Liked Models</DropdownItem>
      </DropdownMenu>
    </div>
  )
}

export const WithIconsUncontrolled = () => {
  const c = useStyles()
  return (
    <div>
      <DropdownMenu className={c.DropdownMenu}>
        <DropdownItem onClick={action('deleted folder')}>
          <TrashCanIcon />
          <span>Delete Folder</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <UploadModelToFolderIcon />
          <span>Upload Model to Folder</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <ModelSquareIcon className={c.ModelSquareIcon} />
          <span>Upload Model</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <NewFolderIcon />
          <span>Add Folder</span>
        </DropdownItem>
      </DropdownMenu>
    </div>
  )
}

export const WithIconsControlledOpen = () => {
  const c = useStyles()
  return (
    <div>
      <DropdownMenu className={c.DropdownMenu} isOpen={true}>
        <DropdownItem onClick={action('deleted folder')}>
          <TrashCanIcon />
          <span>Delete Folder</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <UploadModelToFolderIcon />
          <span>Upload Model to Folder</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <ModelSquareIcon className={c.ModelSquareIcon} />
          <span>Upload Model</span>
        </DropdownItem>
        <DropdownItem to='/'>
          <NewFolderIcon />
          <span>Add Folder</span>
        </DropdownItem>
      </DropdownMenu>
    </div>
  )
}
