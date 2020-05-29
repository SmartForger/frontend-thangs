import React from 'react';
import { FolderCreateModal } from './';
import { action } from '@storybook/addon-actions';
import { authenticationService } from '@services';
import { withApolloProvider } from '../../../.storybook/withApolloProvider';
import { CREATE_FOLDER_MUTATION } from '../../../src/@services/graphql-service/folders';
import { USER_QUERY } from '../../../src/@services/graphql-service/users';

export default {
    title: 'FolderCreateModal',
    component: FolderCreateModal,
};

export function Successful() {
    authenticationService.getCurrentUserId = () => '1111';
    return (
        <FolderCreateModal
            onCancel={action('cancel button clicked')}
            onSave={action('save button clicked')}
        ></FolderCreateModal>
    );
}
Successful.story = {
    decorators: [
        withApolloProvider({
            requestMockHandlers: {
                queries: [{ type: USER_QUERY, data: { user: {} } }],
                mutations: [
                    {
                        type: CREATE_FOLDER_MUTATION,
                        data: { createFolder: {} },
                    },
                ],
            },
        }),
    ],
};

export function Error() {
    authenticationService.getCurrentUserId = () => '1111';
    return (
        <FolderCreateModal
            onCancel={action('cancel button clicked')}
            onSave={action('save button clicked')}
        ></FolderCreateModal>
    );
}
Error.story = {
    decorators: [
        withApolloProvider({
            requestMockHandlers: {
                queries: [{ type: USER_QUERY, data: { user: {} } }],
                mutations: [
                    {
                        type: CREATE_FOLDER_MUTATION,
                        data: () => {
                            throw new Error('error in backend');
                        },
                    },
                ],
            },
        }),
    ],
};
