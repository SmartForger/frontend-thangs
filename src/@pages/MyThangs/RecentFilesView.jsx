import React, { useEffect } from 'react'
import { useStoreon } from 'storeon/react'
import { Spacer, TitleTertiary, FileCard, StatsBar, FileTable } from '@components'
import { createUseStyles } from '@style'
import { useStarred } from '@hooks'

const useStyles = createUseStyles(_theme => {
  return {
    RecentFilesView: {
      display: 'flex',
      flexDirection: 'row',
      overflowY: 'scroll',
    },
    RecentFilesView_Content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    RecentFilesView_Starred: {
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const RecentFilesView = () => {
  const c = useStyles({})
  const { dispatch, userActivity, thangs } = useStoreon('userActivity', 'thangs')
  const { starredModels = [] } = useStarred()
  useEffect(() => {
    console.log('This is where I will fetch userActivity once there is an endpoint')
  }, [])

  return (
    <main className={c.RecentFilesView}>
      <Spacer size='2rem' />
      <div className={c.RecentFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Activity & Contributions</TitleTertiary>
        <Spacer size='2rem' />
        <StatsBar userActivity={userActivity} />
        <Spacer size='4rem' />
        <TitleTertiary>Starred</TitleTertiary>
        <Spacer size='1.5rem' />
        <div className={c.RecentFilesView_Starred}>
          {starredModels.map((model, index) => {
            return (
              <React.Fragment key={`starred_${index}`}>
                <FileCard model={{ name: model.name }} />
                <Spacer size='2rem' />
              </React.Fragment>
            )
          })}
        </div>
        <Spacer size='4rem' />
        <TitleTertiary>Recent</TitleTertiary>
        <Spacer size='2rem' />
        <FileTable></FileTable>
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default RecentFilesView
