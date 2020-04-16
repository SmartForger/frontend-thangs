import React from 'react';
import styled from 'styled-components';

import { useHistory, Link } from 'react-router-dom';
import { ProfilePicture } from '@components/ProfilePicture';
import { ReactComponent as BackArrow } from '@svg/back-arrow-icon.svg';
import { ModelDetails } from './ModelDetails';
import { LikeModelButton } from '@components/LikeModelButton';
import { ModelViewer } from '@components/ModelViewer';

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

const ModelViewerContainer = styled.div`
    flex-grow: 1;
    border-radius: 8px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    height: 416px;
    min-width: 50%;
    margin-top: 8px;
    margin-right: 56px;
    margin-bottom: 48px;
`;

const Sidebar = styled.div`
    margin: 8px 0 0 8px;
    min-width: 400px;

    > table {
        margin-bottom: 24px;
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

const PrimaryButton = styled(Link)`
    background: ${props => props.theme.modelPrimaryButtonBackground};
    color: ${props => props.theme.modelPrimaryButtonText};

    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 28px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    display: inline-block;
    text-decoration: none;
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
`;

const ModelOwnerLink = styled(Link)`
    display: block;
    color: ${props => props.theme.modelOwnerLink};

    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
`;

function ModelTitle({ model, className }) {
    return (
        <ModelTitleContainer className={className}>
            {model.owner && (
                <ModelOwnerProfilePicture size="48px" user={model.owner} />
            )}
            <ModelTitleContent>
                <ModelTitleText>{model.name}</ModelTitleText>
                {model.owner && (
                    <ModelOwnerLink to={`/profile/${model.owner.id}`}>
                        {model.owner.fullName}
                    </ModelOwnerLink>
                )}
            </ModelTitleContent>
        </ModelTitleContainer>
    );
}

const ModelPreviewPage = ({ model, currentUser }) => {
    const history = useHistory();

    return (
        <>
            <HeaderStyled>
                <BackButton onClick={() => history.goBack()}>
                    <BackArrow />
                </BackButton>
            </HeaderStyled>
            <ModelContainer>
                <ModelViewerContainer>
                    <ModelViewer model={model} />
                </ModelViewerContainer>
                <Sidebar>
                    <LikeModelButton currentUser={currentUser} model={model} />
                    <ModelTitle model={model} />
                    <ModelDetails model={model} />
                    <PrimaryButton to={`/model/${model.id}`}>
                        View details
                    </PrimaryButton>
                </Sidebar>
            </ModelContainer>
        </>
    );
};

export { ModelPreviewPage };
