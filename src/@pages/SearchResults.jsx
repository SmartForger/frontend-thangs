import React from 'react';
import styled from 'styled-components/macro';
import { WithNewThemeLayout } from '@style';
import { useParams, Link } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';
import { Spinner } from '@components/Spinner';
import { CardCollection } from '@components/CardCollection';
import { BrandButton } from '../@components/Button';
import { SearchBar } from '@components/SearchBar';
import { NoResults } from '../@components/NoResults';
import { subheaderText } from '@style/text';
import { mediaMdPlus } from '../@style/media-queries';
import { ReactComponent as MatchingIcon } from '../@svg/matching-icon.svg';

const MatchingIconStyled = styled(MatchingIcon)`
    margin-right: 8px;
`;

const SearchResultsStyle = styled.div`
    margin-top: 32px;
`;

const Header = styled.div`
    ${subheaderText};
    margin-bottom: 24px;
`;

const Flex = styled.div`
    display: flex;
`;

function Matching() {
    return (
        <Link to={'/matching'}>
            <BrandButton
                css={`
                    width: 100%;
                `}
            >
                <MatchingIconStyled />
                <span>Search by Model</span>
            </BrandButton>
        </Link>
    );
}

const SearchResult = ({ searchQuery }) => {
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
            <CardCollection
                models={models}
                noResultsText="No results found. Try searching another keyword or search by model above."
            />
        </SearchResultsStyle>
    );
};

const Page = () => {
    const { searchQuery } = useParams();
    return (
        <>
            <Flex
                css={`
                    margin-bottom: 48px;
                `}
            >
                <Matching />
                <SearchBar
                    initialSearchQuery={searchQuery}
                    css={`
                        margin-left: 8px;

                        ${mediaMdPlus} {
                            margin-left: 16px;
                            height: 100%;
                        }
                    `}
                />
            </Flex>
            {searchQuery ? (
                <SearchResult searchQuery={searchQuery} />
            ) : (
                <NoResults>
                    Begin typing to search models by name, description, owner,
                    etc. Use search by model to find geometrically similar
                    matches to the model you upload.
                </NoResults>
            )}
        </>
    );
};

export const SearchResults = WithNewThemeLayout(Page);
