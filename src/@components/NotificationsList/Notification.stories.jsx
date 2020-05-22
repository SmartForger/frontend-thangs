import React from 'react';
import { Notification } from './Notification';
import {
    // USER_LIKED_MODEL,
    // NOT_RECOGNIZED,
    // USER_DOWNLOADED_MODEL,
    // MODEL_CHANGED_STATUS,
    // MODEL_FAILED_PROCESSING,
    // MODEL_COMPLETED_PROCESSING,
    // USER_COMMENTED_ON_MODEL,
    // USER_UPLOADED_MODEL,
    USER_STARTED_FOLLOWING_USER,
} from '@services/graphql-service/notifications.js';

const TIME = '2020-05-14T20:04:05.677850+00:00';

export function UserStartedFollowingUser() {
    const props = {
        timestamp: TIME,
        actor: {
            fullName: 'Thangs User',
            profile: {
                avatarUrl: '',
            },
        },
        verb: 'started following',
        target: null,
        notificationType: USER_STARTED_FOLLOWING_USER,
        actionObject: null,
    };
    return <Notification {...props} />;
}

export default {
    title: 'Notification',
    component: Notification,
};
