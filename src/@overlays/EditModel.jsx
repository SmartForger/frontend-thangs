import React, { useCallback, useState } from 'react'
import {
  Spacer,
  EditModelForm,
  HoopsModelViewer,
  ModelViewer as BackupViewer,
  useFlashNotification,
} from '@components'
import { useLocalStorage } from '@hooks'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

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

      [md]: {
        flexDirection: 'row',
      },
    },
    EditModel_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'column',
      },
    },
    EditModel_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
    },
    EditModel_Viewer: {
      width: '100%',
      height: '23.5rem',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
  }
})

const EditModel = ({ model, user, fetchData, folderId }) => {
  const c = useStyles()
  const { navigateWithFlash } = useFlashNotification()
  const [showBackupViewer] = useLocalStorage('showBackupViewer', false)
  const [editModelErrorMessage, setEditModelErrorMessage] = useState(null)
  const { dispatch } = useStoreon()

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    newModelData => {
      const { id, ...updatedModel } = newModelData
      dispatch(types.UPDATE_MODEL, {
        id,
        model: updatedModel,
        onError: error => {
          setEditModelErrorMessage(error)
        },
        onFinish: () => {
          dispatch(types.CLOSE_OVERLAY)
          navigateWithFlash(
            folderId ? `/folder/${folderId}` : `/${user.username}`,
            'Model updated successfully.'
          )
        },
      })
    },
    [dispatch, setEditModelErrorMessage, folderId, navigateWithFlash, user]
  )

  const handleDelete = useCallback(() => {
    dispatch(types.DELETE_USER_OWN_MODEL, {
      id: model.id,
      fetchData,
      onFinish: () => {
        dispatch(types.CLOSE_OVERLAY)
        navigateWithFlash(
          folderId ? `/folder/${folderId}` : `/${user.username}`,
          'Model deleted successfully.'
        )
      },
    })
  }, [dispatch, model, fetchData, navigateWithFlash, folderId, user])

  return (
    <div className={c.EditModel}>
      <ExitIcon className={c.EditModel_ExitButton} onClick={closeOverlay} />
      <Spacer className={c.EditModel_MobileSpacer} size='4rem' />
      <div className={c.EditModel_Column}>
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
      <Spacer className={c.EditModel_MobileSpacer} size='4rem' mobileSize='2rem' />
      <div className={c.EditModel_Column}>
        <Spacer className={c.EditModel_MobileSpacer} size='4rem' />
        <EditModelForm
          model={model}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          editModelErrorMessage={editModelErrorMessage}
        />
        <Spacer className={c.EditModel_MobileSpacer} size='4rem' />
      </div>
      <Spacer className={c.EditModel_MobileSpacer} size='4rem' />
    </div>
  )
}

export default EditModel
