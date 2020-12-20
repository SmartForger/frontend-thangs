import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { useCurrentUserId } from '@hooks'
import { Pill, Spacer } from '@components'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const EditModelButton = ({ model = {} }) => {
  const currentUserId = useCurrentUserId()
  const { dispatch } = useStoreon()
  const isCurrentUser = model.owner && model.owner.id.toString() === currentUserId

  const openEditOverlay = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'editModel',
      overlayData: {
        model,
        user: model.owner,
        animateIn: true,
        windowed: true,
        showViewer: false,
      },
    })
    track('Model page edit clicked')
  }, [dispatch, model])
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
