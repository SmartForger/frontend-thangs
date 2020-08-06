import * as commentService from '@services/graphql-service/comments'

const useComments = () => {
  const useCreateModelCommentMutation = modelId => {
    return commentService.useCreateModelCommentMutation(modelId)
  }

  return {
    useCreateModelCommentMutation,
  }
}

export default useComments
