import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { useForm } from '@hooks'
import { Spacer, SingleLineBodyText, Divider, Toggle, Button, Input } from '@components'
import { createUseStyles } from '@style'

import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'

import SearchBar from './SearchBar'

import * as types from '@constants/storeEventTypes'

import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    SelectFolderMenu: {
      position: 'relative',
    },

    SelectFolderMenu_DropdownMenu: {
      background: theme.colors.white[400],
      borderRadius: '.5rem',
      boxShadow: '0 1rem 2rem 0 rgba(0,0,0,0.15)',
      boxSizing: 'border-box',
      position: 'absolute',
      right: '-4rem',
      marginTop: '.5rem',
      zIndex: '2',
      overflowY: 'auto',

      [md]: {
        right: '0rem',
      },
    },

    SelectFolderMenu_ItemsContainer: {
      maxHeight: '10rem',
      overflowY: 'auto',
    },

    SelectFolderMenu_Columnn: {
      ...theme.mixins.flexColumn,
    },

    SelectFolderMenu_Row: {
      ...theme.mixins.flexRow,
      alignItems: 'center',
    },

    SelectFolderMenu__fullWidth: {
      width: '100%',
    },

    SelectFolderMenu_Row__clickable: {
      cursor: 'pointer',
    },
  }
})

const noop = () => null

const FoldersScreen = ({ onChange, folders = [] }) => {
  const c = useStyles({})
  const [searchTerm, setSearchTerm] = useState(null)
  const filteredFolders =
    searchTerm === null
      ? [...folders]
      : folders.filter(folder => folder.label.includes(searchTerm))

  return (
    <>
      <SearchBar onChange={e => setSearchTerm(e.target.value)} value={searchTerm || ''} />
      <Spacer size={'1.5rem'} />
      <div className={c.SelectFolderMenu_ItemsContainer}>
        {filteredFolders.map(folder => {
          return (
            <React.Fragment key={folder.value}>
              <div
                className={classnames(
                  c.SelectFolderMenu_Row,
                  c.SelectFolderMenu_Row__clickable
                )}
                onClick={() => {
                  onChange(folder.value)
                }}
              >
                <FolderIcon />
                <Spacer size={'.5rem'} />
                <SingleLineBodyText>{folder.label}</SingleLineBodyText>
              </div>
              <Spacer size={'1rem'} />
            </React.Fragment>
          )
        })}
      </div>
      <Divider spacing={0} />
      <Spacer size={'1rem'} />
    </>
  )
}

const NewFolderScreen = ({ onChange = () => {} }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const [errorMessage, setErrorMessage] = useState(null)
  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState: { name: '', isPublic: false },
  })

  const handleSubmit = useCallback(
    data => {
      track('Create Folder', { isPrivate: !data.isPublic })
      dispatch(types.CREATE_FOLDER, {
        data,
        onError: error => {
          setErrorMessage((error || {}).message)
        },
        onFinish: id => {
          if (id) onChange(id)
        },
      })
    },
    [dispatch, onChange]
  )

  return (
    <form onSubmit={onFormSubmit(handleSubmit)}>
      {errorMessage && (
        <>
          <h4 className={c.FolderForm_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      <Spacer size='1rem' />
      <Input
        onChange={(_key, value) => {
          onInputChange('name', value)
        }}
        label='Folder Name'
        maxLength='150'
        value={inputState.name}
      />
      <Toggle
        onChange={e => {
          onInputChange('isPublic', !e.target.checked)
        }}
        label={'Private Folder'}
        checked={!inputState.isPublic}
      />
      <Spacer size='1rem' />
      <Button
        className={classnames(c.SelectFolderMenu_Row, c.SelectFolderMenu__fullWidth)}
        type='submit'
      >
        Create
      </Button>
    </form>
  )
}

export const SelectFolderMenu = ({ onChange = () => {}, folders }) => {
  const c = useStyles({})
  const [isCreateMode, setIsCreateMode] = useState(false)

  return (
    <div
      className={classnames(
        c.SelectFolderMenu_Row,
        c.SelectFolderMenu_DropdownMenu,
        c.SelectFolderMenu__fullWidth
      )}
    >
      <Spacer size='1rem' />
      <div
        className={classnames(c.SelectFolderMenu_Columnn, c.SelectFolderMenu__fullWidth)}
      >
        <Spacer size='1rem' />

        {isCreateMode ? (
          <>
            <div
              className={classnames(
                c.SelectFolderMenu_Row,
                c.SelectFolderMenu_Row__clickable
              )}
              onClick={() => {
                setIsCreateMode(false)
              }}
            >
              <ArrowLeftIcon />
              <Spacer size='.5rem' />
              <SingleLineBodyText>Back</SingleLineBodyText>
            </div>
            <NewFolderScreen onChange={onChange} />
          </>
        ) : (
          <>
            <FoldersScreen folders={folders} onChange={onChange} />

            <div
              className={classnames(
                c.SelectFolderMenu_Row,
                c.SelectFolderMenu_Row__clickable
              )}
              onClick={() => {
                setIsCreateMode(true)
              }}
            >
              <PlusIcon />
              <Spacer size={'.5rem'} />
              <SingleLineBodyText> Create new folder</SingleLineBodyText>
            </div>
          </>
        )}
        <Spacer size='1rem' />
      </div>
      <Spacer size='1rem' />
    </div>
  )
}

const SelectFolderActionMenu = ({ onChange = noop, TargetComponent, folders }) => {
  const c = useStyles({})
  const [isToggled, toggle] = useState(false)

  const handleChange = value => {
    toggle(false)
    onChange(value)
  }

  return (
    <div className={c.SelectFolderMenu}>
      <TargetComponent
        onClick={() => {
          toggle(!isToggled)
        }}
      />
      {isToggled && <SelectFolderMenu onChange={handleChange} folders={folders} />}
    </div>
  )
}

export default SelectFolderActionMenu
