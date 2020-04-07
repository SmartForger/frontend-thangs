import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as R from 'ramda';
import { getFileDataUrl } from './utils';

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
                    fullName
                }
            }
            owner {
                id
                firstName
                lastName
                fullName
            }
            attachment {
                id
                attachmentId
            }
            likesCount
            commentsCount
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
                fullName
                profile {
                    description
                    avatarUrl
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
                        fullName
                    }
                }
                owner {
                    id
                    firstName
                    lastName
                    fullName
                }
                attachment {
                    id
                    attachmentId
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
                fullName
                profile {
                    description
                    avatarUrl
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
                        fullName
                    }
                }
                owner {
                    id
                    firstName
                    lastName
                    fullName
                }
                attachment {
                    id
                    attachmentId
                }
            }
            like {
                id
            }
        }
    }
`;

const MODELS_BY_DATE_QUERY = gql`
    query modelsByDate {
        modelsByDate {
            id
            name
            owner {
                id
                firstName
                lastName
                fullName
                email
            }
            attachment {
                id
                filetype
                fileSize
            }
        }
    }
`;

const getAttachmentId = R.pathOr(null, ['attachment', 'attachmentId']);
const getModel = R.pathOr(null, ['model']);
const getModelsByDate = R.pathOr(null, ['modelsByDate']);
const getSearchModels = R.pathOr(null, ['searchModels']);

const parseModel = model => {
    const attachmentId = getAttachmentId(model);
    const url = attachmentId
        ? `${getFileDataUrl()}?attachment_id=${attachmentId}`
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

const parseModelsByDatePayload = data => {
    const models = getModelsByDate(data);
    if (!models) {
        return null;
    }

    return models.map(parseModel);
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

const UPLOAD_MODEL_MUTATION = gql`
    mutation uploadModel(
        $file: Upload!
        $name: String!
        $size: Int!
        $userEmail: String!
    ) {
        uploadModel(
            file: $file
            units: "mm"
            name: $name
            size: $size
            userEmail: $userEmail
        ) {
            model {
                id
            }
        }
    }
`;

const parseModelPayload = data => {
    const model = getModel(data);

    if (!model) {
        return null;
    }

    return parseModel(model);
};

const useModelsByDate = () => {
    const { error, loading, data } = useQuery(MODELS_BY_DATE_QUERY);

    const models = parseModelsByDatePayload(data);

    return { loading, error, models };
};

const SEARCH_MODELS_QUERY = gql`
    query searchModels($query: String!) {
        searchModels(query: $query) {
            id
            name
            owner {
                id
                firstName
                lastName
                fullName
            }
            attachment {
                id
                fileSize
                filetype
            }
            likesCount
            commentsCount
        }
    }
`;

const useUploadModelMutation = () => {
    return useMutation(UPLOAD_MODEL_MUTATION);
};

const parseSeachModelsPayload = data => {
    const models = getSearchModels(data);

    if (!models) {
        return null;
    }

    return models.map(parseModel);
};

const useSearchModels = searchQuery => {
    const { error, loading, data } = useQuery(SEARCH_MODELS_QUERY, {
        variables: { query: searchQuery },
    });

    const models = parseSeachModelsPayload(data);

    return { loading, error, models };
};

export {
    useModelById,
    useLikeModelMutation,
    useUnlikeModelMutation,
    useUploadModelMutation,
    useModelsByDate,
    useSearchModels,
};
