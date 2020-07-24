import React from 'react'
import ModelCard from '../ModelCard'
import FolderCard from '../FolderCard'
import { NoResults } from '../NoResults'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    CardCollection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(21.5rem, 1fr))',
      gap: '1rem',
      width: '100%',
    },
    CardCollection__singleRow: {
      gridTemplateColumns: 'repeat(auto-fill, 21.5rem)',
    },
  }
})

const nothingToDisplay = ({ models, folders }) => {
  if (models && models.length >= 1) {
    return false
  } else if (folders && folders.length >= 1) {
    return false
  }
  return true
}

const CardCollection = ({ models = [], maxPerRow = 4, noResultsText, folders = [] }) => {
  const c = useStyles()
  if (nothingToDisplay({ models, folders })) {
    return <NoResults>{noResultsText}</NoResults>
  }
  const singleRow = models.length + folders.length < maxPerRow
  return (
    <div
      className={classnames(c.CardCollection, {
        [c.CardCollection__singleRow]: singleRow,
      })}
    >
      {models.map((model, index) => (
        <ModelCard key={`model-${model.id}:${index}`} model={model} withOwner={true} />
      ))}
      {folders.map((folder, index) => (
        <FolderCard key={`folder=${folder.id}:${index}`} folder={folder} />
      ))}
    </div>
  )
}

export default CardCollection
