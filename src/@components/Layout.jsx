import React, { useCallback, useEffect, useState } from 'react'
import Header from '@components/Header'
import Footer from '@components/Footer'
import FeedbackTooltip from '@components/FeedbackTooltip'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import Banner from './Header/Banner'
import { ReactComponent as ArrowUpIcon } from '@svg/icon-arrow-up.svg'
import { useOverlay } from '@contexts/Overlay'
import { useActionMenu } from '@contexts/ActionMenu'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    '@keyframes notificationsSlideIn': {
      from: {
        width: 0,
        opacity: '0',
      },
      to: {
        width: '15rem',
        opacity: '1',
      },
    },
    '@keyframes notificationsSlideOut': {
      from: {
        width: '15rem',
        opacity: '1',
      },
      to: {
        width: 0,
        opacity: '0',
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
    Container_MobileOverlayOpen: {},
    Layout: {
      display: 'flex',
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
      zIndex: '1',
    },
    BackToTop: {
      backgroundColor: theme.colors.gold[500],
      borderRadius: '2rem',
      width: '2.5rem',
      height: '2.5rem',
      right: '2rem',
      bottom: '6rem',
      zIndex: '1',
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})

const BackToTop = () => {
  const getScrollContainer = () => document.getElementById('root')
  const c = useStyles({})
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = useCallback(() => {
    const container = getScrollContainer()

    if (!showScroll && container.scrollTop > container.clientHeight) {
      setShowScroll(true)
    } else if (showScroll && container.scrollTop <= container.clientHeight) {
      setShowScroll(false)
    }
  }, [showScroll])

  const scrollTop = () => {
    getScrollContainer().scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    getScrollContainer().addEventListener('scroll', checkScrollTop)

    return () => getScrollContainer()?.removeEventListener('scroll', checkScrollTop)
  }, [checkScrollTop])

  return (
    <>
      {!showScroll ? (
        <></>
      ) : (
        <div className={c.BackToTop} onClick={scrollTop}>
          <ArrowUpIcon />
        </div>
      )}
    </>
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
  const { isActionMenuOpen } = useActionMenu() || {}
  const { isOverlayOpen } = useOverlay() || {}

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
