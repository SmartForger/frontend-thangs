import React from 'react'
import { Link } from 'react-router-dom'
import { ModelThumbnail } from '../ModelThumbnail'
import { FolderInfo } from '../FolderInfo'
import { Card } from '../Card'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    FolderCard: {},
    FolderCard_Grid: {
      display: 'grid',
      height: '100%',
      gridTemplateAreas: `
            'info info'
            'model-one model-two'`,
      gridTemplateRows: 'repeat(2, minmax(50%, 140px))',
      gridGap: '.25rem',
    },
    FolderCard_Placeholder: {
      backgroundColor: theme.color.GREY_13,
    },
    FolderCard_ModelThumbnail: {
      margin: 'auto',
      '& img': {
        maxWidth: '100%',
        maxHeight: '100%',
      },
    },
    FolderCard_CardContents: {
      gridArea: 'info',
      borderRadius: '.5rem .5rem 0 0',
    },
    FolderCard_ModelOne: {
      gridArea: 'model-one',
    },
    FolderCard_ModelTwo: {
      gridArea: 'model-two',
    },
  }
})

function Placeholder() {
  const c = useStyles()
  return <Card className={c.FolderCard_Placeholder} />
}

function PossiblyEmptyModelCard({ model, className }) {
  const c = useStyles()
  return model ? (
    <Card className={className}>
      <ModelThumbnail className={c.FolderCard_ModelThumbnail} {...model} />
    </Card>
  ) : (
    <Placeholder className={className} />
  )
}

function CardContents({ className, folder }) {
  const c = useStyles()
  const [model1, model2] = folder.models
  return (
    <div className={classnames(className, c.FolderCard_Grid)}>
      <Card className={c.FolderCard_CardContents}>
        <FolderInfo name={folder.name} members={folder.members} models={folder.models} />
      </Card>
      <PossiblyEmptyModelCard className={c.FolderCard_ModelOne} model={model1} />
      <PossiblyEmptyModelCard className={c.FolderCard_ModelTwo} model={model2} />
    </div>
  )
}

function FolderCard({ className, folder }) {
  return (
    <Link to={`/folder/${folder.id}`}>
      <CardContents folder={folder} />
    </Link>
  )
}

export { FolderCard }
