import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { Header, Modal, NotificationsList, Footer } from '@components'
import {
  Upload,
  SearchByUpload,
  CreateFolder,
  CreateTeam,
  PasswordReset,
  SignIn,
  FolderManagement,
  ReportModel,
} from '@overlays'
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
    Container: {
      position: 'relative',
      minHeight: '100vh',
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
    Layout_blur: {
      filter: 'blur(4px)',
      OFilter: 'blur(4px)',
      MsFilter: 'blur(4px)',
      MozFilter: 'blur(4px)',
      WebkitFilter: 'blur(4px)',
    },
    Layout_Content: {
      paddingBottom: '7rem',
    },
    NotificationsList: {
      maxWidth: '43rem',
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
      cursor: 'pointer',
    },
    Modal__hidden: {
      display: 'none',
    },
  }
})
const modalTemplates = {
  upload: Upload,
  searchByUpload: SearchByUpload,
  createFolder: CreateFolder,
  createTeam: CreateTeam,
  signIn: SignIn,
  passwordReset: PasswordReset,
  folderManagement: FolderManagement,
  reportModel: ReportModel,
}

const Layout = ({ children, Hero, showSearch, showSearchTextFlash, showUser }) => {
  const { modal } = useStoreon('modal')
  const [notificationsIsOpen, setNotificationsOpen] = useState(false)
  const [notificationsClosing, setNotificationsClosing] = useState(false)
  const c = useStyles({ notificationsIsOpen })

  const onNotificationsClick = useCallback(() => {
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

  const ModalView = useMemo(
    () => modal && modal.isOpen && modalTemplates[modal.currentModal],
    [modal]
  )

  useEffect(() => {
    if (modal.isOpen) {
      setNotificationsOpen(false)
    }
  }, [modal])

  return (
    <div className={c.Container}>
      <Header
        onNotificationsClick={onNotificationsClick}
        notificationsIsOpen={notificationsIsOpen}
        showSearchTextFlash={showSearchTextFlash}
        showSearch={showSearch}
        showUser={showUser}
      />
      {ModalView && (
        <Modal
          className={classnames({ [c.Modal__hidden]: modal.isHidden })}
          isOpen={modal.isOpen}
          {...modal.modalData}
        >
          <ModalView {...modal.modalData} />
        </Modal>
      )}
      <div
        className={classnames(c.Layout_Content, {
          [c.Layout_blur]: modal.isOpen && !modal.isHidden,
        })}
      >
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
                onClick={onNotificationsClick}
              />
              <NotificationsList />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
