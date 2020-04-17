import React from 'react';
import { ModelCard } from './ModelCard';
import styled from 'styled-components';
import * as R from 'ramda';
import { ReactComponent as NoResultsIcon } from '@svg/no-results-icon.svg';

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
    background-color: #dbdbdf;
    color: #88888b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 136px;
    padding-bottom: 168px;
    border-radius: 8px;
    width: 100%;
`;

const Text = styled.div`
    font-size: 18px;
    font-weight: 500;
    margin-top: 32px;
    margin-bottom: 8px;
`;

function NoResultsDisplay({ text, subtext }) {
    return (
        <NoResultsFrame>
            <NoResultsIcon />
            <Text>{text}</Text>
            <div>{subtext}</div>
        </NoResultsFrame>
    );
}

export function ModelCollection({
    models = [],
    maxPerRow = 4,
    noResultsText,
    noResultsSubtext,
}) {
    if (R.isEmpty(models)) {
        return (
            <NoResultsDisplay text={noResultsText} subtext={noResultsSubtext} />
        );
    }
    return (
        <ModelsStyled singleRow={models.length < maxPerRow}>
            {models.map((model, index) => (
                <ModelCard key={index} model={model} withOwner={true} />
            ))}
        </ModelsStyled>
    );
}
