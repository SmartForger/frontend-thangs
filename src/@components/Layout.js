import React, { useCallback, useState } from 'react'
import { Header, Modal, NotificationsList } from '@components'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Layout: {
      display: 'flex',
      flexDirection: 'row',
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2.5rem',
      paddingRight: '1rem',
      paddingBottom: '2rem',
      paddingLeft: '1rem',
      transition: 'width 2s',

      [md]: {
        paddingRight: ({ notificationsIsOpen }) =>
          notificationsIsOpen ? '1.25rem' : '4rem',
        paddingLeft: '4rem',
      },
    },
    NotificationsList_Wrapper: {
      position: 'relative',
      paddingTop: '1.5rem',
      paddingLeft: '1.25rem',
      width: '15rem',
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
  const [notificationsIsOpen, setNotificationsOpen] = useState(false)
  const c = useStyles({ notificationsIsOpen })

  const handleNotificationsClick = useCallback(() => {
    setNotificationsOpen(!notificationsIsOpen)
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
          <div className={c.NotificationsList_Wrapper}>
            <ExitIcon
              className={c.NotificationsList_CloseIcon}
              onClick={handleNotificationsClick}
            />
            <NotificationsList />
          </div>
        )}
      </div>
    </>
  )
}

export default Layout
