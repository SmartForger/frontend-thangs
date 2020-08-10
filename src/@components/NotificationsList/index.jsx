import React, { useEffect } from 'react'
import * as R from 'ramda'

import { useNotifications } from '@hooks'
import { Spinner, NoResults } from '@components'
import { logger } from '@utilities/logging'
import Notification from './Notification'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    NotificationsList: {
      maxWidth: '43rem',

      '& .notification + .notification': {
        marginTop: '4rem',
      },
    },
  }
})

const NotificationsList = ({ className, notifications, loading, error }) => {
  const c = useStyles()
<<<<<<< HEAD
  const {
    useNotificationsByUserId,
    // useUpdateLastCheckedNotifications,
  } = useNotifications()
  const { loading, error, notifications } = useNotificationsByUserId()
  // const [updateLastChecked] = useUpdateLastCheckedNotifications()
=======
  const { useUpdateLastCheckedNotifications } = useNotifications()
  const [updateLastChecked] = useUpdateLastCheckedNotifications()

  useEffect(() => {
    // updateLastChecked()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
>>>>>>> bd5312b04608a3fbbd1343f94ac290ab34da7593

  if (loading) {
    return <Spinner />
  } else if (error) {
    logger.error('error', error)
    return (
      <NoResults>
        We were not able to load notifications. Please try again later.
      </NoResults>
    )
  } else if (R.isEmpty(notifications)) {
    return <NoResults>No new notifications.</NoResults>
  }

  return (
    <ol className={classnames(className, c.NotificationsList)}>
      {notifications.map((notification, i) => (
        <Notification
          key={i}
          timestamp={notification.timestamp}
          actor={notification.actor}
          verb={notification.verb}
          target={notification.target}
          actionObject={notification.actionObject}
          notificationType={notification.notificationType}
          className='notification'
        />
      ))}
    </ol>
  )
}

export default NotificationsList
