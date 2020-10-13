import React, { useMemo } from 'react'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import {
  AddContextMenu,
  Spacer,
  TitleTertiary,
  FileCard,
  FolderCard,
  StatsBar,
  FileTable,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStarred } from '@hooks'
import { ContextMenuTrigger } from 'react-contextmenu'

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
}) => {
  const c = useStyles({})
  const { thangs } = useStoreon('thangs')
  const { starredModels = [], starredFolders = [] } = useStarred()
  const { data: thangsData = {} } = thangs
  const files = useMemo(() => {
    return !R.isEmpty(thangsData)
      ? [thangsData.folders, thangsData.models]
          .flat()
          .sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate))
      : []
  }, [thangsData])

  return (
    <>
      <ContextMenuTrigger id='Add_Menu' holdToDisplay={1000}>
        <main className={classnames(className, c.RecentFilesView_Row)}>
          <Spacer size='2rem' />
          <div className={c.RecentFilesView_Content}>
            <Spacer size='2rem' />
            <TitleTertiary>Activity & Contributions</TitleTertiary>
            <Spacer size='2rem' />
            <StatsBar userActivity={thangsData.activity} />
            <Spacer size='4rem' />
            <TitleTertiary>Starred</TitleTertiary>
            <div className={c.RecentFilesView_Starred}>
              {starredModels.map((model, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_${index}`}>
                    <FileCard model={model} handleClick={handleEditModel} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
              {starredFolders.map((folder, index) => {
                return (
                  <div className={c.RecentFilesView_Row} key={`starred_${index}`}>
                    <FolderCard folder={folder} handleClick={handleChangeFolder} />
                    <Spacer size='2rem' />
                  </div>
                )
              })}
            </div>
            <Spacer size='4rem' />
            <TitleTertiary>Recent</TitleTertiary>
            <Spacer size='2rem' />
            <FileTable
              files={files}
              handleChangeFolder={handleChangeFolder}
              handleEditModel={handleEditModel}
              sortedBy={'created'}
            ></FileTable>
          </div>
          <Spacer size='2rem' />
        </main>
      </ContextMenuTrigger>
      <AddContextMenu />
    </>
  )
}

export default RecentFilesView
