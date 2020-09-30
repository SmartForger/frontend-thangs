import React, { useCallback } from 'react'
import * as R from 'ramda'

import { createUseStyles } from '@style'
import { logger } from '@utilities/logging'
import { DropdownMenu, DropdownItem } from '@components/DropdownMenu'
import NotificationsButton from './NotificationsButton'
import { useStoreon } from 'storeon/react'
import Notification from './Notification'
import { NoResults, Spinner } from '@components'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { sm },
  } = theme

  return {
    Notifications: {
      width: '18.75rem',
      maxHeight: '25.5rem',
      right: '-9rem',

      [sm]: {
        right: '.75rem',
      },
    },

    DropdownMenu__Loading: {
      '& svg': {
        margin: 'auto',
      },
    },
  }
})

const Notifications = () => {
  const c = useStyles()
  const {
    notifications: { data = {}, isLoading, isError, error },
  } = useStoreon('notifications')
  const { notifications: notificationsArray } = data

  const renderStatusItem = useCallback(() => {
    if (isLoading) {
      return (
        <DropdownItem className={c.DropdownMenu__Loading}>
          <Spinner />
        </DropdownItem>
      )
    } else if (isError && R.isEmpty(notificationsArray)) {
      logger.error('error', error)
      return (
        <DropdownItem>
          <NoResults>
            We were not able to load notifications. Please try again later.
          </NoResults>
        </DropdownItem>
      )
    } else if (R.isEmpty(notificationsArray) || R.isNil(notificationsArray)) {
      return (
        <DropdownItem>
          <NoResults>No new notifications.</NoResults>
        </DropdownItem>
      )
    }

    return null
  }, [c.DropdownMenu__Loading, notificationsArray, isLoading, isError, error])

  const statusItem = renderStatusItem()

  return (
    <DropdownMenu className={c.Notifications} TargetComponent={NotificationsButton}>
      {statusItem
        ? statusItem
        : notificationsArray &&
          notificationsArray.map(notification => (
            <Notification key={`notification_${notification.id}`} {...notification} />
          ))}
    </DropdownMenu>
  )
}

export default Notifications
