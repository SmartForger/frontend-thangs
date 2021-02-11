import React from 'react'
import { text, number, boolean } from '@storybook/addon-knobs'
import Avatar from 'react-avatar'

const defaultSrc = 'https://st.renderu.com/logo/307899'

export const AvatarTest = () => {
  const size = number('Size', 32)
  const src = text('Src', defaultSrc)
  const round = boolean('Round', true)

  return <Avatar src={src} size={size} round={round} maxInitials={2} />
}

export default {
  title: 'Molecules/Avatar',
}
