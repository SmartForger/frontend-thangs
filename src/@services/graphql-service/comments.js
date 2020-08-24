import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

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
