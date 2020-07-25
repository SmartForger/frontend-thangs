import * as commentService from '@services/graphql-service/comments'

export function useModelCommentsPaged(modelId) {
  const response = commentService.useModelCommentsPaged(modelId)
  return response
}

export function useAllModelCommentsCount(modelId, _previousCursor) {
  const response = commentService.useAllModelCommentsCount(modelId)
  const { error, loading, count } = response
  return { error, loading, count }
}

export function useCreateModelCommentMutation(modelId) {
  return commentService.useCreateModelCommentMutation(modelId)
}
