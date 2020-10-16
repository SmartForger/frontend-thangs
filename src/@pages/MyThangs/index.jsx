import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { WorkspaceHeader, WorkspaceNavbar, Spinner } from '@components'
import { authenticationService } from '@services'
import { useOverlay } from '@hooks'
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

const useStyles = createUseStyles(theme => {
  return {
    MyThangs: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      overflowY: 'scroll',
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
      top: '2rem',
    },
  }
})

const MyThangs = withRouter(({ match }) => {
  const history = useHistory()
  const { Overlay, isOverlayOpen, isOverlayHidden } = useOverlay()
  const c = useStyles({})
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const currentUserId = authenticationService.getCurrentUserId()
  const { dispatch, thangs, folders, folderNav } = useStoreon(
    'thangs',
    'folders',
    'folderNav'
  )
  const { isLoading: isLoadingThangs, data: thangsData = {} } = thangs
  const { isLoading: isLoadingFolders, data: foldersData = {} } = folders

  const isLoading = useMemo(() => {
    return isLoadingThangs || isLoadingFolders
  }, [isLoadingFolders, isLoadingThangs])

  const myFolders = useMemo(() => {
    if (!foldersData || !foldersData.length) return []
    return foldersData.filter(
      ({ creator }) => creator.id.toString() === currentUserId.toString()
    )
  }, [currentUserId, foldersData])

  const sharedFolders = useMemo(() => {
    if (!foldersData || !foldersData.length) return []
    return foldersData.filter(
      ({ creator }) => creator.id.toString() !== currentUserId.toString()
    )
  }, [currentUserId, foldersData])

  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
    dispatch(types.FETCH_THANGS, {})
  }, [currentUserId, dispatch])

  const handleCurrentView = useCallback(
    name => {
      setCurrentFolderId(null)
      history.push(`/myThangs/${name}`)
    },
    [history]
  )

  const handleChangeFolder = useCallback(
    folder => {
      setCurrentFolderId(folder.id)
      history.push(`/myThangs/folder/${folder.id}`)
    },
    [history]
  )

  const handleEditModel = useCallback(
    model => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'editModel',
        overlayData: {
          model,
          user: model.owner,
          animateIn: true,
          windowed: true,
        },
      })
    },
    [dispatch]
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
    folders: folders.data,
    myFolders: myFolders,
    sharedFolders,
    models: thangsData.models,
    userId: currentUserId,
    onDrop,
    isLoading,
  }

  return (
    <div
      className={classnames(c.MyThangs, {
        [c.Layout_blur]: isOverlayOpen && !isOverlayHidden,
      })}
    >
      {Overlay}
      <WorkspaceNavbar
        folderNav={folderNav}
        folders={myFolders}
        setCurrentView={handleCurrentView}
        handleEditModel={handleEditModel}
        handleChangeFolder={handleChangeFolder}
        isLoadingThangs={isLoading}
        models={thangsData.models}
        currentFolderId={currentFolderId}
      />
      <div className={c.MyThangs_ContentWrapper}>
        <WorkspaceHeader setCurrentView={handleCurrentView} />
        {isLoading ? (
          <Spinner className={c.Spinner} />
        ) : (
          <Switch>
            <Route
              exact
              path={match.path}
              render={() => <RecentFilesView {...viewProps} />}
            />
            <Route
              path={`${match.path}/recentFiles`}
              render={() => <RecentFilesView {...viewProps} />}
            />
            <Route
              path={`${match.path}/allFiles`}
              render={() => <AllFilesView {...viewProps} />}
            />
            <Route
              path={`${match.path}/editProfile`}
              render={() => <EditProfileView {...viewProps} />}
            />
            <Route
              path={`${match.path}/folder/:folderId`}
              render={() => <FolderView {...viewProps} />}
            />
            <Route
              path={`${match.path}/likedModels`}
              render={() => <LikedModelsView {...viewProps} />}
            />
            <Route
              path={`${match.path}/sharedFiles`}
              render={() => <SharedFilesView {...viewProps} />}
            />
            <Route
              path={`${match.path}/savedSearches`}
              render={() => <SavedSearchesView {...viewProps} />}
            />
            <Route
              path={`${match.path}/searchFiles/:searchTerm`}
              render={() => <SearchView {...viewProps} />}
            />
            <Route component={() => 'Oops, Page Not Found'} />
          </Switch>
        )}
      </div>
    </div>
  )
})

export default MyThangs
