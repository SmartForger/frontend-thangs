import React, { useCallback, useState } from 'react'
import { Button, Spinner } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => {
  return {
    ShowMoreButton: {
      ...theme.text.linkText,
      width: '7rem',
      padding: '.25rem .75rem',
    },
    ShowMoreButton_Spinner: {
      width: '1rem',
      height: '1rem',
    },
  }
})

// Used for Client-Side Controlled Pagination - Sync
const ShowMoreSync = ({ more, className }) => {
  const [shouldShowMore, setShouldShowMore] = useState()
  const c = useStyles()
  return shouldShowMore ? (
    more
  ) : (
    <div className={classnames(className, c.ShowMoreButton)}>
      <Button text onClick={() => setShouldShowMore(true)}>
        Show More
      </Button>
    </div>
  )
}

// Used for Server-Side Controlled Pagination - Async
const ShowMoreAsync = ({ fetchMore, className }) => {
  const [loading, setLoading] = useState()
  const [hadError, setHadError] = useState()
  const c = useStyles()

  const handleClick = useCallback(
    async e => {
      e.preventDefault()
      setLoading(true)
      try {
        await fetchMore()
        setLoading(false)
      } catch (error) {
        setHadError(true)
      }
    },
    [fetchMore]
  )

  return (
    <Button
      text
      className={classnames(className, c.ShowMoreButton)}
      onClick={handleClick}
    >
      {hadError ? (
        'Server Error'
      ) : loading ? (
        <Spinner className={c.ShowMoreButton_Spinner} />
      ) : (
        'Show More'
      )}
    </Button>
  )
}

const ShowMoreButton = props => {
  const { fetchMore } = props
  return fetchMore ? <ShowMoreAsync {...props} /> : <ShowMoreSync {...props} />
}

export default ShowMoreButton
