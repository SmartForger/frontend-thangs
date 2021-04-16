import React from 'react'
import { Link } from 'react-router-dom'
import { Divider, Notifications, SearchBar, Spacer, UserNav } from '@components'
import { useCurrentUser } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as MenuIcon } from '@svg/icon-menu.svg'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    WorkspaceHeader: {
      backgroundColor: theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      zIndex: '3',

      [md]: {
        position: 'fixed',
        top: 0,
        left: '20.5rem',
        width: 'calc(100% - 20.5rem)',
      },
    },
    WorkspaceHeader_Content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    WorkspaceHeader_HeaderRow: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    WorkspaceHeader_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
    WorkspaceHeader_DesktopRow: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    WorkspaceHeader_DesktopOnly: {
      display: 'none',

      [md]: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      },
    },
    WorkspaceHeader_MobileOnly: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',

      [md]: {
        display: 'none',
      },
    },
    WorkspaceHeader_MobileBoundary: {
      margin: '1.5rem',
      padding: 0,
      width: 'auto',
    },
    WorkspaceHeader_MobileNotifications: {
      right: '-3rem',
    },
  }
})

const noop = () => null
const WorkspaceHeader = ({ setCurrentView = noop, openMobileNav = noop }) => {
  const c = useStyles({})
  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()

  return (
    <header className={c.WorkspaceHeader}>
      <div className={c.WorkspaceHeader_MobileOnly}>
        <div className={c.WorkspaceHeader_MobileBoundary}>
          <div className={c.WorkspaceHeader_HeaderRow}>
            <Link to='/'>
              <Logo />
            </Link>
            <div className={c.WorkspaceHeader_Row}>
              <Notifications
                className={c.WorkspaceHeader_MobileNotifications}
                myThangsMenu={true}
              />
              <Spacer size='1.5rem' />
              <MenuIcon onClick={openMobileNav} />
            </div>
          </div>
          <SearchBar
            setCurrentView={setCurrentView}
            placeholder='Search to find your models'
            onSearch={term => track('Search My Thangs', { searchTerm: term })}
          />
        </div>
      </div>
      <div className={c.WorkspaceHeader_DesktopOnly}>
        <Spacer size='2rem' />
        <div className={c.WorkspaceHeader_Content}>
          <div className={c.WorkspaceHeader_DesktopRow}>
            <Spacer size='2rem' />
            <SearchBar
              setCurrentView={setCurrentView}
              placeholder='Search to find your models'
              onSearch={term => track('Search My Thangs', { searchTerm: term })}
            />
          </div>
          <div>
            <UserNav
              isLoading={isLoading}
              user={user}
              showUser={true}
              showUpload={false}
              myThangsMenu={true}
            />
          </div>
        </div>
        <Spacer size='2rem' />
        <Divider spacing='0' />
      </div>
    </header>
  )
}

export default WorkspaceHeader
