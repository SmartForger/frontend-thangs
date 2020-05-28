import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { parseUser } from './users';

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
`;

const parseCommentPayload = data => {
    if (!data || !data.allModelComments) {
        return [];
    }

    return data.allModelComments.map(comment => {
        return {
            ...comment,
            owner: parseUser(comment.owner),
        };
    });
};

const useAllModelComments = modelId => {
    const { loading, error, data } = useQuery(ALL_MODEL_COMMENTS_QUERY, {
        variables: { modelId },
    });
    const comments = parseCommentPayload(data);
    return { loading, error, comments };
};

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
`;

const useCreateModelCommentMutation = ({ modelId }) => {
    return useMutation(CREATE_MODEL_COMMENT_MUTATION, {
        refetchQueries: [
            {
                query: ALL_MODEL_COMMENTS_QUERY,
                variables: { modelId },
            },
        ],
    });
};

export { useAllModelComments, useCreateModelCommentMutation };
