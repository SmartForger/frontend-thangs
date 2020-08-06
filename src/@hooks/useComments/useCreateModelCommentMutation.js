import * as commentService from '@services/graphql-service/comments'

const useCreateModelCommentMutation = modelId => {
  return commentService.useCreateModelCommentMutation(modelId)
}

export default useCreateModelCommentMutation
