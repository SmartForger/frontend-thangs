import React from 'react'
import { createUseStyles } from '@physna/voxel-ui'
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
    <div className={c.Container}>
      <Checkbox {...props} />
    </div>
  )
}

export default {
  title: 'Molecules/Checkbox',
}
