import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FolderForm, MultiLineBodyText, Spacer, Spinner } from '@components'
import { useOverlay } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { overlayview, track } from '@utilities/analytics'
import MobileDesktopTitle from '../@components/MobileDesktopTitle'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    AddFolder: {
      height: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.white[300],
      borderRadius: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',

      [md]: {
        height: 'unset',
        flexDirection: 'row',
      },
    },
    AddFolder_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',

      [md]: {
        flexDirection: 'row',
        height: 'unset',
      },
    },
    AddFolder_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: '4',
      position: 'absolute',
    },
    AddFolder_ViewerWrapper: {
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
    AddFolder_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    AddFolder_Wrapper: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '339px',
      },
    },
    AddFolder_LoaderScreen: {
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

const AddFolder = ({ folder }) => {
  const c = useStyles()
  const history = useHistory()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch, folders = {} } = useStoreon('folders')
  const { setOverlayOpen } = useOverlay()
  const { isSaving } = folders

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleSubmit = useCallback(
    newFolderData => {
      track('Create Folder', { isPrivate: !newFolderData.isPublic })
      dispatch(types.CREATE_FOLDER, {
        data: newFolderData,
        onError: error => {
          setErrorMessage(error.message)
        },
        onFinish: id => {
          closeOverlay()
          history.push(`/mythangs/folder/${id}`)
        },
      })
    },
    [closeOverlay, dispatch, history]
  )

  useEffect(() => {
    overlayview('AddFolder')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.AddFolder}>
      {isSaving && (
        <div className={c.AddFolder_LoaderScreen}>
          <Spinner />
        </div>
      )}
      <ExitIcon className={c.AddFolder_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.AddFolder_Column, c.AddFolder_EditForm)}>
        <Spacer className={c.AddFolder_MobileSpacer} size='2rem' />
        <div className={c.AddFolder_Wrapper}>
          <Spacer size='4rem' />
          <MobileDesktopTitle>Create New Folder</MobileDesktopTitle>
          <Spacer size='1rem' />
          <MultiLineBodyText>
            Set the name or privacy settings of your folder.
          </MultiLineBodyText>
          <Spacer size='1rem' />
          <FolderForm
            handleSubmit={handleSubmit}
            handleCancel={closeOverlay}
            errorMessage={errorMessage}
            parentFolder={folder}
          />
        </div>
        <Spacer className={c.AddFolder_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default AddFolder
