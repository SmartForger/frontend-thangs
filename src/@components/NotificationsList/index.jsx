import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import { useNotifications } from '@customHooks/Notifications';
import { Spinner } from '@components/Spinner';
import { NoResults } from '@components/NoResults';
import { logger } from '../../logging';
import { Notification } from './Notification';

const List = styled.ol`
    max-width: 688px;

    .notification + .notification {
        margin-top: 16px;
    }
`;

export function NotificationsList() {
    const { loading, error, notifications } = useNotifications();

    if (loading) {
        return <Spinner />;
    } else if (error) {
        logger.error('error', error);
        return (
            <NoResults>
                We were not able to load notifications. Please try again later.
            </NoResults>
        );
    } else if (R.isEmpty(notifications)) {
        return <NoResults>No new notifications.</NoResults>;
    }

    return (
        <List>
            {notifications.map((notification, i) => (
                <Notification
                    key={i}
                    timestamp={notification.timestamp}
                    actor={notification.actor}
                    subject={notification.subject}
                    verb={notification.verb}
                    target={notification.target}
                    object={notification.object}
                    className="notification"
                />
            ))}
        </List>
    );
}
