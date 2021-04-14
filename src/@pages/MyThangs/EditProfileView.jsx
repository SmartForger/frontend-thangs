import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import {
  ChangeablePicture,
  EditProfileForm,
  Pill,
  ProfilePicture,
  Spacer,
} from '@components'
import { useCurrentUser } from '@hooks'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs, md },
  } = theme

  return {
    EditProfile: {
      display: 'flex',
      flexDirection: 'row',
    },
    EditProfile_TitleSecondary: {
      fontSize: '1.25rem',
      [md]: {
        fontSize: '2.25rem',
      },
    },
    EditProfile_Content: {
      width: '100%',
      [md]: {
        width: 'unset',
      },
    },
    EditProfile_Row: {
      display: 'block',
      textAlign: 'center',

      [md]: {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    EditProfile_Column: {
      display: 'block',
      textAlign: 'center',
    },
    EditProfile_TitleTertiary: {
      display: 'block',
      [md]: {
        display: 'flex',
      },
    },
    EditProfile_UserName: {
      display: 'block',
      [md]: {
        display: 'flex',
      },
    },

    EditProfile_ButtonsSection: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      '& > *': {
        width: '100%',
      },
      '& > *:last-child': {
        marginLeft: '1rem',
      },
      flexWrap: 'wrap',
      [xs]: {
        flexWrap: 'nowrap',
      },
      [md]: {
        justifyContent: 'flex-start',
      },
    },
    EditProfile_Spacer__mobile: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
  }
})

const EditProfile = ({ className }) => {
  const c = useStyles({})
  const [errorMessage, setErrorMessage] = useState()
  const { dispatch } = useStoreon()
  const {
    atom: { data: user = {}, isLoading },
  } = useCurrentUser()

  useEffect(() => {
    pageview('MyThangs - EditProfile')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateProfile = useCallback(
    newUserData => {
      const { id, ...updatedUser } = newUserData
      dispatch(types.UPDATE_USER, {
        id,
        user: updatedUser,
        onError: error => {
          setErrorMessage(error)
        },
      })
    },
    [dispatch]
  )

  const handleDeleteImage = useCallback(() => {
    dispatch(types.DELETE_USER_AVATAR)
  }, [dispatch])

  return (
    <main className={classnames(className, c.EditProfile)}>
      <Spacer size='2rem' />
      <div className={c.EditProfile_Content}>
        <Spacer size='2rem' className={c.EditProfile_Spacer__mobile} />
        <Title
          headerLevel={HeaderLevel.secondary}
          className={c.EditProfile_TitleSecondary}
        >
          Profile Settings
        </Title>
        <Spacer size='2rem' />
        <div className={c.EditProfile_Row}>
          <ProfilePicture
            className={c.Profile_ProfilePicture}
            size={'6.25rem'}
            src={user.profile && user.profile.avatarUrl}
            name={user.fullName || user.username}
          />
          <Spacer size={'1.5rem'} />
          <div className={c.EditProfile_Column}>
            <Title
              headerLevel={HeaderLevel.tertiary}
              className={c.EditProfile_TitleTertiary}
            >
              {user.fullName || user.username}
            </Title>
            <Spacer size={'.5rem'} />
            <Metadata type={MetadataType.primary} className={c.EditProfile_UserName}>
              {user.fullName ? user.username : user.email}
            </Metadata>
            <Spacer size={'1rem'} />
            <div className={c.EditProfile_ButtonsSection}>
              <ChangeablePicture disabled={isLoading} />
              <Pill secondary onClick={handleDeleteImage} disabled={isLoading}>
                Delete Image
              </Pill>
            </div>
          </div>
        </div>
        <Spacer size='2rem' />
        <Title headerLevel={HeaderLevel.tertiary}>Information</Title>
        <Spacer size='1rem' />
        <EditProfileForm
          user={user}
          handleUpdateProfile={handleUpdateProfile}
          errorMessage={errorMessage}
          disabled={isLoading}
        />
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default EditProfile
