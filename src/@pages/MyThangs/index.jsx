import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { WorkspaceHeader, WorkspaceNavbar } from '@components'
import { authenticationService } from '@services'
import EditProfileView from './EditProfileView'
import FolderView from './FolderView'
import RecentFilesView from './RecentFilesView'
import SharedFilesView from './SharedFilesView'
import LikedModelsView from './LikedModelsView'
import SavedSearchesView from './SavedSearchesView'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(_theme => {
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
  }
})

const views = {
  editProfile: EditProfileView,
  folder: FolderView,
  likedModels: LikedModelsView,
  recentFiles: RecentFilesView,
  savedSearches: SavedSearchesView,
  sharedFiles: SharedFilesView,
}

const MyThangs = () => {
  const [currentView, setCurrentView] = useState({ name: 'recentFiles', data: {} })
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

  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
    dispatch(types.FETCH_THANGS, { id: currentUserId })
  }, [currentUserId, dispatch])

  const handleNewModel = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'upload' })
  }, [dispatch])

  const handleCurrentView = useCallback((name, data = {}) => {
    setCurrentView({ name, data })
  }, [])

  return (
    <div className={c.MyThangs}>
      <WorkspaceNavbar
        folderNav={folderNav}
        folders={myFolders}
        handleCurrentView={handleCurrentView}
        handleNewModel={handleNewModel}
        isLoadingThangs={isLoading}
        models={thangsData.models}
      />
      <div className={c.MyThangs_ContentWrapper}>
        <WorkspaceHeader />
        <WorkspaceView {...currentView.data} />
      </div>
    </div>
  )
}

export default MyThangs
