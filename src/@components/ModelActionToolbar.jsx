import React from 'react'
import { MODEL_MENU_OPTIONS } from '@constants/menuOptions'

import {
  ContainerRow,
  EditModelButton,
  ModelActionMenu,
  NewVersionButton,
  Spacer,
} from '@components'

const ModelActionToolbar = ({ model = {}, isExpandedOptions = false }) => {
  return (
    <ContainerRow alignItems={'center'}>
      <NewVersionButton model={model} />
      <Spacer size={'1rem'} />
      <EditModelButton model={model} />
      <Spacer size={'1rem'} />
      <ModelActionMenu
        model={model}
        isExpandedOptions={isExpandedOptions}
        omitOptions={[MODEL_MENU_OPTIONS.NEW_VERSION, MODEL_MENU_OPTIONS.EDIT]}
      />
    </ContainerRow>
  )
}

export default ModelActionToolbar
