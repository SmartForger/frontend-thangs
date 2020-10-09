import React, { useCallback } from 'react'
import {
  Card,
  FileContextMenu,
  LikeModelButton,
  SingleLineBodyText,
  Spacer,
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
      right: '1rem',
      top: '1rem',

      '& path': {
        fill: '#AE881E',
        stroke: '#AE881E',
      },
    },
  }
})

const noop = () => null
const FileCard = ({ handleClick = noop, model }) => {
  const c = useStyles({})
  const { id, name } = model

  const handleModelClick = useCallback(() => {
    handleClick(model)
  }, [handleClick, model])

  return (
    <>
      <ContextMenuTrigger id={`File_Menu_${id}`} holdToDisplay={1000}>
        <Card
          className={c.FileCard}
          size={'14.375rem'}
          backgroundColor={'#FCF8EC'}
          onClick={handleModelClick}
        >
          <LikeModelButton className={c.FileCard_Star} model={model} minimal />
          <Spacer size={'3rem'} />
          <FileCardIcon />
          <Spacer size={'2.75rem'} />
          <SingleLineBodyText>{name}</SingleLineBodyText>
          <Spacer size={'2.125rem'} />
        </Card>
      </ContextMenuTrigger>
      <FileContextMenu id={id} model={model} type={'model'} />
    </>
  )
}

export default FileCard
