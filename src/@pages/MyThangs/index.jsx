import React, { useCallback, useEffect, useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  WorkspaceHeader,
  WorkspaceNavbar,
  Spacer,
  Spinner,
  AddContextMenu,
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
import { createUseStyles } from '@style'
import classnames from 'classnames'
import * as types from '@constants/storeEventTypes'
import { pageview, track } from '@utilities/analytics'
import { ContextMenuTrigger } from 'react-contextmenu'

const useStyles = createUseStyles(theme => {
  return {
    MyThangs: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      overflowY: 'scroll',
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
      scrollbarWidth: 'thin',
      scrollbarColor: '#C7C7C7 white',

      '&::-webkit-scrollbar': {
        width: 12,
      },
      '&::-webkit-scrollbar-track': {
        background: 'white',
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: '3px solid white',
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
    MyThangs_UploadZone: {
      '& > div': {
        outline: 'none',
      },
    },
    Spinner: {
      position: 'relative',
      top: '9rem',
    },
    MyThangs_ContextMenu: {
      zIndex: 2,
    },
  }
})

const OverlayWrapper = () => {
  const c = useStyles({})
  const { Overlay, isOverlayOpen, isOverlayHidden } = useOverlay()

  return (
    <div
      className={classnames(c.MyThangs_OverlayWrapper, {
        [c.Layout_blur]: isOverlayOpen && !isOverlayHidden,
      })}
    >
      {Overlay}
    </div>
  )
}

const MyThangs = () => {
  const { path } = useRouteMatch()
  const history = useHistory()
  const c = useStyles({})
  const [currentFolderId, setCurrentFolderId] = useState(null)
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
    if (isLoaded) track('Page Loaded - MyThangs', { seconds: getTime() })
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

  const handleChangeFolder = useCallback(
    folder => {
      setCurrentFolderId(folder.id)
      history.push(`/mythangs/folder/${folder.id}`)
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
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'multiUpload',
        overlayData: {
          initData: { acceptedFiles, rejectedFile, e: _event },
          folderId: currentFolderId,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [currentFolderId, dispatch]
  )

  const viewProps = {
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
        <OverlayWrapper />
        <ContextMenuTrigger
          id='Add_Menu'
          attributes={{
            style: { height: '100%' },
          }}
          holdToDisplay={1000}
        >
          <WorkspaceNavbar
            currentFolderId={currentFolderId}
            folders={folderData}
            handleChangeFolder={handleChangeFolder}
            handleEditModel={handleEditModel}
            isLoadingThangs={isLoading}
            models={modelData}
            setCurrentView={handleCurrentView}
          />
        </ContextMenuTrigger>

        <div className={c.MyThangs_ContentWrapper}>
          <WorkspaceHeader setCurrentView={handleCurrentView} />
          <Spacer size={'7rem'} />
          {!isLoaded || isLoading ? (
            <Spinner className={c.Spinner} />
          ) : (
            <ContextMenuTrigger
              id='Add_Menu'
              attributes={{
                style: { height: '100%' },
              }}
              holdToDisplay={1000}
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
      <AddContextMenu className={c.MyThangs_ContextMenu} />
    </>
  )
}

export default MyThangs
