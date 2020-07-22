import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { linkText, modelTitleText } from '@style/text';
import { ProfilePicture } from '@components/ProfilePicture';

const ModelTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px 0;
`;

const ModelTitleContent = styled.div`
    flex-direction: column;
`;

const ProfileLink = styled(Link)`
    ${linkText};
    display: block;
    text-decoration: none;
`;

const ModelOwnerProfilePicture = styled(ProfilePicture)`
    margin-right: 16px;
`;

const ModelTitleText = styled.div`
    ${modelTitleText};
    margin-bottom: 8px;
`;

export function ModelTitle({ className, model }) {
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
