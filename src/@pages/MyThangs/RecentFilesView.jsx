import React, { useMemo } from 'react'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { Spacer, TitleTertiary, FileCard, StatsBar, FileTable } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStarred } from '@hooks'

const useStyles = createUseStyles(_theme => {
  return {
    RecentFilesView: {
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
  const { starredModels = [] } = useStarred()
  const { data: thangsData = {} } = thangs
  const files = useMemo(() => {
    return !R.isEmpty(thangsData)
      ? [thangsData.folders, thangsData.models]
        .flat()
        .sort((a, b) => a.uploadDate - b.uploadDate)
      : []
  }, [thangsData])
  return (
    <main className={classnames(className, c.RecentFilesView)}>
      <Spacer size='2rem' />
      <div className={c.RecentFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Activity & Contributions</TitleTertiary>
        <Spacer size='2rem' />
        <StatsBar userActivity={thangsData.activity} />
        <Spacer size='4rem' />
        <TitleTertiary>Starred</TitleTertiary>
        <Spacer size='1.5rem' />
        <div className={c.RecentFilesView_Starred}>
          {starredModels.map((model, index) => {
            return (
              <React.Fragment key={`starred_${index}`}>
                <FileCard model={model} handleClick={handleEditModel} />
                <Spacer size='2rem' />
              </React.Fragment>
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
        ></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default RecentFilesView
