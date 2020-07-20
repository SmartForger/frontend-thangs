import React from 'react';
import styled from 'styled-components/macro';
import { NoResults } from '../NoResults';
import { ModelCard } from '../ModelCard';
import { ShowMoreButton } from '../ShowMore';
import { Grid } from './Grid';

const NOOP = () => null;

const ShowMoreContainer = styled.div`
    margin-top: 32px;
    text-align: center;
`;

export function ModelCollection({
    models = [],
    maxPerRow = 4,
    noResultsText,
    fetchMore = NOOP,
    hasMore,
}) {
    if (!models || models.length < 1) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    return (
        <>
            <Grid singleRow={models.length < maxPerRow}>
                {models.map((model, index) => (
                    <ModelCard
                        key={`model-${model.id}:${index}`}
                        model={model}
                        withOwner={true}
                    />
                ))}
            </Grid>
            {hasMore && (
                <ShowMoreContainer>
                    <ShowMoreButton fetchMore={fetchMore} />
                </ShowMoreContainer>
            )}
        </>
    );
}
