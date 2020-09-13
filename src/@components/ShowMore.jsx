import React, { useState } from 'react'
import { Button } from './Button'
import { Spinner } from './Spinner'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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
export function ShowMore({ more, className }) {
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
export function ShowMoreButton({ fetchMore }) {
  const [loading, setLoading] = useState()
  const [hadError, setHadError] = useState()
  const c = useStyles()

  const handleClick = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetchMore()
      setLoading(false)
    } catch (error) {
      setHadError(true)
    }
  }
  return (
    <Button text className={c.ShowMoreButton} onClick={handleClick}>
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
