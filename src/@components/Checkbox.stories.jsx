import React from 'react'
import { createUseStyles } from '@style'
import { text, boolean } from '@storybook/addon-knobs'
import Checkbox from './Checkbox'

const useStyles = createUseStyles(_theme => {
  return {
    Container: {
      minWidth: '8rem',
    },
  }
})

export const CheckboxTest = () => {
  const c = useStyles()

  const props = {
    label: text('Label', 'Label'),
    checked: boolean('Checked', false),
  }

  return (
    <div class={c.Container}>
      <Checkbox {...props} />
    </div>
  )
}

export default {
  title: 'Molecules/Checkbox',
}
