import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import { BasicPageStyle } from '@style';
import { ProfileSidebar, ModelDisplay } from '@components';
import * as GraphqlService from '@services/graphql-service';

const ProfileStyle = styled(BasicPageStyle)`
    display: grid;
    position: fixed;
    grid-template-rows: 5% 30% 65%;
    grid-template-columns: 30% 70%;
    grid-template-areas:
        '. .'
        'sidebar header'
        'sidebar models';
`;

const HeaderStyled = styled.div`
    grid-area: header;
`;

const ModelsStyled = styled.div`
    grid-area: models;
    display: flex;
    flex-flow: row wrap;
`;

const Profile = () => {
    const { id } = useParams();
    const mockModels = [
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
        { attachmentName: 'Yourgoy', route: '/details/634' },
    ];

    const config = { mass: 6, tension: 2000, friction: 95, clamp: true };
    const [trail] = useTrail(mockModels.length, () => ({
        config,
        to: { transform: 'translate(0,0) scale(1)' },
        from: { transform: 'translate(1000%,0) scale(0.6)' },
    }));

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, user } = graphqlService.useUserById(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !user) {
        return (
            <div data-cy="fetch-profile-error">
                Error! We were not able to load your profile. Please try again
                later.
            </div>
        );
    }

    return (
        <ProfileStyle>
            <HeaderStyled />
            <ProfileSidebar user={user} />
            <ModelsStyled>
                {trail.map((props, index) => (
                    <ModelDisplay
                        style={props}
                        width="185px"
                        height="135px"
                        key={index}
                        route={mockModels[index].route}
                        name={mockModels[index].attachmentName}
                    />
                ))}
            </ModelsStyled>
        </ProfileStyle>
    );
};

export { Profile };
