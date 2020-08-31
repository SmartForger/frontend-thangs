import React, { useEffect, useState } from 'react'
import {
  Layout,
  WithFlash,
  Spinner,
  CardCollection,
  ProfilePicture,
  ProfileButton,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import FolderCards from '@components/CardCollection/FolderCards'
import { Message404 } from '../404'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import useFetchPerMount from '@hooks/useServices/useFetchPerMount'
import { useCurrentUserId, useCurrentUser } from '@hooks'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    Home: {
      width: '100%',
    },
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
    Profile_Row: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '3rem',
    },
    Profile_ProfilePicture: {
      marginRight: '.5rem',
    },
    Profile_Name: {
      ...theme.mixins.text.subheaderText,
    },
    Profile_ProfileButton: {
      marginTop: '.25rem',
      display: 'block',
    },
    Profile_EditProfileLink: {
      ...theme.mixins.text.boldText,
      ...theme.mixins.text.linkText,
    },
  }
})

export * from './EditProfile'
export * from './RedirectProfile'
export * from './Likes'

const CollectionTitle = ({ selected, onClick, className, title, Icon, amount }) => {
  const c = useStyles({ selected })
  return (
    <div className={classnames(className, c.Home_Row)} onClick={onClick}>
      <Icon className={c.Home_Icon} selected={selected} />
      {amount ? [title, amount].join(' ') : title}
    </div>
  )
}

const PageContent = ({ user }) => {
  const c = useStyles({})
  const currentUserId = useCurrentUserId()

  const { folders } = useStoreon('folders')

  const {
    atom: { data: models },
  } = useFetchPerMount(currentUserId, 'user-own-models')
  const [selected, setSelected] = useState('models')

  const selectModels = () => setSelected('models')
  const selectFolders = () => setSelected('folders')

  const sortedModels = ((Array.isArray(models) && models) || []).sort(
    (modelA, modelB) => {
      if (modelA.created === modelB.created) return 0
      if (modelA.created > modelB.created) return -1
      else return 1
    }
  )

  return (
    <div className={c.Home}>
      <div className={c.Profile_Row}>
        <ProfilePicture
          className={c.Profile_ProfilePicture}
          size='5rem'
          src={user && user.profile && user.profile.avatarUrl}
          name={user.fullName}
        />
        <div>
          <div className={c.Profile_Name}>{user.fullName}</div>
          <ProfileButton className={c.Profile_ProfileButton} userId={currentUserId} />
        </div>
      </div>
      <div className={c.Home_TextHeader}>
        <CollectionTitle
          selected={selected === 'models'}
          onClick={selectModels}
          title={'Models'}
          amount={((Array.isArray(models) && models) || []).length}
          Icon={ModelSquareIcon}
        />
        <CollectionTitle
          selected={selected === 'folders'}
          className={c.Home_FoldersTitle}
          onClick={selectFolders}
          title={'Folders'}
          amount={((Array.isArray(folders.data) && folders.data) || []).length}
          Icon={FolderIcon}
        />
      </div>
      <WithFlash>
        {selected === 'models' ? (
          <CardCollection noResultsText='This user has not uploaded any models yet.'>
            <ModelCards items={sortedModels} />
          </CardCollection>
        ) : (
          <CardCollection noResultsText='This user has not uploaded any folders yet.'>
            <FolderCards items={folders && folders.data} />
          </CardCollection>
        )}
      </WithFlash>
    </div>
  )
}

const Page = () => {
  const {
    atom: { isLoading, isError, data: user },
  } = useCurrentUser()

  const { dispatch, folders } = useStoreon('folders')
  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
  }, [dispatch])

  if (isLoading || folders.isLoading) {
    return <Spinner />
  }

  if (isError) {
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
    <Layout>
      <Page />
    </Layout>
  )
}
