import React from 'react'
import { Link } from 'react-router-dom'

import { useCurrentUser } from '@hooks'
import {
  Button,
  ChangeablePicture,
  EditProfileForm,
  Flash,
  Layout,
  ProfilePicture,
  Spinner,
} from '@components'
import * as GraphqlService from '@services/graphql-service'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    EditProfile: {},
    EditProfile_Row: {
      display: 'flex',
      alignItems: 'center',
    },
    EditProfile_Row__avatar: {
      marginRight: '.25rem',
    },
    EditProfile_Row__profile: {
      marginTop: '1rem',
    },
    EditProfile_ProfilePicture: {
      marginRight: '1.5rem',
    },
    EditProfile_PictureForm: {
      marginBottom: '4rem',
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const PictureForm = ({ user, className }) => {
  const c = useStyles()
  const [deleteProfileAvatar, { loading }] = graphqlService.useDeleteUserAvatarMutation(
    user
  )
  const onDelete = () => deleteProfileAvatar()
  const deleteText = loading ? 'Deleting...' : 'Delete'

  const currentAvatar = user && user.profile && user.profile.avatarUrl
  return (
    <div className={classnames(className, c.EditProfile_Row)}>
      <ProfilePicture
        className={c.EditProfile_ProfilePicture}
        size='80px'
        name={user.fullName}
        src={currentAvatar}
      />
      <div>
        <div className={classnames(c.EditProfile_Row, c.EditProfile_Row__avatar)}>
          <ChangeablePicture user={user} />

          {currentAvatar && (
            <Button dark onClick={onDelete} disabled={loading}>
              {deleteText}
            </Button>
          )}
        </div>
        <div className={classnames(c.EditProfile_Row, c.EditProfile_Row__profile)}>
          <Link to={'/home'}>View Profile</Link>
        </div>
      </div>
    </div>
  )
}

const WarningOnEmptyProfile = ({ user }) => {
  const userDescription = user && user.profile && user.profile.description
  if (!userDescription) {
    return (
      <Flash>
        Add information about yourself below to let others know your specialties,
        interests, etc.
      </Flash>
    )
  }
  return null
}

const Page = () => {
  const c = useStyles()
  const { loading, error, user } = useCurrentUser()

  if (loading) {
    return <Spinner />
  }

  if (error || !user) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load your profile. Please try again later.
      </div>
    )
  }

  return (
    <div>
      <WarningOnEmptyProfile user={user} />
      <PictureForm className={c.EditProfile_PictureForm} user={user} />
      <EditProfileForm user={user} />
    </div>
  )
}

export const EditProfile = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
