import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

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
            }
            like {
                id
            }
        }
    }
`;

const parseModelPayload = data => {
    if (!data || !data.model) {
        return null;
    }

    return {
        ...data.model,
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
            }
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
            }
        ) => {
            store.writeQuery({
                query: MODEL_QUERY,
                variables: { id: `${model.id}` },
                data: { model },
            });
        },
    });
};

const UPLOAD_MODEL_MUTATION = gql`
    mutation uploadModel($file: Upload!) {
        uploadModel(file: $file) {
            model {
                id
            }
        }
    }
`;

const useUploadModelMutation = () => {
    return useMutation(UPLOAD_MODEL_MUTATION);
};

export {
    useModelById,
    useLikeModelMutation,
    useUnlikeModelMutation,
    useUploadModelMutation,
};
