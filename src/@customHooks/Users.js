import { useState, useEffect } from 'react';
import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const graphqlService = GraphqlService.getInstance();

function useAuthenticationServiceSubscription() {
    const [currentUser, setCurrentUser] = useState();
    useEffect(() => {
        // Subscribe to currentUser changes
        const unsubscribe = authenticationService.subscribe(event => {
            setCurrentUser(event.user);
        });
        return function cleanup() {
            // Unsubscribe to currentUser changes
            unsubscribe();
        };
    }, []);
    return { user: currentUser };
}

export function useCurrentUser() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return { loading: false, error: undefined, user: undefined };
    }

    const { loading, error, user } = graphqlService.useUserById(id);
    return { loading, error, user };
}
