import React, { useCallback, useState, useRef, forwardRef } from 'react'
import { useForm } from '@hooks'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'
import {
  Divider,
  DropdownMenu,
  SingleLineBodyText,
  Spacer,
  Input,
  Toggle,
  Button,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import SearchBar from './SearchBar'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    FoldersDropdown: {
      width: '16.25rem',
      zIndex: '10',
    },
    FoldersDropdown_Container: {
      width: '100%',
    },
    FoldersDropdown_ItemsContainer: {
      maxHeight: '10rem',
      overflowY: 'auto',
    },

    MultiUpload_Column: {
      display: 'flex',
      alignItems: 'center',
    },

    FolderForm_Button: {
      width: '100%',
    },
    FolderForm_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: '500',
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
    FoldersDropdown_FolderItem: {
      display: 'flex !important',
      alignItems: 'center !important',
      cursor: 'pointer',
    },
  }
})

export const FoldersDropdownMenu = ({
  className,
  TargetComponent,
  folders,
  onChange,
  ...props
}) => {
  const c = useStyles({})
  const targetRef = useRef(null)
  const [isOpen, setIsOpen] = useState(true)

  const hanldeClose = () => {
    setIsOpen(false)
    console.log('----->', 'targetRef', targetRef)
  }

  return (
    <DropdownMenu
      className={classnames(className, c.FoldersDropdown)}
      TargetComponent={TargetComponent}
      TargetComponentProps={{ ref: targetRef }}
      isAutoClosed={false}
      {...props}
    >
      <FoldersDropdownMenuContainer
        folders={folders}
        onChange={value => {
          onChange(value)
          hanldeClose()
        }}
      />
    </DropdownMenu>
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
      <Button className={c.FolderForm_Button} type='submit'>
        Create
      </Button>
    </form>
  )
}

const FoldersScreen = ({
  onChange,
  folders = [
    { isPublic: true, label: 'My Public Files', value: '9755' },
    {
      isPublic: true,
      label: 'Folder1',
      value: '1308',
    },
  ],
}) => {
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
      <div className={c.FoldersDropdown_ItemsContainer}>
        {filteredFolders.map(folder => {
          return (
            <React.Fragment key={folder.value}>
              <div
                className={c.FoldersDropdown_FolderItem}
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

export const FoldersDropdownMenuContainer = ({ onChange = () => {}, folders }) => {
  const c = useStyles({})
  const [isCreateMode, setIsCreateMode] = useState(false)

  return (
    <div className={c.FoldersDropdown_Container}>
      {isCreateMode ? (
        <>
          <div
            className={c.FoldersDropdown_FolderItem}
            onClick={() => {
              setIsCreateMode(false)
            }}
          >
            <ArrowLeftIcon />
            <Spacer size='.5rem' />
            <SingleLineBodyText>Back</SingleLineBodyText>
          </div>
          <NewFolderScreen onChange={onChange} />{' '}
        </>
      ) : (
        <>
          <FoldersScreen folders={folders} onChange={onChange} />
          <div
            className={c.FoldersDropdown_FolderItem}
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
    </div>
  )
}
