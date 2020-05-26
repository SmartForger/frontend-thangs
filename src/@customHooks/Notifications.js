import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const graphqlService = GraphqlService.getInstance();

export function useNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return { user: null };
    }
    const {
        loading,
        error,
        notifications,
    } = graphqlService.useNotificationsByUserId(id);
    return { loading, error, notifications };
}

export function useHasUnreadNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return false;
    }

    const {
        loading,
        error,
        hasUnreadNotifications,
    } = graphqlService.useUserHasUnreadNotifications(id);

    return { loading, error, hasUnreadNotifications };
}

export function useUpdateLastCheckedNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return false;
    }

    const [
        updateLastChecked,
        { loading, error, data },
    ] = graphqlService.useUpdateLastCheckedNotificationsForUser(id);

    return [updateLastChecked, { loading, error, data }];
}
