import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { Button } from '@components'
import { useCurrentUser, useTranslations } from '@hooks'
import { createUseStyles } from '@style'

import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass-header.svg'

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
    UserNav_Button: {
      marginLeft: '1rem',
      cursor: 'pointer',
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
    UserNav_TextButton: {
      marginRight: '1.5rem',
      fontSize: '1rem',
      lineHeight: '1rem',
      fontWeight: 'bold',
      color: theme.colors.white[400],

      '& span': {
        marginLeft: '.5rem',
      },
    },
    UserNav_SignUpButton: {
      marginRight: '.5rem',
      color: theme.colors.gold[500],
    },
    UserNav_SearchIcon: {
      '& path, & polygon': {
        fill: theme.colors.gold[500],
      },
    },
  }
})

const noop = () => null
const UserNav = ({
  handleNotificationsClick,
  notificationsIsOpen,
  dispatch,
  handleSearchShow = noop,
}) => {
  const { loading, user } = useCurrentUser()
  const c = useStyles()
  const t = useTranslations({})

  if (loading) {
    return <div className={c.UserNav_Row}></div>
  }

  if (user) {
    return (
      <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
        <NotificationsButton handleNotificationsClick={handleNotificationsClick} />
        <ProfileDropdownMenu
          user={user}
          TargetComponent={ProfileDropdown}
          dispatch={dispatch}
          handleNotificationsClick={handleNotificationsClick}
          notificationsIsOpen={notificationsIsOpen}
        />
        <Button
          className={classnames(c.UserNav_Button, c.UserNav_DesktopOnly)}
          onClick={() => dispatch('open-modal', { modalName: 'upload' })}
        >
          {t('header.uploadButtonText')}
        </Button>
        <MagnifyingGlass
          title={'Search By Text'}
          className={classnames(
            c.UserNav_SearchIcon,
            c.UserNav_Button,
            c.UserNav_MobileOnly
          )}
          onClick={handleSearchShow}
        />
      </div>
    )
  }

  return (
    <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
      <Link to={'/signup/alpha'} onClick={() => dispatch('close-modal')}>
        <Button text className={classnames(c.UserNav_TextButton, c.UserNav_SignUpButton)}>
          Sign up
        </Button>
      </Link>
      <Button
        className={c.UserNav_Button}
        onClick={() =>
          dispatch('open-modal', {
            modalName: 'signIn',
            modalData: { afterSignIn: () => dispatch('close-modal') },
          })
        }
      >
        Sign in
      </Button>
    </div>
  )
}

export default UserNav
