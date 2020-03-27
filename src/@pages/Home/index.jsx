import React from 'react';
import styled from 'styled-components';
import { DisplayCard, Slides } from '@components';
import { Spinner } from '@components/Spinner';
import { WithLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const HomeBodyStyle = styled.div`
    margin-top: 50px;
`;

const CardRow = styled.div`
    display: flex;
    justify-content: space-around;
`;

const ModelSlides = ({ models }) => {
    const modelData = models.map(model => {
        const owner = model.owner
            ? `${model.owner.firstName} ${model.owner.lastName}`
            : null;

        return {
            title: model.name,
            owner,
            route: `/model/${model.id}`,
        };
    });

    return <Slides data={modelData} />;
};

const Models = () => {
    const { error, loading, models } = graphqlService.useModelsByDate();
    return (
        <div>
            <DisplayCard
                percentage="10"
                headerContent="New models"
                fontSize="2"
                shadow
            >
                {loading ? (
                    <Spinner />
                ) : error || !models ? (
                    <div>Error</div>
                ) : (
                    <ModelSlides models={models} />
                )}
            </DisplayCard>
        </div>
    );
};

const NewspostsSlides = ({ newsposts }) => {
    const newspostData = newsposts.map(newspost => {
        const owner = newspost.owner
            ? `${newspost.owner.firstName} ${newspost.owner.lastName}`
            : null;

        return {
            title: newspost.title,
            owner,
            route: `/newspost/${newspost.id}`,
        };
    });

    return <Slides data={newspostData} />;
};

const Newsposts = () => {
    const { error, loading, newsposts } = graphqlService.useAllNewsposts();
    return (
        <div>
            <DisplayCard
                shadow
                headerContent="News"
                percentage="10"
                fontSize={2}
            >
                <NewspostsSlides newsposts={newsposts} />
            </DisplayCard>
        </div>
    );
};

const Page = () => {
    return (
        <HomeBodyStyle>
            <CardRow>
                <Models />
                <Newsposts />
            </CardRow>
        </HomeBodyStyle>
    );
};

const Home = WithLayout(Page);

export { Home };
