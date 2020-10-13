import React, { useCallback, useMemo } from 'react'
import {
  Card,
  FileContextMenu,
  SingleLineBodyText,
  Spacer,
  LikeFolderButton,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FolderCardIcon } from '@svg/folder-card.svg'
import { ContextMenuTrigger } from 'react-contextmenu'

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

      '& path': {
        fill: '#5A5A75',
        stroke: '#5A5A75',
      },
    },
  }
})

const noop = () => null
const FolderCard = ({ handleClick = noop, folder }) => {
  const c = useStyles({})
  const { id, name } = folder
  const FolderId = useMemo(() => {
    return `Folder_${id}`
  }, [id])
  const displayName = name.split('//').reverse()[0]
  const handleFolderClick = useCallback(() => {
    handleClick(folder)
  }, [folder, handleClick])

  return (
    <>
      <ContextMenuTrigger id={`File_Menu_${FolderId}`} holdToDisplay={1000}>
        <Card
          className={c.FolderCard}
          size={'14.375rem'}
          backgroundColor={'#F7F7FB'}
          onClick={handleFolderClick}
        >
          <LikeFolderButton
            className={c.FolderCard_Star}
            folder={folder}
            minimal
            onlyShowOwned
          />
          <Spacer size={'3rem'} />
          <FolderCardIcon />
          <Spacer size={'2rem'} />
          <SingleLineBodyText>{displayName}</SingleLineBodyText>
          <Spacer size={'2rem'} />
        </Card>
      </ContextMenuTrigger>
      <FileContextMenu id={FolderId} folder={folder} type={'folder'} />
    </>
  )
}

export default FolderCard
