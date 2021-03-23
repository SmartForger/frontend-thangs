import React, { useEffect } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui'
import classnames from 'classnames'
import {
  CardCollectionSearch,
  SearchCards,
  Spinner,
  Spacer,
  TitleTertiary,
} from '@components'
import * as types from '@constants/storeEventTypes'
import { pageview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    SavedSearches: {
      display: 'flex',
      flexDirection: 'row',
    },
    SavedSearches_Content: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      [md]: {
        minWidth: '56rem',
      },
    },
    SavedSearches_Spinner: {
      marginTop: '10rem',
    },
  }
})

const SavedSearches = ({ className }) => {
  const c = useStyles({})
  const { dispatch, searchSubscriptions } = useStoreon('searchSubscriptions')
  const { data: savedSearches, isLoaded, isError } = searchSubscriptions

  useEffect(() => {
    pageview('MyThangs - SavedSearches')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(types.FETCH_SUBSCRIPTIONS)
  }, [dispatch])

  if (!isLoaded) {
    return (
      <main className={classnames(className, c.SavedSearches)}>
        <Spinner className={c.SavedSearches_Spinner} />
      </main>
    )
  }

  if (isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (R.isEmpty(savedSearches)) {
    return (
      <div className={c.Profile_NoContentMessage}>
        Get notifications when more results are added by saving your
        <a href='/search'>
          <span className={c.Profile_NoContentMessage__link}>search.</span>
        </a>{' '}
        Find it on the search results page.
      </div>
    )
  }

  return (
    <main className={classnames(className, c.SavedSearches)}>
      <Spacer size='2rem' />
      <div className={c.SavedSearches_Content}>
        <Spacer size='2rem' />
        <TitleTertiary>Saved Searches</TitleTertiary>
        <Spacer size='2rem' />
        <CardCollectionSearch
          cardWidth={'22.5rem'}
          noResultsText='You have not saved and searches yet.'
        >
          <SearchCards items={savedSearches} />
        </CardCollectionSearch>
      </div>
    </main>
  )
}

export default SavedSearches
