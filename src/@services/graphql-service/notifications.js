import { gql } from 'apollo-boost';
import * as R from 'ramda';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAppUrl } from './utils';
import { parseModel } from './models';

const FIVE_MINUTES = 5 * 60 * 1000;

const USER_LIKED_MODEL = 'USER_LIKED_MODEL';
const NOT_RECOGNIZED = 'NOT_RECOGNIZED';

const VERB_TO_NOTIFICATION_TYPE = {
    liked: USER_LIKED_MODEL,
};

const isUserLikedModel = R.equals(USER_LIKED_MODEL);

function getNotificationType(verb) {
    const type = VERB_TO_NOTIFICATION_TYPE[verb];
    return type || NOT_RECOGNIZED;
}

function parseActor(actor, type) {
    if (isUserLikedModel(type)) {
        return {
            name: actor.fullName,
        };
    }
    return { name: null };
}

function parseTarget(target, type) {
    if (isUserLikedModel(type)) {
        const model = parseModel(target);
        return { ...model, isModel: true };
    }
    return { name: null, isModel: false };
}

function parseSubject(actor, type) {
    if (isUserLikedModel(type)) {
        return {
            name: actor.fullName,
            id: actor.id,
            img: actor.profile && createAppUrl(actor.profile.avatarUrl),
        };
    }
    return { name: null, img: null };
}

function parseObject(target, type) {
    if (isUserLikedModel(type)) {
        const model = parseModel(target);
        return { ...model, img: model.thumbnailUrl, isModel: true };
    }
    return { name: null, img: null, isModel: false };
}

function parseNotification(notification) {
    const type = getNotificationType(notification.verb);

    const actor = parseActor(notification.actor, type);
    const subject = parseSubject(notification.actor, type);
    const target = parseTarget(notification.target, type);
    const object = parseObject(notification.target, type);
    const { verb, timestamp } = notification;

    return { actor, subject, verb, target, object, timestamp };
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

function isHandledNotificationType(notification) {
    const type = getNotificationType(notification.verb);
    return isUserLikedModel(type);
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
