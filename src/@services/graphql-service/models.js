import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as R from 'ramda';

const MODEL_QUERY = gql`
    query getModel($id: ID) {
        model(id: $id) {
            id
            name
            likes {
                isLiked
                owner {
                    id
                    firstName
                    lastName
                }
            }
            owner {
                firstName
                lastName
            }
            attachment {
                remoteId
            }
        }
    }
`;

const LIKE_MODEL_MUTATION = gql`
    mutation likeModel($userId: ID, $modelId: ID) {
        likeModel(userId: $userId, modelId: $modelId) {
            user {
                id
                firstName
                lastName
                profile {
                    description
                    avatar
                }
            }
            model {
                id
                name
                likes {
                    isLiked
                    owner {
                        id
                        firstName
                        lastName
                    }
                }
                owner {
                    firstName
                    lastName
                }
                attachment {
                    remoteId
                }
            }
            like {
                id
            }
        }
    }
`;

const UNLIKE_MODEL_MUTATION = gql`
    mutation unlikeModel($userId: ID, $modelId: ID) {
        unlikeModel(userId: $userId, modelId: $modelId) {
            user {
                id
                firstName
                lastName
                profile {
                    description
                    avatar
                }
            }
            model {
                id
                name
                likes {
                    isLiked
                    owner {
                        id
                        firstName
                        lastName
                    }
                }
                owner {
                    firstName
                    lastName
                }
                attachment {
                    remoteId
                }
            }
            like {
                id
            }
        }
    }
`;

const getRemoteId = R.pathOr(null, ['attachment', 'remoteId']);
const getModel = R.pathOr(null, ['model']);

const parseModelPayload = data => {
    const model = getModel(data);

    if (!model) {
        return null;
    }

    const remoteId = getRemoteId(model);
    const url = remoteId
        ? `http://localhost:5000/get_attachment_full_data?attachmentid=${remoteId}`
        : null;

    return {
        ...model,
        url,
        tags: [
            { name: 'Yormy' },
            { name: 'Grimgooorsh' },
            { name: 'AB' },
            { name: 'Longish' },
            { name: 'Real long Tag' },
            { name: 'Screw' },
            { name: 'Bolt' },
            { name: 'Automotive' },
            { name: 'Clasp' },
            { name: 'Physna' },
            { name: 'Thangs.com' },
            { name: 'Boat' },
            { name: 'Trucks' },
            { name: 'Civil Engineering' },
            { name: '3D Printing' },
            { name: 'Yormy' },
        ],
    };
};

const useModelById = id => {
    const { loading, error, data } = useQuery(MODEL_QUERY, {
        variables: { id },
    });
    const model = parseModelPayload(data);

    return { loading, error, model };
};

const useLikeModelMutation = (userId, modelId) => {
    return useMutation(LIKE_MODEL_MUTATION, {
        variables: { userId, modelId },
        update: (
            store,
            {
                data: {
                    likeModel: { model },
                },
            },
        ) => {
            store.writeQuery({
                query: MODEL_QUERY,
                variables: { id: `${model.id}` },
                data: { model },
            });
        },
    });
};

const useUnlikeModelMutation = (userId, modelId) => {
    return useMutation(UNLIKE_MODEL_MUTATION, {
        variables: { userId, modelId },
        update: (
            store,
            {
                data: {
                    unlikeModel: { model },
                },
            },
        ) => {
            store.writeQuery({
                query: MODEL_QUERY,
                variables: { id: `${model.id}` },
                data: { model },
            });
        },
    });
};

export { useModelById, useLikeModelMutation, useUnlikeModelMutation };
