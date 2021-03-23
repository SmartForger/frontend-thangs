import React, { useCallback, useEffect, useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useStoreon } from 'storeon/react'
import {
  AddContextMenu,
  FileContextMenu,
  FolderContextMenu,
  FolderInviteContextMenu,
  Spacer,
  Spinner,
  WorkspaceHeader,
  WorkspaceNavbar,
} from '@components'
import { authenticationService } from '@services'
import { useOverlay, usePerformanceMetrics, useStarred } from '@hooks'
import AllFilesView from './AllFilesView'
import EditProfileView from './EditProfileView'
import FolderView from './FolderView'
import LikedModelsView from './LikedModelsView'
import RecentFilesView from './RecentFilesView'
import SavedSearchesView from './SavedSearchesView'
import SearchView from './SearchView'
import SharedFilesView from './SharedFilesView'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'
import { pageview, perfTrack } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    MyThangs: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
    },
    MyThangs_OverlayWrapper: {
      display: 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    MyThangs_ContentWrapper: {
      flex: 'auto',
      overflow: 'scroll',

      [md]: {
        ...theme.mixins.scrollbar,
      },
    },
    Layout_blur: {
      display: 'block',
      filter: 'blur(4px)',
      OFilter: 'blur(4px)',
      MsFilter: 'blur(4px)',
      MozFilter: 'blur(4px)',
      WebkitFilter: 'blur(4px)',
    },
    ContextMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    ContextMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    MyThangs_MainView: {
      overflow: 'hidden',

      [md]: {
        overflow: 'visible',
      },
    },
    MyThangs_UploadZone: {
      '& > div': {
        outline: 'none',
      },
    },
    Spinner: {
      position: 'relative',
      top: '9rem',
    },
    MyThangs_HeaderSpacer: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
  }
})

const MyThangs = () => {
  const { path } = useRouteMatch()
  const history = useHistory()
  const c = useStyles({})
  const { setOverlay } = useOverlay()
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const currentUserId = authenticationService.getCurrentUserId()
  const { dispatch, folders = {}, models = {}, shared = {}, thangs } = useStoreon(
    'folders',
    'models',
    'thangs',
    'shared'
  )
  const { isLoading, isLoaded } = thangs
  const { data: folderData } = folders
  const { data: modelData } = models
  const { data: sharedData } = shared
  useStarred()
  const { startTimer, getTime } = usePerformanceMetrics()

  useEffect(() => {
    pageview('MyThangs')
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoaded) perfTrack('Page Loaded - MyThangs', getTime())
  }, [getTime, isLoaded])

  useEffect(() => {
    dispatch(types.FETCH_THANGS, {})
    dispatch(types.FETCH_NOTIFICATIONS)
  }, [currentUserId, dispatch])

  const handleCurrentView = useCallback(
    name => {
      setCurrentFolderId(null)
      history.push(`/mythangs/${name}`)
    },
    [history]
  )

  const handleEditModel = useCallback(
    model => {
      history.push(`/model/${model.id}`)
    },
    [history]
  )

  const onDrop = useCallback(
    (acceptedFiles, rejectedFile, _event) => {
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          initData: { acceptedFiles, rejectedFile },
          folderId: currentFolderId,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [currentFolderId, setOverlay]
  )

  const openMobileNav = useCallback(() => {
    setMobileNavOpen(true)
  }, [])

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false)
  }, [])

  const handleChangeFolder = useCallback(
    folder => {
      closeMobileNav()
      setCurrentFolderId(folder.id)
      history.push(`/mythangs/folder/${folder.id}`)
    },
    [history, closeMobileNav]
  )

  const viewProps = {
    className: c.MyThangs_MainView,
    setCurrentView: handleCurrentView,
    setCurrentFolderId,
    handleEditModel,
    handleChangeFolder,
    myFolders: folderData,
    sharedFolders: sharedData,
    models: modelData,
    userId: currentUserId,
    onDrop,
    isLoading,
  }

  return (
    <>
      <div className={c.MyThangs}>
        <ContextMenuTrigger
          id='Add_Menu'
          attributes={{
            style: { height: '100%' },
          }}
          holdToDisplay={-1}
        >
          <WorkspaceNavbar
            currentFolderId={currentFolderId}
            folders={folderData}
            handleChangeFolder={handleChangeFolder}
            handleEditModel={handleEditModel}
            isLoadingThangs={isLoading}
            models={modelData}
            setCurrentView={handleCurrentView}
            isMobileNavOpen={isMobileNavOpen}
            closeMobileNav={closeMobileNav}
          />
        </ContextMenuTrigger>
        <div className={c.MyThangs_ContentWrapper}>
          <WorkspaceHeader
            setCurrentView={handleCurrentView}
            openMobileNav={openMobileNav}
          />
          <Spacer size={'7rem'} className={c.MyThangs_HeaderSpacer} />
          {!isLoaded || isLoading ? (
            <Spinner className={c.Spinner} />
          ) : (
            <ContextMenuTrigger
              id='Add_Menu'
              attributes={{
                style: { height: '100%' },
              }}
              holdToDisplay={-1}
            >
              <Switch>
                <Route
                  exact
                  path={path}
                  render={() => <RecentFilesView {...viewProps} />}
                />
                <Route
                  path={`${path}/recent-files`}
                  render={() => <RecentFilesView {...viewProps} />}
                />
                <Route
                  path={`${path}/all-files`}
                  render={() => <AllFilesView {...viewProps} />}
                />
                <Route
                  path={`${path}/edit-profile`}
                  render={() => <EditProfileView {...viewProps} />}
                />
                <Route
                  path={`${path}/folder/:folderId`}
                  render={() => <FolderView {...viewProps} />}
                />
                <Route
                  path={`${path}/liked-models`}
                  render={() => <LikedModelsView {...viewProps} />}
                />
                <Route
                  path={`${path}/shared-files`}
                  render={() => <SharedFilesView {...viewProps} />}
                />
                <Route
                  path={`${path}/saved-searches`}
                  render={() => <SavedSearchesView {...viewProps} />}
                />
                <Route
                  path={`${path}/searchFiles/:searchTerm`}
                  render={() => <SearchView {...viewProps} />}
                />
                <Route component={() => 'Oops, Page Not Found'} />
              </Switch>
            </ContextMenuTrigger>
          )}
        </div>
      </div>

      <AddContextMenu />
      <FileContextMenu />
      <FolderContextMenu />
      <FolderInviteContextMenu />
    </>
  )
}

export default MyThangs
