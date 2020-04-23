import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';
import * as R from 'ramda';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '250px' : 'minmax(250px, 1fr)')}
    );
    grid-auto-rows: 250px;
    gap: 16px;
    width: 100%;
`;

const NoResultsFrame = styled.div`
    background-color: ${props => props.theme.zeroStateBackground};
    color: ${props => props.theme.zeroStateColor};
    padding: 16px;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
`;

export function ModelCollection({
    models = [],
    maxPerRow = 4,
    noResultsText,
    noResultsSubtext,
}) {
    if (R.isEmpty(models)) {
        return <NoResultsFrame>{noResultsText}</NoResultsFrame>;
    }
    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
