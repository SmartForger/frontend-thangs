import React from 'react';
import styled from 'styled-components';

import { headerText } from '@style/text';
import { NoResults } from '@components/NoResults';
import { CardCollection } from '@components/CardCollection';
import { Spinner } from '@components/Spinner';
import { ProgressText } from '@components/ProgressText';
import { ReactComponent as LoadingIcon } from '@svg/image-loading-icon.svg';
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg';
import { isError, isProcessing } from '@utilities';

import { logger } from '../../logging';

import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const NoResultsStyled = styled(NoResults)`
    display: flex;
    align-items: center;
    > svg {
        margin-right: 8px;
    }
`;

const SmallLoadingIconStyled = styled(LoadingIcon)`
    width: 24px;
    height: 24px;
`;

const SmallErrorIconStyled = styled(ErrorIcon)`
    width: 24px;
    height: 24px;
`;

const Header = styled.div`
    ${headerText};
    margin-bottom: 24px;
`;

const Related = styled.div`
    grid-area: related;
`;

export function RelatedModels({ modelId, className }) {
    const {
        loading,
        error,
        model,
        startPolling,
        stopPolling,
    } = graphqlService.useModelByIdWithRelated(modelId);

    if (loading) {
        return <Spinner />;
    } else if (error) {
        logger.error('error', error);
        return <Spinner />;
    }

    if (isProcessing(model)) {
        startPolling(1000);
    } else {
        stopPolling();
    }

    return (
        <Related className={className}>
            <Header>Geometrically Similar</Header>

            {isProcessing(model) ? (
                <NoResultsStyled>
                    <SmallLoadingIconStyled />
                    <ProgressText text="Processing for matches" />
                </NoResultsStyled>
            ) : isError(model) ? (
                <NoResultsStyled>
                    <SmallErrorIconStyled />
                    An error occurred while processing for matches.
                </NoResultsStyled>
            ) : (
                <CardCollection
                    models={model && model.relatedModels}
                    maxPerRow={3}
                    noResultsText="There were no geometrically similar matches found."
                />
            )}
        </Related>
    );
}
