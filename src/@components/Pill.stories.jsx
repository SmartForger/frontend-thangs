import React from 'react'
import Pill from './Pill'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import Spacer from './Spacer'

export const PillPrimaryTest = () => {
  return <Pill>Label</Pill>
}
export const PillSecondaryTest = () => {
  return <Pill secondary>Label</Pill>
}

export const PillPrimaryIconTest = () => {
  return (
    <Pill>
      <PlusIcon />
      <Spacer size='.5rem' />
      Label
    </Pill>
  )
}

export default {
  title: 'Molecules/Pill',
}
