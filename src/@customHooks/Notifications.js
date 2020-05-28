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

export function useHasUnreadNotifications() {
    const id = authenticationService.getCurrentUserId();
    if (!id) {
        return {
            loading: false,
            error: undefined,
            hasUnreadNotifications: false,
        };
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
