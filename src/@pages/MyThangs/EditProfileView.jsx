import React, { useCallback, useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  ChangeablePicture,
  EditProfileForm,
  MetadataPrimary,
  Pill,
  ProfilePicture,
  Spacer,
  Spinner,
  TitleSecondary,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
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
        <TitleSecondary className={c.EditProfile_TitleSecondary}>
          Profile Settings
        </TitleSecondary>
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
            <TitleTertiary className={c.EditProfile_TitleTertiary}>
              {user.fullName || user.username}
            </TitleTertiary>
            <Spacer size={'.5rem'} />
            <MetadataPrimary className={c.EditProfile_UserName}>
              {user.fullName ? user.username : user.email}
            </MetadataPrimary>
            <Spacer size={'1rem'} />
            <div className={c.EditProfile_ButtonsSection}>
              <ChangeablePicture />
              <Pill secondary onClick={handleDeleteImage}>
                Delete Image
              </Pill>
            </div>
          </div>
        </div>
        <Spacer size='2rem' />
        <TitleTertiary>Information</TitleTertiary>
        <Spacer size='1rem' />
        {!R.isEmpty(user) ? (
          <EditProfileForm
            user={user}
            handleUpdateProfile={handleUpdateProfile}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          <Spinner />
        )}
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default EditProfile
