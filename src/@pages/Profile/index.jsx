import React, { useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import { isError, isProcessing } from '@utilities';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { useCurrentUser } from '@customHooks/Users';
import { Spinner } from '@components/Spinner';
import { AnchorButton } from '@components/AnchorButton';
import { ProfilePicture } from '@components/ProfilePicture';
import { Markdown } from '@components/Markdown';
import { Message404 } from '../404';
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg';
import { ReactComponent as AboutIcon } from '@svg/about-icon.svg';
import { ReactComponent as ModelIcon } from '@svg/model-icon.svg';
import { ReactComponent as PencilIcon } from '@svg/pencil-icon.svg';
import { ModelCollection } from '@components/ModelCollection';
import { SecondaryButton } from '@components/Button';
import {
    subheaderText,
    tabNavigationText,
    activeTabNavigationText,
    profileAboutText,
} from '@style/text';

export * from './EditProfile';
export * from './RedirectProfile';

const graphqlService = GraphqlService.getInstance();

const Anchor = styled(AnchorButton)`
    margin-top: 16px;
    padding: 4px;
`;

const Frame = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 16px;
`;

const Name = styled.div`
    ${subheaderText};
    margin-top: 16px;
`;

const TabTitleGroup = styled.div`
    display: flex;
    align-self: start;
`;

const TabTitle = styled.div`
    ${props => (props.selected ? activeTabNavigationText : tabNavigationText)};

    display: flex;
    align-items: center;
    margin-right: 56px;
    cursor: pointer;
`;

const Icon = styled.div`
    display: flex;
    height: 24px;
    width: 24px;
    align-items: center;
    margin-right: 8px;
`;

const rejectErrorsAndProcessing = R.pipe(
    R.reject(isError),
    R.reject(isProcessing)
);

function ModelCount({ user }) {
    const models = R.pathOr([], ['models'])(user);
    const { user: currentUser, loading } = useCurrentUser();
    if (loading || !currentUser) {
        return <Spinner />;
    }

    const showAllModels = user.id === currentUser.id;

    const modelsToRender = showAllModels
        ? models
        : rejectErrorsAndProcessing(models);

    const amount = modelsToRender.length;
    return <span>Models {amount}</span>;
}

function Models({ selected, onClick, user }) {
    return (
        <TabTitle selected={selected} onClick={onClick}>
            <Icon>
                <ModelIcon />
            </Icon>
            <ModelCount user={user} />
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
    margin-top: 24px;
    width: 100%;
    display: flex;
`;

const MarkdownStyled = styled(Markdown)`
    max-width: 600px;
    margin: auto;
    ${profileAboutText};
`;

const getDescription = R.pathOr(null, ['profile', 'description']);
const getModels = R.pathOr([], ['models']);
const getLikedModels = R.pathOr([], ['likedModels']);

function AboutContent({ selected, user }) {
    if (!selected) {
        return null;
    }

    const description = getDescription(user);
    return <MarkdownStyled>{description}</MarkdownStyled>;
}

function ModelsContent({ selected, user }) {
    const models = getModels(user);
    const { user: currentUser, loading } = useCurrentUser();

    if (!selected) {
        return null;
    }

    if (loading || !currentUser) {
        return <Spinner />;
    }

    const sortedModels = models.sort((modelA, modelB) => {
        if (modelA.created === modelB.created) return 0;
        if (modelA.created > modelB.created) return -1;
        else return 1;
    });

    return (
        <ModelCollection
            models={sortedModels}
            noResultsText="This user has not uploaded any models yet."
            showAllModels={user.id === currentUser.id}
        />
    );
}

function LikesContent({ selected, user }) {
    if (!selected) {
        return null;
    }
    const models = getLikedModels(user);
    return (
        <ModelCollection
            models={models}
            noResultsText="This user has not liked any models yet."
        />
    );
}

const TabGroupContainer = styled.div`
    margin-top: 72px;
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

const EditButton = styled(SecondaryButton)`
    padding: 8px 16px;
    max-width: 100%;

    svg {
        margin-right: 8px;
    }
`;

function EditProfileButton({ viewedUser, className }) {
    const { user } = useCurrentUser();
    const history = useHistory();

    if (!user || user.id !== viewedUser.id) {
        return null;
    }

    return (
        <>
            <Link to={'/profile/edit'} className={className}>
                <EditButton>
                    <PencilIcon />
                    Edit Profile
                </EditButton>
            </Link>

            <Anchor
                onClick={() => {
                    authenticationService.logout();
                    history.push('/login');
                }}
            >
                Sign Out
            </Anchor>
        </>
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
                <Message404 />
            </div>
        );
    }

    return (
        <Frame>
            <ProfilePicture user={user} size="104px" />
            <Name>{user.fullName}</Name>
            <EditProfileButtonStyled viewedUser={user} />
            <Tabs user={user} />
        </Frame>
    );
}

export const Profile = WithNewThemeLayout(Page);
