import React, { useCallback } from 'react'
import { useOverlay } from '@hooks'
import { Pill, Spacer } from '@components'
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
    <Pill secondary onClick={openEditOverlay}>
      <EditIcon />
      <Spacer size={'.25rem'} />
      Edit Model
    </Pill>
  )
}

export default EditModelButton
