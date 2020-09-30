import React, { useCallback, useMemo, useEffect } from 'react'
import Select from 'react-select'
import { Button, TextInput } from '@components'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import { useForm } from '@hooks'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Upload: {},
    UploadForm_Row: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2.5rem',
    },
    UploadForm_Column: {},
    UploadForm_Column__frame: {
      marginRight: '2rem',
    },
    UploadForm_Column__form: {
      minWidth: '21rem',
    },
    UploadForm_Field: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '.5rem',
    },
    UploadForm_FullWidthInput: {
      display: 'block',
      flexGrow: 1,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
    },
    UploadForm_Label: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '.5rem',
    },
    UploadForm_RequiredFlag: {
      textTransform: 'uppercase',
      backgroundColor: theme.colors.grey[100],
      borderRadius: '.25rem',
      color: 'white',
      letterSpacing: '.16em',
      fontWeight: 'bold',
      fontSize: '11px',
      lineHeight: '16px',
      padding: '1px 2px 2px 3px',
    },
    UploadForm_ButtonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    UploadForm_Button__CancelButton: {
      marginRight: '.5rem',
    },
    UploadForm_Header: {
      ...theme.text.subheaderText,
      marginBottom: '1.5rem',
    },
    UploadForm_Error: {
      ...theme.text.formErrorText,
      margin: '.5rem 0',
    },
    UploadForm_DropdownIndicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: `8px solid ${theme.colors.purple[900]}`,
    },
    UploadForm_Dots: {
      ...theme.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
    UploadForm_Select: {
      border: '1px solid #ddd',
      borderRadius: '.5rem',
      marginBottom: '.5rem',
    },
    UploadForm_FolderLabel: {
      justifyContent: 'flex-start',

      '& > svg': {
        marginRight: '.5rem',
      },
    },
  }
})

const CATEGORIES = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'home', label: 'Home' },
  { value: 'safety', label: 'Safety' },
  { value: 'characters', label: 'Characters' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'technology', label: 'Technology' },
  { value: 'hobbyist', label: 'Hobbyist' },
]

const UploadForm = ({
  onSubmit,
  disableSubmit,
  file,
  folders,
  isLoading,
  selectedFolderId,
}) => {
  const c = useStyles()

  const usersFolders = useMemo(() => {
    return folders && folders.length
      ? folders.map(folder => ({ value: folder.id, label: folder.name }))
      : []
  }, [folders])

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return undefined
    const selectedFolderObj = folders.find(folder => folder.id === selectedFolderId)
    const selectedFolder = { value: selectedFolderId, label: selectedFolderObj.name }
    return selectedFolder
  }, [folders, selectedFolderId])

  const initialState = {
    name: '',
    material: '',
    height: '',
    weight: '',
    description: '',
    category: '',
    folder: 'public',
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  useEffect(() => {
    if (selectedFolderId) {
      handleOnInputChange('folder', selectedFolderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  useEffect(() => {
    const fileName = (file && file.name) || ''
    handleOnInputChange('name', fileName)
  }, [file, handleOnInputChange])

  const handleOnFormSubmit = useCallback(
    e => {
      e.preventDefault()
      onFormSubmit(
        onSubmit({
          file,
          category: inputState.category,
          weight: inputState.weight,
          material: inputState.material,
          height: inputState.height,
          name: inputState.name,
          description: inputState.description,
          folder:
            inputState.folder === '' || inputState.folder === 'public'
              ? undefined
              : inputState.folder,
        })
      )
    },
    [file, inputState, onFormSubmit, onSubmit]
  )

  return (
    <form onSubmit={handleOnFormSubmit}>
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='name'>
          Title
          <span className={c.UploadForm_RequiredFlag}>Required</span>
        </label>
        <TextInput
          className={c.UploadForm_FullWidthInput}
          type='text'
          name='name'
          maxLength='100'
          onChange={e => {
            handleOnInputChange('name', e.target.value)
          }}
          value={inputState && inputState.name}
          required
        />
      </div>
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='description'>
          Description
          <span className={c.UploadForm_RequiredFlag}>Required</span>
        </label>
        <TextInput
          className={c.UploadForm_FullWidthInput}
          type='text'
          name='description'
          onChange={e => {
            handleOnInputChange('description', e.target.value)
          }}
          value={inputState && inputState.description}
          required
        />
      </div>
      {folders && folders.length ? (
        <div className={c.UploadForm_Field}>
          <label
            className={classnames(c.UploadForm_Label, c.UploadForm_FolderLabel)}
            htmlFor='folder'
          >
            <FolderIcon width={'1rem'} />
            Add To Folder
          </label>
          <Select
            className={c.UploadForm_Select}
            name='folder'
            placeholder='Select folder'
            defaultValue={selectedFolder}
            options={[{ value: 'public', label: 'Public' }, ...usersFolders]}
            onChange={e => {
              if (e) handleOnInputChange('folder', e.value)
            }}
            components={{
              IndicatorSeparator: () => null,
              // eslint-disable-next-line react/display-name
              DropdownIndicator: () => {
                // cx causes React to throw an error, so we remove it
                return <div className={c.UploadForm_DropdownIndicator} />
              },
            }}
            styles={{
              control: base => {
                return {
                  ...base,
                  minHeight: 'auto',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                }
              },
              singleValue: base => {
                return {
                  ...base,
                  margin: 0,
                  color: '#999999',
                }
              },
              placeholder: base => {
                return {
                  ...base,
                  margin: 0,
                  color: '#999999',
                }
              },
              clearIndicator: base => {
                return {
                  ...base,
                  color: '#999999',
                  padding: '7px',
                }
              },
              input: base => {
                return {
                  ...base,
                  margin: 0,
                  padding: 0,
                }
              },
              valueContainer: base => {
                return {
                  ...base,
                  padding: '8px 16px',
                }
              },
            }}
          />
        </div>
      ) : null}
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='material'>
          Material
        </label>
        <TextInput
          className={c.UploadForm_FullWidthInput}
          type='text'
          name='material'
          maxLength='50'
          onChange={e => {
            handleOnInputChange('material', e.target.value)
          }}
          value={inputState && inputState.material}
        />
      </div>
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='weight'>
          Weight
        </label>
        <TextInput
          className={c.UploadForm_FullWidthInput}
          type='text'
          name='weight'
          maxLength='50'
          onChange={e => {
            handleOnInputChange('weight', e.target.value)
          }}
          value={inputState && inputState.weight}
        />
      </div>
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='height'>
          Height
        </label>
        <TextInput
          className={c.UploadForm_FullWidthInput}
          type='text'
          name='height'
          maxLength='50'
          onChange={e => {
            handleOnInputChange('height', e.target.value)
          }}
          value={inputState && inputState.height}
        />
      </div>
      <div className={c.UploadForm_Field}>
        <label className={c.UploadForm_Label} htmlFor='category'>
          Category
        </label>
        <Select
          className={c.UploadForm_Select}
          name='category'
          placeholder='Select category'
          isClearable
          options={CATEGORIES}
          onChange={e => {
            if (e) handleOnInputChange('category', e.value)
          }}
          components={{
            IndicatorSeparator: () => null,
            // eslint-disable-next-line react/display-name
            DropdownIndicator: () => {
              // cx causes React to throw an error, so we remove it
              return <div className={c.UploadForm_DropdownIndicator} />
            },
          }}
          styles={{
            control: base => {
              return {
                ...base,
                minHeight: 'auto',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: 'none',
              }
            },
            singleValue: base => {
              return {
                ...base,
                margin: 0,
                color: '#999999',
              }
            },
            placeholder: base => {
              return {
                ...base,
                margin: 0,
                color: '#999999',
              }
            },
            clearIndicator: base => {
              return {
                ...base,
                color: '#999999',
                padding: '7px',
              }
            },
            input: base => {
              return {
                ...base,
                margin: 0,
                padding: 0,
              }
            },
            valueContainer: base => {
              return {
                ...base,
                padding: '8px 16px',
              }
            },
          }}
        />
      </div>
      <div className={c.UploadForm_ButtonGroup}>
        <Button className={c.UploadForm_Button} type='submit' disabled={disableSubmit}>
          {isLoading ? 'Processing...' : 'Save Model'}
        </Button>
      </div>
    </form>
  )
}

export default UploadForm
