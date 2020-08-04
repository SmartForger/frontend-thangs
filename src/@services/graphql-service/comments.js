import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

export const ALL_MODEL_COMMENTS_QUERY = gql`
    query allModelComments($modelId: ID) {
        allModelComments(modelId: $modelId) {
            id
            owner {
                id
                firstName
                lastName
                fullName
                profile {
                    avatarUrl
                }
            }
            body
            created
        }
    }
`

export const CREATE_MODEL_COMMENT_MUTATION = gql`
    mutation createModelComment($input: CreateModelCommentInput!) {
        createModelComment(input: $input) {
            comment {
                id
                body
                created
                owner {
                    id
                }
                model {
                    id
                }
            }
        }
    }
`

const useCreateModelCommentMutation = () => {
  return useMutation(CREATE_MODEL_COMMENT_MUTATION)
}

export { useCreateModelCommentMutation }
