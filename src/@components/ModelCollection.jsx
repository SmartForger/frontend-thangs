import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-auto-rows: 250px;
    gap: 20px;
`;

export function ModelCollection({ models = [] }) {
    return (
        <ModelsStyled>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
