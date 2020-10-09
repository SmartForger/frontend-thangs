import React, { useCallback } from 'react'
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

const useStyles = createUseStyles(theme => {
  return {
    FolderView: {
      display: 'flex',
      flexDirection: 'row',

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
const FolderHeader = ({ folder, rootFolder, setFolder = noop }) => {
  const c = useStyles({})
  const { id, name } = folder
  const folderPath = name.split('//')
  const rootFolderName = folderPath[0]

  const handleClickRoot = useCallback(() => {
    if (id !== rootFolder.id) setFolder(rootFolder)
  }, [id, rootFolder, setFolder])

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
                {folderPath.map((path, index) => {
                  if (index === 0) return null
                  if (index === folderPath.length - 1)
                    return <span className={c.FolderView_CurrentFolder}>{path}</span>
                  return <>{`${path}`}&nbsp;&nbsp;/&nbsp;&nbsp;</>
                })}
              </MetadataPrimary>
            </>
          )}
        </div>
      </div>
      <Button>
        <InviteIcon />
        <Spacer size={'.5rem'} />
        Invite Users
      </Button>
    </div>
  )
}

const findFolderById = (id, folders) => {
  return R.find(R.propEq('id', id.toString()))(folders) || {}
}

const FolderView = ({
  className,
  id,
  folders,
  handleChangeFolder = noop,
  handleEditModel = noop,
}) => {
  const c = useStyles({})
  const folder = findFolderById(id, folders)

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
      <AddContextMenu />
    </>
  )
}

export default FolderView
