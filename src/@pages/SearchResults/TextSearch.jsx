import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { NoResults, Spacer, TextSearchResults, Pill } from '@components'
import { useQuery, useInfiniteScroll, useSpotCheck } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'
import SearchHeader from './SearchHeader'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
    SearchResults_MatchingIcon: {
      marginRight: '.5rem',
    },
    SearchResults_FromThangsLogo: {
      height: '1rem',
      width: 'auto',
      marginLeft: '0.5rem',
      transform: 'translateY(3px)',

      '& path:last-child': {
        transform: 'translate(0, -12%)',
      },
    },
    SearchResult_ResultCountText: {
      ...theme.text.searchResultsHeader,
      fontSize: '.875rem',
      lineHeight: '1rem',
      color: theme.colors.grey[300],
    },
    SearchResults_BrandButton: {
      width: '100%',
    },
    SearchResults_SearchBar: {
      marginLeft: '.25rem',

      [md]: {
        marginLeft: '1rem',
        height: '100%',
      },
    },
    SearchResults_Results: {
      display: 'flex',
      flexDirection: 'column',
      margin: '1rem 0',
    },
    SearchResults_ResultsHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
      marginTop: '.5rem',
    },
    SearchResults_ResultsHeaderText: {
      ...theme.text.searchResultsHeader,
      marginLeft: '.5rem',
    },
    Spinner: {
      animation: '$spin 1.2s linear infinite',
    },
    SearchResults_ReportModelButton: {
      width: '12rem',
      marginTop: '2rem',
      alignSelf: 'flex-start',
      color: theme.colors.purple[400],

      '& > svg': {
        fill: theme.colors.purple[400],
        width: '.75rem',
      },
    },
    SearchResults_FilterBar: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

const maxScrollCount = 20
const noop = () => null
const TextSearchPage = ({ onFindRelated = noop, onReportModel = noop }) => {
  const FILTER_DEFAULT = 'all'
  const EXACT_SEARCH_DEFAULT = false
  const c = useStyles()
  const [endOfModels, setEndOfModels] = useState(false)
  const history = useHistory()
  const filter = useQuery('filter') || FILTER_DEFAULT
  const exact = useQuery('exact') || EXACT_SEARCH_DEFAULT
  const { searchQuery } = useParams()

  const { dispatch, textSearchResults, modelsStats } = useStoreon(
    'textSearchResults',
    'modelsStats'
  )

  const setSearchFilters = useCallback(
    ({ scopeFilter, exactFilter }) => {
      if (scopeFilter !== filter || `${exactFilter}` !== exact) {
        history.push(`?filter=${scopeFilter}&exact=${exactFilter}`)
      }
    },
    [filter, history, exact]
  )

  const textModels = R.path(['data'], textSearchResults) || []
  const { endOfData, isLoading, isError, pageToLoad } = textSearchResults
  const isScrollPaused = useMemo(() => !pageToLoad || isLoading || endOfData, [
    endOfData,
    isLoading,
    pageToLoad,
  ])
  const { spotCheck, spotCheckRef, setSpotCheck } = useSpotCheck('text_search_scroll', {
    searchQuery,
    filter,
  })

  useEffect(() => {
    if (spotCheck && !isLoading && spotCheckRef.current) {
      spotCheckRef.current.scrollIntoView({ block: 'center' })
    }
  }, [isLoading, spotCheck, spotCheckRef])

  useEffect(() => {
    if (!spotCheck) {
      resetScroll()
      setEndOfModels(false)
      dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
        searchTerm: decodeURIComponent(searchQuery),
        scope: filter,
        isExactMatch: exact,
        isInitial: true,
        spotCheck,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filter, exact])

  const onScroll = useCallback(() => {
    dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
      searchTerm: decodeURIComponent(searchQuery),
      scope: filter,
      isExactMatch: exact,
    })
  }, [dispatch, filter, searchQuery, exact])

  const handleLoadMore = useCallback(() => {
    dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
      searchTerm: decodeURIComponent(searchQuery),
      scope: filter,
      isExactMatch: exact,
    })
  }, [dispatch, searchQuery, filter, exact])

  const [cardHeight, setCardHeight] = useState()
  const firstCardRef = useCallback(element => {
    const height = element?.getBoundingClientRect()?.height
    setCardHeight(height ? 2 * height : undefined)
  }, [])

  const { resetScroll, isMaxScrollReached } = useInfiniteScroll({
    initialCount: 1,
    isPaused: isScrollPaused,
    maxScrollCount,
    onScroll,
    scrollBuffer: cardHeight,
  })

  const onThangsClick = useCallback(
    result => {
      setSpotCheck(result, {
        searchQuery,
        filter,
      })
    },
    [filter, searchQuery, setSpotCheck]
  )

  const models = useMemo(() => textModels.filter(model => model.attributionUrl), [
    textModels,
  ])

  return (
    <>
      {searchQuery && (
        <SearchHeader
          filter={filter}
          isExactMatchSearch={exact.toLowerCase() === 'true'}
          setFilters={setSearchFilters}
          isLoading={isLoading}
          resultCount={models.length}
          endOfModels={endOfModels}
          searchQuery={searchQuery}
          showExactSearchFilter
        />
      )}
      {searchQuery ? (
        <>
          <TextSearchResults
            isError={isError}
            isLoading={isLoading}
            items={models}
            onThangsClick={onThangsClick}
            onFindRelated={onFindRelated}
            onReportModel={onReportModel}
            searchScope={filter}
            searchTerm={searchQuery}
            spotCheckIndex={spotCheck}
            spotCheckRef={spotCheckRef}
            firstCardRef={firstCardRef}
            totalModelCount={
              modelsStats && modelsStats.data && modelsStats.data.modelsIngested
            }
          />
          {isMaxScrollReached && (
            <div className={c.Landing_LoadMore}>
              <Spacer size='2rem' />
              <Pill onClick={handleLoadMore}>More Thangs</Pill>
            </div>
          )}
        </>
      ) : (
        <NoResults>
          Begin typing to search models by name, description, owner, etc. Use search by
          model to find geometrically related matches to the model you upload.
        </NoResults>
      )}
    </>
  )
}

export default TextSearchPage
