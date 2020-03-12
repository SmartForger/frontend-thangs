import React from 'react';
import { useParams } from 'react-router-dom';
import * as GraphqlService from '@services/graphql-service';

const Model = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelById(id);
    return <div>Model</div>;
};

export { Model };
