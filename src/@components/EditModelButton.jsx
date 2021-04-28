import React, { useCallback } from 'react'
import { useOverlay } from '@hooks'
import { IconButton } from '@components'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { track } from '@utilities/analytics'

const EditModelButton = ({ model = {} }) => {
  const { setOverlay } = useOverlay()

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

  return (
    <IconButton onClick={openEditOverlay}>
      <EditIcon />
    </IconButton>
  )
}

export default EditModelButton
