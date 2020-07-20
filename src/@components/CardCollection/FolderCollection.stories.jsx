import React from 'react';
import { FolderCollection } from './FolderCollection';
import ThumbnailFixture from '../../../.storybook/fixtures/model-thumbnail.png';
import UserImgFixture from '../../../.storybook/fixtures/user-img.png';

const userFixture = {
    id: '9998',
    fullName: 'Thangs Physna',
    profile: {
        avatarUrl: UserImgFixture,
    },
};

const modelFixture = {
    id: '9999',
    uploadStatus: 'COMPLETED',
    name: 'Awesome model',
    likesCount: 100,
    commentsCount: 523,
    owner: userFixture,
    thumbnailUrl: ThumbnailFixture,
};

const folderFixture = {
    id: 1,
    name: 'test-folder',
    members: [userFixture, userFixture],
    models: [modelFixture, modelFixture, modelFixture],
};

export default {
    title: 'FolderCollection',
    component: FolderCollection,
};

export function NoResults() {
    return (
        <FolderCollection
            models={[]}
            noResultsText="This user hasn't created any folders."
        ></FolderCollection>
    );
}

export function SingleRowFolders() {
    return (
        <FolderCollection
            folders={[folderFixture, folderFixture]}
        ></FolderCollection>
    );
}

export function MultipleRowFolders() {
    return (
        <FolderCollection
            folders={[
                folderFixture,
                folderFixture,
                folderFixture,
                folderFixture,
                folderFixture,
                folderFixture,
            ]}
        ></FolderCollection>
    );
}
