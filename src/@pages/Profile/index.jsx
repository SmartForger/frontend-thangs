import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import { ProfileSidebar, ModelDisplay } from '@components';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { WithLayout } from '@style';

const ProfileStyle = styled.div`
    display: grid;
    grid-template-rows: 5% 30% 65%;
    grid-template-columns: 30% 70%;
    grid-template-areas:
        '. .'
        'sidebar models'
        'sidebar models';
`;

const ModelsStyled = styled.div`
    grid-area: models;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    overflow-y: scroll;
    height: 100%;
`;

const Models = ({ models }) => {
    const config = { mass: 6, tension: 2000, friction: 95, clamp: true };
    const [trail] = useTrail(models.length, () => ({
        config,
        to: { transform: 'translate(0,0) scale(1)' },
        from: { transform: 'translate(1000%,0) scale(0.6)' },
    }));
    return (
        <ModelsStyled>
            {trail.map((props, index) => (
                <ModelDisplay style={props} key={index} model={models[index]} />
            ))}
        </ModelsStyled>
    );
};

const Page = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, user } = graphqlService.useUserById(id);

    const currentUserId =
        authenticationService.currentUserValue &&
        authenticationService.currentUserValue.id;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !user) {
        return (
            <div data-cy="fetch-profile-error">
                Error! We were not able to this profile. Please try again later.
            </div>
        );
    }

    const isCurrentUser = currentUserId === user.id;

    return (
        <ProfileStyle>
            <ProfileSidebar user={user} isCurrentUser={isCurrentUser} />
            <Models models={user.models} />
        </ProfileStyle>
    );
};

const Profile = WithLayout(Page);

export { Profile };
