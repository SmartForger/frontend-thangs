import React from 'react'
import { Card, SingleLineBodyText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FolderCardIcon } from '@svg/folder-card.svg'

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
      right: '1rem',
      top: '1rem',

      '& path': {
        fill: '#5A5A75',
        stroke: '#5A5A75',
      },
    },
  }
})

const noop = () => null
const FolderCard = ({ onClick = noop, folder }) => {
  const c = useStyles({})
  const { name } = folder
  const displayName = name.split('//').reverse()[0]
  return (
    <Card
      className={c.FolderCard}
      size={'14.375rem'}
      backgroundColor={'#F7F7FB'}
      onClick={onClick}
    >
      {/* <StarIcon className={c.FolderCard_Star} /> */}
      <FolderCardIcon />
      <SingleLineBodyText>{displayName}</SingleLineBodyText>
    </Card>
  )
}

export default FolderCard
