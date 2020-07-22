import React, { useState } from 'react'
import { TextButton } from './Button'
import { Spinner } from './Spinner'
import { linkText } from '../@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    ShowMoreButton: {
      ...linkText,
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
    <div className={c.ShowMoreButton}>
      <TextButton onClick={() => setShouldShowMore(true)}>Show More</TextButton>
    </div>
  )
}

// Used for Server-Side Controlled Pagination - Async
export function ShowMoreButton({ fetchMore }) {
  const [loading, setLoading] = useState()
  const [hadError, setHadError] = useState()
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
    <TextButton className={c.ShowMoreButton} onClick={handleClick}>
      {hadError ? (
        'Server Error'
      ) : loading ? (
        <Spinner className={c.ShowMoreButton_Spinner} />
      ) : (
        'Show More'
      )}
    </TextButton>
  )
}
