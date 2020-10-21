import React, { useCallback, useState } from 'react'
import { DeleteForm, Spacer, Spinner } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    DeleteModel: {
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
    DeleteModel_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    DeleteModel_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
    },
    DeleteModel_ViewerWrapper: {
      width: '100%',
      height: '24rem',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      borderRadius: '1rem 1rem 0 0',
      position: 'relative',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.colors.white[900]}`,

      [md]: {
        height: '40rem',
        borderBottom: 'none',
        borderRight: `1px solid ${theme.colors.white[900]}`,
        borderRadius: '1rem 0 0 1rem',
      },
    },
    DeleteModel_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    DeleteModel_LoaderScreen: {
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

const DeleteModel = ({ model, type, folderId }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, [`model-${model.id}`]: modelAtom = {} } = useStoreon(
    `model-${model.id}`
  )
  const { isSaving } = modelAtom
  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    id => {
      track('Delete Model - Overlay')
      dispatch(types.DELETE_MODEL, {
        id,
        folderId,
        onError: error => {
          setErrorMessage(error)
        },
        onFinish: () => {
          closeOverlay()
        },
      })
    },
    [closeOverlay, dispatch, folderId]
  )

  return (
    <div className={c.DeleteModel}>
      {isSaving && (
        <div className={c.DeleteModel_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.DeleteModel_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.DeleteModel_Column, c.DeleteModel_EditForm)}>
        <Spacer className={c.DeleteModel_MobileSpacer} size='2rem' />
        <DeleteForm
          model={model}
          type={type}
          handleDelete={handleSubmit}
          handleCancel={closeOverlay}
          errorMessage={errorMessage}
        />
        <Spacer className={c.DeleteModel_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default DeleteModel
