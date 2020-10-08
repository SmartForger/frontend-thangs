import React from 'react'
import { Card, SingleLineBodyText } from '@components'
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
const FileCard = ({ onClick = noop, model }) => {
  const c = useStyles({})
  const { name } = model
  return (
    <Card
      className={c.FileCards}
      size={'14.375rem'}
      backgroundColor={'#FCF8EC'}
      onClick={onClick}
    >
      <StarIcon className={c.FileCard_Star} />
      <FileCardIcon />
      <SingleLineBodyText>{name}</SingleLineBodyText>
    </Card>
  )
}

export default FileCard
