import React, { useCallback } from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import { createUseStyles } from '@style'
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
      right: '-11.75rem',
      marginTop: '1rem',
      zIndex: '10',

      [sm]: {
        right: '0',
      },
    },

    DropdownMenu__Loading: {
      '& svg': {
        margin: 'auto',
      },
    },
  }
})

const Notifications = ({ className, myThangsMenu }) => {
  const c = useStyles()
  const {
    notifications: { data = {}, isLoading, isError },
  } = useStoreon('notifications')
  const { notifications: notificationsArray } = data

  const renderStatusItem = useCallback(() => {
    if (isLoading) {
      return (
        <DropdownItem>
          <Spinner />
        </DropdownItem>
      )
    } else if (isError && R.isEmpty(notificationsArray)) {
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
  }, [notificationsArray, isLoading, isError])

  const statusItem = renderStatusItem()

  return (
    <DropdownMenu
      className={classnames(className, c.Notifications)}
      TargetComponent={NotificationsButton}
      myThangsMenu={myThangsMenu}
    >
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
