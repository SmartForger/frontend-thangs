import React from 'react'
import { NoResults } from '../NoResults'
import Skeleton from '@material-ui/lab/Skeleton'
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
    ModelCard_Skeleton: {
      paddingBottom: 0,
      minHeight: '16.375rem',
      margin: 'auto',
      width: '100%',
      borderRadius: '.5rem',
    },
  }
})

const CardCollection = ({
  maxPerRow = 4,
  noResultsText,
  loading = false,
  children,
}) => {
  const c = useStyles()

  if (loading) {
    return (
      <div className={c.CardCollection}>
        {[...Array(12).keys()].map((model, index) => (
          <Skeleton
            variant='rect'
            className={c.ModelCard_Skeleton}
            key={`skeletonCard:${index}`}
          />
        ))}
      </div>
    )
  }
  
  if (children) {
    return (
      <div
        className={classnames(c.CardCollection, {
          [c.CardCollection__singleRow]: children.length < maxPerRow,
        })}
      >
        {children}
      </div>
    )
  } else {
    return <NoResults>{noResultsText}</NoResults>
  }
}

export default CardCollection
