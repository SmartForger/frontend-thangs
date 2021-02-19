import React, { useCallback, useMemo, useState } from 'react'
import { Divider, ModelSearchResult, Pill, Spacer } from '@components'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'
import { ReactComponent as FromThangsLogo } from '@svg/fromThangs.svg'

const useStyles = createUseStyles(_theme => {
  return {
    ModelSearchResult_LoadMore: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      zIndex: 1,
    },
    ModelSearchResult_LoadMoreBtn: {
      margin: '0 auto !important',
    },
    ModelSearchResult_LoadMoreLogo: {
      height: '1rem',
      marginLeft: '0.5rem',
      width: 'auto',

      '& path:last-child': {
        transform: 'translate(0, -12%)',
      },
    },
  }
})

const ModelSearchResults = ({ items = [], showLoadMore, ...props }) => {
  const [loadedCount, setLoadedCount] = useState(showLoadMore ? 5 : 0)
  const c = useStyles()

  const handleMoreThangs = useCallback(() => {
    setLoadedCount(loadedCount + 10)
    track('More Thangs - Search')
  }, [loadedCount])

  const filteredItems = useMemo(
    () =>
      Array.isArray(items) ? (loadedCount ? items.slice(0, loadedCount) : items) : [],
    [items, loadedCount]
  )

  return (
    <>
      {filteredItems.map((model, index) => (
        <ModelSearchResult
          key={`model-${model.id}:${index}`}
          model={model}
          withOwner={true}
          {...props}
        />
      ))}
      {showLoadMore && loadedCount < items.length && (
        <div className={c.ModelSearchResult_LoadMore}>
          <Spacer size='1rem' />
          <Pill
            className={c.ModelSearchResult_LoadMoreBtn}
            secondary
            onClick={handleMoreThangs}
          >
            <Spacer size='1rem' />
            <div>More Results</div>
            <FromThangsLogo className={c.ModelSearchResult_LoadMoreLogo} />
            <Spacer size='1rem' />
          </Pill>
          <Spacer size='2rem' />
        </div>
      )}
    </>
  )
}

export default ModelSearchResults
