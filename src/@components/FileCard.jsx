import React, { useCallback } from 'react'
import { Card, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as StarIcon } from '@svg/icon-star-filled.svg'
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
  const { name } = model

  const handleModelClick = useCallback(() => {
    handleClick(model)
  }, [handleClick, model])

  return (
    <Card
      className={c.FileCard}
      size={'14.375rem'}
      backgroundColor={'#FCF8EC'}
      onClick={handleModelClick}
    >
      <StarIcon className={c.FileCard_Star} />
      <Spacer size={'3rem'} />
      <FileCardIcon />
      <Spacer size={'2.75rem'} />
      <SingleLineBodyText>{name}</SingleLineBodyText>
      <Spacer size={'2.125rem'} />
    </Card>
  )
}

export default FileCard
