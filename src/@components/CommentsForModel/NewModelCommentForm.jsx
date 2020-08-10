import React, { useCallback } from 'react'
import { useForm } from '@hooks'
import { authenticationService } from '@services'
import * as GraphqlService from '@services/graphql-service'
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
    NewModalCommentForm_PostCommentButton: {},
  }
})

const graphqlService = GraphqlService.getInstance()

const NewModelCommentForm = ({ modelId }) => {
  const c = useStyles()
  const userId = authenticationService.getCurrentUserId()
  const { user } = graphqlService.useUserById(userId)
  const { dispatch } = useStoreon()

  const initialState = {
    body: '',
  }

  const { onFormSubmit, onInputChange, inputState, clearAllInputs } = useForm({
    initialState,
  })

  const [createModelComment] = graphqlService.useCreateModelCommentMutation({
    modelId,
  })

  const formSubmit = useCallback(
    async (inputState, isValid, _errors) => {
      if (isValid) {
        await createModelComment({
          variables: {
            input: { ownerId: userId, modelId: `${modelId}`, body: inputState.body },
          },
        })

        dispatch('fetch-model-comments', { id: modelId })
        clearAllInputs()
      }
    },
    [clearAllInputs, createModelComment, dispatch, modelId, userId]
  )

  const handleOnInputChange = useCallback(
    (key, value) => {
      onInputChange(key, value)
    },
    [onInputChange]
  )

  if (!user) {
    return null
  }

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
        <Button className={c.NewModalCommentForm_PostCommentButton} type='submit'>
          Comment
        </Button>
      </form>
    </div>
  )
}

export default NewModelCommentForm
