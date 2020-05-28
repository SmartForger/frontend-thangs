import React from 'react';
import styled from 'styled-components/macro';
import { FolderCard } from './';
import { withApolloProvider } from '../../../.storybook/withApolloProvider';
import ThumbnailFixture from '../../../.storybook/fixtures/model-thumbnail.png';
import UserImgFixture from '../../../.storybook/fixtures/user-img.png';

export default {
    title: 'FolderCard',
    component: FolderCard,
    decorators: [withApolloProvider()],
};

const ContainerSize = styled.div`
    width: 344px;
    height: 270px;
`;

const userFixture = {
    id: '9998',
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    fullName: 'Thangs Physna',
    profile: {
        avatarUrl: UserImgFixture,
    },
    inviteCode: null,
    likedModels: [],
    models: [],
    isBeingFollowedByRequester: false,
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

export function WithManyModels() {
    const folderFixture = {
        id: 1,
        name: 'test-folder',
        members: [userFixture, userFixture],
        models: [modelFixture, modelFixture, modelFixture],
    };
    return (
        <ContainerSize>
            <FolderCard folder={folderFixture}></FolderCard>
        </ContainerSize>
    );
}

export function WithSingleModel() {
    const folderFixture = {
        id: 1,
        name: 'test-folder',
        members: [userFixture, userFixture],
        models: [modelFixture],
    };
    return (
        <ContainerSize>
            <FolderCard folder={folderFixture}></FolderCard>
        </ContainerSize>
    );
}

export function WithNoModels() {
    const folderFixture = {
        id: 1,
        name: 'test-folder',
        members: [userFixture, userFixture],
        models: [],
    };
    return (
        <ContainerSize>
            <FolderCard folder={folderFixture}></FolderCard>
        </ContainerSize>
    );
}
