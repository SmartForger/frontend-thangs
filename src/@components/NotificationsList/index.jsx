import React, {useEffect} from 'react'
import * as R from 'ramda'

import { useNotifications } from '@hooks'
import { Spinner, NoResults } from '@components'
import { logger } from '@utilities/logging'
import Notification from './Notification'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import {useStoreon} from 'storeon/react'

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

const NotificationsList = ({className}) => {
  const c = useStyles()
  const {dispatch} = useStoreon('notifications')
  let filteredNotifications = []
  const {
    useNotificationsByUserId,
    // useUpdateLastCheckedNotifications,
  } = useNotifications()
  const {loading, error, notifications} = useNotificationsByUserId()

  if (notifications.length > 0) {
    filteredNotifications = notifications.filter(function(el) {
      if (el.actor != null && el.target != null && el.target.__typename !== 'UserType') {
        return el
      }
      return null
    })
  }

  useEffect(() => {
    if(filteredNotifications.length > 0){
      dispatch('setFilteredNotificationsCount', filteredNotifications.length)
    }
  }, [filteredNotifications.length, dispatch])

  // const [updateLastChecked] = useUpdateLastCheckedNotifications()

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
