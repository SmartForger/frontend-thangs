import React from 'react'
import classnames from 'classnames'

import { useServices } from '@hooks'
import { createUseStyles } from '@style'
import { ReactComponent as NotificationIcon } from '@svg/notification-icon.svg'

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
        stroke: ({ notificationsIsOpen }) =>
          notificationsIsOpen ? theme.colors.gold[500] : theme.colors.purple[500],
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

const NotificationsButton = ({ handleNotificationsClick }) => {
  const c = useStyles({})
  const { useFetchPerMount } = useServices()
  const { atom: notifications } = useFetchPerMount('notifications')
  const { data: notificationData } = notifications
  return (
    <div
      className={classnames(
        c.NotificationsButton_NotificationIconWrapper,
        c.NotificationsButton_ClickableButton
      )}
      onClick={handleNotificationsClick}
    >
      <NotificationIcon className={c.NotificationsButton_NotificationIcon} />
      {notificationData && notificationData.unreadCount > 0 && (
        <div className={c.NotificationsButton_UnreadBadge}>
          {notificationData.unreadCount}
        </div>
      )}
    </div>
  )
}

export default NotificationsButton
