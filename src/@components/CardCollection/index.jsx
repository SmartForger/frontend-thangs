import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import { createUseStyles } from '@style'
import Grid from './Grid'

const useStyles = createUseStyles(_theme => {
  return {
    ModelCard_Skeleton: {
      paddingBottom: 0,
      minHeight: '16.375rem',
      margin: 'auto',
      width: '100%',
      borderRadius: '.5rem',
    },
  }
})

const CardCollection = ({ maxPerRow = 4, noResultsText, loading = false, children }) => {
  const c = useStyles()

  if (loading) {
    return (
      <Grid singleRow={false}>
        {[...Array(12).keys()].map(index => (
          <Skeleton
            variant='rect'
            className={c.ModelCard_Skeleton}
            key={`skeletonCard:${index}`}
          />
        ))}
      </Grid>
    )
  }

  if (children) {
    return <Grid singleRow={children.length < maxPerRow}>{children}</Grid>
  } else {
    return <NoResults>{noResultsText}</NoResults>
  }
}

export default CardCollection
