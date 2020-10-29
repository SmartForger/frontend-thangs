import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useStoreon } from 'storeon/react'
import { Link, useHistory } from 'react-router-dom'
import * as R from 'ramda'
import {
  AddMenu,
  Button,
  Divider,
  FileExplorer,
  NavLink,
  Spacer,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import { authenticationService } from '@services'
import { useCurrentUser, useExternalClick } from '@hooks'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as ClockIcon } from '@svg/icon-clock.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as PortfolioIcon } from '@svg/icon-portfolio.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import { ReactComponent as SettingsIcon } from '@svg/icon-settings.svg'
import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as SignOutIcon } from '@svg/icon-signout.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    WorkspaceNavbar: {
      width: '20.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.colors.white[600],
      flex: 'none',
    },
    WorkspaceNavbar_Logo: {
      marginTop: '3rem',
      marginBottom: '4rem',
      marginLeft: '1rem',
    },
    WorkspaceNavbar_NavContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 2rem)',
      flex: 'none',
    },
    WorkspaceNavbar_AddWrapper: {
      marginLeft: '1rem',
      position: 'relative',
      zIndex: 2,
    },
    WorkspaceNavbar_AddButton: {
      width: '50%',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2rem',
    },
    WorkspaceNavbar_AddMenu: {
      position: 'absolute',
      width: '12rem',
      top: '2.375rem',
    },
    WorkspaceNavbar_NavLink: {
      marginLeft: '1rem',
    },
    WorkspaceNavbar_ScrollableFiles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowX: 'hidden',
      overflowY: 'scroll',
      scrollbarColor: 'transparent',
      height: '100%',
      paddingTop: '.125rem',
      position: 'relative',

      '&::-webkit-scrollbar': {
        width: '.75rem',
        display: 'none',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
        borderRadius: '.5rem',
        display: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[600]}`,
        display: 'none',
      },
    },
  }
})
const noop = () => null
const findFolderById = (id, folders) => {
  const rootFolder = R.find(R.propEq('id', id.toString()))(folders) || {}
  if (!R.isEmpty(rootFolder)) return rootFolder
  let subFolder = false
  folders.some(folder => {
    const subfolders = folder.subfolders
    subFolder = R.find(R.propEq('id', id.toString()))(subfolders) || false
    return subFolder
  })
  return subFolder
}

const AddMenuDropdown = ({ currentFolderId, folders }) => {
  const c = useStyles()
  const addMenuRef = useRef(null)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const handleClickCreate = useCallback(() => setShowCreateMenu(true), [])
  useExternalClick(addMenuRef, () => setShowCreateMenu(false))

  const folder = useMemo(() => {
    return currentFolderId ? findFolderById(currentFolderId, folders) : {}
  }, [currentFolderId, folders])

  return (
    <div className={c.WorkspaceNavbar_AddWrapper} ref={addMenuRef}>
      <Button className={c.WorkspaceNavbar_AddButton} onClick={handleClickCreate}>
        <PlusIcon />
        <Spacer size={'.5rem'} />
        Add New
      </Button>
      {showCreateMenu && (
        <div className={c.WorkspaceNavbar_AddMenu}>
          <AddMenu folder={folder} sideBar={true} />
        </div>
      )}
    </div>
  )
}

const WorkspaceNavbar = ({
  currentFolderId,
  folders,
  models,
  isLoadingThangs,
  handleEditModel = noop,
  setCurrentView = noop,
  handleChangeFolder = noop,
}) => {
  const c = useStyles()
  const { dispatch, folderNav } = useStoreon('folderNav')
  const {
    atom: { data: user },
  } = useCurrentUser()
  const history = useHistory()
  const path = history.location.pathname
  const [showFileExplorer, setShowFileExplorer] = useState(false)

  useEffect(() => {
    let timeout
    if (folderNav.files) {
      timeout = setTimeout(() => {
        setShowFileExplorer(true)
      }, 200)
    } else {
      timeout = setTimeout(() => {
        setShowFileExplorer(false)
      }, 450)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [dispatch, folderNav.files, setShowFileExplorer])

  useEffect(() => {
    const filteredRootFolders = () => {
      return folders.filter(folder => !folder.root && !folder.name.includes('//'))
    }
    if (filteredRootFolders.length > 0 && filteredRootFolders.length < 11) {
      dispatch(types.FOLDER_OPEN, { id: 'files' })
    }
  }, [dispatch, folders])

  const shouldShowFileExplorer = useMemo(() => showFileExplorer || folderNav.files, [
    folderNav.files,
    showFileExplorer,
  ])

  const handleAllFiles = useCallback(() => {
    setCurrentView('all-files')
  }, [setCurrentView])

  const handleClickRecent = useCallback(() => {
    setCurrentView('recent-files')
  }, [setCurrentView])

  const handleClickShared = useCallback(() => setCurrentView('shared-files'), [
    setCurrentView,
  ])

  const handleClickLiked = useCallback(() => setCurrentView('liked-models'), [
    setCurrentView,
  ])

  const handleClickSearches = useCallback(() => setCurrentView('saved-searches'), [
    setCurrentView,
  ])

  const handleClickEdit = useCallback(() => setCurrentView('edit-profile'), [
    setCurrentView,
  ])

  const handleClickPortfolio = useCallback(() => {
    history.push(`/${user.username}`)
  }, [history, user])

  const handleSignOut = useCallback(() => {
    authenticationService.logout()
    history.push('/')
  }, [history])

  return (
    <nav className={c.WorkspaceNavbar}>
      <Spacer size={'1rem'} />
      <div className={c.WorkspaceNavbar_NavContainer}>
        <div className={c.WorkspaceNavbar_Logo}>
          <Link to={'/'}>
            <Logo />
          </Link>
        </div>
        <AddMenuDropdown currentFolderId={currentFolderId} folders={folders} />
        <div className={c.WorkspaceNavbar_ScrollableFiles}>
          <div>
            <TitleTertiary className={c.WorkspaceNavbar_NavLink}>My Thangs</TitleTertiary>
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
        </div>
      </div>
      <Spacer size={'1rem'} />
    </nav>
  )
}

export default WorkspaceNavbar
