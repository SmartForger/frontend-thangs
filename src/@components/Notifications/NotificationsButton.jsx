import React, { useCallback } from 'react'
import classnames from 'classnames'

import { createUseStyles } from '@style'
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg'
import { useStoreon } from 'storeon/react'
import * as storeEventTypes from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    NotificationsButton: {},
    NotificationsButton_ClickableButton: {
      cursor: 'pointer',
    },
    NotificationsButton_NotificationIconWrapper: {
      position: 'relative',
    },
    NotificationsButton_NotificationIcon: {
      color: theme.colors.purple[400],
      '& path': {
        stroke: theme.colors.purple[500],
      },
    },
    NotificationsButton_UnreadBadge: {
      background: theme.colors.gold[500],
      borderRadius: '100%',
      color: theme.colors.purple[900],
      width: '.875rem',
      height: '.875rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '.5625rem',
      fontWeight: 'bold',
      position: 'absolute',
      top: '-.5rem',
      right: '.7rem',
    },
  }
})

const NotificationsButton = ({ onClick }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { notifications: { data: notifications } } = useStoreon('notifications')

  const handleNotificationsClick = useCallback(() => {
    if (notifications.unreadCount > 0) {
      dispatch(storeEventTypes.READ_NOTIFICATIONS)
    }
  }, [dispatch, notifications])
  
  return (
    <div
      className={classnames(
        c.NotificationsButton_NotificationIconWrapper,
        c.NotificationsButton_ClickableButton
      )}
      onClick={() => {
        handleNotificationsClick()
        onClick()
      }}
    >
      <NotificationIcon className={c.NotificationsButton_NotificationIcon} />
      {notifications && notifications.unreadCount > 0 && (
        <div className={c.NotificationsButton_UnreadBadge}>
          {notifications.unreadCount}
        </div>
      )}
    </div>
  )
}

export default NotificationsButton
