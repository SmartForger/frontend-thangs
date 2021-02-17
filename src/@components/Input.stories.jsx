import React from 'react'
import { text, number, boolean } from '@storybook/addon-knobs'
import { createUseStyles } from '@style'
import Input from './Input'

const defaultText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const useStyles = createUseStyles(() => {
  return {
    Container: {
      margin: '3rem',
    },
  }
})

export const InputTest = () => {
  const c = useStyles({})

  const props = {
    disabled: boolean('Disabled', false),
    value: text('Text', defaultText),
    maxLength: number('Max length', 300),
    type: text('Type', 'text'),
    required: boolean('Reqired', false),
  }

  return (
    <div className={c.Container}>
      <Input {...props} />
    </div>
  )
}

export default {
  title: 'Molecules/Input',
}
