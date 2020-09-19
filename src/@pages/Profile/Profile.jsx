import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  CardCollection,
  EditProfileForm,
  FolderCards,
  Layout,
  Markdown,
  MetadataPrimary,
  ModelCards,
  ProfileButton,
  ProfilePicture,
  SearchCards,
  SingleLineBodyText,
  Spacer,
  Spinner,
  useFlashNotification,
  WithFlash,
} from '@components'
import { Message404 } from '@pages/404'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId, usePageMeta, useQuery } from '@hooks'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Home: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    Home_Content: {
      width: '100%',
    },
    Home_TextHeader: {
      ...theme.text.subheaderText,
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    Home_Row: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      textDecoration: ({ selected }) => (selected ? 'underline' : 'none'),

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    Profile: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '3rem',
      width: '100%',

      [md]: {
        maxWidth: '15rem',
      },
    },
    Profile_Header: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',

      [md]: {
        flexDirection: 'column',
      },
    },
    Profile_Details: {
      marginTop: '1rem',
      width: '100%',
    },
    Profile_ProfilePicture: {
      marginRight: '.5rem',
      height: '8rem !important',
      width: '8rem !important',

      '& img': {
        height: '8rem !important',
        width: '8rem !important',
      },

      [md]: {
        height: '15rem !important',
        width: '15rem !important',

        '& img': {
          height: '15rem !important',
          width: '15rem !important',
        },
      },
    },
    Profile_Name: {
      ...theme.text.subheaderText,
    },
    Profile_ProfileButton: {
      width: '100%',
    },
    Profile_NoContentMessage: {
      ...theme.text.smallHeaderText,
      marginTop: '1.75rem',
    },

    Profile_NoContentMessage__link: {
      ...theme.text.linkText,
    },
  }
})

const getDescription = R.pathOr('Empty', ['profile', 'description'])

const ModelsContent = ({ models: modelsData = {}, isCurrentUsersProfile }) => {
  const c = useStyles({})
  const { data: models, isLoaded, isError } = modelsData
  const { dispatch } = useStoreon()

  if (!isLoaded) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  const sortedModels = ((Array.isArray(models) && models) || []).sort(
    (modelA, modelB) => {
      if (modelA.created === modelB.created) return 0
      if (modelA.created > modelB.created) return -1
      else return 1
    }
  )

  if (R.isEmpty(sortedModels) && isCurrentUsersProfile) {
    return (
      <div className={c.Profile_NoContentMessage}>
        <a
          href='/#'
          onClick={e => {
            e.preventDefault()
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'upload',
            })
          }}
        >
          <span className={c.Profile_NoContentMessage__link}>Upload</span>
        </a>{' '}
        your first model to start building your portfolio.
      </div>
    )
  }

  return (
    <CardCollection noResultsText='You have not uploaded any models yet.'>
      <ModelCards items={sortedModels} />
    </CardCollection>
  )
}

const FoldersContent = ({ folders: foldersAtom = {} }) => {
  const c = useStyles({})
  const { data: folders, isLoaded, isError } = foldersAtom
  const { dispatch } = useStoreon()
  const { navigateWithFlash } = useFlashNotification()
  const handleAfterCreate = useCallback(
    folder => {
      dispatch(types.CLOSE_OVERLAY)
      navigateWithFlash(
        `/folder/${folder.folderId}`,
        'Folder created successfully. If the provided unregistered email addresses, they will receive an email with instructions for accessing your folder.'
      )
    },
    [dispatch, navigateWithFlash]
  )

  if (!isLoaded) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isEmpty(folders)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        <a
          href='/#'
          onClick={e => {
            e.preventDefault()
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'createFolder',
              overlayData: {
                afterCreate: handleAfterCreate,
              },
            })
          }}
        >
          <span className={c.Profile_NoContentMessage__link}>Create</span>
        </a>{' '}
        a private shared folder, invite team members, and start collaborating on projects.
      </div>
    )
  }

  return (
    <CardCollection noResultsText='You have not uploaded any folders yet.'>
      <FolderCards items={folders} />
    </CardCollection>
  )
}

const SavedSearchesContent = ({ searchSubscriptionsData = {} }) => {
  const c = useStyles({})
  const { data: searchSubscriptions, isLoaded, isError } = searchSubscriptionsData
  if (!isLoaded) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isEmpty(searchSubscriptions)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        Get notifications when more results are added by saving your
        <a href='/search'>
          <span className={c.Profile_NoContentMessage__link}>search.</span>
        </a>{' '}
        Find it on the search results page.
      </div>
    )
  }

  return (
    <CardCollection
      cardWidth={'22.5rem'}
      noResultsText='You have not saved and searches yet.'
    >
      <SearchCards items={searchSubscriptions} />
    </CardCollection>
  )
}

const LikesContent = ({ models: modelsData = {} }) => {
  const { data: models, isLoading } = modelsData

  if (isLoading || !models) {
    return <Spinner />
  }

  return (
    <CardCollection noResultsText='This user has not liked any models yet.'>
      <ModelCards items={models} />
    </CardCollection>
  )
}

const CollectionTitle = ({ selected, onClick, className, title, amount }) => {
  const c = useStyles({ selected })
  return (
    <div className={classnames(className, c.Home_Row)} onClick={onClick}>
      <SingleLineBodyText>
        {amount ? [title, amount].join(' ') : title}
      </SingleLineBodyText>
    </div>
  )
}

const Portfolio = ({ models, likes }) => {
  const c = useStyles({})

  const [selected, setSelected] = useState('models')

  const selectModels = useCallback(() => setSelected('models'), [])
  const selectLikes = useCallback(() => setSelected('likes'), [])

  const TabContent = useCallback(() => {
    switch (selected) {
      case 'models':
        return <ModelsContent models={models} isCurrentUsersProfile={false} />
      case 'likes':
        return <LikesContent models={likes} />
      default:
        return null
    }
  }, [models, likes, selected])

  return (
    <>
      <div className={c.Home_TextHeader}>
        <CollectionTitle
          selected={selected === 'models'}
          onClick={selectModels}
          title={'Models'}
          amount={((Array.isArray(models.data) && models.data) || []).length}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'likes'}
          onClick={selectLikes}
          title={'Likes'}
          amount={((Array.isArray(likes.data) && likes.data) || []).length}
        />
        <Spacer size={'1.5rem'} />
      </div>
      <div>
        <TabContent />
      </div>
    </>
  )
}

const MyProfile = ({ models, likes }) => {
  const c = useStyles({})
  const { dispatch, folders, searchSubscriptions } = useStoreon(
    'folders',
    'searchSubscriptions'
  )
  const selectedQuery = useQuery('selected')
  const [selected, setSelected] = useState('models')

  useEffect(() => {
    if (selectedQuery) setSelected(selectedQuery)
  }, [selectedQuery])

  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
    dispatch(types.FETCH_SUBSCRIPTIONS)
  }, [dispatch])

  const selectModels = useCallback(() => setSelected('models'), [])
  const selectLikes = useCallback(() => setSelected('likes'), [])
  const selectFolders = useCallback(() => setSelected('folders'), [])
  const selectSearches = useCallback(() => setSelected('savedSearches'), [])

  const TabContent = useCallback(() => {
    switch (selected) {
      case 'models':
        return <ModelsContent models={models} isCurrentUsersProfile={true} />
      case 'likes':
        return <LikesContent models={likes} />
      case 'folders':
        return <FoldersContent folders={folders} />
      case 'savedSearches':
        return <SavedSearchesContent searchSubscriptionsData={searchSubscriptions} />
      default:
        return null
    }
  }, [folders, models, likes, searchSubscriptions, selected])

  return (
    <>
      <div className={c.Home_TextHeader}>
        <CollectionTitle
          selected={selected === 'models'}
          onClick={selectModels}
          title={'Models'}
          amount={((Array.isArray(models.data) && models.data) || []).length}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'likes'}
          onClick={selectLikes}
          title={'Likes'}
          amount={((Array.isArray(likes.data) && likes.data) || []).length}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'folders'}
          onClick={selectFolders}
          title={'Folders'}
          amount={((Array.isArray(folders.data) && folders.data) || []).length}
        />
        <Spacer size={'1.5rem'} />
        <CollectionTitle
          selected={selected === 'savedSearches'}
          onClick={selectSearches}
          title={'Searches'}
          amount={
            ((Array.isArray(searchSubscriptions.data) && searchSubscriptions.data) || [])
              .length
          }
        />
      </div>
      <WithFlash>
        <TabContent />
      </WithFlash>
    </>
  )
}

const UserPage = ({ user = {}, userId, isCurrentUsersProfile, isLoading }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const [showProfileForm, setShowProfileForm] = useState(false)
  const description = getDescription(user)
  const {
    [`user-own-models-${userId}`]: ownUserModelsAtom = {},
    [`user-liked-models-${userId}`]: likedUserModelsAtom = {},
  } = useStoreon(`user-own-models-${userId}`, `user-liked-models-${userId}`)

  useEffect(() => {
    dispatch(types.FETCH_USER_OWN_MODELS, { id: userId })
    dispatch(types.FETCH_USER_LIKED_MODELS, { id: userId })
  }, [dispatch, userId])

  const handleUpdateProfile = useCallback(
    newUserData => {
      const { id, ...updatedUser } = newUserData
      dispatch(types.UPDATE_USER, {
        id,
        user: updatedUser,
        onFinish: () => {
          return (window.location.href = `/${user.username}`)
        },
      })
    },
    [dispatch, user]
  )

  const handleCancel = useCallback(() => {
    setShowProfileForm(false)
  }, [])

  return (
    <div className={c.Home}>
      <div className={c.Profile}>
        <div className={c.Profile_Header}>
          <ProfilePicture
            className={c.Profile_ProfilePicture}
            size={'15rem'}
            src={user.profile && user.profile.avatarUrl}
            name={user.fullName || user.username}
          />
          <div>
            <Spacer size={'2rem'} />
            <h1 className={c.Profile_Name}>{user.fullName}</h1>
            <MetadataPrimary>{user.username}</MetadataPrimary>
          </div>
        </div>
        <div className={c.Profile_Details}>
          {showProfileForm ? (
            <EditProfileForm
              user={user}
              handleUpdateProfile={handleUpdateProfile}
              handleCancel={handleCancel}
              isLoading={isLoading}
            />
          ) : (
            <>
              <div>
                <Spacer size={'1rem'} />
                <Markdown className={c.Profile_Markdown}>{description}</Markdown>
                <Spacer size={'1.5rem'} />
                <ProfileButton
                  className={c.Profile_ProfileButton}
                  userId={userId}
                  onEditClick={setShowProfileForm}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Spacer size={'1.5rem'} />
      <div className={c.Home_Content}>
        {isCurrentUsersProfile ? (
          <MyProfile models={ownUserModelsAtom} likes={likedUserModelsAtom} />
        ) : (
          <Portfolio
            models={ownUserModelsAtom}
            likes={likedUserModelsAtom}
            userId={userId}
          />
        )}
      </div>
    </div>
  )
}

const PageById = ({ userId, isCurrentUsersProfile }) => {
  const { dispatch, [`user-${userId}`]: userData = {} } = useStoreon(`user-${userId}`)
  const { isLoading, isLoaded, isError, data: user } = userData

  useEffect(() => {
    dispatch(types.FETCH_USER, { id: userId })
  }, [dispatch, userId])

  if (!isLoaded) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isNil(user) || R.isEmpty(user)) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }

  return (
    <UserPage
      user={user}
      userId={userId}
      isCurrentUsersProfile={isCurrentUsersProfile}
      isLoading={isLoading}
    />
  )
}

const PageByUserName = ({ userName }) => {
  const { dispatch, [`user-id-${userName}`]: userIdData = {} } = useStoreon(
    `user-id-${userName}`
  )
  const { isLoaded, isError, data: userId } = userIdData
  const { title, description } = usePageMeta('profile')
  const currentUserId = useCurrentUserId()
  const isCurrentUsersProfile = useMemo(() => currentUserId === userId, [
    currentUserId,
    userId,
  ])

  useEffect(() => {
    dispatch(types.FETCH_USER_ID, { id: userName })
  }, [dispatch, userName])

  if (!isCurrentUsersProfile && isLoaded) pendo.track('Portfolio', { userName })
  if (!isLoaded) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (!userId) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {userName}
          {title}
        </title>
        <meta name='description' content={description} />
      </Helmet>
      <PageById userId={userId} isCurrentUsersProfile={isCurrentUsersProfile} />
    </>
  )
}

const Page = () => {
  const { id, userName } = useParams()

  if (userName) {
    return <PageByUserName userName={userName} />
  }

  if (id) {
    return <PageById userId={id} />
  }

  return (
    <div data-cy='fetch-profile-error'>
      <Message404 />
    </div>
  )
}

const Profile = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default Profile
