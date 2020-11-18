import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  CardCollection,
  Layout,
  Markdown,
  MetadataPrimary,
  ModelCards,
  ProfileButton,
  ProfilePicture,
  ShareDropdown,
  ShareDropdownMenu,
  SingleLineBodyText,
  Spacer,
  Spinner,
} from '@components'
import { Message404 } from '@pages/404'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId, usePageMeta } from '@hooks'
import * as types from '@constants/storeEventTypes'
import { pageview, track } from '@utilities/analytics'

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
        position: 'sticky',
        top: '2rem',
        maxWidth: '15rem',
      },
    },
    Profile_Avatar: {
      position: 'relative',
    },
    Profile_Header: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',

      [md]: {
        flexDirection: 'column',
      },
    },
    Profile_HeaderBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
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
    Profile_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  }
})

const getDescription = R.pathOr('Empty', ['profile', 'description'])

const ModelsContent = ({ models: modelsData = {} }) => {
  const { data: models, isLoaded, isError } = modelsData

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

  return (
    <CardCollection noResultsText='You have not uploaded any models yet.'>
      <ModelCards items={sortedModels} />
    </CardCollection>
  )
}

const LikesContent = ({ models, isLoading }) => {
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
        return (
          <LikesContent
            models={R.pathOr([], ['data', 'models'], likes)}
            isLoading={likes.isLoading}
          />
        )
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
          amount={R.pathOr([], ['data', 'models'], likes).length}
        />
        <Spacer size={'1.5rem'} />
      </div>
      <div>
        <TabContent />
      </div>
    </>
  )
}

const UserPage = ({ user = {}, userId, isCurrentUsersProfile }) => {
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

  return (
    <div className={c.Home}>
      <div className={c.Profile}>
        <div className={c.Profile_Header}>
          <div className={c.Profile_Avatar}>
            <ProfilePicture
              className={c.Profile_ProfilePicture}
              size={'15rem'}
              src={user.profile && user.profile.avatarUrl}
              name={user.fullName || user.username}
            />
          </div>
          <div>
            <Spacer size={'2rem'} />
            <h1 className={c.Profile_Name}>{user.fullName}</h1>
            {!showProfileForm && <MetadataPrimary>{user.username}</MetadataPrimary>}
          </div>
        </div>
        <div className={c.Profile_Details}>
          <div>
            <Spacer size={'1rem'} />
            <Markdown className={c.Profile_Markdown}>{description}</Markdown>
            <Spacer size={'1.5rem'} />
            <div className={c.Profile_Row}>
              {!isCurrentUsersProfile && (
                <>
                  <ProfileButton
                    className={c.Profile_ProfileButton}
                    user={user}
                    userId={userId}
                    onEditClick={setShowProfileForm}
                  />
                  <Spacer size={'1rem'} />
                </>
              )}
              <ShareDropdownMenu
                TargetComponent={ShareDropdown}
                iconOnly={false}
                title={`${user.username} - 3D model uploads`}
                urlPathname={`/portfolio/${userId}`}
              />
            </div>
          </div>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.Home_Content}>
        <Portfolio
          models={ownUserModelsAtom}
          likes={likedUserModelsAtom}
          userId={userId}
          username={user.username}
        />
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
  const history = useHistory()
  const { isLoaded, isError, data: userId } = userIdData
  const { title, description } = usePageMeta('profile')
  const currentUserId = useCurrentUserId()
  const isCurrentUsersProfile = useMemo(() => currentUserId === userId, [
    currentUserId,
    userId,
  ])
  const isExternalReferral = useMemo(() => {
    return history.location && history.location.state === undefined
  }, [history.location])

  useEffect(() => {
    dispatch(types.FETCH_USER_ID, { id: userName })
  }, [dispatch, userName])

  useEffect(() => {
    if (!isCurrentUsersProfile && isLoaded && isExternalReferral) {
      track('Portfolio', { userName })
    }
  }, [isCurrentUsersProfile, isExternalReferral, isLoaded, userName])
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
          {userName} - 3D model uploads
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
  const identifier = id || userName
  useEffect(() => {
    pageview('Profile', identifier)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
