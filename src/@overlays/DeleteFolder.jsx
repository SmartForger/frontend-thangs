import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
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
    DeleteFolder: {
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
    DeleteFolder_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: '100%',
      },
    },
    DeleteFolder_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    DeleteFolder_ViewerWrapper: {
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
    DeleteFolder_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    DeleteFolder_LoaderScreen: {
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

const DeleteFolder = ({ folder, type }) => {
  const c = useStyles()
  const history = useHistory()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, folders = {} } = useStoreon('folders')
  const { setOverlayOpen } = useOverlay()
  const { isSaving } = folders
  const isNotRecentFilesPage =
    history.location.pathname !== '/mythangs/recent-files' &&
    history.location.pathname !== '/mythangs'

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleDelete = useCallback(
    folder => {
      track('Delete Folder')
      dispatch(types.DELETE_FOLDER, {
        folder,
        onError: error => {
          setErrorMessage(error)
        },
        onFinish: () => {
          closeOverlay()
          const { root } = folder
          if (root) {
            return history.push(`/mythangs/folder/${root}`)
          }
          if (isNotRecentFilesPage) {
            return history.push('/mythangs/all-files')
          }
        },
      })
    },
    [closeOverlay, dispatch, history, isNotRecentFilesPage]
  )

  useEffect(() => {
    overlayview('DeleteFolder')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.DeleteFolder}>
      {isSaving && (
        <div className={c.DeleteFolder_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.DeleteFolder_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.DeleteFolder_Column, c.DeleteFolder_EditForm)}>
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
        <DeleteForm
          handleDelete={handleDelete}
          handleCancel={closeOverlay}
          folder={folder}
          type={type}
          errorMessage={errorMessage}
        />
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default DeleteFolder
