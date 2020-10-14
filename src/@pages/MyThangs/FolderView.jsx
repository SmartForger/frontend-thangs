import React, { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
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
} from '@components'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ContextMenuTrigger } from 'react-contextmenu'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '56rem',
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
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
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
  const { id, name } = folder
  const folderPath = name.split('//')
  const folderPathEnhanced = folderPath.map(path => {
    const { id: pathId } = getSubfolderId(path, rootFolder, folder)
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
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [dispatch, folder])

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

  return (
    <div className={c.FolderView_Row}>
      <div className={c.FolderView_Row}>
        <FolderIcon />
        <Spacer size={'1rem'} />
        <div className={c.FolderView_Col}>
          <div className={c.FolderView_Row}>
            <div className={c.FolderView_RootLink} onClick={handleClickRoot}>
              <TitleTertiary>{rootFolderName}</TitleTertiary>
            </div>
            <Spacer size={'.5rem'} />
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
                        to={`/myThangs/folder/${pathObj.id}`}
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
      <div className={c.FolderView_Row}>
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
    </div>
  )
}

const findFolderById = (id, folders) => {
  return R.find(R.propEq('id', id.toString()))(folders) || {}
}

const FolderView = ({
  className,
  folders,
  handleChangeFolder = noop,
  handleEditModel = noop,
}) => {
  const c = useStyles({})
  const { folderId: id } = useParams()
  const folder = id ? findFolderById(id, folders) : {}

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

  return (
    <>
      <ContextMenuTrigger id='Add_Menu' holdToDisplay={1000}>
        <main className={classnames(className, c.FolderView)}>
          <Spacer size='2rem' />
          <div className={c.FolderView_Content}>
            <Spacer size='2rem' />
            <FolderHeader
              folder={folder}
              rootFolder={rootFolder}
              setFolder={handleChangeFolder}
            />
            <Spacer size='4rem' />
            <TitleTertiary>Folders</TitleTertiary>
            <div className={c.FolderView_Folders}>
              {directSubFolders.map((subfolder, index) => (
                <React.Fragment key={`folder=${subfolder.id}_${index}`}>
                  <FolderCard folder={subfolder} handleClick={handleChangeFolder} />
                  <Spacer size={'2rem'} />
                </React.Fragment>
              ))}
            </div>
            <Spacer size='4rem' />
            <TitleTertiary>Files</TitleTertiary>
            <Spacer size='2rem' />
            <FileTable
              files={models}
              handleEditModel={handleEditModel}
              handleChangeFolder={handleChangeFolder}
            ></FileTable>
          </div>
          <Spacer size='2rem' />
        </main>
      </ContextMenuTrigger>
      <AddContextMenu folder={folder} rootFolder={rootFolder} />
    </>
  )
}

export default FolderView
