import React from 'react'
import { MODEL_MENU_OPTIONS } from '@constants/menuOptions'

import {
  ContainerRow,
  EditModelButton,
  ModelActionMenu,
  NewVersionButton,
  Spacer,
  Tooltip,
} from '@components'
import { useIsFeatureOn } from '@hooks/useExperiments'

const ModelActionToolbar = ({ model = {}, isExpandedOptions = false }) => {
  const newVersionFeatureEnabled = useIsFeatureOn('new_versions_feature')

  // TODO: Enable new version button for assemblies when ready
  return (
    <ContainerRow alignItems={'center'}>
      {newVersionFeatureEnabled && !model.isAssembly && (
        <Tooltip title={'Upload a new version'} defaultPlacement={'bottom'}>
          <NewVersionButton model={model} />
        </Tooltip>
      )}
      <Spacer size={'0.5rem'} />
      <Tooltip title={'Edit model details'} defaultPlacement={'bottom'}>
        <EditModelButton model={model} />
      </Tooltip>
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
