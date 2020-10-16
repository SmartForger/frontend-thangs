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
import { useExternalClick } from '@hooks'
import { ReactComponent as Logo } from '@svg/logo.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as ClockIcon } from '@svg/icon-clock.svg'
import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as SearchIcon } from '@svg/icon-search.svg'
import { ReactComponent as SettingsIcon } from '@svg/icon-settings.svg'
import { ReactComponent as SignOutIcon } from '@svg/icon-signout.svg'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    WorkspaceNavbar: {
      width: '22.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.colors.white[600],
      flex: 'none',
    },
    WorkspaceNavbar_Logo: {
      marginTop: '3rem',
      marginBottom: '4rem',
    },
    WorkspaceNavbar_NavContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 4rem)',
      flex: 'none',
    },
    WorkspaceNavbar_AddWrapper: {
      position: 'relative',
      zIndex: 1,
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
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
    },
    WorkspaceNavbar_ScrollableFiles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowX: 'hidden',
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      scrollbarColor: '#C7C7C7 white',
      height: '100%',
      paddingTop: '.125rem',

      '&::-webkit-scrollbar': {
        width: '.75rem',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[600]}`,
      },
    },
  }
})
const noop = () => null
const findFolderById = (id, folders) => {
  return R.find(R.propEq('id', id.toString()))(folders) || {}
}

const WorkspaceNavbar = ({
  currentFolderId,
  folderNav,
  folders,
  models,
  isLoadingThangs,
  handleEditModel = noop,
  setCurrentView = noop,
  handleChangeFolder = noop,
}) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const history = useHistory()
  const [showFileExplorer, setShowFileExplorer] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const addMenuRef = useRef(null)

  const folder = useMemo(() => {
    return currentFolderId ? findFolderById(currentFolderId, folders) : {}
  }, [currentFolderId, folders])

  useEffect(() => {
    if (folderNav.files) {
      setTimeout(() => {
        setShowFileExplorer(true)
      }, 200)
    } else {
      setTimeout(() => {
        setShowFileExplorer(false)
      }, 450)
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
    setCurrentView('allFiles')
  }, [setCurrentView])

  const handleClickRecent = useCallback(() => {
    setCurrentView('recentFiles')
  }, [setCurrentView])

  const handleClickShared = useCallback(() => setCurrentView('sharedFiles'), [
    setCurrentView,
  ])

  const handleClickLiked = useCallback(() => setCurrentView('likedModels'), [
    setCurrentView,
  ])

  const handleClickSearches = useCallback(() => setCurrentView('savedSearches'), [
    setCurrentView,
  ])

  const handleClickEdit = useCallback(() => setCurrentView('editProfile'), [
    setCurrentView,
  ])

  const handleClickCreate = useCallback(() => setShowCreateMenu(true), [])

  const handleSignOut = useCallback(() => {
    authenticationService.logout()
    history.push('/')
  }, [history])

  useExternalClick(addMenuRef, () => setShowCreateMenu(false))

  return (
    <nav className={c.WorkspaceNavbar}>
      <Spacer size={'2rem'} />
      <div className={c.WorkspaceNavbar_NavContainer}>
        <div className={c.WorkspaceNavbar_Logo}>
          <Link to={'/'}>
            <Logo />
          </Link>
        </div>
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
        <div className={c.WorkspaceNavbar_ScrollableFiles}>
          <div>
            <TitleTertiary>My Thangs</TitleTertiary>
            <Spacer size={'2rem'} />
            <NavLink
              Icon={FolderIcon}
              label={'All Files'}
              isFolder={true}
              folderId={'files'}
              onClick={handleAllFiles}
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
            <Spacer size={'2rem'} />
            <NavLink Icon={ClockIcon} label={'Recent'} onClick={handleClickRecent} />
            <Spacer size={'1.5rem'} />
            <NavLink
              Icon={SharedIcon}
              label={'Shared Files'}
              onClick={handleClickShared}
            />
            <Divider />
            <NavLink Icon={HeartIcon} label={'Liked Models'} onClick={handleClickLiked} />
            <Spacer size={'1.5rem'} />
            <NavLink
              Icon={SearchIcon}
              label={'Saved Searches'}
              onClick={handleClickSearches}
            />
            <Spacer size={'2rem'} />
          </div>
          <div>
            <Spacer size={'1.5rem'} />
            <NavLink
              Icon={SettingsIcon}
              label={'Profile Settings'}
              onClick={handleClickEdit}
            />
            <Spacer size={'1.5rem'} />
            <NavLink Icon={SignOutIcon} label={'Sign Out'} onClick={handleSignOut} />
            <Spacer size={'2rem'} />
          </div>
        </div>
      </div>
      <Spacer size={'2rem'} />
    </nav>
  )
}

export default WorkspaceNavbar
