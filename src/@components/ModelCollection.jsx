import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';
import * as R from 'ramda';
import { zeroStateText } from '@style/text';
import { isError, isProcessing } from '@utilities';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '250px' : 'minmax(250px, 1fr)')}
    );
    gap: 16px;
    width: 100%;
`;

const NoResultsFrame = styled.div`
    ${zeroStateText};
    background-color: ${props => props.theme.zeroStateBackground};
    padding: 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
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
        return <NoResultsFrame>{noResultsText}</NoResultsFrame>;
    }

    const modelsToRender = showAllModels
        ? models
        : rejectErrorsAndProcessing(models);

    if (R.isEmpty(modelsToRender)) {
        return <NoResultsFrame>{noResultsText}</NoResultsFrame>;
    }

    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {modelsToRender.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
