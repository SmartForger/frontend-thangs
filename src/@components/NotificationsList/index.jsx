import React from 'react';
import styled from 'styled-components/macro';
import * as R from 'ramda';

import { useNotifications } from '@customHooks/Notifications';
import { Spinner } from '@components/Spinner';
import { NoResults } from '@components/NoResults';
import { logger } from '../../logging';
import { Notification } from './Notification';

const List = styled.ol`
    max-width: 688px;

    .notification + .notification {
        margin-top: 48px;
    }
`;

export function NotificationsList({ className }) {
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
        <List className={className}>
            {notifications.map((notification, i) => (
                <Notification
                    key={i}
                    timestamp={notification.timestamp}
                    actor={notification.actor}
                    verb={notification.verb}
                    target={notification.target}
                    actionObject={notification.actionObject}
                    notificationType={notification.notificationType}
                    className="notification"
                />
            ))}
        </List>
    );
}
