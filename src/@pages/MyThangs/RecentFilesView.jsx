import React from 'react'
import {
  Spacer,
  TitleTertiary,
  FileCard,
  FolderCard,
  StatsBar,
  FileTable,
} from '@components'
import { createUseStyles } from '@style'

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
      overflowY: 'scroll',
    },
    RecentFilesView_Starred: {
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const RecentFilesView = () => {
  const c = useStyles({})
  return (
    <main className={c.RecentFilesView}>
      <Spacer size='2rem' />
      <div className={c.RecentFilesView_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Activity & Contributions</TitleTertiary>
        <Spacer size='2rem' />
        <StatsBar />
        <Spacer size='4rem' />
        <TitleTertiary>Starred</TitleTertiary>
        <Spacer size='1.5rem' />
        <div className={c.RecentFilesView_Starred}>
          <FileCard model={{ name: 'Pikachu.stl' }} />
          <Spacer size='2rem' />
          <FolderCard folder={{ name: 'Car Engine' }} />
          <Spacer size='2rem' />
          <FolderCard folder={{ name: 'Pokemons' }} />
          <Spacer size='2rem' />
          <FolderCard folder={{ name: 'Starship Enterprise' }} />
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
