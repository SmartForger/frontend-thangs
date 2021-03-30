import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Contributors,
  LikeFolderButton,
  MetadataPrimary,
  Spacer,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock.svg'
import { ContextMenuTrigger } from 'react-contextmenu'
import { useOverlay } from '@hooks'
import { buildPath } from '@utilities'

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

const FolderHeader = ({ folder, folders, rootFolder, setFolder = noop }) => {
  const c = useStyles({})
  const { setOverlay } = useOverlay()
  const { id } = folder
  const folderPath = useMemo(() => {
    return buildPath(folders, id, folder => ({
      label: folder.name,
      id: folder.id,
    }))
  }, [folders, id])
  const folderName = folder.name

  const handleInviteUsers = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'inviteUsers',
      data: {
        folderId: rootFolder ? rootFolder.id : folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder.id, rootFolder, setOverlay])

  const handleEditFolder = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'editFolder',
      data: {
        folder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder, setOverlay])

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
              <div className={c.FolderView_RootLink}>
                <TitleTertiary>{folderName}</TitleTertiary>
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
                  {folderPath.map((pathObj, index) => {
                    if (index === folderPath.length - 1) return null
                    return (
                      <React.Fragment key={`folderCrumb_${pathObj.id}`}>
                        <Link
                          to={`/mythangs/folder/${pathObj.id}`}
                        >{`${pathObj.label}`}</Link>
                        {index !== folderPath.length - 2 && (
                          <>&nbsp;&nbsp;/&nbsp;&nbsp;</>
                        )}
                      </React.Fragment>
                    )
                  })}
                </MetadataPrimary>
              </>
            )}
          </div>
        </div>
        <div className={classnames(c.FolderView_Row, c.FolderView_Row__desktop)}>
          <Contributors users={members} displayLength='10' />
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
        <div className={c.FolderView_MobileMenuButton} onClick={e => e.preventDefault()}>
          <ContextMenuTrigger
            id={'Folder_Invite_Menu'}
            holdToDisplay={0}
            collect={() => ({ folder, members: folder.members })}
          >
            <DotStackIcon />
          </ContextMenuTrigger>
        </div>
      </div>
    </>
  )
}

export default FolderHeader
