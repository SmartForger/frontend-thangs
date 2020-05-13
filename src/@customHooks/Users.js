import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const graphqlService = GraphqlService.getInstance();

export function getCurrentUserId() {
    return (
        authenticationService.currentUserValue &&
        authenticationService.currentUserValue.id
    );
}

export function useCurrentUser() {
    const id = getCurrentUserId();
    if (!id) {
        return { user: null };
    }
    const { loading, error, user } = graphqlService.useUserById(id);
    return { loading, error, user };
}
