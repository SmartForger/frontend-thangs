import React from 'react'
import { useForm } from 'react-hook-form'
import { authenticationService } from '@services'
import * as GraphqlService from '@services/graphql-service'
import { formCalloutText } from '@style/text'
import { Button } from '@components/Button'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    NewModalCommentForm: {
      marginTop: '2.5rem',
    },
    NewModalCommentForm_Header: {
      ...formCalloutText,
      marginBottom: '1rem',
    },
    NewModalCommentForm_PostCommentTextArea: {
      width: '100%',
      marginBottom: '1.5rem',
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
    NewModalCommentForm_PostCommentButton: {
      marginBottom: '1.5rem',
      float: 'right',
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const NewModelCommentForm = ({ modelId }) => {
  const c = useStyles()
  const userId = authenticationService.getCurrentUserId()
  const { user } = graphqlService.useUserById(userId)

  const { register, handleSubmit, reset } = useForm()
  const [createModelComment] = graphqlService.useCreateModelCommentMutation({
    modelId,
  })

  async function formSubmit(data, e) {
    e.preventDefault()
    await createModelComment({
      variables: { input: { ownerId: userId, modelId, body: data.body } },
    })
    reset()
  }

  if (!user) {
    return null
  }

  return (
    <div className={c.NewModalCommentForm}>
      <div className={c.NewModalCommentForm_Header}>Add Comment</div>
      <form onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}>
        <textarea
          className={c.NewModalCommentForm_PostCommentTextArea}
          name='body'
          ref={register({ required: true })}
        />
        <Button className={c.NewModalCommentForm_PostCommentButton} type='submit'>
          Post Comment
        </Button>
      </form>
    </div>
  )
}

export default NewModelCommentForm
