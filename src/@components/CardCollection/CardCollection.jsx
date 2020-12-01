import React from 'react'
import { NoResults } from '@components'
import Skeleton from '@material-ui/lab/Skeleton'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { PREVIEW_MODELS_SIZE } from '@store/modelPreviews/store'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs_352, md, md_972, xxl_1454 },
  } = theme

  return {
    CardCollection: {
      display: 'grid',
      gap: '1rem',
      margin: '0 auto',
      width: '100%',
      justifyContent: 'center',
      gridTemplateColumns: 'repeat(auto-fit, minmax(164px, 1fr))',

      '@media (min-width: 425px)': {
        gridTemplateColumns: 'repeat(auto-fit, 164px)',
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
      [xs_352]: {
        minHeight: '17.52rem',
      },
      [md_972]: {
        minHeight: '19.2rem',
      },
      [xxl_1454]: {
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
