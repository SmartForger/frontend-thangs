import React, { useCallback, useState } from 'react'
import { Header, Modal, NotificationsList } from '@components'
import { useNotifications } from '@hooks'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    '@keyframes notificationsSlideIn': {
      from: {
        width: 0,
        opacity: 0,
      },
      to: {
        width: '15rem',
        opacity: 1,
      },
    },
    '@keyframes notificationsSlideOut': {
      from: {
        width: '15rem',
        opacity: 1,
      },
      to: {
        width: 0,
        opacity: 0,
      },
    },
    NotificationsList: {
      maxWidth: '43rem',
      animation: '1000ms linear 0s $slideIn',
      width: '100%',

      '& .notification + .notification': {
        marginTop: '4rem',
      },
    },
    Layout: {
      display: 'flex',
      flexDirection: 'row',
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2.5rem',
      paddingRight: '1rem',
      paddingBottom: '2rem',
      paddingLeft: '1rem',

      [md]: {
        paddingRight: ({ notificationsIsOpen }) =>
          notificationsIsOpen ? '1.25rem' : '4rem',
        paddingLeft: '4rem',
      },
    },
    NotificationsList_Wrapper: {
      animation: '100ms linear 0s $notificationsSlideIn',
      position: 'relative',
      paddingTop: '1.5rem',
      paddingLeft: '1.25rem',
      width: '15rem',
    },
    NotificationsList_Wrapper__deactive: {
      animation: '100ms linear 0s $notificationsSlideOut',
      position: 'relative',
      paddingTop: '1.5rem',
      paddingLeft: '1.25rem',
      width: 0,
    },
    NotificationsList_CloseIcon: {
      position: 'absolute',
      top: '-1rem',
      right: '.75rem',
    },
  }
})
const noop = () => null
const Layout = ({ children, Hero = noop }) => {
  const [modelOpen, setModelOpen] = useState(null) //'createFolder', 'createTeam', 'signIn', 'signUp', 'forgotPassword', 'upload', 'searchByUpload'
  const { useNotificationsByUserId } = useNotifications()
  const {
    loading: notificationsLoading,
    error: notificationsError,
    notifications,
  } = useNotificationsByUserId()
  const [notificationsIsOpen, setNotificationsOpen] = useState(false)
  const [notificationsClosing, setNotificationsClosing] = useState(false)
  const c = useStyles({ notificationsIsOpen })

  const handleNotificationsClick = useCallback(() => {
    if (notificationsIsOpen) {
      setNotificationsClosing(true)
      setTimeout(() => {
        setNotificationsOpen(!notificationsIsOpen)
        setNotificationsClosing(false)
      }, 100)
    } else {
      setNotificationsOpen(!notificationsIsOpen)
    }
  }, [notificationsIsOpen])

  const handleModelOpen = useCallback(modalName => {
    setModelOpen(modalName)
  }, [])

  return (
    <>
      <Header
        setModelOpen={setModelOpen}
        handleNotificationsClick={handleNotificationsClick}
        handleModelOpen={handleModelOpen}
        notificationsIsOpen={notificationsIsOpen}
      />
      {modelOpen && <Modal template={modelOpen} />}
      {Hero && <Hero />}
      <div className={c.Layout}>
        {children}
        {notificationsIsOpen && (
          <div
            className={classnames(c.NotificationsList_Wrapper, {
              [c.NotificationsList_Wrapper__deactive]: notificationsClosing,
            })}
          >
            <ExitIcon
              className={c.NotificationsList_CloseIcon}
              onClick={handleNotificationsClick}
            />
            <NotificationsList
              notifications={notifications}
              loading={notificationsLoading}
              error={notificationsError}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Layout
