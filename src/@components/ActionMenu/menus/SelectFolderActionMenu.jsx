import React, { useCallback, useMemo, useState, useRef } from 'react'
import classnames from 'classnames'
import {
  ActionMenu,
  ModelThumbnail,
  MultiLineBodyText,
  Spacer,
  SingleLineBodyText,
  Tag,
  TextInput,
  InfiniteTreeView,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X-sm.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xl, md_972, md_viewer, lg_viewer },
  } = theme
  return {
    SelectFolderActionMenu: {
      bottom: '5rem',
      right: '0',
      maxHeight: '80vh',
    },
    SelectFolderMenu: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      [md_viewer]: {
        width: '15rem',
        maxWidth: '15rem',
      },

      [md_972]: {
        width: '17.5rem',
        maxWidth: '17.5rem',
      },
    },
  }
})

const noop = () => null

export const SelectFolderMenu = ({ onChange = noop }) => {
  const c = useStyles({})
  const handleClick = folder => {
    onChange(folder)
  }

  const handleCreateNew = () => {}

  return <div className={c.SelectFolderMenu}>dropdown menu contents</div>
}

export const SelectFolderTarget = ({ selectedValue }) => {
  return (
    <div>
      input - Choose Folder - down arrow
      {selectedValue}
    </div>
  )
}

const SelectFolderActionMenu = ({ onChange = noop, selectedValue }) => {
  const c = useStyles({})
  const menuProps = useMemo(() => {
    return {
      actionBarTitle: 'Select Folder',
      className: c.SelectFolderActionMenu,
      onChange,
      selectedValue,
    }
  }, [c.SelectFolderActionMenu, onChange, selectedValue])

  const targetProps = useMemo(() => {
    return { selectedValue }
  }, [selectedValue])

  return (
    <ActionMenu
      MenuComponent={SelectFolderMenu}
      MenuComponentProps={menuProps}
      TargetComponent={SelectFolderTarget}
      TargetComponentProps={targetProps}
      isAutoClosed={false}
    />
  )
}

export default SelectFolderActionMenu
