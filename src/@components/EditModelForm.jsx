import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import {
  Button,
  Dropdown,
  Input,
  LicenseField,
  LikeModelButton,
  Textarea,
  Spacer,
} from '@components'
import { useForm } from '@hooks'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    EditModelForm: {
      width: '100%',
    },
    EditModelForm_Wrapper: {
      width: '100%',

      [md]: {
        width: ({ showViewer }) => (showViewer ? '16.875rem' : '21.75rem'),
      },

      '& button': {
        width: '100%',
      },
    },
    EditModelForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    EditModelForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
    },
    EditModelForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    EditModelForm_label: {
      margin: '.5rem 0',
    },
    EditModelForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    EditModelForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.colors.white[400],
    },
    EditModelForm_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    EditModel_ModelName: {
      wordBreak: 'break-all',
    },
    EditForm_FieldRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    EditForm_Field: {
      marginBottom: '1rem',
      flexGrow: 1,
    },
    EditForm_LicenseButton: {
      ...theme.variables.button,
      padding: '0.5rem 0.75rem',
      width: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.gold[500],
      border: 'none',
      borderRadius: '.5rem',
      color: theme.colors.black[500],
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      outline: 'none',
      textAlign: 'center',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      fontSize: '1rem',
      lineHeight: '1rem',
      fontWeight: '500',

      '&:hover': {
        backgroundColor: theme.colors.gold[700],
      },
    },
    EditForm_LicenseClearButton: {
      cursor: 'pointer',
      marginBottom: '1rem',
    },
    EditModelForm_ModelTitle: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& h3': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '18rem',
        display: 'inline-block',
        lineHeight: '1.25rem',
      },

      '& svg': {
        flex: 'none',
      },
    },
    EditModelForm_FieldRow: {
      alignItems: 'flex-end',
      display: 'flex',
      flexDirection: 'row',
    },
  }
})
const noop = () => null
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

const EditModelForm = ({
  model = {},
  onSubmit = noop,
  editProfileErrorMessage,
  showViewer,
}) => {
  const c = useStyles({ showViewer })
  const firstInputRef = useRef(null)

  const initialState = {
    id: model.id,
    name: model.name || '',
    description: model.description || '',
    material: model.material || '',
    height: model.height || '',
    weight: model.weight || '',
    category: model.category || '',
    license: model.license || null,
  }

  const { onFormSubmit, onInputChange, inputState } = useForm({
    initialState,
  })

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  const handleLicenseChange = data => {
    onInputChange('license', data)
  }

  const selectedCategory = useMemo(() => {
    return R.find(R.propEq('value', model.category), CATEGORIES)
  }, [model])

  useEffect(() => {
    firstInputRef.current.focus()
  }, [])

  return (
    <div className={c.EditModelForm_Wrapper}>
      <>
        <Spacer size='4rem' />
        <div className={c.EditModelForm_ModelTitle}>
          <FileIcon />
          <Spacer size={'1rem'} />
          <Title headerLevel={HeaderLevel.tertiary} title={model.name}>
            {model.name}
          </Title>
          <Spacer size={'.5rem'} />
          <LikeModelButton className={c.FileCard_Star} model={model} minimal />
        </div>
        <Spacer size='2rem' />
        <form
          className={c.EditModelForm}
          onSubmit={onFormSubmit(onSubmit)}
          data-cy='edit-model-form'
        >
          {editProfileErrorMessage && (
            <>
              <h4 className={c.EditModel_ErrorText} data-cy='edit-model-error'>
                {editProfileErrorMessage}
              </h4>
              <Spacer size='1rem' />
            </>
          )}
          <Input
            id='name-input'
            name='name'
            label='Name'
            maxLength='150'
            value={inputState && inputState.name}
            onChange={handleOnInputChange}
            inputRef={firstInputRef}
            required
          />
          <Spacer size='1rem' />
          <LicenseField
            model={model}
            className={c.EditModelForm_FieldRow}
            onChange={handleLicenseChange}
            value={inputState && inputState.license}
          />
          <Spacer size='1rem' />
          <Textarea
            id='description-input'
            name='description'
            label='Description'
            type='description'
            value={inputState && inputState.description}
            onChange={handleOnInputChange}
            required
          />
          <Spacer size='1rem' />
          <Input
            id='material-input'
            name='material'
            label='Material'
            maxLength='150'
            type='material'
            value={inputState && inputState.material}
            onChange={handleOnInputChange}
          />
          <Spacer size='1rem' />
          <Input
            id='height-input'
            name='height'
            label='Height'
            maxLength='150'
            type='height'
            value={inputState && inputState.height}
            onChange={handleOnInputChange}
          />
          <Spacer size='1rem' />
          <Input
            id='weight-input'
            name='weight'
            label='Weight'
            maxLength='150'
            type='weight'
            value={inputState && inputState.weight}
            onChange={handleOnInputChange}
          />
          <Spacer size='1rem' />
          <Dropdown
            className={c.UploadForm_Select}
            name='category'
            placeholder='Select category'
            defaultValue={selectedCategory}
            isClearable
            options={CATEGORIES}
            onChange={e => {
              if (e) handleOnInputChange('category', e.value)
            }}
            label='Category'
          />
          <Spacer size='2rem' />
          <Button type='submit'>Save Changes</Button>
          <Spacer size='1rem' />
        </form>
        <Spacer size='2.5rem' />
      </>
    </div>
  )
}

export default EditModelForm
