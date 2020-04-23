import React from 'react';
import styled from 'styled-components';
import { useHistory, Link, useParams } from 'react-router-dom';

import { ProfilePicture } from '@components/ProfilePicture';
import { ModelCollection } from '@components/ModelCollection';
import { LikeModelButton } from '@components/LikeModelButton';
import { CommentsForModel } from '@components/CommentsForModel';
import { ModelViewer } from '@components/HoopsModelViewer';
import { ModelViewer as BackupViewer } from '@components/ModelViewer';
import { Spinner } from '@components/Spinner';
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';

import { useLocalStorage } from '@customHooks/Storage';
import * as GraphqlService from '@services/graphql-service';
import { WithNewThemeLayout } from '@style/Layout';
import { headerText, linkText } from '@style/text';

import { ModelDetails } from '../ModelPreview/ModelDetails';
import { Page404 } from '../404';

const allowCssProp = props => (props.css ? props.css : '');

const BackButton = styled.button`
    width: 48px;
    height: 48px;
    border-radius: 48px;
    padding: 0;
    border: 0;
    margin-right: 16px;
    cursor: pointer;
`;

const HeaderStyled = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0 16px;
`;

const ModelContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ScrollableColumn = styled.div`
    padding: 10px;
    margin: -10px;

    ${allowCssProp};
`;

const ModelViewerStyled = styled(ModelViewer)`
    height: 416px;
`;

const BackupViewerStyled = styled(BackupViewer)`
    height: 416px;
`;

const ModelColumn = styled(ScrollableColumn)`
    flex-grow: 1;
    padding: 0 16px;
    margin: 0 -16px;
`;

const Sidebar = styled(ScrollableColumn)`
    margin-left: 24px;
    width: 420px;
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

const ModelTitleText = styled.span`
    display: block;
    color: ${props => props.theme.modelTitleText};

    font-size: 24px;
    font-weight: normal;
`;

const ProfileLink = styled(Link)`
    display: block;
    color: ${props => props.theme.modelOwnerLink};

    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
`;

const Description = styled.div`
    margin: 32px 0;
`;

const DownloadLink = styled.a`
    ${linkText};
    font-weight: 500;
    margin-bottom: 24px;
    display: block;
`;

function ModelTitle({ model, className }) {
    return (
        <ModelTitleContainer className={className}>
            {model.owner && (
                <ProfileLink to={`/profile/${model.owner.id}`}>
                    <ModelOwnerProfilePicture size="48px" user={model.owner} />
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
    margin-top: 48px;
`;

const Header = styled.div`
    ${headerText};
    margin: 48px 0 24px;
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
                <ModelColumn>
                    {showBackupViewer ? (
                        <BackupViewerStyled model={model} />
                    ) : (
                        <ModelViewerStyled model={model} />
                    )}
                    <Header>Geometrically Similar</Header>
                    <ModelCollection
                        models={model.relatedModels}
                        maxPerRow={3}
                        noResultsText="There were no geometrically similar matches found."
                    />
                </ModelColumn>
                <Sidebar>
                    <LikeModelButton currentUser={currentUser} model={model} />
                    <ModelTitle model={model} />
                    <Description>{model.description}</Description>
                    <DownloadLink href={model.attachment.dataSrc}>
                        Download Model
                    </DownloadLink>
                    <ModelDetails model={model} />
                    <Comments model={model} />
                </Sidebar>
            </ModelContainer>
        </>
    );
};

function Page() {
    const { id } = useParams();
    const [showBackupViewer] = useLocalStorage('showBackupViewer', false);

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelByIdWithRelated(
        id
    );
    const [currentUser] = useLocalStorage('currentUser', null);

    if (loading) {
        return <Spinner />;
    } else if (!model) {
        return <Page404 />;
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
