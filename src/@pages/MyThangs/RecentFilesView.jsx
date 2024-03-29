import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { FileCard, FileTable, FolderCard, Spacer, StatsBar } from '@components'
import { useStarred } from '@hooks'
import { pageview } from '@utilities/analytics'
import { getMyFolders } from '@selectors'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

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
      marginLeft: '1.5rem',
      [md]: {
        marginLeft: '2rem',
        minWidth: '56rem',
      },
    },
    RecentFilesView_Starred: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',

      [md]: {
        flexWrap: 'wrap',
        overflowX: 'hidden',
      },

      '& > div': {
        marginTop: '1.5rem',
      },
    },
  }
})
const noop = () => null
const RecentFilesView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  onDrop = noop,
  folders,
  models: modelData,
}) => {
  const c = useStyles({})
  const { activity } = useStoreon('activity')
  const { data: activityData } = activity
  const { starredModels = [], starredFolders = [] } = useStarred()
  const hasStarred = useMemo(
    () => starredFolders.length > 0 || starredModels.length > 0,
    [starredFolders.length, starredModels.length]
  )
  const files = useMemo(() => {
    const rootFolders = getMyFolders(folders).filter(folder => !folder.parentId)
    return [rootFolders, modelData].flat()
  }, [folders, modelData])

  useEffect(() => {
    pageview('MyThangs - RecentFiles')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className={classnames(className, c.RecentFilesView_Row)}>
      <div className={c.RecentFilesView_Content}>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Activity & Contributions</Title>
        <Spacer size='2rem' />
        <StatsBar userActivity={activityData} />
        {hasStarred && (
          <>
            <Spacer size='4rem' />
            <Title headerLevel={HeaderLevel.tertiary}>Starred</Title>
            <div className={c.RecentFilesView_Starred}>
              {starredFolders.map((folder, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_folders_${index}`}>
                    <FolderCard folder={folder} handleClick={handleChangeFolder} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
              {starredModels.map((model, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_models_${index}`}>
                    <FileCard model={model} handleClick={handleEditModel} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
            </div>
          </>
        )}
        <Spacer size='4rem' />
        <FileTable
          files={files}
          handleChangeFolder={handleChangeFolder}
          handleEditModel={handleEditModel}
          heightOffset={8}
          onDrop={onDrop}
          isToolbarShown={true}
          sortedBy='created'
          title='Recent'
          hasSubtree={false}
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default RecentFilesView
