import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import * as R from 'ramda';
import { ProfileSidebar, ModelDisplay } from '@components';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';
import { WithLayout } from '@style';
import { Spinner } from '@components/Spinner';
import { Page404 } from '../404';

const ProfileStyle = styled.div`
    display: grid;
    margin-top: 50px;
    grid-template-rows: 30% 70%;
    grid-template-columns: 30% 70%;
    grid-template-areas:
        'sidebar models'
        'sidebar models';
`;

const ModelsArea = styled.div`
    grid-area: models;
    padding-left: 32px;
`;

const ModelsStyled = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    overflow-y: scroll;
`;

const Models = ({ models }) => {
    const config = { mass: 6, tension: 2000, friction: 95, clamp: true };
    const [trail] = useTrail(models.length, () => ({
        config,
        to: { transform: 'translate(0,0) scale(1)' },
        from: { transform: 'translate(1000%,0) scale(0.6)' },
    }));
    return (
        <ModelsArea>
            <ModelsStyled>
                {trail.map((props, index) => (
                    <ModelDisplay
                        style={props}
                        key={index}
                        model={models[index]}
                    />
                ))}
            </ModelsStyled>
        </ModelsArea>
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
        return <Spinner />;
    }

    if (error) {
        return (
            <div data-cy="fetch-profile-error">
                Error! We were not able to this profile. Please try again later.
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

    const isCurrentUser = currentUserId === user.id;

    return (
        <ProfileStyle>
            <ProfileSidebar user={user} isCurrentUser={isCurrentUser} />
            {user.models &&
                !R.isEmpty(user.models) && <Models models={user.models} />}
        </ProfileStyle>
    );
};

const Profile = WithLayout(Page);

export { Profile };
