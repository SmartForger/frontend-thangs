import React from 'react';
import { withApolloProvider } from '../../../.storybook/withApolloProvider';
import { Breadcrumbs } from './';

export default {
    title: 'Breadcrumbs',
    component: Breadcrumbs,
    decorators: [withApolloProvider()],
};

export function FolderBreadcrumbs() {
    const folderFixture = {
        name: '4 Cylinder Engine Project',
        id: 9,
    };
    return <Breadcrumbs modelsCount={6} folder={folderFixture}></Breadcrumbs>;
}
