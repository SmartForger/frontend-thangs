import React from 'react'
import { createUseStyles } from '@style'
import { text } from '@storybook/addon-knobs'
import { ProfileDropdownMenu } from './ProfileDropdown'

const avatarSrc = 'https://st.renderu.com/logo/307899'

const useStyles = createUseStyles(() => {
  return {
    Container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }
})

export default {
  title: 'Organism/UserMenu',
}

export const ProfileDropdownMenuTest = () => {
  const c = useStyles({})

  const user = {
    fullName: text('Fullnames', 'Test Name Jr.'),
    profile: {
      avatarUrl: text('Avatar src', avatarSrc),
      description: '',
    },
  }

  return <ProfileDropdownMenu className={c.Container} user={user} isOpen={true} />
}
