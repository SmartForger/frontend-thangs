import React from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import Toggle from './Toggle'

export const ToggleTest = () => {
  const props = {
    label: text('Label', 'Label'),
    disabled: boolean('Disabled', false),
    checked: boolean('Checked', false),
    hoverTooltip: text('Hover tooltip', ''),
  }

  return <Toggle {...props} />
}

export default {
  title: 'Molecules/Toggle',
}
