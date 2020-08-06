import React, { useEffect, useState } from 'react'
import * as R from 'ramda'

import { NewThemeLayout } from '@components/Layout'
import { WithFlash } from '@components/Flash'
import { useCurrentUser } from '@customHooks/Users'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'
import CardCollection from '@components/CardCollection'
import ModelCards from '@components/CardCollection/ModelCards'
import FolderCards from '@components/CardCollection/FolderCards'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    Home: {},
    Home_TextHeader: {
      ...theme.mixins.text.subheaderText,
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
    Home_FoldersTitle: {
      marginLeft: '1rem',
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

const FoldersTitle = ({ _user, selected, onClick, className }) => {
  const c = useStyles({ selected })
  const { folders } = useStoreon('folders')
  const folderAmount = folders && folders.data && folders.data.length
  return (
    <div className={classnames(className, c.Home_Row)} onClick={onClick}>
      <FolderIcon className={c.Home_Icon} selected={selected} />
      Folders {folderAmount}
    </div>
  )
}

const getModels = R.pathOr([], ['models'])

const PageContent = ({ user }) => {
  const c = useStyles({})
  const { folders } = useStoreon('folders')
  const [selected, setSelected] = useState('models')

  const selectModels = () => setSelected('models')
  const selectFolders = () => setSelected('folders')

  const models = getModels(user)

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
          className={c.Home_FoldersTitle}
          selected={selected === 'folders'}
          onClick={selectFolders}
          user={user}
        />
      </div>
      <WithFlash>
        {selected === 'models' ? (
          <CardCollection noResultsText='This user has not uploaded any models yet.'>
            <ModelCards models={sortedModels} />
          </CardCollection>
        ) : (
          <CardCollection noResultsText='This user has not uploaded any folders yet.'>
            <FolderCards folders={folders && folders.data} />
          </CardCollection>
        )}
      </WithFlash>
    </div>
  )
}

const Page = () => {
  const { user, error, loading } = useCurrentUser()
  const { dispatch, folders } = useStoreon('folders')
  useEffect(() => {
    dispatch('fetch-folders')
  }, [dispatch])

  if (loading || folders.isLoading) {
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
