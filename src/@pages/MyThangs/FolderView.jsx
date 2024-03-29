import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import * as R from 'ramda'
import classnames from 'classnames'
import { useHistory, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { FileTable, FolderCard, FolderHeader, Spacer, Spinner } from '@components'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'
import { getFolderModels, getSubFolders } from '@selectors'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    FolderView: {
      display: 'flex',
      flexDirection: 'row',
      minHeight: '88vh',

      '& > div': {
        flex: 'none',
      },
    },
    FolderView_Content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1.5rem',
      [md]: {
        marginLeft: '2rem',
        minWidth: '56rem',
      },
    },
    FolderView_FoldersSection: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    FolderView_Folders: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',

      '& > div': {
        marginTop: '1.5rem',
      },
    },
    FolderView_Row: {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: '1.5rem',
    },
    FolderView_Row__desktop: {
      display: 'none',
      [md]: {
        display: 'flex',
      },
    },
    FolderView_TitleAndIcons: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    FolderView_Col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    FolderView_Spinner: {
      marginTop: '10rem',
    },
    FolderView_CurrentFolder: {
      color: theme.colors.black[500],
    },
    FolderView_RootLink: {
      cursor: 'pointer',
    },
    PadlockIcon_Header: {
      flex: 'none',
    },
    FolderView_MobileMenuButton: {
      marginRight: '1.5rem',
      position: 'relative',
      display: 'unset',
      [md]: {
        display: 'none',
      },
      '& > svg': {
        padding: '.25rem',
        borderRadius: '.25rem',
        border: '1px solid transparent',

        '&:hover': {
          border: `1px solid ${theme.colors.grey[300]}`,
        },
      },
    },
    FolderView_MobileMenu: {
      position: 'absolute',
      top: '1.2rem',
      right: 0,
      zIndex: '1',
    },
    FolderView_FileTable__mobile: {
      display: 'unset',
      [md]: {
        display: 'none',
      },
    },
    FolderView_FileTable__desktop: {
      display: 'none',
      [md]: {
        display: 'unset',
      },
    },
    Spacer__mobile: {
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
  }
})

const noop = () => null

const FolderView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  onDrop = noop,
  setCurrentFolderId = noop,
  folders,
  models,
}) => {
  const currentUserId = authenticationService.getCurrentUserId()
  const c = useStyles({})
  const inviteCode = useQuery('inviteCode')
  const history = useHistory()
  const { dispatch } = useStoreon()
  const { folderId: id } = useParams()
  const folder = folders[id] || {}
  const isSharedFolder = folder.creator && folder.creator.id !== currentUserId
  const folderModels = useMemo(() => getFolderModels(models, id), [models, id])
  const [selectedModel, setSelectedModel] = useState(null)
  const toolbarRef = useRef()

  useEffect(() => {
    // This is for setting the current folder id
    // to be used by the upload model selected folder dropdown
    // when the user hard loads to a folder view page on mythangs
    if (id) setCurrentFolderId(id)
    pageview('MyThangs - FolderView', id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (inviteCode)
      dispatch(types.FETCH_FOLDER, {
        folderId: id,
        inviteCode,
        onFinish: () => {
          history.push(`/mythangs/folder/${id}`)
        },
      })
  }, [dispatch, history, id, inviteCode])

  const handleOnChange = useCallback(
    model => {
      setSelectedModel(model?.id ? model : null)
    },
    [setSelectedModel]
  )

  if (!folder && !R.isEmpty(folders)) {
    return <main className={classnames(className, c.FolderView)}>Folder not found.</main>
  }

  if (!folder || R.isEmpty(folder)) {
    return (
      <main className={classnames(className, c.FolderView)}>
        <Spinner className={c.FolderView_Spinner} />
      </main>
    )
  }

  const directSubFolders = getSubFolders(folders, id)

  return (
    <main className={classnames(className, c.FolderView)}>
      <div className={c.FolderView_Content}>
        <FolderHeader
          folder={folder}
          folders={folders}
          selectedModel={selectedModel}
          toolbarRef={toolbarRef}
        />
        {directSubFolders.length > 0 && (
          <div className={c.FolderView_FoldersSection}>
            <Spacer size='4rem' />
            <Title headerLevel={HeaderLevel.tertiary}>Folders</Title>
            <div className={c.FolderView_Folders}>
              {directSubFolders.map((subfolder, index) => (
                <React.Fragment key={`folder=${subfolder.id}_${index}`}>
                  <FolderCard
                    folder={subfolder}
                    handleClick={handleChangeFolder}
                    disableStar={isSharedFolder}
                  />
                  <Spacer size={'2rem'} />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        <Spacer size='2rem' />{' '}
        <FileTable
          className={c.FolderView_FileTable__desktop}
          files={folderModels}
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
          hideDropzone={directSubFolders.length > 0}
          onDrop={onDrop}
          heightOffset={8}
          isToolbarShown={false}
          onChange={handleOnChange}
          title='Files'
          toolbarRef={toolbarRef}
          hasSubtree={false}
        />
        <FileTable
          className={c.FolderView_FileTable__mobile}
          files={[...directSubFolders, ...folderModels]}
          handleEditModel={handleEditModel}
          handleChangeFolder={handleChangeFolder}
          hideDropzone={directSubFolders.length > 0}
          onDrop={onDrop}
          heightOffset={8}
          title='Files'
          hasSubtree={false}
        />
      </div>
      <Spacer size='2rem' />
    </main>
  )
}

export default FolderView
