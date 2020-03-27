import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '@customHooks/Storage';
import * as GraphqlService from '@services/graphql-service';
import { ModelPage } from './ModelPage';
import { WithFullScreenLayout } from '@style';
import { Spinner } from '@components/Spinner';
import { Page404 } from '../404';

const Page = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, model } = graphqlService.useModelById(id);
    const [user] = useLocalStorage('currentUser', null);

    if (loading) {
        return <Spinner />;
    } else if (!model) {
        return <Page404 />;
    } else if (error) {
        return <div>Error loading Model</div>;
    }
    return <ModelPage model={model} user={user} />;
};

const Model = WithFullScreenLayout(Page);
export { Model };
