import React, { useCallback, useEffect, useState } from 'react'
import {
  Spacer,
  Spinner,
  EditModelForm,
  HoopsModelViewer,
  ModelViewer as BackupViewer,
} from '@components'
import { useLocalStorage } from '@hooks'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { overlayview, track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    EditModel: {
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      width: '100%',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: 'unset',
      },
    },
    EditModel_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    EditModel_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
    },
    EditModel_ViewerWrapper: {
      width: '100%',
      height: '24rem',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '1rem 1rem 0 0',
      position: 'relative',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.colors.white[900]}`,

      [md]: {
        overflow: 'hidden',
        height: '40rem',
        borderBottom: 'none',
        borderRight: `1px solid ${theme.colors.white[900]}`,
        borderRadius: '1rem 0 0 1rem',
      },
    },
    EditModel_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    EditModel_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: 5,
      borderRadius: '1rem',
      display: 'flex',
    },
  }
})

const EditModel = ({ model, fetchData }) => {
  const c = useStyles()
  const [showBackupViewer] = useLocalStorage('showBackupViewer', false)
  const [editModelErrorMessage, setEditModelErrorMessage] = useState(null)
  const { dispatch, [`model-${model.id}`]: modelAtom = {} } = useStoreon(
    `model-${model.id}`
  )
  const { isSaving } = modelAtom
  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    newModelData => {
      track('Edit Model')
      const { id, ...updatedModel } = newModelData
      dispatch(types.UPDATE_MODEL, {
        id,
        model: updatedModel,
        onError: error => {
          setEditModelErrorMessage(error)
        },
        onFinish: () => {
          dispatch(types.CLOSE_OVERLAY)
        },
      })
    },
    [dispatch]
  )

  const handleDelete = useCallback(() => {
    track('Delete Model - Edit Overlay')
    dispatch(types.DELETE_USER_OWN_MODEL, {
      id: model.id,
      fetchData,
      onFinish: () => {
        dispatch(types.CLOSE_OVERLAY)
      },
    })
  }, [dispatch, model.id, fetchData])

  useEffect(() => {
    overlayview('EditModel')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.EditModel}>
      {isSaving && (
        <div className={c.EditModel_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.EditModel_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.EditModel_Column, c.EditModel_ViewerWrapper)}>
        {showBackupViewer ? (
          <BackupViewer className={c.EditModel_Viewer} model={model} />
        ) : (
          <HoopsModelViewer
            className={c.EditModel_Viewer}
            model={model}
            minimizeTools={true}
          />
        )}
      </div>
      <div className={classnames(c.EditModel_Column, c.EditModel_EditForm)}>
        <Spacer className={c.EditModel_MobileSpacer} size='3rem' />
        <EditModelForm
          model={model}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          editModelErrorMessage={editModelErrorMessage}
        />
        <Spacer className={c.EditModel_MobileSpacer} size='3rem' />
      </div>
    </div>
  )
}

export default EditModel
