import React, { useCallback, useEffect } from 'react'
import { useStoreon } from 'storeon/react'
import { WorkspaceNavbar } from '@components'
import { authenticationService } from '@services'
// import EditProfileView from './EditProfileView'
// import FolderView from './FolderView'
// import RecentFilesView from './RecentFilesView'
// import SharedFilesView from './SharedFilesView'
// import LikedModelsView from './LikedModelsView'
// import SavedSearchesView from './SavedSearchesView'
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

// const views = {
//   editProfile: EditProfileView,
//   folder: FolderView,
//   likedModels: LikedModelsView,
//   recentFiles: RecentFilesView,
//   savedSearches: SavedSearchesView,
//   sharedFiles: SharedFilesView,
// }

const MyThangs = () => {
  const c = useStyles({})
  const currentUserId = authenticationService.getCurrentUserId()
  const { dispatch, thangs, folderNav } = useStoreon('thangs', 'folderNav')
  // const [currentView, setCurrentView] = useState('recentFiles')
  // const WorkspaceView = useMemo(() => views[currentView], [currentView])
  const { isLoading, data: thangsData = {} } = thangs
  useEffect(() => {
    dispatch(types.FETCH_THANGS, { id: currentUserId })
  }, [currentUserId, dispatch])

  const handleNewModel = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'upload' })
  }, [dispatch])

  return (
    <div className={c.MyThangs}>
      <WorkspaceNavbar
        folderNav={folderNav}
        folders={thangsData.folders}
        handleNewModel={handleNewModel}
        isLoadingThangs={isLoading}
        models={thangsData.models}
        // setThangsView={setCurrentView}
      />
      <div className={c.MyThangs_ContentWrapper}>
        {/* <WorkspaceHeader setThangsView={setCurrentView} /> */}
        {/* <WorkspaceView setThangsView={setCurrentView} /> */}
      </div>
    </div>
  )
}

export default MyThangs
