import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const ALL_MODEL_COMMENTS_QUERY = gql`
    query allModelComments($modelId: ID) {
        allModelComments(modelId: $modelId) {
            id
            owner {
                id
                firstName
                lastName
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

    return [...data.allModelComments];
};

const useAllModelComments = modelId => {
    const { loading, error, data } = useQuery(ALL_MODEL_COMMENTS_QUERY, {
        variables: { modelId },
    });
    const comments = parseCommentPayload(data);
    return { loading, error, comments };
};

export { useAllModelComments };
