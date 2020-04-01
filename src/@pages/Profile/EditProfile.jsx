import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const Name = styled.div`
    font-family: ${props => props.theme.mainFont};
    font-size: 24px;
    color: ${props => props.theme.profileNameColor};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 24px;
`;

const UploadButton = styled.button``;
const DeleteButton = styled.button``;

function PictureForm({ user, className }) {
    return (
        <Row className={className}>
            <ProfilePictureStyled user={user} size="80px" />
            <UploadButton>Upload New Photo</UploadButton>
            <DeleteButton>Delete</DeleteButton>
        </Row>
    );
}

const PictureFormStyled = styled(PictureForm)`
    margin-top: 64px;
`;

function InlineProfile({ user }) {
    return (
        <Row>
            <ProfilePictureStyled user={user} size="50px" />
            <Name>{user.fullName}</Name>
        </Row>
    );
}

function Page() {
    const { user } = useCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <div>
            <InlineProfile user={user} />
            <PictureFormStyled user={user} />
        </div>
    );
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
