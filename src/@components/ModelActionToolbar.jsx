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
