import React from 'react';
import * as R from 'ramda';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import { useFolder } from '../../@customHooks/Folders';
import { useCurrentUser } from '../../@customHooks/Users';

import { WithFlash } from '../../@components/Flash';
import { Spinner } from '../../@components/Spinner';
import { CardCollection } from '../../@components/CardCollection';
import { Breadcrumbs } from '../../@components/Breadcrumbs';
import { WithNewThemeLayout } from '../../@style/Layout';
import { Message404 } from '../404';

const BreadcrumbsStyled = styled(Breadcrumbs)`
    margin-bottom: 40px;
`;

function Folder({ folder, modelCount }) {
    return (
        <div>
            <BreadcrumbsStyled
                modelsCount={6}
                folder={folder}
            ></BreadcrumbsStyled>
            <WithFlash>
                <CardCollection
                    models={folder.models}
                    noResultsText="Upload models to this folder and collaborate with other users privately."
                />
            </WithFlash>
        </div>
    );
}

function Page() {
    const { folderId } = useParams();

    const { loading, error, folder } = useFolder(folderId);
    const { loading: userLoading, error: userError, user } = useCurrentUser();

    if (loading || userLoading) {
        return <Spinner />;
    } else if (!folder || !user) {
        return <Message404 />;
    } else if (error | userError) {
        return <div>Error loading folder</div>;
    }

    const modelCount = R.length(user.models);
    return <Folder folder={folder} modelCount={modelCount} />;
}

export const FolderPage = WithNewThemeLayout(Page);
