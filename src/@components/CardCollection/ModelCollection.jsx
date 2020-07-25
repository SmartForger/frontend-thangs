import React from 'react'
import { NoResults } from '../NoResults'
import ModelCard from '../ModelCard'
import { ShowMoreButton } from '../ShowMore'
import Grid from './Grid'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    ModelCollection: {},
    ModelCollection_ShowMoreContainer: {
      marginTop: '2rem',
      textAlign: 'center',
    },
  }
})

const NOOP = () => null

const ModelCollection = ({
  models = [],
  maxPerRow = 4,
  noResultsText,
  fetchMore = NOOP,
  hasMore,
}) => {
  const c = useStyles()
  if (!models || models.length < 1) {
    return <NoResults>{noResultsText}</NoResults>
  }
  return (
    <>
      <Grid singleRow={models.length < maxPerRow}>
        {models.map((model, index) => (
          <ModelCard key={`model-${model.id}:${index}`} model={model} withOwner={true} />
        ))}
      </Grid>
      {hasMore && (
        <div className={c.ModelCollection_ShowMoreContainer}>
          <ShowMoreButton fetchMore={fetchMore} />
        </div>
      )}
    </>
  )
}

export default ModelCollection
