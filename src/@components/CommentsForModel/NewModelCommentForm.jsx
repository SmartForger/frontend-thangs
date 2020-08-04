import React from 'react'
import { useForm } from 'react-hook-form'
import { authenticationService } from '@services'
import * as GraphqlService from '@services/graphql-service'
import { Button } from '@components/Button'
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
        boxShadow: theme.variables.boxShadow,
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

  const { register, handleSubmit, reset } = useForm()
  const [createModelComment] = graphqlService.useCreateModelCommentMutation({
    modelId,
  })

  async function formSubmit(data, e) {
    e.preventDefault()
    await createModelComment({
      variables: { input: { ownerId: userId, modelId: `${modelId}`, body: data.body } },
    })

    dispatch('fetch-model-comments', { id: modelId })
    reset()
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <div className={c.NewModalCommentForm_Header}>Add Comment</div>
      <form
        className={c.NewModalCommentForm}
        onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}
      >
        <textarea
          className={c.NewModalCommentForm_PostCommentTextArea}
          name='body'
          ref={register({ required: true })}
        />
        <Button className={c.NewModalCommentForm_PostCommentButton} type='submit'>
          Comment
        </Button>
      </form>
    </div>
  )
}

export default NewModelCommentForm
