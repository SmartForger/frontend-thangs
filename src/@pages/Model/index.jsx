import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '@customHooks/Storage';
import * as GraphqlService from '@services/graphql-service';
import { ModelPage } from './ModelPage';

const Model = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelById(id);
    const [user] = useLocalStorage('currentUser', null);

    if (loading) {
        return <div>Loading</div>;
    } else if (!model) {
        return <div>Model does not exist</div>;
    } else if (error) {
        return <div>Error loading Model</div>;
    }
    return <ModelPage model={model} user={user} />;
};

export { Model };
