import * as GraphqlService from '@services/graphql-service';
import { authenticationService } from '@services';

const NOOP = () => undefined;

const graphqlService = GraphqlService.getInstance();

export function useNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return { loading: false, error: undefined, notifications: [] };
    }
    const {
        loading,
        error,
        notifications,
    } = graphqlService.useNotificationsByUserId(id);
    return { loading, error, notifications };
}

export function useUnreadNotificationCount() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return {
            loading: false,
            error: undefined,
            unreadNotifications: undefined,
        };
    }

    const {
        loading,
        error,
        unreadNotificationCount,
    } = graphqlService.useUserUnreadNotificationCount(id);

    return { loading, error, unreadNotificationCount };
}

export function useUpdateLastCheckedNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        const updateLastChecked = NOOP;
        return [
            updateLastChecked,
            { loading: false, error: undefined, data: undefined },
        ];
    }

    const [
        updateLastChecked,
        { loading, error, data },
    ] = graphqlService.useUpdateLastCheckedNotificationsForUser(id);

    return [updateLastChecked, { loading, error, data }];
}
