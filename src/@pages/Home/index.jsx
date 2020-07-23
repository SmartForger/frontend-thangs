import React from 'react'
import { Link } from 'react-router-dom'

import { NewThemeLayout } from '@components/Layout'
import { WithFlash } from '@components/Flash'
import { useCurrentUser, useModelsOwnedBy, useFoldersOwnedBy } from '@customHooks/Users'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'
import ModelCollection from '@components/CardCollection/ModelCollection'
import FolderCollection from '@components/CardCollection/FolderCollection'
import { subheaderText } from '@style/text'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Home: {},
    Home_TextHeader: {
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
    Home_Title: {
      ...subheaderText,
      display: 'flex',
      alignItems: 'center',
      color: 'inherit',
    },
    Home_FolderTitle: {
      marginLeft: '1rem',
    },
  }
})

function ModelsTitle({ count, selected }) {
  const c = useStyles({ selected })
  return (
    <Link className={c.Home_Title} to={!selected && '/models'} as={selected && 'div'}>
      <ModelSquareIcon className={c.Home_Icon} selected={selected} />
      Models {count}
    </Link>
  )
}

function FoldersTitle({ count, selected, className }) {
  const c = useStyles({ selected })
  return (
    <Link
      className={classnames(className, c.Home_Title)}
      to={!selected && '/folders'}
      as={selected && 'div'}
    >
      <FolderIcon className={c.Home_Icon} selected={selected} />
      Folders {count}
    </Link>
  )
}

function FoldersContent({ user }) {
  const c = useStyles({})
  const { folders, loading, fetchMore, pageInfo } = useFoldersOwnedBy(user.id)

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <div className={c.Home_TextHeader}>
        <ModelsTitle count={user.modelsCount} />
        <FoldersTitle
          className={c.Home_FoldersTitle}
          selected
          count={user.foldersCount}
        />
      </div>
      <WithFlash>
        <FolderCollection
          folders={folders}
          noResultsText='You have not created any folders yet.'
          fetchMore={() => fetchMore(pageInfo.endCursor)}
          hasMore={pageInfo.hasNextPage}
        />
      </WithFlash>
    </div>
  )
}

function ModelsContent({ user }) {
  const { models, loading, fetchMore, pageInfo } = useModelsOwnedBy(user.id)

  if (loading) {
    return <Spinner />
  }

  const sortedModels = models.sort((modelA, modelB) => {
    if (modelA.created === modelB.created) return 0
    if (modelA.created > modelB.created) return -1
    else return 1
  })

  return (
    <ModelCollection
      models={sortedModels}
      noResultsText='You have not uploaded any models yet.'
      fetchMore={() => fetchMore(pageInfo.endCursor)}
      hasMore={pageInfo.hasNextPage}
    />
  )
}

function ModelsPage() {
  const c = useStyles({})
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

  return (
    <div>
      <div className={c.Home_TextHeader}>
        <ModelsTitle selected count={user.modelsCount} />
        <FoldersTitle
          className={c.Home_FolderTitle}
          user={user}
          count={user.foldersCount}
        />
      </div>
      <WithFlash>
        <ModelsContent user={user} />
      </WithFlash>
    </div>
  )
}

function FoldersPage() {
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

  return <FoldersContent user={user} />
}

export const Folders = () => {
  return (
    <NewThemeLayout>
      <FoldersPage />
    </NewThemeLayout>
  )
}

export const Models = () => {
  return (
    <NewThemeLayout>
      <ModelsPage />
    </NewThemeLayout>
  )
}
