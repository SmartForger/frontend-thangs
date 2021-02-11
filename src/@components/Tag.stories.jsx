import React from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import Tag from './Tag'

export const TagTest = () => {
  const label = text('Label', 'Label')
  const secondary = boolean('Secondary', false)

  return <Tag secondary={secondary}>{label}</Tag>
}

export default {
  title: 'Molecules/Tag',
}
