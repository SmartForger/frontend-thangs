import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';
import * as R from 'ramda';
import { NoResults } from '@components/NoResults';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '250px' : 'minmax(250px, 1fr)')}
    );
    gap: 16px;
    width: 100%;
`;

export function ModelCollection({ models = [], maxPerRow = 4, noResultsText }) {
    if (!models) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    if (R.isEmpty(models)) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
