import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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

const CardCollection = ({
  maxPerRow = 4,
  noResultsText,
  loading = false,
  children,
  cardWidth = '20.5rem',
}) => {
  const c = useStyles({ cardWidth })

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
    const allItemsCount = Array.isArray(children)
      ? children.reduce(
        (acc, child) => (child.props.items && acc + child.props.items.length) || 0,
        0
      )
      : (children.props.items && children.props.items.length) || 0

    return (
      <div
        className={classnames(c.CardCollection, {
          [c.CardCollection__singleRow]: allItemsCount < maxPerRow,
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