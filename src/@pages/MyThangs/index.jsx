import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { WorkspaceHeader, WorkspaceNavbar } from '@components'
import { authenticationService } from '@services'
import { useOverlay } from '@hooks'
import AllFilesView from './AllFilesView'
import EditProfileView from './EditProfileView'
import FolderView from './FolderView'
import RecentFilesView from './RecentFilesView'
import SharedFilesView from './SharedFilesView'
import LikedModelsView from './LikedModelsView'
import SavedSearchesView from './SavedSearchesView'
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
  }
})

const views = {
  allFilesView: AllFilesView,
  editProfile: EditProfileView,
  folderView: FolderView,
  likedModels: LikedModelsView,
  recentFiles: RecentFilesView,
  savedSearches: SavedSearchesView,
  sharedFiles: SharedFilesView,
}

const MyThangs = () => {
  const { view } = useParams()
  const history = useHistory()
  const [currentView, setCurrentView] = useState({
    name: view || 'recentFiles',
  })
  const { Overlay, isOverlayOpen, isOverlayHidden } = useOverlay()
  const c = useStyles({})
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
  const WorkspaceView = useMemo(() => views[currentView.name], [currentView])
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

  const handleNewModel = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'upload' })
  }, [dispatch])

  const handleCurrentView = useCallback(
    (name, data = {}) => {
      setCurrentView({ name: name, data: data })
      history.push(`/myThangs/${name}`)
    },
    [history]
  )

  const handleChangeFolder = useCallback(
    folder => {
      setCurrentView({ name: 'folderView', data: { folderId: folder.id } })
    },
    [setCurrentView]
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

  return (
    <div
      className={classnames(c.MyThangs, {
        [c.Layout_blur]: isOverlayOpen && !isOverlayHidden,
      })}
    >
      {Overlay}
      <WorkspaceNavbar
        {...currentView.data}
        folderNav={folderNav}
        folders={myFolders}
        setCurrentView={handleCurrentView}
        handleNewModel={handleNewModel}
        handleEditModel={handleEditModel}
        handleChangeFolder={handleChangeFolder}
        isLoadingThangs={isLoading}
        models={thangsData.models}
      />
      <div className={c.MyThangs_ContentWrapper}>
        <WorkspaceHeader />
        <WorkspaceView
          {...currentView.data}
          setCurrentView={handleCurrentView}
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
          folders={folders.data}
          myFolders={myFolders}
          sharedFolders={sharedFolders}
          models={thangsData.models}
          userId={currentUserId}
        />
      </div>
    </div>
  )
}

export default MyThangs
