import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import { WithFlash } from '@components/Flash';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { Message404 } from '../404';
import { CardCollection } from '@components/CardCollection';
import { subheaderText } from '@style/text';
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { BLUE_2 } from '../../@style/colors';

export * from './EditProfile';
export * from './RedirectProfile';
export * from './Likes';

const TextHeader = styled.div`
    ${subheaderText}
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

const Row = styled.div`
    display: flex;
    align-items: center;
`;

function ModelsTitle({ user, selected, onClick }) {
    const models = R.pathOr([], ['models'])(user);
    const modelAmount = models.length;
    return (
        <Row
            onClick={onClick}
            css={`
                cursor: pointer;
            `}
        >
            <ModelIconStyled selected={selected} />
            Models {modelAmount}
        </Row>
    );
}

function FoldersTitle({ user, selected, onClick, className }) {
    const folders = R.pathOr([], ['folders'])(user);
    const folderAmount = folders.length;
    return (
        <Row
            onClick={onClick}
            className={className}
            css={`
                cursor: pointer;
            `}
        >
            <FolderIconStyled selected={selected} />
            Folders {folderAmount}
        </Row>
    );
}

const getModels = R.pathOr([], ['models']);
const getFolders = R.pathOr([], ['folders']);

function PageContent({ user }) {
    const [selected, setSelected] = useState('models');

    const selectModels = () => setSelected('models');
    const selectFolders = () => setSelected('folders');

    const models = getModels(user);
    const folders = getFolders(user);

    const sortedModels = models.sort((modelA, modelB) => {
        if (modelA.created === modelB.created) return 0;
        if (modelA.created > modelB.created) return -1;
        else return 1;
    });

    return (
        <div>
            <TextHeader>
                <ModelsTitle
                    selected={selected === 'models'}
                    onClick={selectModels}
                    user={user}
                />
                <FoldersTitle
                    selected={selected === 'folders'}
                    onClick={selectFolders}
                    user={user}
                    css={`
                        margin-left: 16px;
                    `}
                />
            </TextHeader>
            <WithFlash>
                {selected === 'models' ? (
                    <CardCollection
                        models={sortedModels}
                        noResultsText="This user has not uploaded any models yet."
                    />
                ) : (
                    <CardCollection
                        folders={folders}
                        noResultsText="This user has not uploaded any folders yet."
                    />
                )}
            </WithFlash>
        </div>
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

    return <PageContent user={user} />;
}

export const Home = WithNewThemeLayout(Page);
