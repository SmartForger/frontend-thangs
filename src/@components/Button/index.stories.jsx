import React from 'react'
import Button from './'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import Spacer from '@components/Spacer'

export const PrimaryButton = () => {
  return <Button>Label</Button>
}

export const SecondaryButton = () => {
  return <Button secondary>Label</Button>
}

export const PrimaryIconButton = () => {
  return (
    <Button>
      <PlusIcon />
      <Spacer size={'.5rem'} />
      Label
    </Button>
  )
}

export const SecondaryIconButton = () => {
  return (
    <Button secondary>
      <PlusIcon />
      <Spacer size={'.5rem'} />
      Label
    </Button>
  )
}

export default {
  title: 'Molecules/Button',
}
