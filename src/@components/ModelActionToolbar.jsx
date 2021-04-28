import React from 'react'
import { MODEL_MENU_OPTIONS } from '@constants/menuOptions'

import {
  ContainerRow,
  EditModelButton,
  ModelActionMenu,
  NewVersionButton,
  Spacer,
} from '@components'
import { useIsFeatureOn } from '@hooks/useExperiments'

const ModelActionToolbar = ({ model = {}, isExpandedOptions = false }) => {
  const newVersionFeatureEnabled = useIsFeatureOn('new_versions_feature')

  return (
    <ContainerRow alignItems={'center'}>
      {newVersionFeatureEnabled && <NewVersionButton model={model} />}
      <Spacer size={'0.5rem'} />
      <EditModelButton model={model} />
      <Spacer size={'0.5rem'} />
      <ModelActionMenu
        model={model}
        isExpandedOptions={isExpandedOptions}
        isStaticBackground
        omitOptions={[MODEL_MENU_OPTIONS.NEW_VERSION, MODEL_MENU_OPTIONS.EDIT]}
      />
    </ContainerRow>
  )
}

export default ModelActionToolbar
