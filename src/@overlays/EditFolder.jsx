import React, { useCallback, useState } from 'react'
import { Spacer, FolderForm, TitleTertiary, MultiLineBodyText } from '@components'
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
    EditFolder: {
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
    EditFolder_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    EditFolder_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
      position: 'absolute',
    },
    EditFolder_ViewerWrapper: {
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
    EditFolder_Viewer: {
      width: '100%',
      height: '100%',
      margin: '0 auto',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    EditFolder_Wrapper: {
      width: '339px',
    },
  }
})

const EditFolder = ({ folder }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch } = useStoreon()

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    newFolderData => {
      track('Edit Folder')
      const { id, ...updatedFolder } = newFolderData
      dispatch(types.EDIT_FOLDER, {
        id,
        folder: updatedFolder,
        onError: error => {
          setErrorMessage(error)
        },
        onFinish: () => {
          closeOverlay()
        },
      })
    },
    [closeOverlay, dispatch]
  )

  return (
    <div className={c.EditFolder}>
      <ExitIcon className={c.EditFolder_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.EditFolder_Column, c.EditFolder_EditForm)}>
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
        <div className={c.EditFolder_Wrapper}>
          <Spacer size='4rem' />
          <TitleTertiary>Edit Folder</TitleTertiary>
          <Spacer size='1rem' />
          <MultiLineBodyText>Change the name of your folder.</MultiLineBodyText>
          <Spacer size='1rem' />
          <FolderForm
            errorMessage={errorMessage}
            folder={folder}
            handleCancel={closeOverlay}
            handleSubmit={handleSubmit}
          />
        </div>
        <Spacer className={c.EditFolder_MobileSpacer} size='2rem' />
      </div>
    </div>
  )
}

export default EditFolder
