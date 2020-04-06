import React from 'react';
import styled from 'styled-components';

import { useHistory, Link } from 'react-router-dom';
import { ProfilePicture } from '@components/ProfilePicture';
import { ModelCollection } from '@components/ModelCollection';
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';
import { ModelDetails } from '../ModelPreview/ModelDetailsPlaceholder';
import { LikeModelButton } from '@components/LikeModelButton';
import { CommentsForModel } from '@components/CommentsForModel';

import { useParams } from 'react-router-dom';
import { useLocalStorage } from '@customHooks/Storage';
import * as GraphqlService from '@services/graphql-service';
import { WithNewThemeLayout } from '@style';
import { Spinner } from '@components/Spinner';
import { Page404 } from '../404';

import {
    createBatch,
    userFactory,
    modelFactory,
    attachmentFactory,
} from '@helpers/content-factories';

const SHOW_OWNER = true;
const SHOW_MODELS = true;

const allowCssProp = props => (props.css ? props.css : '');

const BackButton = styled.button`
    width: 48px;
    height: 48px;
    border-radius: 48px;
    padding: 0;
    border: 0;
    margin-right: 16px;
`;

const HeaderStyled = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0;
`;

const ModelContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ScrollableColumn = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: calc(100vh - 300px);
    ${allowCssProp};
`;

const ModelViewer = styled.div`
    background: ${props => props.theme.modelViewerPlaceholder};
    border-radius: 8px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    height: 416px;
    margin-top: 8px;
    margin-right: 56px;
    margin-bottom: 48px;
`;

const ModelColumn = styled(ScrollableColumn)`
    flex-grow: 1;
`;

const Sidebar = styled(ScrollableColumn)`
    margin: 8px 0 0 24px;
    min-width: 440px;

    > table {
        font-family: Montserrat-Regular;
        font-size: 14px;
        font-weight: normal;
        line-height: 18px;
    }
    > table td:first-child {
        color: ${props => props.theme.modelDetailLabel};
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        text-transform: uppercase;
    }
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

    font-family: Montserrat-Regular;
    font-size: 24px;
    font-weight: normal;
`;

const ProfileLink = styled(Link)`
    display: block;
    color: ${props => props.theme.modelOwnerLink};

    font-family: Montserrat-Medium;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
`;

function ModelTitle({ model, className }) {
    return (
        <ModelTitleContainer className={className}>
            {model.owner && (
                <ProfileLink to={`/new/profile/${model.owner.id}`}>
                    <ModelOwnerProfilePicture size="48px" user={model.owner} />
                </ProfileLink>
            )}
            <ModelTitleContent>
                <ModelTitleText>{model.name}</ModelTitleText>
                {model.owner && (
                    <ProfileLink to={`/new/profile/${model.owner.id}`}>
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

const ModelDetailPage = ({ model, currentUser }) => {
    // Temporary placeholder data.
    const relatedModels = SHOW_MODELS ? createBatch(10, modelFactory) : [];
    model.owner = SHOW_OWNER ? userFactory() : undefined;
    model.attachment = attachmentFactory();
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
                    <ModelViewer />
                    <ModelCollection models={relatedModels} />
                </ModelColumn>
                <Sidebar>
                    <LikeModelButton currentUser={currentUser} model={model} />
                    <ModelTitle model={model} />
                    <ModelDetails model={model} />
                    <Comments model={model} />
                </Sidebar>
            </ModelContainer>
        </>
    );
};

function Page() {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelById(id);
    const [currentUser] = useLocalStorage('currentUser', null);

    if (loading) {
        return <Spinner />;
    } else if (!model) {
        return <Page404 />;
    } else if (error) {
        return <div>Error loading Model</div>;
    }
    return <ModelDetailPage model={model} currentUser={currentUser} />;
}

const ModelDetail = WithNewThemeLayout(Page);

export { ModelDetail };
