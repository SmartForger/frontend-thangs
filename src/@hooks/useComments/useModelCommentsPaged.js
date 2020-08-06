import * as commentService from '@services/graphql-service/comments'

const useModelCommentsPaged = modelId => {
  return commentService.useModelCommentsPaged(modelId)
}

export default useModelCommentsPaged
