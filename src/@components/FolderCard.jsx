import React, { useCallback, useMemo } from 'react'
import { ContextMenuTrigger } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { Card, Spacer, LikeFolderButton } from '@components'
import { ReactComponent as FolderCardIcon } from '@svg/folder-card.svg'
import { ReactComponent as PadlockIcon } from '@svg/icon-padlock-blue.svg'
import { ReactComponent as SharedFolderIcon } from '@svg/icon-sharedfolder.svg'

const useStyles = createUseStyles(theme => {
  return {
    FolderCard: {
      borderRadius: '.5rem',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'relative',
      flex: 'none',
      cursor: 'pointer',
    },
    FolderCard_UploadIcon: {
      padding: '1.5rem',
      fill: theme.colors.gold[500],
    },
    FolderCard_Star: {
      position: 'absolute',
      right: '0',
      top: '0',
      padding: '1rem',
    },
    FolderCard_Title: {
      textOverflow: 'ellipsis',
      maxWidth: '9.5rem',
      overflow: 'hidden',
      flex: 'none',
      lineHeight: '1rem !important',
    },
    FolderCard_IconWrapper: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
    },
    FolderCard_Row: {
      display: 'flex',
      flexDirection: 'row',
      flex: 'none',
    },
  }
})

const noop = () => null
const FolderCard = ({ handleClick = noop, folder, isSharedFolder, disableStar }) => {
  const c = useStyles({})
  const { id, name, isPublic, members = [] } = folder
  const FolderId = useMemo(() => {
    return `Folder_${id}`
  }, [id])
  const displayName = name.split('//').reverse()[0]
  const handleFolderClick = useCallback(() => {
    handleClick(folder)
  }, [folder, handleClick])
  return (
    <>
      <ContextMenuTrigger
        id={'Folder_Menu'}
        collect={() => ({ folder })}
        holdToDisplay={-1}
      >
        <Card
          className={c.FolderCard}
          size={'11.375rem'}
          backgroundColor={'#F7F7FB'}
          onClick={handleFolderClick}
        >
          {!disableStar && (
            <LikeFolderButton
              key={`LikeBtn-${FolderId}`}
              className={c.FolderCard_Star}
              folder={folder}
              minimal
              color={'#5A5A75'}
              shared={isSharedFolder}
            />
          )}
          <Spacer size={'3rem'} />
          <div className={c.FolderCard_IconWrapper}>
            <FolderCardIcon />
          </div>
          <Spacer size={'2rem'} />
          <div className={c.FolderCard_Row}>
            <Body className={c.FolderCard_Title}>{displayName}</Body>
            {!isPublic && (
              <>
                <PadlockIcon />
              </>
            )}
            {members.length > 1 && (
              <>
                <SharedFolderIcon />
              </>
            )}
          </div>
          <Spacer size={'2rem'} />
        </Card>
      </ContextMenuTrigger>
    </>
  )
}

export default FolderCard
