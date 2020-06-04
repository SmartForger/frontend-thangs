import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { Message404 } from '../404';
import { CardCollection } from '@components/CardCollection';
import { subheaderText } from '@style/text';

export * from './EditProfile';
export * from './RedirectProfile';
export * from './Likes';

const Frame = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 16px;
`;

const TextHeader = styled.div`
    display: flex;
    align-items: center;
    margin-right: 56px;
    cursor: pointer;
    ${subheaderText}
`;

function ObjectCount({ user }) {
    const models = R.pathOr([], ['models'])(user);
    const folders = R.pathOr([], ['folders'])(user);

    const modelAmount = models.length;
    const folderAmount = folders.length;
    return (
        <span>
            Models {modelAmount} Folders {folderAmount}
        </span>
    );
}

function Models({ onClick, user }) {
    return (
        <TextHeader onClick={onClick}>
            <ObjectCount user={user} />
        </TextHeader>
    );
}
const ContentContainer = styled.div`
    margin-top: 24px;
    width: 100%;
    display: flex;
`;

const getModels = R.pathOr([], ['models']);
const getFolders = R.pathOr([], ['folders']);

function ModelsContent({ user }) {
    const models = getModels(user);
    const folders = getFolders(user);

    const sortedModels = models.sort((modelA, modelB) => {
        if (modelA.created === modelB.created) return 0;
        if (modelA.created > modelB.created) return -1;
        else return 1;
    });

    return (
        <CardCollection
            models={sortedModels}
            folders={folders}
            noResultsText="This user has not uploaded any models yet."
        />
    );
}

const PageContainer = styled.div`
    margin-top: 24px;
    width: 100%;
`;

function PageContent({ user }) {
    return (
        <PageContainer>
            <Models user={user} />
            <ContentContainer>
                <ModelsContent user={user} />
            </ContentContainer>
        </PageContainer>
    );
}

function Page() {
    const { user, error, loading } = useCurrentUser();

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div data-cy="fetch-profile-error">
                Error! We were not able to load this profile. Please try again
                later.
            </div>
        );
    }

    if (!user) {
        return (
            <div data-cy="fetch-profile-error">
                <Message404 />
            </div>
        );
    }

    return (
        <Frame>
            <PageContent user={user} />
        </Frame>
    );
}

export const Home = WithNewThemeLayout(Page);
