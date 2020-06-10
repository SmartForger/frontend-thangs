import React from 'react';
import styled from 'styled-components/macro';
import { ModelCard } from '../ModelCard';
import { FolderCard } from '../FolderCard';
import { NoResults } from '../NoResults';

const ModelsStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '344px' : 'minmax(344px, 1fr)')}
    );
    gap: 16px;
    width: 100%;
`;

const nothingToDisplay = ({ models, folders }) => {
    if (models && models.length >= 1) {
        return false;
    } else if (folders && folders.length >= 1) {
        return false;
    }
    return true;
};

export function CardCollection({
    models = [],
    maxPerRow = 4,
    noResultsText,
    folders = [],
}) {
    if (nothingToDisplay({ models, folders })) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    return (
        <ModelsStyled singleRow={models.length + folders.length < maxPerRow}>
            {models.map((model, index) => (
                <ModelCard
                    key={`model-${model.id}:${index}`}
                    model={model}
                    withOwner={true}
                />
            ))}
            {folders.map((folder, index) => (
                <FolderCard
                    key={`folder=${folder.id}:${index}`}
                    folder={folder}
                />
            ))}
        </ModelsStyled>
    );
}
