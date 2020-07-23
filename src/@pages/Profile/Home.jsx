import React, { useState } from 'react'
import * as R from 'ramda'

import { NewThemeLayout } from '@components/Layout'
import { WithFlash } from '@components/Flash'
import { useCurrentUser } from '@customHooks/Users'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'
import CardCollection from '@components/CardCollection'
import { subheaderText } from '@style/text'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Home: {},
    Home_TextHeader: {
      ...subheaderText,
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      marginBottom: '1.5rem',
    },
    Home_Icon: {
      marginRight: '.5rem',
      width: '1.5rem',
      height: '1.5rem',
      color: ({ selected }) => (selected ? theme.colors.blue[500] : 'inherit'),
    },
    Home_Row: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
  }
})

export * from './EditProfile'
export * from './RedirectProfile'
export * from './Likes'

const ModelsTitle = ({ user, selected, onClick }) => {
  const c = useStyles({ selected })
  const models = R.pathOr([], ['models'])(user)
  const modelAmount = models.length
  return (
    <div className={c.Home_Row} onClick={onClick}>
      <ModelSquareIcon className={c.Home_Icon} selected={selected} />
      Models {modelAmount}
    </div>
  )
}

const FoldersTitle = ({ user, selected, onClick, className }) => {
  const c = useStyles({ selected })
  const folders = R.pathOr([], ['folders'])(user)
  const folderAmount = folders.length
  return (
    <div className={classnames(className, c.Home_Row)} onClick={onClick}>
      <FolderIcon className={c.Home_Icon} selected={selected} />
      Folders {folderAmount}
    </div>
  )
}

const getModels = R.pathOr([], ['models'])
const getFolders = R.pathOr([], ['folders'])

const PageContent = ({ user }) => {
  const c = useStyles({})
  const [selected, setSelected] = useState('models')

  const selectModels = () => setSelected('models')
  const selectFolders = () => setSelected('folders')

  const models = getModels(user)
  const folders = getFolders(user)

  const sortedModels = models.sort((modelA, modelB) => {
    if (modelA.created === modelB.created) return 0
    if (modelA.created > modelB.created) return -1
    else return 1
  })

  return (
    <div>
      <div className={c.Home_TextHeader}>
        <ModelsTitle
          selected={selected === 'models'}
          onClick={selectModels}
          user={user}
        />
        <FoldersTitle
          selected={selected === 'folders'}
          onClick={selectFolders}
          user={user}
          css={`
            margin-left: 16px;
          `}
        />
      </div>
      <WithFlash>
        {selected === 'models' ? (
          <CardCollection
            models={sortedModels}
            noResultsText='This user has not uploaded any models yet.'
          />
        ) : (
          <CardCollection
            folders={folders}
            noResultsText='This user has not uploaded any folders yet.'
          />
        )}
      </WithFlash>
    </div>
  )
}

const Page = () => {
  const { user, error, loading } = useCurrentUser()

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (!user) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }

  return <PageContent user={user} />
}

export const Home = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
