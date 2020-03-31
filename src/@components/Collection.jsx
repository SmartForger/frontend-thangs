import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';

const ModelsStyled = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    overflow-y: scroll;
`;

export function Collection(props) {
    const models = props.models || [];
    return (
        <ModelsStyled>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} />
            ))}
        </ModelsStyled>
    );
}
