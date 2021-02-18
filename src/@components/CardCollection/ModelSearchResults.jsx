import React, { useCallback, useMemo, useState } from 'react'
import { ModelSearchResult, Pill } from '@components'
import { createUseStyles } from '@style'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(_theme => {
  return {
    ModelSearchResult_LoadMore: {
      display: 'flex',
      justifyContent: 'center',
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
          <Pill onClick={handleMoreThangs}>More Thangs</Pill>
        </div>
      )}
    </>
  )
}

export default ModelSearchResults
