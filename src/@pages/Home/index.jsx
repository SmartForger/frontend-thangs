import React from 'react';
import styled from 'styled-components';
import { DisplayCard, Slides } from '@components';
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

    return <Slides data={modelData} prefix="New Uploads" />;
};

const Page = () => {
    const { error, loading, models } = graphqlService.useModelsByDate();

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
                    {error || loading || !models ? (
                        <div>Loading</div>
                    ) : (
                        <ModelSlides models={models} />
                    )}
                </DisplayCard>
            </CardRow>
        </HomeBodyStyle>
    );
};

const Home = WithLayout(Page);

export { Home };
