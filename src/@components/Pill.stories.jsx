import React from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import Pill from './Pill'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import Spacer from './Spacer'

export const PillTest = () => {
  const label = text('Label', 'Label')
  const secondary = boolean('Secondary', false)
  const icon = boolean('Icon', false)

  return (
    <Pill secondary={secondary}>
      {icon && (
        <>
          <PlusIcon />
          <Spacer size={'.5rem'} />
        </>
      )}
      {label}
    </Pill>
  )
}

export default {
  title: 'Molecules/Pill',
}
