import React, { useCallback } from 'react'
import classnames from 'classnames'

import { createUseStyles } from '@style'
import { ReactComponent as NotificationIcon } from '@svg/icon-notification.svg'
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
      marginLeft: '1rem',
    },
    NotificationsButton_NotificationIcon: {
      '& > path': {
        fill: ({ myThangsMenu }) =>
          myThangsMenu ? theme.colors.black[500] : theme.colors.gold[500],
      },
    },
    NotificationsButton_UnreadBadge: {
      alignItems: 'center',
      background: '#30BE93',
      border: ({ myThangsMenu }) =>
        myThangsMenu
          ? `1px solid ${theme.colors.white[400]}`
          : `1px solid ${theme.colors.purple[900]}`,
      borderRadius: '100%',
      bottom: '1px',
      display: 'flex',
      fontSize: '.5625rem',
      fontWeight: 'bold',
      height: '.5rem',
      justifyContent: 'center',
      position: 'absolute',
      right: '-3px',
      width: '.5rem',
    },
  }
})

const NotificationsButton = ({ onClick, myThangsMenu }) => {
  const c = useStyles({ myThangsMenu })
  const { dispatch } = useStoreon()
  const {
    notifications: { data: notifications = {} },
  } = useStoreon('notifications')

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
        <div className={c.NotificationsButton_UnreadBadge}></div>
      )}
    </div>
  )
}

export default NotificationsButton
