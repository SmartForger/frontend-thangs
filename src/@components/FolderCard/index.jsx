import React from 'react'
import { Link } from 'react-router-dom'
import { Card, FolderInfo } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    FolderCard: {},
    FolderCard_CardContents: {
      gridArea: 'info',
      borderRadius: '.5rem .5rem 0 0',
      height: 'auto !important',
    },
  }
})

const CardContents = ({ className, folder }) => {
  const c = useStyles()
  return (
    <Card className={classnames(className, c.FolderCard_CardContents)}>
      <FolderInfo name={folder.name} members={folder.members} models={folder.models} />
    </Card>
  )
}

const FolderCard = ({ folder }) => {
  return (
    <Link to={`/folder/${folder.id}`}>
      <CardContents folder={folder} />
    </Link>
  )
}

export default FolderCard
