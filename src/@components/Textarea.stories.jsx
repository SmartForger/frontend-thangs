import React from 'react'
import { text, number, boolean, select } from '@storybook/addon-knobs'
import Textarea from './Textarea'

const defaultText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const TextAreaTest = () => {
  const props = {
    disabled: boolean('Disabled', false),
    value: text('Text', defaultText),
    maxLength: number('Max length', 300),
    type: select('Type', ['text', 'description'], 'text'),
  }

  return <Textarea {...props} />
}

export default {
  title: 'Molecules/Textarea',
}
