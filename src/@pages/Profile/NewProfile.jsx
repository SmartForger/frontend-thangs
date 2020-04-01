import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { WithNewThemeLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';
import { Spinner } from '@components/Spinner';
import { ProfilePicture } from '@components/ProfilePicture';
import { Page404 } from '../404';

const graphqlService = GraphqlService.getInstance();

const Centered = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Name = styled.div`
    font-family: ${props => props.theme.mainFont};
    font-size: 24px;
    color: ${props => props.theme.profileNameColor};
`;

function Page() {
    const { id } = useParams();

    const { loading, error, user } = graphqlService.useUserById(id);

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
                <Page404 />
            </div>
        );
    }

    return (
        <Centered>
            <ProfilePicture user={user} size="104px" />
            <Name>{user.fullName}</Name>
        </Centered>
    );
}

const Profile = WithNewThemeLayout(Page);

export { Profile };
