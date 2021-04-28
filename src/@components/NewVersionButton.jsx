import React, { useCallback } from 'react'
import { useCurrentUserId, useOverlay } from '@hooks'
import { Pill, Spacer } from '@components'
import { ReactComponent as NewModelVersionIcon } from '@svg/icon-model-new-version.svg'
import { track } from '@utilities/analytics'

const NewVersionButton = ({ model = {} }) => {
  const currentUserId = useCurrentUserId()
  const { setOverlay } = useOverlay()
  const isCurrentUser =
    model.owner && model.owner.id && model.owner.id.toString() === currentUserId

  const handleNewVersion = useCallback(
    e => {
      e.preventDefault()
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          versionData: {
            modelId: model.id,
          },
          action: 'update',
        },
      })
      track('New Version clicked - model page')
    },
    [model, setOverlay]
  )

  if (!isCurrentUser) return null

  return (
    <Pill primary onClick={handleNewVersion}>
      <NewModelVersionIcon />
      <Spacer size={'0.5rem'} />
      New version
    </Pill>
  )
}

export default NewVersionButton
