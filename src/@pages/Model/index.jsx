import React from 'react';
import styled from 'styled-components';
import { useHistory, Link, useParams } from 'react-router-dom';

import { ProfilePicture } from '@components/ProfilePicture';
import { LikeModelButton } from '@components/LikeModelButton';
import { CommentsForModel } from '@components/CommentsForModel';
import { ModelViewer } from '@components/HoopsModelViewer';
import { ModelViewer as BackupViewer } from '@components/ModelViewer';
import { TextButton, BackButton } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ProgressText } from '@components/ProgressText';
import { RelatedModels } from '@components/RelatedModels';

import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';

import { useLocalStorage } from '@customHooks/Storage';
import { useDownloadModel } from '@customHooks/Models';
import * as GraphqlService from '@services/graphql-service';
import { WithNewThemeLayout } from '@style/Layout';
import { linkText, modelTitleText } from '@style/text';
import {
    mediaSmPlus,
    mediaMdPlus,
    mediaLgPlus,
    mediaXlPlus,
} from '@style/media-queries';

import { ModelDetails } from '../ModelPreview/ModelDetails';
import { Message404 } from '../404';

const graphqlService = GraphqlService.getInstance();

const HeaderStyled = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0 16px;
`;

const ModelContainer = styled.div`
    display: grid;
    grid-template-areas:
        'viewer'
        'details'
        'related'
        'comments';
    row-gap: 24px;

    ${mediaLgPlus} {
        grid-template-columns: 62% auto;
        column-gap: 24px;
        row-gap: 48px;
        grid-template-areas:
            'viewer details'
            'related comments';
    }
`;

const ModelViewerStyled = styled(ModelViewer)`
    display: flex;
    overflow: hidden;

    flex-direction: column;
    grid-area: viewer;
    height: 375px;
    margin: 0 -16px;
    width: calc(100% + 32px);

    ${mediaSmPlus} {
        height: 460px;
    }

    ${mediaMdPlus} {
        height: 600px;
        margin: 0;
        width: 100%;
    }

    ${mediaLgPlus} {
        height: 616px;
        width: auto;
    }

    ${mediaXlPlus} {
        height: 616px;
    }
`;

const BackupViewerStyled = styled(BackupViewer)`
    height: 616px;
`;

const ModelTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px 0;
`;

const ModelTitleContent = styled.div`
    flex-direction: column;
`;

const ModelOwnerProfilePicture = styled(ProfilePicture)`
    margin-right: 16px;
`;

const ModelTitleText = styled.div`
    ${modelTitleText};
    margin-bottom: 8px;
`;

const ProfileLink = styled(Link)`
    ${linkText};
    display: block;
    text-decoration: none;
`;

const Description = styled.div`
    margin: 32px 0;
`;

function ModelTitle({ model, className }) {
    return (
        <ModelTitleContainer className={className}>
            {model.owner && (
                <ProfileLink to={`/profile/${model.owner.id}`}>
                    <ModelOwnerProfilePicture
                        size="48px"
                        name={model.owner.fullName}
                        src={model.owner.profile.avatarUrl}
                    />
                </ProfileLink>
            )}
            <ModelTitleContent>
                <ModelTitleText>{model.name}</ModelTitleText>
                {model.owner && (
                    <ProfileLink to={`/profile/${model.owner.id}`}>
                        {model.owner.fullName}
                    </ProfileLink>
                )}
            </ModelTitleContent>
        </ModelTitleContainer>
    );
}

const Comments = styled(CommentsForModel)`
    grid-area: comments;
`;

const DownloadTextButton = styled(TextButton)`
    ${linkText};
    width: 122px;
    text-align: left;
    margin-bottom: 24px;
`;

function DownloadLink({ model }) {
    const [isDownloading, hadError, downloadModel] = useDownloadModel(model);
    return (
        <DownloadTextButton onClick={downloadModel}>
            {isDownloading ? (
                <ProgressText text="Downloading" />
            ) : hadError ? (
                'Server Error'
            ) : (
                'Download Model'
            )}
        </DownloadTextButton>
    );
}

const Details = styled.div`
    grid-area: details;
`;

const ModelDetailPage = ({ model, currentUser, showBackupViewer }) => {
    const history = useHistory();

    return (
        <>
            <HeaderStyled>
                <BackButton onClick={() => history.goBack()}>
                    <BackArrow />
                </BackButton>
            </HeaderStyled>
            <ModelContainer>
                {showBackupViewer ? (
                    <BackupViewerStyled model={model} />
                ) : (
                    <ModelViewerStyled model={model} />
                )}
                <RelatedModels modelId={model.id} />
                <Details>
                    <LikeModelButton currentUser={currentUser} model={model} />
                    <ModelTitle model={model} />
                    <Description>{model.description}</Description>
                    <DownloadLink model={model} />
                    <ModelDetails model={model} />
                </Details>
                <Comments model={model} />
            </ModelContainer>
        </>
    );
};

function Page() {
    const { id } = useParams();
    const [showBackupViewer] = useLocalStorage('showBackupViewer', false);

    const { loading, error, model } = graphqlService.useModelById(id);
    const [currentUser] = useLocalStorage('currentUser', null);

    if (loading) {
        return <Spinner />;
    } else if (!model) {
        return <Message404 />;
    } else if (error) {
        return <div>Error loading Model</div>;
    }
    return (
        <ModelDetailPage
            model={model}
            currentUser={currentUser}
            showBackupViewer={showBackupViewer}
        />
    );
}

export const ModelDetail = WithNewThemeLayout(Page);
