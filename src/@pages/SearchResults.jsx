import React from 'react';
import styled from 'styled-components';
import { WithNewThemeLayout } from '@style';
import { useParams } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';
import * as R from 'ramda';
import { Spinner } from '@components/Spinner';
import { ModelCollection } from '@components/ModelCollection';

const SearchResultsStyle = styled.div`
    margin-top: 50px;
`;

const Header = styled.div`
    font-size: 24px;
    line-height: 36px;
    margin-bottom: 24px;
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
            <Header>Results for {searchQuery}</Header>
            {!R.isEmpty(models) && <ModelCollection models={models} />}
        </SearchResultsStyle>
    );
};

export const SearchResults = WithNewThemeLayout(Page);
