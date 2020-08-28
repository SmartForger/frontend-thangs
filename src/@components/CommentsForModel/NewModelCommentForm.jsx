import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import { Button, TextInput } from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    NewModalCommentForm: {
      display: 'flex',
      marginBottom: '2.5rem',
    },
    NewModalCommentForm_Header: {
      ...theme.mixins.text.formCalloutText,
      marginBottom: '1rem',
    },
    NewModalCommentForm_PostCommentTextArea: {
      width: '100%',
      marginRight: '.75rem',
      resize: 'none',
      minHeight: '2.5rem',
      border: 'none',
      boxSizing: 'border-box',
      padding: '.5rem',
      height: '1.5rem',
      lineHeight: '1.5rem',
      borderRadius: '.25rem',

      '&:focus': {
        outline: 'none',
      },
    },
  }
})

const NewModelCommentForm = ({ modelId }) => {
  const c = useStyles()

  const { dispatch } = useStoreon()

  const initialState = {
    body: '',
  }

  const { onFormSubmit, onInputChange, inputState, clearAllInputs } = useForm({
    initialState,
  })

  const formSubmit = useCallback(
    async (inputState, isValid, _errors) => {
      if (isValid) {

        dispatch('new-model-comments', { id: modelId, body: inputState.body, onFinish: () => {
          clearAllInputs()
        } })
      }
    },
    [clearAllInputs, dispatch, modelId]
  )

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  return (
    <div>
      <div className={c.NewModalCommentForm_Header}>Add Comment</div>
      <form className={c.NewModalCommentForm} onSubmit={onFormSubmit(formSubmit)}>
        <TextInput
          className={c.NewModalCommentForm_PostCommentTextArea}
          name='body'
          value={inputState && inputState.body}
          onChange={e => {
            handleOnInputChange('body', e.target.value)
          }}
          required
        />
        <Button type='submit'>Comment</Button>
      </form>
    </div>
  )
}

export default NewModelCommentForm
