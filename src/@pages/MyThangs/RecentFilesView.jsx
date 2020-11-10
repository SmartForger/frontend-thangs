import React, { useEffect, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import {
  FileCard,
  FileTable,
  FolderCard,
  Spacer,
  Spinner,
  StatsBar,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStarred } from '@hooks'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(_theme => {
  return {
    RecentFilesView: {},
    RecentFilesView_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    RecentFilesView_Content: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '56rem',
    },
    RecentFilesView_Starred: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      position: 'relative',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    RecentFilesView_Loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.19)',
      zIndex: 1,
      top: '-.75rem',
      left: '-1rem',
      display: 'flex',
      alignItems: 'center',
    },
  }
})
const noop = () => null
const RecentFilesView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  onDrop = noop,
  myFolders: folderData,
  models: modelData,
}) => {
  const c = useStyles({})
  const { activity } = useStoreon('activity')
  const { data: activityData } = activity
  const {
    starredModels = [],
    starredFolders = [],
    isLoading: isLoadingStarred,
  } = useStarred()
  const hasStarred = useMemo(
    () => starredFolders.length > 0 || starredModels.length > 0,
    [starredFolders.length, starredModels.length]
  )
  const files = useMemo(() => {
    return [folderData, modelData].flat()
  }, [folderData, modelData])

  useEffect(() => {
    pageview('MyThangs - RecentFiles')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={classnames(className, c.RecentFilesView_Row)}>
      <Spacer size='2rem' />
      <div className={c.RecentFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Activity & Contributions</TitleTertiary>
        <Spacer size='2rem' />
        <StatsBar userActivity={activityData} />
        {(isLoadingStarred || hasStarred) && (
          <>
            <Spacer size='4rem' />
            <TitleTertiary>Starred</TitleTertiary>
            <div className={c.RecentFilesView_Starred}>
              {isLoadingStarred && (
                <div className={c.RecentFilesView_Loader}>
                  <Spinner />
                </div>
              )}
              {starredFolders.map((folder, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_${index}`}>
                    <FolderCard folder={folder} handleClick={handleChangeFolder} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
              {starredModels.map((model, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_${index}`}>
                    <FileCard model={model} handleClick={handleEditModel} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
            </div>
          </>
        )}
        <Spacer size='4rem' />
        <TitleTertiary>Recent</TitleTertiary>
        <Spacer size='2rem' />
        <FileTable
          files={files}
          handleChangeFolder={handleChangeFolder}
          handleEditModel={handleEditModel}
          sortedBy='created'
          onDrop={onDrop}
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default RecentFilesView
