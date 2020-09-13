import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as R from 'ramda'
import {
  CardCollection,
  Markdown,
  Layout,
  ProfilePicture,
  Spinner,
  ProfileButton,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { Message404 } from '../404'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as AboutIcon } from '@svg/about-icon.svg'
import { ReactComponent as ModelIcon } from '@svg/model-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { usePageMeta } from '@hooks'
import useFetchOnce from '@hooks/useServices/useFetchOnce'
import useFetchPerMount from '@hooks/useServices/useFetchPerMount'
import * as pendo from '@vendors/pendo'

const useStyles = createUseStyles(theme => {
  return {
    Profile: {
      width: '100%',
    },
    Profile_Name: {
      ...theme.text.subheaderText,
      margin: '.5rem 0',
    },
    Profile_TabTitleGroup: {
      display: 'flex',
      alignSelf: 'start',
    },
    Profile_TabTitle: {
      ...theme.text.tabNavigationText,
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      cursor: 'pointer',
    },
    Profile_TabTitle__active: {
      ...theme.text.activeTabNavigationText,
    },
    Profile_Icon: {
      display: 'flex',
      height: '1.5rem',
      width: '1.5rem',
      alignItems: 'center',
      marginRight: '.5rem',
    },
    Profile_TabContent: {
      marginTop: '1.5rem',
      width: '100%',
      display: 'flex',
    },
    Profile_Markdown: {
      maxWidth: '37.5rem',
      ...theme.text.profileAboutText,
    },
    Profile_TabGroupContainer: {
      marginTop: '4.5rem',
      width: '100%',
    },
    Profile_ProfilePicture: {
      marginRight: '1.5rem',
    },
    Profile_Row: {
      display: 'flex',
    },
    Profile_EditProfileLink: {
      // We need to reset styles on this component because it is rendered within larger text
      ...theme.text.boldText,
      ...theme.text.linkText,
    },
    Profile_ProfileButton: {
      marginTop: '1rem',
      display: 'block',
    },
  }
})

export * from './EditProfile'
export * from './RedirectProfile'
export * from './Likes'
export * from './Home'

const TabTitle = ({ title, Icon, selected, onClick, amount }) => {
  const c = useStyles()

  return (
    <div
      className={classnames(c.Profile_TabTitle, {
        [c.Profile_TabTitle__active]: selected,
      })}
      onClick={onClick}
    >
      <div className={c.Profile_Icon}>
        <Icon />
      </div>
      <span>{amount ? [title, amount].join(' ') : title}</span>
    </div>
  )
}

const getDescription = R.pathOr('Empty', ['profile', 'description'])

const AboutContent = ({ selected, userId }) => {
  const c = useStyles()
  const {
    atom: { data: user },
  } = useFetchOnce(userId, 'user')

  if (!selected) {
    return null
  }

  const description = getDescription(user)
  return <Markdown className={c.Profile_Markdown}>{description}</Markdown>
}

const ModelsContent = ({ selected, modelsAtom }) => {
  const { data: models, isLoading } = modelsAtom

  if (!selected) {
    return null
  }

  if (isLoading || !models) {
    return <Spinner />
  }

  const sortedModels = ((Array.isArray(models) && models) || []).sort(
    (modelA, modelB) => {
      if (modelA.created === modelB.created) return 0
      if (modelA.created > modelB.created) return -1
      else return 1
    }
  )

  return (
    <CardCollection noResultsText='This user has not uploaded any models yet.'>
      <ModelCards items={sortedModels} />
    </CardCollection>
  )
}

const LikesContent = ({ selected, modelsAtom }) => {
  const { data: models, isLoading } = modelsAtom

  if (!selected) {
    return null
  }

  if (isLoading || !models) {
    return <Spinner />
  }

  return (
    <CardCollection noResultsText='This user has not liked any models yet.'>
      <ModelCards items={models} />
    </CardCollection>
  )
}

const Tabs = ({ userId }) => {
  const [selected, setSelected] = useState('models')

  const selectModel = () => setSelected('models')
  const selectLikes = () => setSelected('likes')
  const selectAbout = () => setSelected('about')
  const c = useStyles()

  const { atom: ownUserModelsAtom } = useFetchPerMount(userId, 'user-own-models')
  const { atom: likedUserModelsAtom } = useFetchPerMount(userId, 'user-liked-models')

  return (
    <div className={c.Profile_TabGroupContainer}>
      <div className={c.Profile_TabTitleGroup}>
        <TabTitle
          title={'Models'}
          Icon={ModelIcon}
          selected={selected === 'models'}
          onClick={selectModel}
          amount={R.length(ownUserModelsAtom.data)}
        />
        <TabTitle
          title={'likes'}
          Icon={HeartIcon}
          selected={selected === 'likes'}
          onClick={selectLikes}
          amount={R.length(likedUserModelsAtom.data)}
        />
        <TabTitle
          title={'About'}
          Icon={AboutIcon}
          selected={selected === 'about'}
          onClick={selectAbout}
        />
      </div>
      <div className={c.Profile_TabContent}>
        <ModelsContent selected={selected === 'models'} modelsAtom={ownUserModelsAtom} />
        <LikesContent selected={selected === 'likes'} modelsAtom={likedUserModelsAtom} />
        <AboutContent selected={selected === 'about'} userId={userId} />
      </div>
    </div>
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

const PageByUserName = ({ userName }) => {
  const {
    atom: { isLoaded, isError, data: userId },
  } = useFetchOnce(userName, 'user-id')
  const { title, description } = usePageMeta('profile')
  pendo.track('Portfolio', { userName })
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
      <PageById userId={userId} />
    </>
  )
}

const PageById = ({ userId }) => {
  const {
    atom: { isLoaded, isError, data: user },
  } = useFetchOnce(userId, 'user')

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

  return <UseredPage user={user} />
}

const UseredPage = ({ user = {} }) => {
  const c = useStyles()

  return (
    <div className={c.Profile}>
      <div className={c.Profile_Row}>
        <ProfilePicture
          className={c.Profile_ProfilePicture}
          size='5rem'
          src={user.profile && user.profile.avatarUrl}
          name={user.fullName}
        />
        <div>
          <h1 className={c.Profile_Name}>{user.fullName}</h1>
          <ProfileButton userId={user.id} className={c.Profile_ProfileButton} />
        </div>
      </div>
      <Tabs userId={user.id} />
    </div>
  )
}

export const Profile = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
