import { gql } from 'apollo-boost';
import * as R from 'ramda';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAppUrl } from './utils';
import { parseModel } from './models';

const FIVE_MINUTES = 5 * 60 * 1000;

function parseActor(actor) {
    if (actor.__typename === 'UserType') {
        return {
            name: actor.fullName,
            img: actor.profile && createAppUrl(actor.profile.avatarUrl),
        };
    }
    return { name: null, img: null };
}

function parseTarget(target) {
    if (target.__typename === 'ModelType') {
        return { ...parseModel(target), isModel: true };
    }
    return { name: null, img: null, isModel: false };
}

function parseNotification(notification) {
    const actor = parseActor(notification.actor);
    const target = parseTarget(notification.target);
    const { verb, timestamp } = notification;
    return { actor, verb, target, timestamp };
}

const NOTIFICATIONS = gql`
    query user($id: ID, $lastCheckedTime: DateTime) {
        user(id: $id) {
            id
            lastCheckedNotifications
            notifications(since: $lastCheckedTime) {
                timestamp
                actor {
                    ... on UserType {
                        id
                        fullName
                        profile {
                            avatarUrl
                        }
                    }
                }
                verb
                target {
                    ... on ModelType {
                        id
                        name
                        uploadStatus
                        uploadedFile
                    }
                }
            }
        }
    }
`;

function isHandledNotificationType({ actor, target }) {
    return actor.__typename === 'UserType' && target.__typename === 'ModelType';
}

function getAndParseHandledNotifications(data) {
    return data && data.user
        ? R.map(
              parseNotification,
              R.filter(isHandledNotificationType, data.user.notifications)
          )
        : [];
}

export function useNotificationsByUserId(id) {
    const { loading, error, data } = useQuery(NOTIFICATIONS, {
        variables: { id, lastCheckedTime: null },
        pollInterval: FIVE_MINUTES,
    });

    const notifications = getAndParseHandledNotifications(data);
    return { loading, error, notifications };
}

const UNREAD_NOTIFICATIONS = gql`
    query user($id: ID) {
        user(id: $id) {
            id
            hasUnreadNotifications
        }
    }
`;

export function useUserHasUnreadNotifications(id) {
    const { loading, error, data } = useQuery(UNREAD_NOTIFICATIONS, {
        variables: { id },
        pollInterval: FIVE_MINUTES,
    });

    const hasUnreadNotifications =
        data && data.user && data.user.hasUnreadNotifications;
    return { loading, error, hasUnreadNotifications };
}

export function useUpdateLastCheckedNotificationsForUser(id) {
    const [updateLastChecked, { loading, error, data }] = useMutation(
        gql`
            mutation updateLastCheckedNotifications($id: ID!) {
                updateLastCheckedNotifications(id: $id) {
                    user {
                        lastCheckedNotifications
                    }
                }
            }
        `,
        {
            variables: { id },
            refetchQueries: [
                { query: UNREAD_NOTIFICATIONS, variables: { id } },
                {
                    query: NOTIFICATIONS,
                    variables: { id, lastCheckedTime: null },
                },
            ],
        }
    );

    return [updateLastChecked, { loading, error, data }];
}
