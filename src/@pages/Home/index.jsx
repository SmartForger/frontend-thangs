import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { WithNewThemeLayout } from '@style/Layout';
import { WithFlash } from '@components/Flash';
import {
    useCurrentUser,
    useModelsOwnedBy,
    useFoldersOwnedBy,
} from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { Message404 } from '../404';
import { ModelCollection } from '@components/CardCollection/ModelCollection';
import { FolderCollection } from '@components/CardCollection/FolderCollection';
import { subheaderText } from '@style/text';
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { BLUE_2 } from '../../@style/colors';

const TextHeader = styled.div`
    display: flex;
    align-items: center;
    margin-right: 56px;
    margin-bottom: 24px;
`;

const BlueIfSelected = css`
    ${props => props.selected && `color: ${BLUE_2};`}
`;

const ModelIconStyled = styled(ModelSquareIcon)`
    margin-right: 8px;
    width: 22px;
    height: 22px;
    ${BlueIfSelected};
`;

const FolderIconStyled = styled(FolderIcon)`
    margin-right: 8px;
    width: 22px;
    height: 22px;
    ${BlueIfSelected};
`;

const Title = styled(Link)`
    ${subheaderText};

    display: flex;
    align-items: center;
    color: inherit;
`;

function ModelsTitle({ count, selected }) {
    return (
        <Title to={!selected && '/models'} as={selected && 'div'}>
            <ModelIconStyled selected={selected} />
            Models {count}
        </Title>
    );
}

function FoldersTitle({ count, selected, className }) {
    return (
        <Title
            to={!selected && '/folders'}
            as={selected && 'div'}
            className={className}
        >
            <FolderIconStyled selected={selected} />
            Folders {count}
        </Title>
    );
}

function FoldersContent({ user }) {
    const { folders, loading, fetchMore, pageInfo } = useFoldersOwnedBy(
        user.id
    );

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <TextHeader>
                <ModelsTitle count={user.modelsCount} />
                <FoldersTitle
                    selected
                    count={user.foldersCount}
                    css={`
                        margin-left: 16px;
                    `}
                />
            </TextHeader>
            <WithFlash>
                <FolderCollection
                    folders={folders}
                    noResultsText="You have not created any folders yet."
                    fetchMore={() => fetchMore(pageInfo.endCursor)}
                    hasMore={pageInfo.hasNextPage}
                />
            </WithFlash>
        </div>
    );
}

function ModelsContent({ user }) {
    const { models, loading, fetchMore, pageInfo } = useModelsOwnedBy(user.id);

    if (loading) {
        return <Spinner />;
    }

    const sortedModels = models.sort((modelA, modelB) => {
        if (modelA.created === modelB.created) return 0;
        if (modelA.created > modelB.created) return -1;
        else return 1;
    });

    return (
        <ModelCollection
            models={sortedModels}
            noResultsText="You have not uploaded any models yet."
            fetchMore={() => fetchMore(pageInfo.endCursor)}
            hasMore={pageInfo.hasNextPage}
        />
    );
}

function ModelsPage() {
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
        <div>
            <TextHeader>
                <ModelsTitle selected count={user.modelsCount} />
                <FoldersTitle
                    user={user}
                    css={`
                        margin-left: 16px;
                    `}
                    count={user.foldersCount}
                />
            </TextHeader>
            <WithFlash>
                <ModelsContent user={user} />
            </WithFlash>
        </div>
    );
}

function FoldersPage() {
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

    return <FoldersContent user={user} />;
}

export const Folders = WithNewThemeLayout(FoldersPage);
export const Models = WithNewThemeLayout(ModelsPage);
