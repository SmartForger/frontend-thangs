import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import { Button, TextInput } from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  return {
    NewModelCommentForm: {
      display: 'flex',
      margin: '2rem 0',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    NewModelCommentForm_Header: {
      ...theme.text.formCalloutText,
      marginBottom: '1rem',
    },
    NewModelCommentForm_PostCommentTextArea: {
      width: '100%',
      marginBottom: '.75rem',
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

const CommentForm = ({ c, modelId }) => {
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
        dispatch(types.NEW_MODEL_COMMENTS, {
          id: modelId,
          body: inputState.body,
          onFinish: () => {
            clearAllInputs()
          },
        })
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
    <form className={c.NewModelCommentForm} onSubmit={onFormSubmit(formSubmit)}>
      <TextInput
        className={c.NewModelCommentForm_PostCommentTextArea}
        name='body'
        value={inputState && inputState.body}
        onChange={e => {
          handleOnInputChange('body', e.target.value)
        }}
        placeholder={'Add a public comment'}
        required
      />
      <Button type='submit'>Comment</Button>
    </form>
  )
}
const noop = () => null
const NewModelCommentForm = ({ modelId, openSignupOverlay = noop }) => {
  const c = useStyles()

  const handleClick = useCallback(
    e => {
      e.preventDefault()
      openSignupOverlay('Join and start collaborating.')
      pendo.track('SignUp Prompt Overlay', { source: 'Comment' })
    },
    [openSignupOverlay]
  )

  if (!modelId) {
    return (
      <div className={c.NewModelCommentForm}>
        <TextInput
          className={c.NewModelCommentForm_PostCommentTextArea}
          placeholder={'Add a public comment'}
        />
        <Button onClick={handleClick}>Comment</Button>
      </div>
    )
  }
  return <CommentForm modelId={modelId} c={c} />
}

export default NewModelCommentForm
