import React, { useCallback, useEffect, useState } from 'react'
import { DeleteForm, Spacer, Spinner } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { overlayview, track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    DeleteAttachment: {
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: 'unset',
      },
    },
    DeleteAttachment_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: '100%',
      },
    },
    DeleteAttachment_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    DeleteAttachment_ViewerWrapper: {
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
    DeleteAttachment_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    DeleteAttachment_LoaderScreen: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.29)',
      zIndex: '5',
      borderRadius: '1rem',
      display: 'flex',
    },
  }
})
const noop = () => null
const DeleteAttachment = ({ activeAttachment, modelId, onFinish = noop }) => {
  const c = useStyles()
  const { dispatch, folders = {} } = useStoreon('folders')
  const { setOverlayOpen } = useOverlay()
  const { isSaving } = folders

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleDelete = useCallback(() => {
    dispatch(types.DELETE_MODEL_ATTACHMENT, {
      attachmentId: activeAttachment.id,
      modelId,
      onFinish,
    })
  }, [activeAttachment.id, dispatch, modelId, onFinish])

  useEffect(() => {
    overlayview('DeleteAttachment')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.DeleteAttachment}>
      {isSaving && (
        <div className={c.DeleteAttachment_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.DeleteAttachment_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.DeleteAttachment_Column, c.DeleteAttachment_EditForm)}>
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
        <DeleteForm
          handleDelete={handleDelete}
          handleCancel={closeOverlay}
          type={'upload'}
        />
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default DeleteAttachment
