import React from 'react';
import styled from 'styled-components';
import { WithLayout } from '@style';
import { useTrail } from 'react-spring';
import { useParams } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';
import * as R from 'ramda';
import { Spinner } from '@components/Spinner';
import { ModelDisplay } from '@components';

const SearchResultsStyle = styled.div`
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
    const { searchQuery } = useParams();
    const graphqlService = GraphqlService.getInstance();
    const { loading, error, models } = graphqlService.useSearchModels(
        searchQuery
    );

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div data-cy="fetch-results-error">
                Error! We were not able to load results. Please try again later.
            </div>
        );
    }

    return (
        <SearchResultsStyle>
            {!R.isEmpty(models) && <Models models={models} />}
        </SearchResultsStyle>
    );
};

const SearchResults = WithLayout(Page);

export { SearchResults };
