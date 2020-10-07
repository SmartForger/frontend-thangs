import React from 'react'
import { Divider, Spacer } from '@components'
import SearchBar from './SearchBar'
import { createUseStyles } from '@style'

import { ReactComponent as NotificationIcon } from '@svg/icon-notification.svg'

const useStyles = createUseStyles(_theme => {
  return {
    WorkspaceHeader: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    WorkspaceHeader_Content: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  }
})

const WorkspaceHeader = () => {
  const c = useStyles({})

  return (
    <header className={c.WorkspaceHeader}>
      <Spacer size='2rem' />
      <div className={c.WorkspaceHeader_Content}>
        <Spacer size='2rem' />
        <SearchBar />
        <div>
          <NotificationIcon />
        </div>
      </div>
      <Spacer size='2rem' />
      <Divider spacing='0' />
    </header>
  )
}

export default WorkspaceHeader
