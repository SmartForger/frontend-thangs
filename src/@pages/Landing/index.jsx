import React from 'react';
import * as R from 'ramda';

import * as GraphqlService from '@services/graphql-service';
import { WithNewInvertedHeaderLayout } from '@style/Layout';
import { Spinner } from '@components/Spinner';
import { ModelCollection } from '@components/ModelCollection';

const graphqlService = GraphqlService.getInstance();

function Page() {
    const { error, loading, models } = graphqlService.useModelsByDate();

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
        <div>{!R.isEmpty(models) && <ModelCollection models={models} />}</div>
    );
}

const Landing = WithNewInvertedHeaderLayout(Page);

export { Landing };
