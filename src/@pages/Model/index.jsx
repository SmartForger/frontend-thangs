import React from 'react';
import { useParams } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';
import { ModelPage } from './ModelPage';

const Model = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelById(id);

    if (loading) {
        return <div>Loading</div>;
    } else if (!model) {
        return <div>Model does not exist</div>;
    } else if (error) {
        return <div>Error loading Model</div>;
    }
    return <ModelPage model={model} />;
};

export { Model };
