import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import * as R from 'ramda'

import { Button, Spacer } from '@components'
import { useTranslations } from '@hooks'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

import { ProfileDropdown, ProfileDropdownMenu } from './ProfileDropdown'
import NotificationsButton from './NotificationsButton'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    UserNav: {},
    UserNav_DesktopOnly: {
      display: 'none',

      [md]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    UserNav_MobileOnly: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',

      [md]: {
        display: 'none',
      },
    },
    UserNav_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      '&:not(:last-of-type)': {
        marginBottom: '1.5rem',
      },

      [md]: {
        justifyContent: 'flex-start',
      },
    },
    UserNav_ButtonsRow: {
      '& > a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:last-child': {
          marginRight: 0,
        },
      },
    },
    UserNav_SearchIcon: {
      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },
    },
  }
})

const UserNav = ({
  handleNotificationsClick,
  notificationsIsOpen,
  dispatch,
  isLoading,
  user,
  showUser,
}) => {
  const c = useStyles()
  const t = useTranslations({})

  if (isLoading) {
    return <div className={c.UserNav_Row}></div>
  }

  if (showUser && user && !R.isNil(user) && !R.isEmpty(user)) {
    return (
      <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
        <NotificationsButton handleNotificationsClick={handleNotificationsClick} />
        <Spacer size='1rem' />
        <ProfileDropdownMenu
          user={user}
          TargetComponent={ProfileDropdown}
          dispatch={dispatch}
          handleNotificationsClick={handleNotificationsClick}
          notificationsIsOpen={notificationsIsOpen}
        />
        <Spacer size='1rem' />
        <Button
          className={classnames(c.UserNav_Button)}
          onClick={() => dispatch(types.OPEN_OVERLAY, { overlayName: 'upload' })}
        >
          {t('header.uploadButtonText')}
        </Button>
        <Spacer size='1rem' className={c.UserNav_DesktopOnly} />
      </div>
    )
  }

  return (
    <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
      <Link to='/signup/alpha' onClick={() => dispatch(types.CLOSE_OVERLAY)}>
        <Button
          tertiary
          className={classnames(c.UserNav_TextButton, c.UserNav_SignUpButton)}
        >
          {t('header.signUpButtonText')}
        </Button>
      </Link>
      <Link to='/login' onClick={() => dispatch(types.CLOSE_OVERLAY)}>
        <Button className={c.UserNav_Button}>{t('header.signInButtonText')}</Button>
      </Link>
      <Spacer size='1rem' className={c.UserNav_DesktopOnly} />
    </div>
  )
}

export default UserNav
