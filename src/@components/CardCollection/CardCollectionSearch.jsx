import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { PREVIEW_MODELS_SIZE } from '@store/modelPreviews/store'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    CardCollection: {
      display: 'grid',
      gridTemplateColumns: ({ cardWidth }) =>
        `repeat(auto-fit, minmax(${cardWidth}, 1fr))`,
      gap: '1rem',
      width: '100%',
    },
    CardCollection__singleRow: {
      [md]: {
        gridTemplateColumns: ({ cardWidth }) => `repeat(auto-fill, ${cardWidth})`,
      },
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

const CardCollectionSearch = ({
  maxPerRow = 4,
  noResultsText,
  isLoading = false,
  children,
  cardWidth = '14.875rem',
}) => {
  const c = useStyles({ cardWidth })

  if (children) {
    const allItemsCount = Array.isArray(children)
      ? children.reduce(
          (acc, child) => (child.props.items && acc + child.props.items.length) || 0,
          0
        )
      : (children.props.items && children.props.items.length) || 0

    return (
      <div
        className={classnames(c.CardCollection, {
          [c.CardCollection__singleRow]: allItemsCount < maxPerRow && !isLoading,
        })}
      >
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

export default CardCollectionSearch
