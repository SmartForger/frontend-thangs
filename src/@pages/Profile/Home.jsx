import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import {
  Layout,
  WithFlash,
  Spinner,
  CardCollection,
  ProfilePicture,
  ToggleFollowButton,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import FolderCards from '@components/CardCollection/FolderCards'
import { useCurrentUser } from '@hooks'
import { Message404 } from '../404'
import { ReactComponent as ModelSquareIcon } from '@svg/model-square-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

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

const ProfileButton = ({ viewedUser, className, c }) => {
  const { user } = useCurrentUser()

  if (!user || user.id !== viewedUser.id) {
    return <ToggleFollowButton viewedUser={viewedUser} className={className} />
  }

  return (
    <Link className={classnames(className, c.Profile_EditProfileLink)} to='/profile/edit'>
      Edit Profile
    </Link>
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
    <div className={c.Home}>
      <div className={c.Profile_Row}>
        <ProfilePicture
          className={c.Profile_ProfilePicture}
          size='2.5rem'
          src={user && user.profile && user.profile.avatarUrl}
          name={user.fullName}
        />
        <div>
          <div className={c.Profile_Name}>{user.fullName}</div>
          <ProfileButton className={c.Profile_ProfileButton} viewedUser={user} c={c} />
        </div>
      </div>
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
    <Layout>
      <Page />
    </Layout>
  )
}
