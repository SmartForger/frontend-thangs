import React from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style';
import { useParams } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';
import * as R from 'ramda';
import { Spinner } from '@components/Spinner';
import { Collection } from '@components/Collection';

const SearchResultsStyle = styled.div`
    margin-top: 50px;
`;

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
            {!R.isEmpty(models) && <Collection models={models} />}
        </SearchResultsStyle>
    );
};

const SearchResults = WithNewThemeLayout(Page);

export { SearchResults };
