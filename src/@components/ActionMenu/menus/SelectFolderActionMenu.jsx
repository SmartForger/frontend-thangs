import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import * as R from 'ramda'
import {
  ActionMenu,
  Button,
  Divider,
  Input,
  SingleLineBodyText,
  SearchBar,
  Spacer,
  Toggle,
} from '@components'
import { useForm } from '@hooks'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down.svg'
import { ReactComponent as ArrowLeftIcon } from '@svg/icon-arrow-left.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { track } from '@utilities/analytics'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    SelectFolderMenu_Wrapper: {
      '& > div': {
        width: '100% !important',
      },
    },

    SelectFolderMenu: {
      position: 'relative',
    },

    SelectFolderActionMenu: {
      width: '100% !important',
    },

    SelectFolderMenu_ItemsContainer: {
      ...theme.mixins.scrollbar,
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
    SelectFolderTarget: {
      cursor: 'pointer !important',
    },
    SelectFolderTarget_Icon: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      height: '2.5rem',
      position: 'absolute',
      right: '1rem',
      top: 0,

      '& path': {
        fill: theme.colors.grey[300],
      },
    },
    SelectFolderMenu_Content: {
      [md]: {
        marginBottom: '1rem',
      },
    },
  }
})

const noop = () => null

const FoldersScreen = ({ onChange, folders = [] }) => {
  const c = useStyles({})
  const [searchTerm, setSearchTerm] = useState('')
  const filteredFolders =
    searchTerm === null
      ? [...folders]
      : folders.filter(folder => folder.label.toLowerCase().includes(searchTerm))

  return (
    <>
      <SearchBar
        onSearch={term => {
          track('Search Upload Folders', { searchTerm: term })
          setSearchTerm(term.toLowerCase())
        }}
        placeholder='Search for folder'
        submitOnChange={true}
      />
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
                onClick={() => onChange(folder)}
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

const NewFolderScreen = ({ onChange = noop, onBack = noop }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const [errorMessage, setErrorMessage] = useState(null)
  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState: { name: '', isPublic: false },
  })

  const handleSubmit = useCallback(
    data => {
      track('Create Folder - Submit - Upload Flow', { isPrivate: !data.isPublic })
      dispatch(types.CREATE_FOLDER, {
        data,
        onError: error => {
          setErrorMessage((error || {}).message)
        },
        onFinish: id => {
          if (id) {
            onChange({ ...data, value: id })
            onBack()
          }
        },
      })
    },
    [dispatch, onChange, onBack]
  )

  return (
    <>
      <div
        className={classnames(c.SelectFolderMenu_Row, c.SelectFolderMenu_Row__clickable)}
        onClick={onBack}
      >
        <ArrowLeftIcon />
        <Spacer size='.5rem' />
        <SingleLineBodyText>Back</SingleLineBodyText>
      </div>
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
    </>
  )
}

export const SelectFolderMenu = ({ onChange = noop, options = [] }) => {
  const c = useStyles({})
  const [isCreateMode, setIsCreateMode] = useState(false)

  const handleChange = useCallback(
    folder => {
      if (folder) onChange(folder)
    },
    [onChange]
  )

  const handleCreateNew = useCallback(
    _ev => {
      setTimeout(() => {
        setIsCreateMode(true)
        track('Create Folder - Form Show - Upload Flow')
      }, 100)
    },
    [setIsCreateMode]
  )

  const onBack = useCallback(() => {
    setTimeout(() => {
      setIsCreateMode(false)
    }, 100)
  }, [setIsCreateMode])

  return (
    <div className={c.SelectFolderMenu}>
      {isCreateMode ? (
        <NewFolderScreen onBack={onBack} onChange={handleChange} />
      ) : (
        <>
          <FoldersScreen folders={options} onChange={handleChange} />
          <div
            className={classnames(
              c.SelectFolderMenu_Row,
              c.SelectFolderMenu_Row__clickable
            )}
            onClick={handleCreateNew}
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

export const SelectFolderTarget = ({
  selectedValue,
  error,
  errorMessage,
  onClick = noop,
}) => {
  const c = useStyles({})
  const handleClick = useCallback(() => {
    track('Choose Folder - Click - Upload Flow')
    onClick()
  }, [onClick])

  return (
    <div onClick={handleClick}>
      <Input
        className={c.SelectFolderTarget}
        label={'Choose Folder'}
        value={(selectedValue || {}).label}
        error={error}
        errorMessage={errorMessage}
      />
      <div className={c.SelectFolderTarget_Icon}>
        <ArrowDownIcon />
      </div>
    </div>
  )
}

const SelectFolderActionMenu = ({
  error,
  errorMessage,
  initialValue,
  onChange = noop,
  selectedValue,
}) => {
  const c = useStyles({})
  const { dispatch, folders = {}, shared = {} } = useStoreon('folders', 'shared')
  const { data: foldersData = [] } = folders
  const { data: sharedData = [] } = shared

  const dropdownFolders = useMemo(() => {
    const foldersArray = [...foldersData]
    const sharedArray = [...sharedData]
    const combinedArray = []
    foldersArray.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    sharedArray.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    foldersArray.forEach(folder => {
      combinedArray.push(folder)
      folder.subfolders.forEach(subfolder => {
        combinedArray.push(subfolder)
      })
    })
    sharedArray.forEach(folder => {
      combinedArray.push(folder)
    })

    const folderOptions = combinedArray.map(folder => ({
      value: folder.id,
      label: folder.name.replace(new RegExp('//', 'g'), '/'),
      isPublic: folder.isPublic,
    }))

    return [
      {
        value: '',
        label: 'My Public Files',
        isPublic: true,
      },
      ...folderOptions,
    ]
  }, [foldersData, sharedData])

  const menuProps = useMemo(() => {
    return {
      actionBarTitle: 'Select Folder',
      className: c.SelectFolderActionMenu,
      onChange,
      options: dropdownFolders,
    }
  }, [c.SelectFolderActionMenu, dropdownFolders, onChange])

  const targetProps = useMemo(() => {
    const folder = dropdownFolders.find(folder => {
      return folder.value === selectedValue
    })
    return { selectedValue: folder, error, errorMessage }
  }, [dropdownFolders, error, errorMessage, selectedValue])

  useEffect(() => {
    // dispatch(types.RESET_UPLOAD_FILES)
    const { data: folderData } = folders
    if (R.isEmpty(folderData)) {
      dispatch(types.FETCH_THANGS, {})
    }
    if (initialValue) {
      const folder = dropdownFolders.find(folder => {
        return folder.value === initialValue
      })
      onChange(folder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.SelectFolderMenu_Wrapper}>
      <ActionMenu
        MenuComponent={SelectFolderMenu}
        MenuComponentProps={menuProps}
        TargetComponent={SelectFolderTarget}
        TargetComponentProps={targetProps}
        isAutoClosed={false}
        isExternalClosed={true}
        isMobileOnly
      />
    </div>
  )
}

export default SelectFolderActionMenu
