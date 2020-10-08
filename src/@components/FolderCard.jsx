import React, { useCallback } from 'react'
import { Card, SingleLineBodyText, Spacer } from '@components'
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
const FolderCard = ({ handleClick = noop, folder }) => {
  const c = useStyles({})
  const { name } = folder
  const displayName = name.split('//').reverse()[0]
  const handleFolderClick = useCallback(() => {
    handleClick(folder)
  }, [folder, handleClick])
  return (
    <Card
      className={c.FolderCard}
      size={'14.375rem'}
      backgroundColor={'#F7F7FB'}
      onClick={handleFolderClick}
    >
      {/* <StarIcon className={c.FolderCard_Star} /> */}
      <Spacer size={'3rem'} />
      <FolderCardIcon />
      <Spacer size={'2.75rem'} />
      <SingleLineBodyText>{displayName}</SingleLineBodyText>
      <Spacer size={'2.125rem'} />
    </Card>
  )
}

export default FolderCard
