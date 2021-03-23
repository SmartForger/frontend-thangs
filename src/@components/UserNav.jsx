import React from 'react'
import classnames from 'classnames'
import * as R from 'ramda'

import { Button, Spacer } from '@components'
import { useOverlay, useTranslations } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ProfileDropdown, ProfileDropdownMenu } from './Header/ProfileDropdown'
import Notifications from '@components/Notifications'

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
    UserNav_SignUpButton: {
      color: theme.colors.gold[500],
    },
  }
})

const UserNav = ({
  isLoading,
  user,
  showUser,
  showUpload = true,
  myThangsMenu = false,
}) => {
  const c = useStyles()
  const t = useTranslations({})
  const { setOverlay } = useOverlay()

  const handleSignUp = () => {
    setOverlay({
      isOpen: true,
      template: 'signUp',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        smallWidth: true,
        source: 'Header',
      },
    })
  }

  const handleSignIn = () => {
    setOverlay({
      isOpen: true,
      template: 'signIn',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        smallWidth: true,
      },
    })
  }

  if (isLoading) {
    return <div className={c.UserNav_Row}></div>
  }

  if (showUser && user && !R.isNil(user) && !R.isEmpty(user)) {
    return (
      <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
        <Notifications myThangsMenu={myThangsMenu} />
        <Spacer size='1.5rem' />
        <ProfileDropdownMenu
          user={user}
          TargetComponent={ProfileDropdown}
          myThangsMenu={myThangsMenu}
        />
        <Spacer size='1rem' />
        {showUpload && (
          <Button
            className={classnames(c.UserNav_Button)}
            onClick={() => {
              setOverlay({
                isOpen: true,
                template: 'multiUpload',
                data: {
                  animateIn: true,
                  windowed: true,
                  dialogue: true,
                },
              })
            }}
          >
            {t('header.uploadButtonText')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={classnames(c.UserNav_Row, c.UserNav_ButtonsRow)}>
      <Button tertiary className={c.UserNav_SignUpButton} onClick={handleSignUp}>
        {t('header.signUpButtonText')}
      </Button>
      <Button className={c.UserNav_Button} onClick={handleSignIn}>
        {t('header.signInButtonText')}
      </Button>
    </div>
  )
}

export default UserNav
