import React from 'react'
import { Header, Footer, FeedbackTooltip } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useOverlay } from '@hooks'
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
      backgroundColor: theme.colors.white[700],
    },
    Layout: {
      display: 'flex',
      flexDirection: 'column-reverse',
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2rem',
      paddingRight: '1rem',
      paddingBottom: '0',
      paddingLeft: '1rem',

      [md]: {
        paddingRight: '4rem',
        paddingLeft: '4rem',
        flexDirection: 'row',
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
      minHeight: '10rem',
      [md]: {
        width: '20rem',
      },
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
    Layout_FeedbackTooltip: {
      position: 'fixed',
      bottom: '3rem',
      right: '2rem',
      zIndex: 1,
    },
  }
})

const Layout = ({
  children,
  bannerText,
  Hero,
  showSearch,
  showSearchTextFlash,
  showUser,
  showNewHero,
  showAboutHero,
}) => {
  const c = useStyles({})
  const { Overlay, isOverlayOpen, isOverlayHidden } = useOverlay()

  return (
    <div
      className={classnames(c.Container, {
        [c.Layout_blur]: isOverlayOpen && !isOverlayHidden,
      })}
    >
      <Header
        showSearchTextFlash={showSearchTextFlash}
        showSearch={showSearch}
        showUser={showUser}
        showNewHero={showNewHero}
        showAboutHero={showAboutHero}
      />
      {Overlay}
      <div className={c.Layout_Content}>
        {Hero && <Hero />}
        {bannerText && <Banner>{bannerText}</Banner>}
        <div className={c.Layout}>
          {children}
          <FeedbackTooltip className={c.Layout_FeedbackTooltip} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
