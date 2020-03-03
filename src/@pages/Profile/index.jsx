import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import { useGraphQL } from 'graphql-react';
import { BasicPageStyle } from '@style';
import { Button, ModelDisplay } from '@components';

const ProfileStyle = styled(BasicPageStyle)`
    display: grid;
    position: fixed;
    grid-template-rows: 5% 30% 65%;
    grid-template-columns: 30% 70%;
    grid-template-areas:
        '. .'
        'header header'
        'sidebar models';
`;

const HeaderStyled = styled.div`
    grid-area: header;
`;

const SidebarStyled = styled.div`
    grid-area: sidebar;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
`;

const SocialStyled = styled.div`
    width: 600px;
    height: 300px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-top: -40%;
    z-index: 1;
    pointer-events: none;

    > * {
        pointer-events: all;
    }
`;

const ProfilePicStyled = styled.div`
    background: grey;
    border-radius: 50%;
    height: 250px;
    width: 250px;
    margin-left: 75px;
`;

const ModelsStyled = styled.div`
    grid-area: models;
    display: flex;
    flex-flow: row wrap;
`;

const userQuery = id => `{
  user(id: "${id}") {
    id
    username
    email
    firstName
    lastName
    profile {
      description
      avatar
    }
}}`;

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

    const { loading, cacheValue = {} } = useGraphQL({
        fetchOptionsOverride(options) {
            const access = localStorage.getItem('accessToken');
            options.url = 'http://127.0.0.1:8000/graphql/';
            options.headers = {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
            };
        },
        operation: {
            query: userQuery(id),
        },
        loadOnMount: true,
        loadOnReload: true,
        loadOnReset: true,
    });

    if (loading) {
        return (
            <ProfileStyle>
                <div>Loading...</div>
            </ProfileStyle>
        );
    }

    return (
        <ProfileStyle>
            <HeaderStyled />
            <SidebarStyled>
                <SocialStyled>
                    <ProfilePicStyled />
                    <Button
                        name="Follow"
                        margin="0 0 0 40px"
                        maxwidth="150px"
                        routeto="/details/7574"
                    />
                </SocialStyled>
            </SidebarStyled>
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
