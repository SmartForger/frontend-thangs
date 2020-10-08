import React from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, Spacer, UserNav } from '@components'
import SearchBar from './SearchBar'
import { useCurrentUser } from '@hooks'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    WorkspaceHeader: {
      backgroundColor: theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 2,
    },
    WorkspaceHeader_Content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    WorkspaceHeader_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const WorkspaceHeader = () => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()

  return (
    <header className={c.WorkspaceHeader}>
      <Spacer size='2rem' />
      <div className={c.WorkspaceHeader_Content}>
        <div className={c.WorkspaceHeader_Row}>
          <Spacer size='2rem' />
          <SearchBar />
        </div>
        <div>
          <UserNav
            dispatch={dispatch}
            isLoading={isLoading}
            user={user}
            showUser={true}
            showUpload={false}
          />
        </div>
      </div>
      <Spacer size='2rem' />
      <Divider spacing='0' />
    </header>
  )
}

export default WorkspaceHeader
