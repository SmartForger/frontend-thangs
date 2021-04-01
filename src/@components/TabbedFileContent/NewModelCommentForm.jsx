import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import { Button, TextInput, ProfilePicture } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    NewModelCommentForm: {
      display: 'flex',
      margin: '2rem 0',
    },
    NewModelCommentForm_Header: {
      ...theme.text.formCalloutText,
      marginBottom: '1rem',
    },
    NewModelCommentForm_PostCommentTextArea: {
      width: '100%',
      marginRight: '.5rem',
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
    NewModelCommentForm_ProfilePicture: {
      marginRight: '1rem',
    },
  }
})

const CommentForm = ({ c, modelId, user }) => {
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
      <div className={c.NewModelCommentForm_ProfilePicture}>
        <ProfilePicture
          size={'2.5rem'}
          name={user.fullName}
          userName={user.username}
          src={(user.profile && user.profile.avatarUrl) || user.avatarUrl}
        />
      </div>
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
const NewModelCommentForm = ({ modelId, currentUser, openSignupOverlay = noop }) => {
  const c = useStyles()

  const handleClick = useCallback(
    e => {
      e.preventDefault()
      openSignupOverlay('Join and start collaborating.', 'Comment')
      track('SignUp Prompt Overlay', { source: 'Comment' })
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
  return <CommentForm modelId={modelId} user={currentUser} c={c} />
}

export default NewModelCommentForm
