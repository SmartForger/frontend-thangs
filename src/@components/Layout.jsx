import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { Header, Overlay, NotificationsList, Footer } from '@components'
import {
  Upload,
  SearchByUpload,
  CreateFolder,
  CreateTeam,
  PasswordReset,
  FolderManagement,
  ReportModel,
} from '@overlays'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import Banner from './Header/Banner'

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
    Overlay__hidden: {
      display: 'none',
    },
  }
})
const overlayTemplates = {
  upload: Upload,
  searchByUpload: SearchByUpload,
  createFolder: CreateFolder,
  createTeam: CreateTeam,
  passwordReset: PasswordReset,
  folderManagement: FolderManagement,
  reportModel: ReportModel,
}

const Layout = ({
  children,
  bannerText,
  isLanding,
  Hero,
  showSearch,
  showSearchTextFlash,
  showUser,
}) => {
  const { overlay } = useStoreon('overlay')
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

  const OverlayView = useMemo(
    () => overlay && overlay.isOpen && overlayTemplates[overlay.currentOverlay],
    [overlay]
  )

  useEffect(() => {
    if (overlay.isOpen) {
      setNotificationsOpen(false)
    }
  }, [overlay])

  return (
    <div className={c.Container}>
      {isLanding && bannerText && <Banner>{bannerText}</Banner>}
      <Header
        onNotificationsClick={onNotificationsClick}
        notificationsIsOpen={notificationsIsOpen}
        showSearchTextFlash={showSearchTextFlash}
        showSearch={showSearch}
        showUser={showUser}
      />
      {OverlayView && (
        <Overlay
          className={classnames({ [c.Overlay__hidden]: overlay.isHidden })}
          isOpen={overlay.isOpen}
          {...overlay.overlayData}
        >
          <OverlayView {...overlay.overlayData} />
        </Overlay>
      )}
      <div
        className={classnames(c.Layout_Content, {
          [c.Layout_blur]: overlay.isOpen && !overlay.isHidden,
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
