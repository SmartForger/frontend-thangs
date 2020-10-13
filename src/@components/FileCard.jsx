import React, { useCallback, useMemo } from 'react'
import {
  Card,
  FileContextMenu,
  LikeModelButton,
  SingleLineBodyText,
  Spacer,
  MetadataSecondary,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FileCardIcon } from '@svg/file-card.svg'
import { ContextMenuTrigger } from 'react-contextmenu'

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

      '& path': {
        fill: '#AE881E',
        stroke: '#AE881E',
      },
    },
    FileCard_Name: {
      textOverflow: 'ellipsis',
      maxWidth: 213,
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
  const CardId = useMemo(() => {
    return `Card_${id}`
  }, [id])
  const handleModelClick = useCallback(() => {
    handleClick(model)
  }, [handleClick, model])

  return (
    <>
      <ContextMenuTrigger id={`File_Menu_${CardId}`} holdToDisplay={1000}>
        <Card
          className={c.FileCard}
          size={'14.375rem'}
          backgroundColor={'#FCF8EC'}
          onClick={handleModelClick}
          title={name}
        >
          <LikeModelButton className={c.FileCard_Star} model={model} minimal />
          <Spacer size={'3rem'} />
          <div className={c.FileCard_IconWrapper}>
            <FileCardIcon className={c.FileCard_Icon} />
            <MetadataSecondary className={c.FileCard_FileType}>
              {fileType}
            </MetadataSecondary>
          </div>
          <Spacer size={'2rem'} />
          <SingleLineBodyText className={c.FileCard_Name}>{name}</SingleLineBodyText>
          <Spacer size={'2rem'} />
        </Card>
      </ContextMenuTrigger>
      <FileContextMenu id={CardId} model={model} type={'model'} />
    </>
  )
}

export default FileCard
