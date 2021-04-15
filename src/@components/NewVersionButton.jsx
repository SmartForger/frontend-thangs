import React, { useCallback } from 'react'
import { useCurrentUserId, useOverlay } from '@hooks'
import { Pill, Spacer } from '@components'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black-sm.svg'
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
    <Pill secondary onClick={handleNewVersion}>
      <UploadIcon />
      <Spacer size={'.25rem'} />
      New version
    </Pill>
  )
}

export default NewVersionButton
