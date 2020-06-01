import React from 'react';
import styled from 'styled-components/macro';
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

const Row = styled.div`
    display: flex;
    flex-direction: row;

    margin-bottom: 24px;
    :last-of-type {
        margin-bottom: 0;
    }
    ${mediaLgPlus} {
        margin-bottom: 48px;
    }

    > * {
        flex-grow: 1;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: Column;

    ${mediaLgPlus} {
        margin-right: 24px;
        :last-of-type {
            margin-right: 0;
        }
    }
`;

const OnlyMobileRow = styled(Row)`
    ${mediaLgPlus} {
        display: none;
    }
`;

const OnlyDesktopColumn = styled(Column)`
    display: none;
    ${mediaLgPlus} {
        display: block;
    }
`;

const ModelViewerStyled = styled(ModelViewer)`
    display: flex;
    overflow: hidden;

    flex-direction: column;
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

function Details({ currentUser, model, className }) {
    return (
        <div className={className}>
            <LikeModelButton currentUser={currentUser} model={model} />
            <ModelTitle model={model} />
            <Description>{model.description}</Description>
            <DownloadLink model={model} />
            <ModelDetails model={model} />
        </div>
    );
}

const ModelDetailPage = ({ model, currentUser, showBackupViewer }) => {
    const history = useHistory();

    return (
        <>
            <HeaderStyled>
                <BackButton onClick={() => history.goBack()}>
                    <BackArrow />
                </BackButton>
            </HeaderStyled>
            <Row>
                <Column
                    css={`
                        ${mediaLgPlus} {
                            width: 65%;
                        }
                    `}
                >
                    <Row>
                        {showBackupViewer ? (
                            <BackupViewerStyled model={model} />
                        ) : (
                            <ModelViewerStyled model={model} />
                        )}
                    </Row>
                    <OnlyMobileRow>
                        <Details currentUser={currentUser} model={model} />
                    </OnlyMobileRow>
                    <Row>
                        <RelatedModels modelId={model.id} />
                    </Row>
                    <OnlyMobileRow>
                        <CommentsForModel model={model} />
                    </OnlyMobileRow>
                </Column>
                <OnlyDesktopColumn>
                    <Row>
                        <Details currentUser={currentUser} model={model} />
                    </Row>
                    <Row>
                        <CommentsForModel model={model} />
                    </Row>
                </OnlyDesktopColumn>
            </Row>
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
