import React from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import Button from './'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import Spacer from '@components/Spacer'

export const ButtonTest = () => {
  const label = text('Label', 'Label')
  const secondary = boolean('Secondary', false)
  const icon = boolean('Icon', false)

  return (
    <Button secondary={secondary}>
      {icon && (
        <>
          <PlusIcon />
          <Spacer size={'.5rem'} />
        </>
      )}
      {label}
    </Button>
  )
}

export default {
  title: 'Molecules/Button',
}
