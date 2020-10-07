import React from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, Spacer, UserNav } from '@components'
import SearchBar from './SearchBar'
import { useCurrentUser } from '@hooks'
import { createUseStyles } from '@style'

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
  const { dispatch } = useStoreon()
  const {
    atom: { isLoading, data: user },
  } = useCurrentUser()

  return (
    <header className={c.WorkspaceHeader}>
      <Spacer size='2rem' />
      <div className={c.WorkspaceHeader_Content}>
        <Spacer size='2rem' />
        <SearchBar />
        <div>
          <UserNav
            dispatch={dispatch}
            isLoading={isLoading}
            user={user}
            showUser={true}
          />
        </div>
      </div>
      <Spacer size='2rem' />
      <Divider spacing='0' />
    </header>
  )
}

export default WorkspaceHeader
