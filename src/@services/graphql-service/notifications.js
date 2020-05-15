import { gql } from 'apollo-boost';
import * as R from 'ramda';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { createAppUrl } from './utils';
import { parseModel } from './models';

const FIVE_MINUTES = 5 * 60 * 1000;

const USER_LIKED_MODEL = 'USER_LIKED_MODEL';
const NOT_RECOGNIZED = 'NOT_RECOGNIZED';
const USER_DOWNLOADED_MODEL = 'USER_DOWNLOADED_MODEL';
const MODEL_CHANGED_STATUS = 'MODEL_CHANGED_STATUS';
const USER_COMMENTED_ON_MODEL = 'USER_COMMENTED_ON_MODEL';
const USER_UPLOADED_MODEL = 'USER_UPLOADED_MODEL';

const COMPLETED = 'COMPLETED';
const ERROR = 'ERROR';

const VERB_TO_NOTIFICATION_TYPE = {
    liked: USER_LIKED_MODEL,
    downloaded: USER_DOWNLOADED_MODEL,
    'changed status': MODEL_CHANGED_STATUS,
    commented: USER_COMMENTED_ON_MODEL,
    uploaded: USER_UPLOADED_MODEL,
};

export const isUserLikedModel = R.equals(USER_LIKED_MODEL);
export const isUserCommentedOnModel = R.equals(USER_COMMENTED_ON_MODEL);
export const isUserDownloadedModel = R.equals(USER_DOWNLOADED_MODEL);
export const isModelChangedStatus = R.equals(MODEL_CHANGED_STATUS);
export const isUserUploadedModel = R.equals(USER_UPLOADED_MODEL);

export const isModelCompletedProcessing = R.propEq('uploadStatus', COMPLETED);
export const isModelFailedProcessing = R.propEq('uploadStatus', ERROR);

function getNotificationType(verb) {
    const type = VERB_TO_NOTIFICATION_TYPE[verb];
    return type || NOT_RECOGNIZED;
}

function parseActor({ actor }, type) {
    if (
        isUserLikedModel(type) ||
        isUserDownloadedModel(type) ||
        isUserCommentedOnModel(type) ||
        isUserUploadedModel(type)
    ) {
        return {
            name: actor.fullName,
            id: actor.id,
            img: actor.profile && createAppUrl(actor.profile.avatarUrl),
        };
    }
    return null;
}

function parseTarget({ target, actor }, type) {
    if (
        isUserLikedModel(type) ||
        isUserDownloadedModel(type) ||
        isUserCommentedOnModel(type)
    ) {
        const model = parseModel(target);
        return { ...model, img: model.thumbnailUrl, isModel: true };
    } else if (isModelChangedStatus(type)) {
        const model = parseModel(actor);
        return { ...model, img: model.thumbnailUrl, isModel: true };
    }
    return null;
}

function parseActionObject({ actionObject }, type) {
    if (isUserCommentedOnModel(type)) {
        return {
            body: actionObject.body,
        };
    } else if (isUserUploadedModel(type)) {
        const model = parseModel(actionObject);
        return { ...model, img: model.thumbnailUrl, isModel: true };
    }
    return null;
}

function parseNotification(notification) {
    const type = getNotificationType(notification.verb);

    const actor = parseActor(notification, type);
    const target = parseTarget(notification, type);
    const actionObject = parseActionObject(notification, type);
    const { verb, timestamp } = notification;

    return {
        actor,
        verb,
        target,
        timestamp,
        actionObject,
        notificationType: type,
    };
}

const NOTIFICATIONS = gql`
    query user($id: ID!, $lastCheckedTime: DateTime) {
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
                    ... on ModelType {
                        id
                        name
                        uploadStatus
                        uploadedFile
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
                actionObject {
                    ... on ModelType {
                        id
                        name
                        uploadStatus
                        uploadedFile
                    }
                    ... on ModelCommentType {
                        id
                        body
                    }
                }
            }
        }
    }
`;

function isHandledNotificationType(notification) {
    const type = getNotificationType(notification.verb);
    return (
        isUserLikedModel(type) ||
        isUserDownloadedModel(type) ||
        (isModelChangedStatus(type) &&
            isModelCompletedProcessing(notification.actor)) ||
        (isModelChangedStatus(type) &&
            isModelFailedProcessing(notification.actor)) ||
        isUserCommentedOnModel(type) ||
        isUserUploadedModel(type)
    );
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
