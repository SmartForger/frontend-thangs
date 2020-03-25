import React from 'react';
import styled from 'styled-components';
import { DisplayCard, Slides, Uploader } from '@components';
import { WithLayout } from '@style';

const HomeBodyStyle = styled.div`
    margin-top: 50px;
`;

const CardRow = styled.div`
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 40%;
    top: 47%;
`;

const Page = () => {
    const modelData = [
        {
            title: 'Fancy Screw',
            owner: 'CarlCPhysna',
            icon: 'Woops',
            route: '/details/5345',
        },
        {
            title: 'Engine Block',
            owner: 'ColinCPhysna',
            icon: 'Woops',
            route: '/details/5345',
        },
        {
            title: 'Cool Chair',
            owner: 'Info@physna.com',
            icon: 'Woops',
            route: '/details/5345',
        },
    ];

    const userData = [
        {
            title: 'CarlCPhysna',
            owner: '',
            route: '/profile/5345',
        },
        {
            title: 'ColinCPhysna',
            owner: '',
            route: '/profile/5345',
        },
        {
            title: 'Info@physna.com',
            owner: '',
            route: '/profile/5345',
        },
    ];

    const newsData = [
        {
            title: 'Big news whoa',
            owner: 'lorem ipsum lorem ipsum',
        },
        {
            title: 'More news? thank you!',
            owner: 'lorem ipsum lorem ipsum',
        },
        {
            title: 'No news',
            owner: 'lorem ipsum lorem ipsum',
        },
    ];
    return (
        <HomeBodyStyle>
            <CardRow>
                <DisplayCard
                    percentage="10"
                    headerContent="Most Viewed"
                    fontSize="2"
                    shadow
                    size="300"
                >
                    <Slides data={modelData} prefix="Uploaded By" />
                </DisplayCard>
                <DisplayCard
                    percentage="10"
                    headerContent="View Designs"
                    fontSize="2"
                    shadow
                    size="300"
                >
                    <Slides data={modelData} prefix="Uploaded By" />
                </DisplayCard>
                <DisplayCard
                    percentage="10"
                    headerContent="Community"
                    fontSize="2"
                    shadow
                    size="300"
                >
                    <Slides
                        data={userData}
                        prefix="a user you could connect with"
                        rounded
                    />
                </DisplayCard>
                <DisplayCard
                    percentage="10"
                    headerContent="News"
                    fontSize="2"
                    shadow
                    size="300"
                >
                    <Slides data={newsData} text />
                </DisplayCard>
                <Uploader />
            </CardRow>
        </HomeBodyStyle>
    );
};

const Home = WithLayout(Page);

export { Home };
