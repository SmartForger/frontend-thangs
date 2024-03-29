import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { Link, useHistory } from 'react-router-dom'
import { ContextMenuTrigger } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Body,
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import { Divider, FileExplorer, ProfilePicture, NavLink, Spacer } from '@components'
import { authenticationService } from '@services'
import { useContextMenu, useCurrentUser } from '@hooks'

import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as ClockIcon } from '@svg/icon-clock.svg'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as PortfolioIcon } from '@svg/icon-portfolio.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import { ReactComponent as SettingsIcon } from '@svg/icon-settings.svg'
import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as SignOutIcon } from '@svg/icon-signout.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    WorkspaceNavbar: {
      backgroundColor: theme.colors.white[600],
      display: 'none',
      flex: 'none',
      flexDirection: 'row',
      height: '100%',
      position: 'absolute',
      width: '100%',
      zIndex: '1',

      [md]: {
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        width: '20.5rem',
      },
    },
    WorkspaceNavbar__visible: {
      display: 'flex',
    },
    WorkspaceNavbar_NavContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 2rem)',
      flex: 'none',
    },
    WorkspaceNavbar_AddWrapper: {
      position: 'relative',
      zIndex: '2',

      [md]: {
        marginLeft: '1rem',
      },
    },
    WorkspaceNavbar_AddButton: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2rem',

      [md]: {
        width: '50%',
      },
    },
    WorkspaceNavbar_AddMenu: {
      position: 'absolute',
      width: '100%',
      top: '2.375rem',

      [md]: {
        width: '12rem',
      },
    },
    WorkspaceNavbar_NavLink: {
      marginLeft: '1rem',
    },
    WorkspaceNavbar_ScrollableFiles: {
      ...theme.mixins.scrollbar,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowX: 'hidden',
      scrollbarColor: 'transparent',
      height: '100%',
      paddingTop: '.125rem',
      position: 'relative',

      '&::-webkit-scrollbar-thumb': {
        border: `3px solid ${theme.colors.white[600]}`,
        borderRadius: 20,
        backgroundColor: '#C7C7C7',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
      },
    },
    WorkspaceNavbar_MobileColumnOnly: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      alignItems: 'center',
      minHeight: '9.5rem',
      textAlign: 'center',

      '& > div': {
        margin: '0 auto',
      },

      [md]: {
        display: 'none',
      },
    },
    WorkspaceNavbar_MobileProfile: {
      display: 'flex',
      flexDirection: 'column',
    },
    WorkspaceNavbar_NavHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: '1rem',
    },
    WorkspaceNavbar_NavHeader_Exit: {
      [md]: {
        display: 'none',
      },
    },
    WorkspaceNavbar_NavSpacer: {
      flex: 'none',
    },
  }
})
const noop = () => null

const WorkspaceNavbar = ({
  folders,
  models,
  isLoadingThangs,
  handleEditModel = noop,
  setCurrentView = noop,
  handleChangeFolder = noop,
  isMobileNavOpen,
  closeMobileNav = noop,
}) => {
  const c = useStyles()
  const { dispatch, folderNav } = useStoreon('folderNav')
  const {
    atom: { data: user = {} },
  } = useCurrentUser()
  const history = useHistory()
  const path = history.location.pathname
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const navbarRef = useRef()

  useEffect(() => {
    if (folderNav.files) {
      setShowFileExplorer(true)
    } else {
      setShowFileExplorer(false)
    }
  }, [dispatch, folderNav.files, setShowFileExplorer])

  // useEffect(() => {
  //   const filteredRootFolders = () => {
  //     return folders.filter(folder => !folder.root && !folder.name.includes('//'))
  //   }
  //   if (filteredRootFolders.length > 0 && filteredRootFolders.length < 11) {
  //     dispatch(types.FOLDER_OPEN, { id: 'files' })
  //   }
  // }, [dispatch, folders])

  const shouldShowFileExplorer = useMemo(
    () => showFileExplorer || folderNav.files,
    [folderNav.files, showFileExplorer]
  )

  const handleAllFiles = useCallback(() => {
    closeMobileNav()
    setCurrentView('all-files')
  }, [setCurrentView, closeMobileNav])

  const handleClickRecent = useCallback(() => {
    closeMobileNav()
    setCurrentView('recent-files')
  }, [setCurrentView, closeMobileNav])

  const handleClickShared = useCallback(() => {
    closeMobileNav()
    setCurrentView('shared-files')
  }, [setCurrentView, closeMobileNav])

  const handleClickLiked = useCallback(() => {
    closeMobileNav()
    setCurrentView('liked-models')
  }, [setCurrentView, closeMobileNav])

  const handleClickSearches = useCallback(() => {
    closeMobileNav()
    setCurrentView('saved-searches')
  }, [setCurrentView, closeMobileNav])

  const handleClickEdit = useCallback(() => {
    closeMobileNav()
    setCurrentView('edit-profile')
  }, [setCurrentView, closeMobileNav])

  const handleClickPortfolio = useCallback(() => {
    history.push(`/${user.username}`)
  }, [history, user])

  const handleSignOut = useCallback(() => {
    authenticationService.logout()
    history.push('/')
  }, [history])

  useContextMenu(navbarRef, 'Add_Menu')

  return (
    <nav
      className={classnames(c.WorkspaceNavbar, {
        [c.WorkspaceNavbar__visible]: isMobileNavOpen,
      })}
      ref={navbarRef}
    >
      <Spacer size={'1rem'} />
      <div className={c.WorkspaceNavbar_NavContainer}>
        <Spacer size={'2rem'} className={c.WorkspaceNavbar_NavSpacer} />
        <div className={c.WorkspaceNavbar_NavHeader}>
          <div>
            <Link to={'/'}>
              <Logo />
            </Link>
          </div>
          <ExitIcon
            className={c.WorkspaceNavbar_NavHeader_Exit}
            onClick={closeMobileNav}
          />
        </div>
        <Spacer size={'2rem'} />
        <div className={c.WorkspaceNavbar_MobileColumnOnly}>
          <ProfilePicture
            className={c.Profile_ProfilePicture}
            size={'5rem'}
            src={user.profile && user.profile.avatarUrl}
            name={user.fullName || user.username}
          />
          <Spacer size={'.75rem'} />
          <div className={c.WorkspaceNavbar_MobileProfile}>
            <Body multiline>{user.fullName || user.username}</Body>
            {user.username && (
              <>
                <Spacer size={'.5rem'} />
                <Metadata type={MetadataType.secondary}>{user.username}</Metadata>
              </>
            )}
          </div>
          <Spacer size={'.75rem'} />
        </div>
        <div className={c.WorkspaceNavbar_ScrollableFiles}>
          <div>
            <Title
              headerLevel={HeaderLevel.tertiary}
              className={c.WorkspaceNavbar_NavLink}
            >
              My Thangs
            </Title>
            <Spacer size={'2rem'} />
            <NavLink
              className={c.WorkspaceNavbar_NavLink}
              Icon={FolderIcon}
              label={'All Files'}
              isFolder={true}
              folderId={'files'}
              onClick={handleAllFiles}
              selected={path === '/mythangs/all-files'}
            />
            <Spacer size={'1.5rem'} />
            {shouldShowFileExplorer && (
              <FileExplorer
                folders={folders}
                models={models}
                folderNav={folderNav}
                showOwned={true}
                isLoading={isLoadingThangs}
                showFile={showFileExplorer && folderNav.files}
                handleChangeFolder={handleChangeFolder}
                handleModelClick={handleEditModel}
              />
            )}
            <NavLink
              className={c.WorkspaceNavbar_NavLink}
              Icon={ClockIcon}
              label={'Recent'}
              onClick={handleClickRecent}
              selected={path === '/mythangs/recent-files' || path === '/mythangs'}
            />
            <Spacer size={'1.5rem'} />
            <NavLink
              className={c.WorkspaceNavbar_NavLink}
              Icon={SharedIcon}
              label={'Shared with me'}
              onClick={handleClickShared}
              selected={path === '/mythangs/shared-files'}
            />
            <Divider />
            <NavLink
              className={c.WorkspaceNavbar_NavLink}
              Icon={HeartIcon}
              label={'Liked Models'}
              onClick={handleClickLiked}
              selected={path === '/mythangs/liked-models'}
            />
            <Spacer size={'1.5rem'} />
            <NavLink
              className={c.WorkspaceNavbar_NavLink}
              Icon={SearchIcon}
              label={'Saved Searches'}
              onClick={handleClickSearches}
              selected={path === '/mythangs/saved-searches'}
            />
            <Spacer size={'2rem'} />
          </div>
          <ContextMenuTrigger id='none'>
            <div>
              <Spacer size={'1.5rem'} />
              <NavLink
                className={c.WorkspaceNavbar_NavLink}
                Icon={PortfolioIcon}
                label={'My Public Portfolio'}
                onClick={handleClickPortfolio}
              />
              <Spacer size={'1.5rem'} />
              <NavLink
                className={c.WorkspaceNavbar_NavLink}
                Icon={SettingsIcon}
                label={'Profile Settings'}
                onClick={handleClickEdit}
                selected={path === '/mythangs/edit-profile'}
              />
              <Spacer size={'1.5rem'} />
              <NavLink
                className={c.WorkspaceNavbar_NavLink}
                Icon={SignOutIcon}
                label={'Sign Out'}
                onClick={handleSignOut}
              />
              <Spacer size={'2rem'} />
            </div>
          </ContextMenuTrigger>
        </div>
      </div>
      <Spacer size={'1rem'} />
    </nav>
  )
}

export default WorkspaceNavbar
