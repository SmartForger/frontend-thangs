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

function InlineProfile({ user }) {
    if (!user) {
        return null;
    }
    return (
        <Row>
            <ProfilePictureStyled user={user} size="50px" />
            <Name>{user.fullName}</Name>
        </Row>
    );
}

function Page() {
    const { user } = useCurrentUser();

    return (
        <div>
            <InlineProfile user={user} />
        </div>
    );
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
