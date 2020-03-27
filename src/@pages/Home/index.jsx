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
    );
};
const Page = () => {
    return (
        <HomeBodyStyle>
            <CardRow>
                <Models />
            </CardRow>
        </HomeBodyStyle>
    );
};

const Home = WithLayout(Page);

export { Home };
