import * as commentService from '@services/graphql-service/comments'

export function useModelCommentsPaged(modelId) {
  const response = commentService.useModelCommentsPaged(modelId)
  return response
}

export function useCreateModelCommentMutation(modelId) {
  return commentService.useCreateModelCommentMutation(modelId)
}
