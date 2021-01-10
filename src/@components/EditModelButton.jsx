import React, { useCallback } from 'react'
import { useCurrentUserId, useOverlay } from '@hooks'
import { Pill, Spacer } from '@components'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { track } from '@utilities/analytics'

const EditModelButton = ({ model = {} }) => {
  const currentUserId = useCurrentUserId()
  const { setOverlay } = useOverlay()
  const isCurrentUser = model.owner && model.owner.id.toString() === currentUserId

  const openEditOverlay = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'editModel',
      data: {
        model,
        user: model.owner,
        animateIn: true,
        windowed: true,
        showViewer: false,
      },
    })
    track('Model page edit clicked')
  }, [model, setOverlay])

  if (!isCurrentUser) return null

  return (
    <Pill secondary onClick={openEditOverlay}>
      <EditIcon />
      <Spacer size={'.5rem'} />
      Edit Model
    </Pill>
  )
}

export default EditModelButton
