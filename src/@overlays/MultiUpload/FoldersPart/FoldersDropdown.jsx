import React from 'react'
import classnames from 'classnames'
import {
  Divider,
  DropdownMenu,
  DropdownItem,
  SingleLineBodyText,
  Spacer,
} from '@components'
import { createUseStyles } from '@style'

import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import SearchBar from './SearchBar'

const useStyles = createUseStyles(_theme => {
  return {
    FoldersDropdown: {
      width: '16.25rem',
      zIndex: '10',
    },
    FoldersDropdown_Container: {
      width: '100%',
    },
    FoldersDropdown_ItemsContainer: {
      maxHeight: '22rem',
      overflowY: 'auto',
      whiteSpace: 'nowrap',
    },

    Zz: {
      display: 'flex',
      alignItems: 'center',
    },
  }
})

const noop = () => null
export const FoldersDropdownMenu = ({
  className,
  myThangsMenu,
  user = {},
  TargetComponent,
  ...props
}) => {
  const c = useStyles({})

  return (
    <DropdownMenu
      className={classnames(className, c.FoldersDropdown)}
      TargetComponent={TargetComponent}
      user={user}
      myThangsMenu={myThangsMenu}
      {...props}
    >
      <FoldersDropdownMenuContainer user={user} />
    </DropdownMenu>
  )
}

export const FoldersDropdownMenuContainer = ({ folders = [] }) => {
  const c = useStyles({})

  return (
    <div className={c.FoldersDropdown_Container}>
      <SearchBar placeholder={'Search'} setCurrentView={() => {}} />
      <div className={c.FoldersDropdown_ItemsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => {
          return (
            <React.Fragment key={value}>
              <Spacer size={'1rem'} />

              <DropdownItem className={c.Zz} onClick={() => {}}>
                <FolderIcon />
                <Spacer size={'.5rem'} />
                <SingleLineBodyText>Folder{value}</SingleLineBodyText>
              </DropdownItem>
            </React.Fragment>
          )
        })}
      </div>

      <Spacer size={'1rem'} />
      <Divider spacing={0} />
      <Spacer size={'1rem'} />

      <DropdownItem className={c.Zz} onClick={() => {}}>
        <PlusIcon />
        <Spacer size={'.5rem'} />
        <SingleLineBodyText> Create new folder</SingleLineBodyText>
      </DropdownItem>
    </div>
  )
}
