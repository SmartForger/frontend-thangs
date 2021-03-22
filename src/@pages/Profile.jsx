import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  Layout,
  Markdown,
  ProfileButton,
  ProfilePicture,
  ShareActionMenu,
  SingleLineBodyText,
  Spacer,
  Spinner,
  CardCollectionPortfolio,
  ModelCardPortfolio,
} from '@components'
import { Message404 } from '@pages/404'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useCurrentUserId, usePageMeta, usePerformanceMetrics } from '@hooks'
import * as types from '@constants/storeEventTypes'
import { pageview, track, perfTrack } from '@utilities/analytics'

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
const noop = () => null
const getDescription = R.pathOr('Empty', ['profile', 'description'])

const ModelsContent = ({ models: modelsData = {}, getTime = noop }) => {
  const { data: models, isLoaded, isError } = modelsData

  useEffect(() => {
    if (isLoaded) {
      perfTrack('Page Loaded - Profile', getTime())
    }
  }, [getTime, isLoaded])

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
    <CardCollectionPortfolio noResultsText='You have not uploaded any models yet.'>
      {Array.isArray(sortedModels) &&
        sortedModels.map((model, index) => (
          <ModelCardPortfolio key={`model-${model.id}:${index}`} model={model} />
        ))}
    </CardCollectionPortfolio>
  )
}

const LikesContent = ({ models, isLoading }) => {
  if (isLoading || !models) {
    return <Spinner />
  }

  return (
    <CardCollectionPortfolio noResultsText='This user has not liked any models yet.'>
      {Array.isArray(models) &&
        models.map((model, index) => (
          <ModelCardPortfolio key={`model-${model.id}:${index}`} model={model} />
        ))}
    </CardCollectionPortfolio>
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

const Portfolio = ({ models, likes, getTime }) => {
  const c = useStyles({})

  const [selected, setSelected] = useState('models')

  const selectModels = useCallback(() => setSelected('models'), [])
  const selectLikes = useCallback(() => setSelected('likes'), [])

  const TabContent = useCallback(() => {
    switch (selected) {
      case 'models':
        return (
          <ModelsContent
            models={models}
            isCurrentUsersProfile={false}
            getTime={getTime}
          />
        )
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
  }, [selected, models, getTime, likes])

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

const UserPage = ({
  user = {},
  userId,
  isCurrentUsersProfile,
  getTime,
  ownUserModelsAtom,
  likedUserModelsAtom,
}) => {
  const c = useStyles({})
  const description = getDescription(user)

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
            <h1 className={c.Profile_Name}>
              {user.username && user.username.split('@')[0]}
            </h1>
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
                  />
                  <Spacer size={'1rem'} />
                </>
              )}
              <ShareActionMenu
                iconOnly={false}
                title={`${user.username} - 3D model uploads`}
                profileId={userId}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
      <Spacer size={'3rem'} />
      <div className={c.Home_Content}>
        <Portfolio
          getTime={getTime}
          models={ownUserModelsAtom}
          likes={likedUserModelsAtom}
          userId={userId}
          username={user.username}
        />
      </div>
    </div>
  )
}

const PageById = ({ userId, isCurrentUsersProfile, getTime, userName }) => {
  const {
    dispatch,
    [`user-${userId}`]: userData = {},
    [`user-own-models-${userId}`]: ownUserModelsAtom = {},
    [`user-liked-models-${userId}`]: likedUserModelsAtom = {},
  } = useStoreon(
    `user-${userId}`,
    `user-own-models-${userId}`,
    `user-liked-models-${userId}`
  )
  const { isLoading, isLoaded, isError, data: user } = userData
  const { title, descriptionSuffix, descriptionDefault } = usePageMeta('profile')
  const description = 'getDescription(user)'
  let profileDescription = `${userName}.${description ? description : descriptionDefault}`
  if (profileDescription.length < 160 && description) {
    profileDescription += `${descriptionSuffix}`
  }

  useEffect(() => {
    dispatch(types.FETCH_USER, { id: userId })
    dispatch(types.FETCH_USER_OWN_MODELS, { id: userId })
    dispatch(types.FETCH_USER_LIKED_MODELS, { id: userId })
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
    <>
      <Helmet>
        <title>{`${userName} - 3D model uploads ${title}`}</title>
        <meta name='description' content={profileDescription} />
      </Helmet>
      <UserPage
        user={user}
        userId={userId}
        isCurrentUsersProfile={isCurrentUsersProfile}
        isLoading={isLoading}
        getTime={getTime}
        ownUserModelsAtom={ownUserModelsAtom}
        likedUserModelsAtom={likedUserModelsAtom}
      />
    </>
  )
}

const PageByUserName = ({ userName, getTime }) => {
  const { dispatch, [`user-id-${userName}`]: userIdData = {} } = useStoreon(
    `user-id-${userName}`
  )
  const history = useHistory()
  const { isLoaded, isError, data: userId } = userIdData
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
    <PageById
      userName={userName}
      userId={userId}
      isCurrentUsersProfile={isCurrentUsersProfile}
      getTime={getTime}
    />
  )
}

const Page = () => {
  const { userName } = useParams()
  const { startTimer, getTime } = usePerformanceMetrics()
  useEffect(() => {
    pageview('Profile', userName)
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (userName) {
    return <PageByUserName userName={userName} getTime={getTime} />
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
