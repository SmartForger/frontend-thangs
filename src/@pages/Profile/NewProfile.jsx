import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { ProfilePicture } from '@components/ProfilePicture';
import { Page404 } from '../404';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as AboutIcon } from '@svg/about-icon.svg';
import { ReactComponent as ModelIcon } from '@svg/model-icon.svg';

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

const TabGroup = styled.div`
    display: flex;
    align-self: start;
`;

const TabTitle = styled.div`
    font-family: ${props => props.theme.mainFont};
    color: ${props => props.theme.profileTabColor};
    font-size: 18px;
    display: flex;
    align-items: center;

    svg {
        fill: ${props => props.theme.profileTabColor};
    }
`;

const Icon = styled.div`
    display: flex;
    height: 24px;
    width: 24px;
    align-items: center;
    margin-right: 8px;
`;

function Models() {
    const { user } = useCurrentUser();
    const models = R.pathOr([], ['likes'])(user);
    const amount = models.length;

    return (
        <TabTitle>
            <Icon>
                <ModelIcon />
            </Icon>
            <span>Models {amount}</span>
        </TabTitle>
    );
}

function Likes() {
    const { user } = useCurrentUser();
    const likes = R.pathOr([], ['likes'])(user);
    const amount = likes.filter(fields => fields.isLiked).length;

    return (
        <TabTitle>
            <Icon>
                <HeartIcon />
            </Icon>
            <span>Likes {amount}</span>
        </TabTitle>
    );
}

function About() {
    const { user } = useCurrentUser();
    return (
        <TabTitle>
            <Icon>
                <AboutIcon />
            </Icon>
            <span>About</span>
        </TabTitle>
    );
}

function Tabs() {
    return (
        <TabGroup>
            <Models />
            <Likes />
            <About />
        </TabGroup>
    );
}

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
            <Tabs />
        </Centered>
    );
}

const Profile = WithNewThemeLayout(Page);

export { Profile };
