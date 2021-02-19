import React, { useCallback, useMemo, useState } from 'react'
import { ModelSearchResult, Pill } from '@components'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'
import { ReactComponent as FromThangsLogo } from '@svg/fromThangs.svg'

const useStyles = createUseStyles(_theme => {
  return {
    ModelSearchResult_LoadMore: {
      display: 'flex',
      justifyContent: 'center',
    },
    ModelSearchResult_LoadMoreLogo: {
      transform: 'scale(.75)',
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
          <Pill secondary onClick={handleMoreThangs}>
            <div>More Results</div>
            <FromThangsLogo className={c.ModelSearchResult_LoadMoreLogo} />
          </Pill>
        </div>
      )}
    </>
  )
}

export default ModelSearchResults
