import React, { useCallback, useEffect, useState } from 'react'
import { DeleteForm, Spacer, Spinner } from '@components'
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
    DeleteComment: {
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
    DeleteComment_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    DeleteComment_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
    },
    DeleteComment_ViewerWrapper: {
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
    DeleteComment_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    DeleteComment_LoaderScreen: {
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

const DeleteComment = ({ modelId, comment }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, comments = {} } = useStoreon('comments')
  const { isSaving } = comments

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleDelete = useCallback(
    folder => {
      track('Delete Comment')
      dispatch(types.DELETE_MODEL_COMMENT, {
        modelId,
        commentId: comment.id,
        onError: error => {
          setErrorMessage(error)
        },
        onFinish: () => {
          closeOverlay()
        }
      })
    },
    [closeOverlay, dispatch, modelId, comment]
  )

  useEffect(() => {
    overlayview('DeleteComment')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.DeleteComment}>
      {isSaving && (
        <div className={c.DeleteComment_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.DeleteComment_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.DeleteComment_Column, c.DeleteComment_EditForm)}>
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
        <DeleteForm
          handleDelete={handleDelete}
          handleCancel={closeOverlay}
          type='comment'
          errorMessage={errorMessage}
        />
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default DeleteComment
