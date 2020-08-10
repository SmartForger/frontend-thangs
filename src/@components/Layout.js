import React, { useCallback, useMemo, useState } from 'react'
import { Header, Modal, NotificationsList } from '@components'
<<<<<<< HEAD
import { Upload } from '@modals'
=======
import { useNotifications } from '@hooks'
>>>>>>> bd5312b04608a3fbbd1343f94ac290ab34da7593
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
<<<<<<< HEAD
=======
    NotificationsList: {
      maxWidth: '43rem',
      animation: '1000ms linear 0s $slideIn',
      width: '100%',

      '& .notification + .notification': {
        marginTop: '4rem',
      },
    },
>>>>>>> bd5312b04608a3fbbd1343f94ac290ab34da7593
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
    Layout_blur: {
      filter: 'blur(4px)',
      OFilter: 'blur(4px)',
      MsFilter: 'blur(4px)',
      MozFilter: 'blur(4px)',
      WebkitFilter: 'blur(4px)',
    },
    NotificationsList: {
      maxWidth: '43rem',
      animation: '1000ms linear 0s $slideIn',
      width: '100%',

      '& .notification + .notification': {
        marginTop: '4rem',
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
const modalTemplates = {
  upload: Upload,
}
const noop = () => null
const Layout = ({ children, Hero = noop }) => {
<<<<<<< HEAD
  const [modalOpen, setModalOpen] = useState(null) //'createFolder', 'createTeam', 'signIn', 'signUp', 'forgotPassword', 'upload', 'searchByUpload'
=======
  const [modelOpen, setModelOpen] = useState(null) //'createFolder', 'createTeam', 'signIn', 'signUp', 'forgotPassword', 'upload', 'searchByUpload'
  const { useNotificationsByUserId } = useNotifications()
  const {
    loading: notificationsLoading,
    error: notificationsError,
    notifications,
  } = useNotificationsByUserId()
>>>>>>> bd5312b04608a3fbbd1343f94ac290ab34da7593
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

  const handleModalOpen = useCallback(modalName => {
    setModalOpen(modalName)
  }, [])

  const handleModalClose = useCallback(() => {
    console.log('handleModalClose')
    setModalOpen(null)
  }, [])

  const ModalView = useMemo(() => modalOpen && modalTemplates[modalOpen], [modalOpen])
  return (
    <>
      <Header
        handleNotificationsClick={handleNotificationsClick}
        handleModalOpen={handleModalOpen}
        modalOpen={modalOpen}
        notificationsIsOpen={notificationsIsOpen}
        setModalOpen={setModalOpen}
      />
<<<<<<< HEAD
      {ModalView && (
        <Modal isOpen={!!modalOpen} handleModalClose={handleModalClose}>
          <ModalView />
        </Modal>
      )}
      <div className={classnames({ [c.Layout_blur]: modalOpen })}>
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
              <NotificationsList />
            </div>
          )}
        </div>
=======
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
>>>>>>> bd5312b04608a3fbbd1343f94ac290ab34da7593
      </div>
    </>
  )
}

export default Layout
