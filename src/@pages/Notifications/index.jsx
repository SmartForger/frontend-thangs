import React from 'react'
import { Button, Layout, NotificationsList, Spinner } from '@components'
import { useNotifications } from '@hooks'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Notifications: {
      marginTop: '3rem',
    },
    Notifications_Header: {
      ...theme.mixins.text.headerText,
    },
    Notifications_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    Notification_Button: {
      minWidth: '10rem',
      margin: '1rem 0',
    },
  }
})

function Page() {
  const c = useStyles()
  const { useUpdateLastCheckedNotifications } = useNotifications()
  const [updateLastChecked, { loading, error }] = useUpdateLastCheckedNotifications()

  const handleClick = e => {
    e.preventDefault()
    return updateLastChecked()
  }

  return (
    <div>
      <h1 className={c.Notifications_Header}>Notifications</h1>
      <Button className={c.Notification_Button} disabled={loading} onClick={handleClick}>
        {loading ? (
          <Spinner className={c.Notifications_Spinner} />
        ) : error ? (
          'Error'
        ) : (
          'Clear Notifications'
        )}
      </Button>
      <NotificationsList className={c.Notifications} />
    </div>
  )
}

export const Notifications = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
