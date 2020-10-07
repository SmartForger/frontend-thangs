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
  const { dispatch, thangs, folderNav } = useStoreon('thangs', 'folderNav')
  const { isLoading, data: thangsData = {} } = thangs
  const WorkspaceView = useMemo(() => views[currentView.name], [currentView])

  useEffect(() => {
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
        folders={thangsData.folders}
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
