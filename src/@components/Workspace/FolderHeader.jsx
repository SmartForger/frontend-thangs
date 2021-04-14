import React, { useMemo, useCallback } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import { createUseStyles } from '@physna/voxel-ui/@style'
import {
  Title,
  HeaderLevel,
  Metadata,
  MetadataType,
} from '@physna/voxel-ui/@atoms/Typography'

import { Contributors, FolderActionToolbar, LikeFolderButton, Spacer } from '@components'
import { buildPath } from '@utilities'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock.svg'

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

const FolderHeader = ({ folder, folders }) => {
  const c = useStyles({})
  const { id } = folder
  const { setOverlay } = useOverlay()
  const folderPath = useMemo(() => {
    return buildPath(folders, id, folder => ({
      label: folder.name,
      id: folder.id,
    }))
  }, [folders, id])
  const folderName = folder.name
  const members = folder.members || []

  const handleInviteUsers = useCallback(() => {
    track('File Menu - Invite Members')
    setOverlay({
      isOpen: true,
      template: 'inviteUsers',
      data: {
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder.id, setOverlay])

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
                <Title headerLevel={HeaderLevel.tertiary}>{folderName}</Title>
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
                <Metadata type={MetadataType.primary}>
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
                </Metadata>
              </>
            )}
          </div>
        </div>
        <div className={classnames(c.FolderView_Row, c.FolderView_Row__desktop)}>
          <Contributors
            onClick={handleInviteUsers}
            users={[folder.creator, ...members]}
            displayLength='10'
          />
          <Spacer size={'1rem'} />
          <FolderActionToolbar folder={folder} />
        </div>
      </div>
    </>
  )
}

export default FolderHeader
