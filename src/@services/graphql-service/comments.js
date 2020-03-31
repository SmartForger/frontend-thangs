import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { parseUser } from './users';

const ALL_MODEL_COMMENTS_QUERY = gql`
    query allModelComments($modelId: ID) {
        allModelComments(modelId: $modelId) {
            id
            owner {
                id
                firstName
                lastName
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

const CREATE_MODEL_COMMENT_MUTATION = gql`
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

const useCreateModelCommentMutation = ({ ownerId, body, modelId }) => {
    return useMutation(CREATE_MODEL_COMMENT_MUTATION, {
        variables: { input: { ownerId, body, modelId } },
        update: (
            store,
            {
                data: {
                    createModelComment: { comment },
                },
            }
        ) => {
            const { allModelComments } = store.readQuery({
                query: ALL_MODEL_COMMENTS_QUERY,
                variables: { modelId },
            });
            store.writeQuery({
                query: ALL_MODEL_COMMENTS_QUERY,
                variables: { modelId },
                data: {
                    allModelComments: allModelComments.concat(comment),
                },
            });
        },
    });
};

export { useAllModelComments, useCreateModelCommentMutation };
