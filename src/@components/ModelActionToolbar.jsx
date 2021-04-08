import React from 'react'

import {
  ContainerRow,
  EditModelButton,
  ModelActionMenu,
  NewVersionButton,
  Spacer,
} from '@components'

const ModelActionToolbar = ({ model }) => {
  return (
    <ContainerRow alignItems={'center'}>
      <NewVersionButton model={model} />
      <Spacer size={'1rem'} />
      <EditModelButton model={model} />
      <Spacer size={'1rem'} />
      <ModelActionMenu model={model} />
    </ContainerRow>
  )
}

export default ModelActionToolbar
