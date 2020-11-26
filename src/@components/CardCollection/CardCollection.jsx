import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { PREVIEW_MODELS_SIZE } from '@store/modelPreviews/store'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs, sm, md, lg, xxl_1454, md_972, xs_352 },
  } = theme

  return {
    CardCollection: {
      display: 'grid',
      gap: '1rem',
      margin: '0 auto',
      width: '100%',
      justifyContent: 'center',

      [xs_352]: {
        gap: '.5rem',
        gridTemplateColumns: 'repeat(auto-fit, 164px)',
      },

      [sm]: {
        gap: '.5rem',
      },

      [md_972]: {
        gridTemplateColumns: 'repeat(auto-fit, 221px)',
      },

      [xxl_1454]: {
        gridTemplateColumns: 'repeat(auto-fit, 340px)',
      },
    },
    CardCollection__singleRow: {
      [md]: {
        gridTemplateColumns: ({ cardWidth }) => `repeat(auto-fill, ${cardWidth})`,
      },
    },
    ModelCard_Skeleton: {
      paddingBottom: 0,
      [xs]: {
        minHeight: '17.52rem',
      },
      [sm]: {
        minHeight: '17.52rem',
      },
      [md]: {
        minHeight: '19.2rem',
      },
      [lg]: {
        minHeight: '26.75rem',
      },

      margin: 'auto',
      width: '100%',
      borderRadius: '.5rem',
    },
  }
})

const CardCollection = ({
  maxPerRow = 4,
  noResultsText,
  isLoading = false,
  children,
}) => {
  const c = useStyles({})

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

export default CardCollection
