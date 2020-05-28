import React from 'react';
import styled from 'styled-components/macro';
import { ModelCard } from './';
import { withApolloProvider } from '../../../.storybook/withApolloProvider';
import ThumbnailFixture from '../../../.storybook/fixtures/model-thumbnail.png';
import UserImgFixture from '../../../.storybook/fixtures/user-img.png';

export default {
    title: 'ModelCard',
    component: ModelCard,
    decorators: [withApolloProvider()],
};

const ContainerSize = styled.div`
    width: 344px;
    height: 270x;
`;

const modelFixture = {
    id: '9999',
    uploadStatus: 'COMPLETED',
    name: 'Awesome model',
    likesCount: 100,
    commentsCount: 523,
    owner: {
        id: '9998',
        fullName: 'Thangs Physna',
        profile: {
            avatarUrl: UserImgFixture,
        },
    },
    thumbnailUrl: ThumbnailFixture,
};

export function WithOwner() {
    return (
        <ContainerSize>
            <ModelCard model={modelFixture} withOwner></ModelCard>
        </ContainerSize>
    );
}

export function WithoutOwner() {
    return (
        <ContainerSize>
            <ModelCard model={modelFixture}></ModelCard>
        </ContainerSize>
    );
}
