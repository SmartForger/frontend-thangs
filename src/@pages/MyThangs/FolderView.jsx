import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import {
  AddContextMenu,
  Button,
  FileTable,
  FolderCard,
  LikeFolderButton,
  MetadataPrimary,
  Spacer,
  Spinner,
  TitleTertiary,
  Contributors,
  FolderMenu,
} from '@components'
import { useExternalClick, useQuery } from '@hooks'
import { authenticationService } from '@services'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock.svg'
import { ContextMenuTrigger } from 'react-contextmenu'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'

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
      width: '90%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      [md]: {
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
      zIndex: 1,
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

const getSubfolderId = (path, rootFolder, folder) => {
  if (!rootFolder) return { id: folder.id }
  if (path === rootFolder.name) return { id: rootFolder.id }
  return rootFolder.subfolders.find(folder => {
    const folderName = folder.name.split('//').reverse()[0]
    return folderName === path
  })
}

const FolderHeader = ({ folder, rootFolder, setFolder = noop }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const [showFileMenu, setShowFileMenu] = useState(false)
  const fileMenuRef = useRef(null)
  const { id, name } = folder
  const folderPath = name.split('//')
  useExternalClick(fileMenuRef, () => setShowFileMenu(false))

  const folderPathEnhanced = folderPath.map(path => {
    const subfolder = getSubfolderId(path, rootFolder, folder)
    if (!subfolder) return null
    const { id: pathId } = subfolder
    return { label: path, id: pathId }
  })
  const rootFolderName = folderPath[0]

  const handleClickRoot = useCallback(() => {
    if (id !== rootFolder.id) setFolder(rootFolder)
  }, [id, rootFolder, setFolder])

  const handleInviteUsers = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'inviteUsers',
      overlayData: {
        folderId: rootFolder ? rootFolder.id : folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [dispatch, folder.id, rootFolder])

  const handleEditFolder = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'editFolder',
      overlayData: {
        folder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [dispatch, folder])

  const handleFileMenu = useCallback(
    e => {
      e.stopPropagation()
      setShowFileMenu(!showFileMenu)
    },
    [showFileMenu]
  )

  const members = rootFolder ? rootFolder.members : folder.members

  return (
    <>
      <Spacer className={c.Spacer__mobile} size='2rem' />
      <div className={c.FolderView_Row}>
        <div className={c.FolderView_TitleAndIcons}>
          <FolderIcon />
          <Spacer size={'1rem'} />
          <div className={c.FolderView_Col}>
            <div className={c.FolderView_TitleAndIcons}>
              <div className={c.FolderView_RootLink} onClick={handleClickRoot}>
                <TitleTertiary>{rootFolderName}</TitleTertiary>
              </div>
              <Spacer size={'.5rem'} />
              {!folder.isPublic && (
                <>
                  <PadlockIcon className={c.PadlockIcon_Header} />
                  <Spacer size={'.25rem'} />
                </>
              )}
              <LikeFolderButton folder={folder} minimal onlyShowOwned />
            </div>
            {folderPath.length > 1 && (
              <>
                <Spacer size={'.5rem'} />
                <MetadataPrimary>
                  {folderPathEnhanced.map((pathObj, index) => {
                    if (index === 0) return null
                    if (index === folderPathEnhanced.length - 1)
                      return (
                        <span
                          key={`folderCrumb_${pathObj.label}_${index}`}
                          className={c.FolderView_CurrentFolder}
                        >
                          {pathObj.label}
                        </span>
                      )
                    return (
                      <React.Fragment key={`folderCrumb_${pathObj.label}_${index}`}>
                        <Link
                          to={`/mythangs/folder/${pathObj.id}`}
                        >{`${pathObj.label}`}</Link>
                        &nbsp;&nbsp;/&nbsp;&nbsp;
                      </React.Fragment>
                    )
                  })}
                </MetadataPrimary>
              </>
            )}
          </div>
        </div>
        <div className={classnames(c.FolderView_Row, c.FolderView_Row__desktop)}>
          <Contributors
            users={members}
            displayLength='10'
          />
          <Spacer size={'1rem'} />
          <Button secondary onClick={handleEditFolder}>
            Edit
          </Button>
          <Spacer size={'1rem'} />
          <Button onClick={handleInviteUsers}>
            <InviteIcon />
            <Spacer size={'.5rem'} />
            Invite Members
          </Button>
        </div>
        <div
          className={c.FolderView_MobileMenuButton}
          onClick={handleFileMenu}
          ref={fileMenuRef}
        >
          <DotStackIcon />
          {showFileMenu && (
            <div className={c.FolderView_MobileMenu}>
              <FolderMenu  members={members} type='folder' folder={folder} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const findFolderById = (id, folders) => {
  const rootFolder = R.find(R.propEq('id', id.toString()))(folders) || {}
  if (!R.isEmpty(rootFolder)) return rootFolder
  let subFolder = false
  folders.some(folder => {
    const subfolders = folder.subfolders
    subFolder = R.find(R.propEq('id', id.toString()))(subfolders) || false
    return subFolder
  })
  return subFolder
}

const FolderView = ({
  className,
  handleChangeFolder = noop,
  handleEditModel = noop,
  myFolders: folders,
  onDrop = noop,
  setCurrentFolderId = noop,
  sharedFolders: shared,
}) => {
  const currentUserId = authenticationService.getCurrentUserId()
  const c = useStyles({})
  const inviteCode = useQuery('inviteCode')
  const history = useHistory()
  const { dispatch } = useStoreon()
  const { folderId: id } = useParams()
  const allFolders = [...folders, ...shared]
  const folder = id ? findFolderById(id, allFolders) : {}
  const isSharedFolder = folder.creator && folder.creator.id !== currentUserId

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
  if (!folder && !R.isEmpty(allFolders)) {
    return <main className={classnames(className, c.FolderView)}>Folder not found.</main>
  }

  if (!folder || R.isEmpty(folder)) {
    return (
      <main className={classnames(className, c.FolderView)}>
        <Spinner className={c.FolderView_Spinner} />
      </main>
    )
  }

  const { name = '', models = [] } = folder
  const rootFolder = folder.root ? findFolderById(folder.root, folders) : folder
  const { subfolders = [] } = rootFolder
  const directSubFolders = subfolders.filter(
    subfolder => !subfolder.name.replace(`${name}//`, '').includes('//')
  )
  const fileTableFolders = directSubFolders.map(item => ({
    ...item,
    name: item.name.split('//').reverse()[0],
  }))

  return (
    <>
      <ContextMenuTrigger id='Add_Menu_FolderView' holdToDisplay={1000}>
        <main className={classnames(className, c.FolderView)}>
          <Spacer size='2rem' />
          <div className={c.FolderView_Content}>
            <FolderHeader
              folder={folder}
              rootFolder={rootFolder}
              setFolder={handleChangeFolder}
              isSharedFolder={isSharedFolder}
            />
            {directSubFolders.length > 0 && (
              <div className={c.FolderView_FoldersSection}>
                <Spacer size='4rem' />
                <TitleTertiary>Folders</TitleTertiary>
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
            {models.length > 0 && (
              <>
                <Spacer size='4rem' />
                <TitleTertiary>Files</TitleTertiary>
              </>
            )}
            <Spacer size='2rem' />{' '}
            <FileTable
              className={c.FolderView_FileTable__desktop}
              files={models}
              handleEditModel={handleEditModel}
              handleChangeFolder={handleChangeFolder}
              hideDropzone={directSubFolders.length > 0}
              onDrop={onDrop}
            />
            <FileTable
              className={c.FolderView_FileTable__mobile}
              files={[...fileTableFolders, ...models]}
              handleEditModel={handleEditModel}
              handleChangeFolder={handleChangeFolder}
              hideDropzone={directSubFolders.length > 0}
              onDrop={onDrop}
            />
          </div>
          <Spacer size='2rem' />
        </main>
      </ContextMenuTrigger>
      <AddContextMenu id='Add_Menu_FolderView' folder={folder} rootFolder={rootFolder} />
    </>
  )
}

export default FolderView
