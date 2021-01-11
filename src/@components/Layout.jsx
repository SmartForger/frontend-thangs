import React, { useEffect, useState } from 'react'
import { Header, Footer, FeedbackTooltip } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import Banner from './Header/Banner'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up.svg'
import { useActionMenu, useOverlay } from '@hooks'

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
      backgroundColor: theme.colors.white[400],

      [md]: {
        backgroundColor: theme.colors.white[700],
      },
    },
    Container_OverlayOpen: {
      position: 'fixed',
      width: '100%',
    },
    Container_MobileOverlayOpen: {
      position: 'fixed',
      width: '100%',

      [md]: {
        position: 'unset',
        width: 'auto',
      },
    },
    Layout: {
      display: 'flex',
      flexDirection: 'column-reverse',
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2rem',
      paddingBottom: '0',
      paddingRight: '1rem',
      paddingLeft: '1rem',
      minHeight: '40rem',

      [md]: {
        flexDirection: 'row',
      },
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
    BackToTop: {
      backgroundColor: theme.colors.gold[500],
      borderRadius: '2rem',
      width: '2.5rem',
      height: '2.5rem',
      right: '2rem',
      bottom: '6rem',
      zIndex: 1,
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})

const BackToTop = () => {
  const c = useStyles({})
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 800) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 800) {
      setShowScroll(false)
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)

    return window.removeEventListener('scroll', checkScrollTop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!showScroll) return null
  return (
    <div className={c.BackToTop} onClick={scrollTop}>
      <ArrowUpIcon />
    </div>
  )
}

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
  const { isActionMenuOpen } = useActionMenu()
  const { isOverlayOpen } = useOverlay()

  return (
    <div
      className={classnames(c.Container, {
        [c.Container_OverlayOpen]: isOverlayOpen,
        [c.Container_MobileOverlayOpen]: isActionMenuOpen,
      })}
    >
      <Header
        showSearchTextFlash={showSearchTextFlash}
        showSearch={showSearch}
        showUser={showUser}
        showNewHero={showNewHero}
        showAboutHero={showAboutHero}
      />

      <div className={c.Layout_Content}>
        {Hero && <Hero />}
        {bannerText && <Banner>{bannerText}</Banner>}
        <div className={c.Layout}>
          {children}
          <BackToTop />
          <FeedbackTooltip className={c.Layout_FeedbackTooltip} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
