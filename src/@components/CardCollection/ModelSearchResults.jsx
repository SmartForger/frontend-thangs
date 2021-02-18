import React, { useCallback, useState } from 'react'
import { ModelSearchResult, Pill } from '@components'
import { createUseStyles } from '@style'

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
  }, [loadedCount])

  const filteredItems = Array.isArray(items)
    ? loadedCount
      ? items.slice(0, loadedCount)
      : items
    : []
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
      {showLoadMore && (
        <div className={c.ModelSearchResult_LoadMore}>
          <Pill onClick={handleMoreThangs}>More Thangs</Pill>
        </div>
      )}
    </>
  )
}

export default ModelSearchResults
