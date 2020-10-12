import React, { useCallback, useState } from 'react'
import { Spacer, FolderForm, TitleTertiary, MultiLineBodyText } from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    AddFolder: {
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
    AddFolder_Column: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    AddFolder_ExitButton: {
      top: '2rem',
      right: '2rem',
      cursor: 'pointer',
      zIndex: 4,
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
      width: '339px',
    },
  }
})

const AddFolder = ({ folder }) => {
  const c = useStyles()
  const [errorMessage, setErrorMessage] = useState(null)
  const { dispatch } = useStoreon()

  const closeOverlay = useCallback(() => {
    dispatch(types.CLOSE_OVERLAY)
  }, [dispatch])

  const handleSubmit = useCallback(
    newFolderData => {
      dispatch(types.CREATE_FOLDER, {
        data: newFolderData,
        onError: error => {
          setErrorMessage(error.message)
        },
        onFinish: () => {
          closeOverlay()
        },
      })
    },
    [closeOverlay, dispatch]
  )

  return (
    <div className={c.AddFolder}>
      <ExitIcon className={c.AddFolder_ExitButton} onClick={closeOverlay} />
      <div className={classnames(c.AddFolder_Column, c.AddFolder_EditForm)}>
        <Spacer className={c.AddFolder_MobileSpacer} size='2rem' />
        <div className={c.AddFolder_Wrapper}>
          <Spacer size='4rem' />
          <TitleTertiary>Create New Folder</TitleTertiary>
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
