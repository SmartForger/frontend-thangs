import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { ReactComponent as PencilIcon } from '@svg/pencil-icon.svg';
import { ModelCollection } from '@components/ModelCollection';

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

function Models({ selected, onClick, user }) {
    const models = R.pathOr([], ['models'])(user);
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

function Likes({ selected, onClick, user }) {
    const likes = getLikedModels(user);
    const amount = likes.length;

    return (
        <TabTitle selected={selected} onClick={onClick}>
            <Icon>
                <HeartIcon />
            </Icon>
            <span>Likes {amount}</span>
        </TabTitle>
    );
}

function About({ selected, onClick, user }) {
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
    width: 100%;
    display: flex;
    color: ${props => props.theme.profileContentColor};
    font-family: ${props => props.theme.mainFont};
`;

const getDescription = R.pathOr(null, ['profile', 'description']);
const getModels = R.pathOr([], ['models']);
const getLikedModels = R.pathOr([], ['likedModels']);

function AboutContent({ selected, user }) {
    if (!selected) {
        return null;
    }

    const description = getDescription(user);
    return <Markdown>{description}</Markdown>;
}

function ModelsContent({ selected, user }) {
    const models = getModels(user);

    if (!selected || R.isEmpty(models)) {
        return null;
    }
    return <ModelCollection models={models} />;
}

function LikesContent({ selected, user }) {
    if (!selected) {
        return null;
    }
    const models = getLikedModels(user);
    return <ModelCollection models={models} />;
}

const TabGroupContainer = styled.div`
    margin-top: 64px;
    width: 100%;
`;

function Tabs({ user }) {
    const [selected, setSelected] = useState('models');

    const selectModel = () => setSelected('models');
    const selectLikes = () => setSelected('likes');
    const selectAbout = () => setSelected('about');

    return (
        <TabGroupContainer>
            <TabTitleGroup>
                <Models
                    selected={selected === 'models'}
                    onClick={selectModel}
                    user={user}
                />
                <Likes
                    selected={selected === 'likes'}
                    onClick={selectLikes}
                    user={user}
                />
                <About
                    selected={selected === 'about'}
                    onClick={selectAbout}
                    user={user}
                />
            </TabTitleGroup>
            <TabContent>
                <ModelsContent selected={selected === 'models'} user={user} />
                <LikesContent selected={selected === 'likes'} user={user} />
                <AboutContent selected={selected === 'about'} user={user} />
            </TabContent>
        </TabGroupContainer>
    );
}

const Button = styled.button`
    color: ${props => props.theme.secondaryButtonText};
    background-color: ${props => props.theme.secondaryButton};
    font-size: 14px;
    padding: 8px 24px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;

    svg {
        margin-right: 8px;
    }
`;

function EditProfileButton({ viewedUser, className }) {
    const { user } = useCurrentUser();

    if (!user || user.id !== viewedUser.id) {
        return null;
    }

    return (
        <Link to={'/profile/edit'} className={className}>
            <Button>
                <PencilIcon />
                Edit Profile
            </Button>
        </Link>
    );
}

const EditProfileButtonStyled = styled(EditProfileButton)`
    margin-top: 16px;
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
            <EditProfileButtonStyled viewedUser={user} />
            <Tabs user={user} />
        </Centered>
    );
}

const Profile = WithNewThemeLayout(Page);

export { Profile };
