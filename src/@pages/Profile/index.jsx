import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as R from 'ramda'
import {
  CardCollection,
  Markdown,
  Layout,
  ProfilePicture,
  Spinner,
  ToggleFollowButton,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import * as GraphqlService from '@services/graphql-service'
import { useCurrentUser } from '@hooks'
import { Message404 } from '../404'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as AboutIcon } from '@svg/about-icon.svg'
import { ReactComponent as ModelIcon } from '@svg/model-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Profile: {},
    Profile_Name: {
      ...theme.mixins.text.subheaderText,
      marginTop: '.5rem',
    },
    Profile_TabTitleGroup: {
      display: 'flex',
      alignSelf: 'start',
    },
    Profile_TabTitle: {
      ...theme.mixins.text.tabNavigationText,
      display: 'flex',
      alignItems: 'center',
      marginRight: '3.5rem',
      cursor: 'pointer',
    },
    Profile_TabTitle__active: {
      ...theme.mixins.text.activeTabNavigationText,
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
      ...theme.mixins.text.profileAboutText,
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
      ...theme.mixins.text.boldText,
      ...theme.mixins.text.linkText,
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

const graphqlService = GraphqlService.getInstance()

const ModelCount = ({ user }) => {
  const models = R.pathOr([], ['models'])(user)
  const { user: currentUser, loading } = useCurrentUser()
  if (loading || !currentUser) {
    return <Spinner />
  }

  const amount = models.length
  return <span>Models {amount}</span>
}

const Models = ({ selected, onClick, user }) => {
  const c = useStyles()
  return (
    <div
      className={classnames(c.Profile_TabTitle, {
        [c.Profile_TabTitle__active]: selected,
      })}
      onClick={onClick}
    >
      <div className={c.Profile_Icon}>
        <ModelIcon />
      </div>
      <ModelCount user={user} />
    </div>
  )
}

const Likes = ({ selected, onClick, user }) => {
  const c = useStyles()
  const likes = getLikedModels(user)
  const amount = likes.length

  return (
    <div
      className={classnames(c.Profile_TabTitle, {
        [c.Profile_TabTitle__active]: selected,
      })}
      onClick={onClick}
    >
      <div className={c.Profile_Icon}>
        <HeartIcon />
      </div>
      <span>Likes {amount}</span>
    </div>
  )
}

const About = ({ selected, onClick, _user }) => {
  const c = useStyles()
  return (
    <div
      className={classnames(c.Profile_TabTitle, {
        [c.Profile_TabTitle__active]: selected,
      })}
      onClick={onClick}
    >
      <div className={c.Profile_Icon}>
        <AboutIcon />
      </div>
      <span>About</span>
    </div>
  )
}

const getDescription = R.pathOr(null, ['profile', 'description'])
const getModels = R.pathOr([], ['models'])
const getLikedModels = R.pathOr([], ['likedModels'])

const AboutContent = ({ selected, user }) => {
  const c = useStyles()
  if (!selected) {
    return null
  }
  const description = getDescription(user)
  return <Markdown className={c.Profile_Markdown}>{description}</Markdown>
}

const ModelsContent = ({ selected, user }) => {
  const models = getModels(user)
  const { user: currentUser, loading } = useCurrentUser()

  if (!selected) {
    return null
  }

  if (loading || !currentUser) {
    return <Spinner />
  }

  const sortedModels = models.sort((modelA, modelB) => {
    if (modelA.created === modelB.created) return 0
    if (modelA.created > modelB.created) return -1
    else return 1
  })

  return (
    <CardCollection noResultsText='This user has not uploaded any models yet.'>
      <ModelCards models={sortedModels} />
    </CardCollection>
  )
}

const LikesContent = ({ selected, user }) => {
  if (!selected) {
    return null
  }
  const models = getLikedModels(user)
  return (
    <CardCollection noResultsText='This user has not liked any models yet.'>
      <ModelCards models={models} />
    </CardCollection>
  )
}

const Tabs = ({ user }) => {
  const [selected, setSelected] = useState('models')

  const selectModel = () => setSelected('models')
  const selectLikes = () => setSelected('likes')
  const selectAbout = () => setSelected('about')
  const c = useStyles()

  return (
    <div className={c.Profile_TabGroupContainer}>
      <div className={c.Profile_TabTitleGroup}>
        <Models selected={selected === 'models'} onClick={selectModel} user={user} />
        <Likes selected={selected === 'likes'} onClick={selectLikes} user={user} />
        <About selected={selected === 'about'} onClick={selectAbout} user={user} />
      </div>
      <div className={c.Profile_TabContent}>
        <ModelsContent selected={selected === 'models'} user={user} />
        <LikesContent selected={selected === 'likes'} user={user} />
        <AboutContent selected={selected === 'about'} user={user} />
      </div>
    </div>
  )
}

const ProfileButton = ({ viewedUser, className }) => {
  const c = useStyles()
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

const Page = () => {
  const { id } = useParams()
  const { loading, error, user } = graphqlService.useUserById(id)
  const c = useStyles()
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
      <div className={c.Profile_Row}>
        <ProfilePicture
          className={c.Profile_ProfilePicture}
          size='80px'
          src={user && user.profile && user.profile.avatarUrl}
          name={user.fullName}
        />
        <div>
          <div className={c.Profile_Name}>{user.fullName}</div>
          <ProfileButton className={c.Profile_ProfileButton} viewedUser={user} />
        </div>
      </div>
      <Tabs user={user} />
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
