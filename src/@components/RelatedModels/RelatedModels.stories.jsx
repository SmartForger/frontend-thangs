import React from 'react';
import { RelatedModels } from '.';
import { MODEL_WITH_RELATED_QUERY } from '../../@services/graphql-service/models';

import { withApolloProvider } from '../../../.storybook/withApolloProvider';

const MOCK_USER = {
    __typename: 'User',
    id: null,
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    fullName: null,
    profile: {
        description: null,
        avatarUrl: null,
    },
    inviteCode: null,
    likedModels: [],
    models: [],
    isBeingFollowedByRequester: false,
};

const MOCK_MODEL = {
    __typename: 'Model',
    id: 1,
    name: 'Test model',
    likes: [
        {
            isLiked: true,
            owner: MOCK_USER,
        },
    ],
    owner: MOCK_USER,
    attachment: {
        id: 0,
        attachmentId: 0,
    },
    likesCount: 11,
    commentsCount: 32,
    uploadStatus: 'PROCESSING',
    description: '',
    category: 'INDUSTRIAL',
    weight: '10',
    height: '10',
    material: 'None',
    uploadedFile: '',
};

const requestMockHandlers = {
    queries: [
        {
            type: MODEL_WITH_RELATED_QUERY,
            data: ({ id }) => {
                const uploadStatus =
                    id === 'model-processing'
                        ? 'PROCESSING'
                        : id === 'model-complete'
                        ? 'COMPLETE'
                        : 'ERROR';
                return {
                    model: {
                        ...MOCK_MODEL,
                        uploadStatus,
                        relatedModels: [],
                    },
                };
            },
        },
    ],
    mutations: [],
};

export function Processing() {
    return <RelatedModels modelId="model-processing" />;
}

export function ProcessingComplete() {
    return <RelatedModels modelId="model-complete" />;
}

export function ProcessingError() {
    return <RelatedModels modelId="model-error" />;
}

export default {
    title: 'RelatedModels',
    component: RelatedModels,
    decorators: [withApolloProvider({ requestMockHandlers })],
};
