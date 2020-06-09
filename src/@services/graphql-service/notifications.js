import { gql } from 'apollo-boost';
import * as R from 'ramda';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { parseModel } from './models';
import { parseUser } from './users';

const FIVE_MINUTES = 5 * 60 * 1000;

export const USER_LIKED_MODEL = 'USER_LIKED_MODEL';
export const NOT_RECOGNIZED = 'NOT_RECOGNIZED';
export const USER_DOWNLOADED_MODEL = 'USER_DOWNLOADED_MODEL';
export const MODEL_CHANGED_STATUS = 'MODEL_CHANGED_STATUS';
export const MODEL_FAILED_PROCESSING = 'MODEL_FAILED_PROCESSING';
export const MODEL_COMPLETED_PROCESSING = 'MODEL_COMPLETED_PROCESSING';
export const USER_COMMENTED_ON_MODEL = 'USER_COMMENTED_ON_MODEL';
export const USER_UPLOADED_MODEL = 'USER_UPLOADED_MODEL';
export const USER_STARTED_FOLLOWING_USER = 'USER_STARTED_FOLLOWING_USER';
export const USER_STARTED_FOLLOWING_MODEL = 'USER_STARTED_FOLLOWING_MODEL';

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
export const isModelFailedProcessing = R.equals(MODEL_FAILED_PROCESSING);
export const isModelCompletedProcessing = R.equals(MODEL_COMPLETED_PROCESSING);
export const isUserUploadedModel = R.equals(USER_UPLOADED_MODEL);
export const isUserStartedFollowingUser = R.equals(USER_STARTED_FOLLOWING_USER);

export const modelHasCompletedStatus = R.propEq('uploadStatus', COMPLETED);
export const modelHasFailedStatus = R.propEq('uploadStatus', ERROR);

function getNotificationType(verb, actor, target) {
    const type = VERB_TO_NOTIFICATION_TYPE[verb];
    if (!type) {
        return NOT_RECOGNIZED;
    }

    if (verb === 'started following') {
        if (isModel(target)) {
            return USER_STARTED_FOLLOWING_MODEL;
        }
        if (isUser(target)) {
            return USER_STARTED_FOLLOWING_USER;
        }
    }

    if (isModelChangedStatus(type) && modelHasCompletedStatus(actor)) {
        return MODEL_COMPLETED_PROCESSING;
    }

    if (isModelChangedStatus(type) && modelHasFailedStatus(actor)) {
        return MODEL_FAILED_PROCESSING;
    }

    return type;
}

const isModel = R.propEq('__typename', 'ModelType');
const isModelComment = R.propEq('__typename', 'ModelCommentType');
const isUser = R.propEq('__typename', 'UserType');

function parseGeneric(item) {
    if (!item) {
        return null;
    } else if (isUser(item)) {
        return parseUser(item);
    } else if (isModel(item)) {
        return parseModel(item);
    } else if (isModelComment(item)) {
        return item;
    }
    return null;
}

function parseNotification(notification) {
    const type = getNotificationType(
        notification.verb,
        notification.actor,
        notification.target
    );

    const actor = parseGeneric(notification.actor);
    const target = parseGeneric(notification.target);
    const actionObject = parseGeneric(notification.actionObject);
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

function isHandledNotificationType({ notificationType }) {
    return R.anyPass([
        isUserLikedModel,
        isUserDownloadedModel,
        isModelCompletedProcessing,
        isModelFailedProcessing,
        isUserCommentedOnModel,
        isUserUploadedModel,
        isUserStartedFollowingUser,
    ])(notificationType);
}

const prepareNotifications = R.pipe(
    R.map(parseNotification),
    R.filter(isHandledNotificationType)
);

function getAndParseHandledNotifications(data) {
    if (!data || !data.user) {
        return [];
    }

    return prepareNotifications(data.user.notifications);
}

export function useNotificationsByUserId(id) {
    const { loading, error, data } = useQuery(NOTIFICATIONS, {
        variables: { id, lastCheckedTime: null },
        fetchPolicy: 'no-cache',
        pollInterval: FIVE_MINUTES,
    });

    const notifications = getAndParseHandledNotifications(data);
    return { loading, error, notifications };
}

const UNREAD_NOTIFICATIONS = gql`
    query user($id: ID) {
        user(id: $id) {
            id
            unreadNotificationCount
        }
    }
`;

export function useUserUnreadNotificationCount(id) {
    const { loading, error, data } = useQuery(UNREAD_NOTIFICATIONS, {
        variables: { id },
        pollInterval: FIVE_MINUTES,
    });

    const unreadNotificationCount =
        data && data.user && data.user.unreadNotificationCount;
    return { loading, error, unreadNotificationCount };
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
