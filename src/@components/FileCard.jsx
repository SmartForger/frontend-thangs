import React, { useCallback } from 'react'
import { ContextMenuTrigger } from 'react-contextmenu'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

import { Card, LikeModelButton, Spacer } from '@components'

import { ReactComponent as FileCardIcon } from '@svg/file-card.svg'

const useStyles = createUseStyles(theme => {
  return {
    FileCard: {
      borderRadius: '.5rem',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'relative',
      cursor: 'pointer',
    },
    FileCard_UploadIcon: {
      padding: '1.5rem',
      fill: theme.colors.gold[500],
    },
    FileCard_Star: {
      position: 'absolute',
      right: '0',
      top: '0',
      padding: '1rem',
    },
    FileCard_Name: {
      textOverflow: 'ellipsis',
      maxWidth: '12.5rem',
      overflow: 'hidden',
      flex: 'none',
      lineHeight: '1rem !important',
    },
    FileCard_Icon: {
      flex: 'none',
    },
    FileCard_IconWrapper: {
      position: 'relative',
    },
    FileCard_FileType: {
      position: 'absolute',
      bottom: '1rem',
      left: 0,
      right: 0,
      color: '#AE881E !important',
    },
  }
})

const noop = () => null
const FileCard = ({ handleClick = noop, model }) => {
  const c = useStyles({})
  const { id, name, fileType } = model
  const CardId = `Card_${id}`
  const handleModelClick = useCallback(() => {
    handleClick(model)
  }, [handleClick, model])

  return (
    <>
      <ContextMenuTrigger id={'File_Menu'} holdToDisplay={-1} collect={() => ({ model })}>
        <Card
          className={c.FileCard}
          size={'14.375rem'}
          backgroundColor={'#FCF8EC'}
          onClick={handleModelClick}
          title={name}
        >
          <LikeModelButton
            key={`LikeBtn-${CardId}`}
            color={'#AE881E'}
            className={c.FileCard_Star}
            model={model}
            minimal
          />
          <Spacer size={'3rem'} />
          <div className={c.FileCard_IconWrapper}>
            <FileCardIcon className={c.FileCard_Icon} />
            <Metadata type={MetadataType.secondary} className={c.FileCard_FileType}>
              {fileType}
            </Metadata>
          </div>
          <Spacer size={'2rem'} />
          <Body className={c.FileCard_Name}>{name}</Body>
          <Spacer size={'2rem'} />
        </Card>
      </ContextMenuTrigger>
    </>
  )
}

export default FileCard
