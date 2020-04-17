import React from 'react';

import * as GraphqlService from '@services/graphql-service';
import { WithNewInvertedHeaderLayout } from '@style/Layout';
import { Spinner } from '@components/Spinner';
import { ModelCollection } from '@components/ModelCollection';

const graphqlService = GraphqlService.getInstance();

function Page() {
    const { error, loading, models } = graphqlService.useModelsByLikes();

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div data-cy="fetch-results-error">
                Error! We were not able to load results. Please try again later.
            </div>
        );
    }

    return (
        <ModelCollection
            models={models}
            noResultsText="We have no models to display right now"
            noResultsSubtext="Please try again later."
        />
    );
}

export const Landing = WithNewInvertedHeaderLayout(Page);
