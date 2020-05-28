import React from 'react';
import { NewModelCommentForm } from './NewModelCommentForm';
import { authenticationService } from '@services';
import { USER_QUERY } from '../../@services/graphql-service/users';
import {
    ALL_MODEL_COMMENTS_QUERY,
    CREATE_MODEL_COMMENT_MUTATION,
} from '../../@services/graphql-service/comments';

import { withApolloProvider } from '../../../.storybook/withApolloProvider';

const MOCK_USER = {
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

const requestMockHandlers = {
    queries: [
        {
            type: ALL_MODEL_COMMENTS_QUERY,
            data: {
                allModelComments: [
                    {
                        id: null,
                        owner: MOCK_USER,
                        body: null,
                        created: null,
                    },
                ],
            },
        },
        {
            type: USER_QUERY,
            data: {
                user: MOCK_USER,
            },
        },
    ],
    mutations: [
        {
            type: CREATE_MODEL_COMMENT_MUTATION,
            data: { createModelComment: {} },
        },
    ],
};

export function Story() {
    authenticationService.getCurrentUser = () => ({ id: '1111' });

    return <NewModelCommentForm modelId="9999" />;
}

export default {
    title: 'NewModelCommentForm',
    component: NewModelCommentForm,
    decorators: [withApolloProvider({ requestMockHandlers })],
};
