import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import { PREVIEW_MODELS_SIZE } from '@store/modelPreviews/store'

const CardCollectionBase = ({ noResultsText, isLoading = false, children, c }) => {
  if (children) {
    return (
      <div className={c.CardCollection}>
        {children}
        {isLoading &&
          [...Array(PREVIEW_MODELS_SIZE).keys()].map(key => (
            <Skeleton
              variant='rect'
              className={c.ModelCard_Skeleton}
              key={`skeletonCard-${key}`}
            />
          ))}
      </div>
    )
  } else {
    return <NoResults>{noResultsText}</NoResults>
  }
}

export default CardCollectionBase
