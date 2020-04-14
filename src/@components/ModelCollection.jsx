import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '250px' : 'minmax(250px, 1fr)')}
    );
    grid-auto-rows: 250px;
    gap: 20px;
    width: 100%;
`;

export function ModelCollection({ models = [], maxPerRow = 4 }) {
    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
