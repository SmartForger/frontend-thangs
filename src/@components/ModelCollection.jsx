import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';
import * as R from 'ramda';
import { isError, isProcessing } from '@utilities';
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

const rejectErrorsAndProcessing = R.pipe(
    R.reject(isError),
    R.reject(isProcessing)
);

export function ModelCollection({
    models = [],
    maxPerRow = 4,
    noResultsText,
    noResultsSubtext,
    showAllModels,
}) {
    if (!models) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    const modelsToRender = showAllModels
        ? models
        : rejectErrorsAndProcessing(models);

    if (R.isEmpty(modelsToRender)) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {modelsToRender.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
