import { useState, useEffect } from 'react';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const graphqlService = GraphqlService.getInstance();

const useCurrentUser = () => {
    const id =
        authenticationService.currentUserValue &&
        authenticationService.currentUserValue.id;
    if (!id) {
        return { user: null };
    }
    const { loading, error, user } = graphqlService.useUserById(id);
    return { loading, error, user };
};

export { useCurrentUser };
