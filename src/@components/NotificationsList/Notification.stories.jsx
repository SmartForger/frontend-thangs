import React from 'react';
import { Notification } from './Notification';
import {
    // USER_LIKED_MODEL,
    // NOT_RECOGNIZED,
    // USER_DOWNLOADED_MODEL,
    // MODEL_CHANGED_STATUS,
    MODEL_FAILED_PROCESSING,
    MODEL_COMPLETED_PROCESSING,
    // USER_COMMENTED_ON_MODEL,
    // USER_UPLOADED_MODEL,
    USER_STARTED_FOLLOWING_USER,
} from '@services/graphql-service/notifications.js';

const TIME = '2020-05-14T20:04:05.677850+00:00';

/**
 * MODEL_FAILED_PROCESSING
 * Verb: "changed status"
 * Actor: Model
 * Target: None
 * ActionObject: None
 */
export function ModelFailedProcessing() {
    const props = {
        timestamp: TIME,
        actor: {
            id: 9999,
            thumbnailUrl: '',
            name: '',
        },
        verb: 'changed status',
        target: null,
        notificationType: MODEL_FAILED_PROCESSING,
        actionObject: null,
    };
    return <Notification {...props} />;
}

/**
 * MODEL_COMPLETED_PROCESSING
 * Verb: "changed status"
 * Actor: Model
 * Target: None
 * ActionObject: None
 */
export function ModelCompletedProcessing() {
    const props = {
        timestamp: TIME,
        actor: {
            id: 9999,
            thumbnailUrl: '',
            name: '',
        },
        verb: 'changed status',
        target: null,
        notificationType: MODEL_COMPLETED_PROCESSING,
        actionObject: null,
    };
    return <Notification {...props} />;
}

/**
 * USER_STARTED_FOLLOWING_USER
 * Verb: "started following"
 * Actor: User
 * Target: None
 * ActionObject: None
 */
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
