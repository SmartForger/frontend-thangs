import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Pill,
  ProfilePicture,
  Divider,
  DropdownMenu,
  DropdownItem,
  MetadataSecondary,
  MultiLineBodyText,
  Spacer,
} from '@components'
import { useTranslations } from '@hooks'
import { authenticationService } from '@services'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

import { ReactComponent as SharedIcon } from '@svg/icon-shared.svg'
import { ReactComponent as PortfolioIcon } from '@svg/icon-portfolio.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as SignOutIcon } from '@svg/icon-signout.svg'
import { ReactComponent as ArrowDownIcon } from '@svg/icon-arrow-down-sm.svg'

const useStyles = createUseStyles(theme => {
  return {
    ProfileDropdown: {
      width: '16.25rem',
    },
    ProfileDropdown_Arrow: {
      '& > path': {
        fill: ({ myThangsMenu }) =>
          myThangsMenu ? theme.colors.black[500] : theme.colors.gold[500],
        stroke: ({ myThangsMenu }) =>
          myThangsMenu ? theme.colors.black[500] : theme.colors.gold[500],
      },
    },
    ProfileDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ProfileDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ProfileDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ProfileDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

const noop = () => null
export const ProfileDropdownMenu = ({
  dispatch,
  myThangsMenu,
  user = {},
  TargetComponent,
}) => {
  const c = useStyles({})
  const t = useTranslations({})
  const history = useHistory()
  const hasfullName = user && user.fullName && user.fullName.replace(' ', '')

  return (
    <DropdownMenu
      className={c.ProfileDropdown}
      TargetComponent={TargetComponent}
      user={user}
      myThangsMenu={myThangsMenu}
    >
      <div>
        <div className={c.ProfileDropdown_Row}>
          <ProfilePicture
            size='2.5rem'
            name={user.fullName}
            userName={user.username}
            src={user.profile.avatarUrl}
          />
          <Spacer size={'.75rem'} />
          <div className={c.ProfileDropdown_Column}>
            <MultiLineBodyText>
              {hasfullName ? user.fullName : user.username}
            </MultiLineBodyText>
            <Link to={'/mythangs/edit-profile'}>
              <MetadataSecondary>Profile Settings</MetadataSecondary>
            </Link>
          </div>
        </div>
        <Spacer size={'1rem'} />
        <Link to={'/mythangs'}>
          <Pill secondary>View My Thangs</Pill>
        </Link>
        <Spacer size={'1rem'} />
        <Divider spacing={0} />
        <Spacer size={'1rem'} />
        <DropdownItem to={`/${user.username}`}>
          <PortfolioIcon /> Portfolio
        </DropdownItem>
        <DropdownItem to={'/mythangs/shared-files'}>
          <SharedIcon /> Shared
        </DropdownItem>
        <DropdownItem to={'/mythangs/liked-models'}>
          <HeartIcon /> Liked
        </DropdownItem>
        <Spacer size={'1rem'} />
        <Divider spacing={0} />
        <Spacer size={'1rem'} />
        <DropdownItem
          onClick={() => {
            dispatch(types.CLOSE_OVERLAY)
            setTimeout(() => {
              authenticationService.logout()
              history.push('/')
            }, 250)
          }}
        >
          <SignOutIcon />
          {t('header.dropdownMenu.signOut')}
        </DropdownItem>
      </div>
    </DropdownMenu>
  )
}

export const ProfileDropdown = ({ user = {}, onClick = noop, myThangsMenu }) => {
  const c = useStyles({ myThangsMenu })

  return (
    <div className={c.ProfileDropdown_ClickableButton} onClick={onClick}>
      <ProfilePicture
        name={user.fullName}
        userName={user.username}
        src={user.profile && user.profile.avatarUrl}
        size='2.375rem'
      />
      <Spacer size={'.75rem'} />
      <ArrowDownIcon className={c.ProfileDropdown_Arrow} />
    </div>
  )
}
