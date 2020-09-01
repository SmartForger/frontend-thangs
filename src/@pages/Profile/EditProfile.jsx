import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { useCurrentUser } from '@hooks'
import {
  Button,
  ChangeablePicture,
  EditProfileForm,
  Flash,
  Layout,
  ProfilePicture,
  Spinner,
  useFlashNotification,
} from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '../../@constants/storeEventTypes'

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

const PictureForm = ({ user, className }) => {
  const c = useStyles()
  const { dispatch, userUploadAvatar } = useStoreon('userUploadAvatar')
  const onDelete = () => dispatch(types.DELETE_USER_AVATAR, { userId: user.id })
  const deleteText =
    userUploadAvatar && userUploadAvatar?.isLoading ? 'Deleting...' : 'Delete'

  const currentAvatar = user && user.profile && user.profile.avatarUrl
  return (
    <div className={classnames(className, c.EditProfile_Row)}>
      <ProfilePicture
        className={c.EditProfile_ProfilePicture}
        size='5rem'
        name={user.fullName}
        src={currentAvatar}
      />
      <div>
        <div className={classnames(c.EditProfile_Row, c.EditProfile_Row__avatar)}>
          <ChangeablePicture user={user} />

          {currentAvatar && (
            <Button
              dark
              onClick={onDelete}
              disabled={userUploadAvatar && userUploadAvatar.isLoading}
            >
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
  const {
    dispatch,
    atom: { data: user, isLoading, isError },
  } = useCurrentUser()
  const { navigateWithFlash } = useFlashNotification()

  const handleUpdateProfile = useCallback(
    user => {
      const { id, ...updatedUser } = user
      dispatch(types.UPDATE_USER, {
        id,
        user: updatedUser,
        onFinish: () => {
          navigateWithFlash('/home', 'Your profile has been updated.')
        },
      })
    },
    [dispatch, navigateWithFlash]
  )

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load your profile. Please try again later.
      </div>
    )
  }

  return (
    <div>
      <>
        <WarningOnEmptyProfile user={user} />
        <PictureForm
          className={c.EditProfile_PictureForm}
          user={user}
        />
        <EditProfileForm
          user={user}
          handleUpdateProfile={handleUpdateProfile}
          isLoading={isLoading}
        />
      </>
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
