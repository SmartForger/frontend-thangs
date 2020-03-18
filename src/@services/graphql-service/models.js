import { gql } from 'apollo-boost';

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

export { MODEL_QUERY, LIKE_MODEL_MUTATION, UNLIKE_MODEL_MUTATION };
