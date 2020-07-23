import React from 'react';
import styled from 'styled-components/macro';
import { useHistory, Link, useParams } from 'react-router-dom';

import { LikeModelButton } from '@components/LikeModelButton';
import { CommentsForModel } from '@components/CommentsForModel';
import { ModelViewer } from '@components/HoopsModelViewer';
import { ModelViewer as BackupViewer } from '@components/ModelViewer';
import { TextButton, BackButton } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { ProgressText } from '@components/ProgressText';
import { RelatedModels } from '@components/RelatedModels';
import { ModelTitle } from '@components/ModelTitle';

import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';
import { ReactComponent as VersionIcon } from '@svg/version-icon.svg';

import { useLocalStorage } from '@customHooks/Storage';
import { useDownloadModel } from '@customHooks/Models';
import * as GraphqlService from '@services/graphql-service';
import { WithNewThemeLayout } from '@style/Layout';
import { linkText, subheaderText, activeTabNavigationText } from '@style/text';
import {
    mediaSmPlus,
    mediaMdPlus,
    mediaLgPlus,
    mediaXlPlus,
} from '@style/media-queries';
import { BLUE_2 } from '@style/colors';
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

    > div {
        flex-grow: 1;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: Column;

    ${mediaLgPlus} {
        margin-right: 48px;
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

const Description = styled.div`
    margin: 32px 0;
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

const Header = styled.h2`
    ${subheaderText};
`;

const LinkTextButton = styled(TextButton)`
    ${linkText};
`;

const IconedButton = styled.div`
    ${activeTabNavigationText};
    display: flex;
    align-items: center;
    margin-right: 56px;
    cursor: pointer;
    *:not(:first-child) {
        margin-left: 12px;
    }
`;

const VersionIconStyled = styled(VersionIcon)``;

const VersionUpload = ({ modelId }) => (
    <div>
        <Header>
            Versions
        </Header>
        <Link to={`/model/${modelId}/upload`}>
            <IconedButton 
                css={`
                        margin-top: 24px
                `}>
                <VersionIconStyled
                    css={`
                        fill: ${BLUE_2} !important;
                        width: 20px;
                        height: 20px;
                    `}
                />
                <LinkTextButton >
                    Upload new version
                </LinkTextButton>
            </IconedButton>
        </Link>
    </div>
)


const Revised = () => (
    <IconedButton css={`
        margin-bottom: 24px;
    `}>
        <VersionIconStyled
            css={`
                fill: ${BLUE_2} !important;
                width: 20px;
                height: 20px;
            `}
        />
        <div>
            Revised from
        </div>
        <LinkTextButton >
            Geofry Thomas
        </LinkTextButton>
    </IconedButton>
)

function Details({ currentUser, model, className }) {
    return (
        <div className={className}>
            <Revised />
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
                <Column>
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
                <OnlyDesktopColumn
                    css={`
                        ${mediaLgPlus} {
                            max-width: 35%;
                        }
                    `}
                >
                    <Row>
                        <Details currentUser={currentUser} model={model} />
                    </Row>
                    <Row>
                        <VersionUpload modelId={model.id}/>
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
