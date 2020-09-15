import React from 'react'
import * as R from 'ramda'

import { Spinner, NoResults } from '@components'
import { logger } from '@utilities/logging'
import Notification from './Notification'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(_theme => {
  return {
    NotificationsList: {
      maxWidth: '43rem',
      minHeight: '20rem',

      '& .notification + .notification': {
        marginTop: '4rem',
      },
    },
  }
})

const NotificationsList = ({ className }) => {
  const c = useStyles()
  const {
    notifications: { data = {}, isLoading, isError, error },
  } = useStoreon('notifications')
  const { notifications: notificationsArray } = data
  if (isLoading) {
    return <Spinner />
  } else if (isError && R.isEmpty(notificationsArray)) {
    logger.error('error', error)
    return (
      <NoResults>
        We were not able to load notifications. Please try again later.
      </NoResults>
    )
  } else if (R.isEmpty(notificationsArray) || R.isNil(notificationsArray)) {
    return <NoResults>No new notifications.</NoResults>
  }

  return (
    <ol className={classnames(className, c.NotificationsList)}>
      {notificationsArray &&
        notificationsArray.map((notification, i) => (
          <Notification
            key={`notification_${i}`}
            className='notification'
            {...notification}
          />
        ))}
    </ol>
  )
}

export default NotificationsList
