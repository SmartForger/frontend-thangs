import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { ProfilePicture } from '@components/ProfilePicture';
import { Markdown } from '@components/Markdown';
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

const TabTitleGroup = styled.div`
    display: flex;
    align-self: start;
`;

const TabTitle = styled.div`
    font-family: ${props => props.theme.mainFont};
    color: ${props =>
        props.selected
            ? props.theme.selectedProfileTabColor
            : props.theme.unselectedProfileTabColor};
    font-size: 18px;
    display: flex;
    align-items: center;
    margin-right: 56px;
    cursor: pointer;

    svg {
        fill: ${props =>
            props.selected
                ? props.theme.selectedProfileTabColor
                : props.theme.unselectedProfileTabColor};
    }
`;

const Icon = styled.div`
    display: flex;
    height: 24px;
    width: 24px;
    align-items: center;
    margin-right: 8px;
`;

function Models({ selected, onClick }) {
    const { user } = useCurrentUser();
    const models = R.pathOr([], ['likes'])(user);
    const amount = models.length;

    return (
        <TabTitle selected={selected} onClick={onClick}>
            <Icon>
                <ModelIcon />
            </Icon>
            <span>Models {amount}</span>
        </TabTitle>
    );
}

function Likes({ selected, onClick }) {
    const { user } = useCurrentUser();
    const likes = R.pathOr([], ['likes'])(user);
    const amount = likes.filter(fields => fields.isLiked).length;

    return (
        <TabTitle selected={selected} onClick={onClick}>
            <Icon>
                <HeartIcon />
            </Icon>
            <span>Likes {amount}</span>
        </TabTitle>
    );
}

function About({ selected, onClick }) {
    const { user } = useCurrentUser();
    return (
        <TabTitle selected={selected} onClick={onClick}>
            <Icon>
                <AboutIcon />
            </Icon>
            <span>About</span>
        </TabTitle>
    );
}

const TabContent = styled.div`
    margin-top: 64px;
`;

const getDescription = R.pathOr(null, ['profile', 'description']);

function AboutContent({ selected }) {
    const { user } = useCurrentUser();

    if (!selected) {
        return null;
    }

    const description = getDescription(user);
    return <Markdown>{description}</Markdown>;
}

function ModelsContent({ selected }) {
    if (!selected) {
        return null;
    }
    return <div>Models</div>;
}

function LikesContent({ selected }) {
    if (!selected) {
        return null;
    }
    return <div>Likes</div>;
}

function Tabs() {
    const [selected, setSelected] = useState('models');

    const selectModel = () => setSelected('models');
    const selectLikes = () => setSelected('likes');
    const selectAbout = () => setSelected('about');

    return (
        <>
            <TabTitleGroup>
                <Models
                    selected={selected === 'models'}
                    onClick={selectModel}
                />
                <Likes selected={selected === 'likes'} onClick={selectLikes} />
                <About selected={selected === 'about'} onClick={selectAbout} />
            </TabTitleGroup>
            <TabContent>
                <ModelsContent selected={selected === 'models'} />
                <LikesContent selected={selected === 'likes'} />
                <AboutContent selected={selected === 'about'} />
            </TabContent>
        </>
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
