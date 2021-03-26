import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { NoResults, Spacer, TextSearchResults, Pill } from '@components'
import { useQuery, useInfiniteScroll, useSpotCheck } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'
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
    SearchResults_Header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: theme.colors.purple[900],
      marginBottom: '1.5rem',
    },
    SearchResults_HeaderTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    SearchResults_HeaderText: {
      ...theme.text.searchResultsHeader,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      color: theme.colors.purple[900],
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
  const c = useStyles()
  const [endOfModels, setEndOfModels] = useState(false)
  const history = useHistory()
  const filter = useQuery('filter')
  const { searchQuery } = useParams()

  const { dispatch, textSearchResults, modelsStats } = useStoreon(
    'textSearchResults',
    'modelsStats'
  )

  const [searchScope, setSearchScope] = useState(filter || FILTER_DEFAULT)

  const textModels = R.path(['data'], textSearchResults) || []
  const isLoading = textSearchResults.isLoading
  const isScrollPaused = useMemo(() => isLoading || endOfModels, [endOfModels, isLoading])
  const { spotCheck, spotCheckRef, setSpotCheck } = useSpotCheck('text_search_scroll', {
    searchQuery,
    filter,
  })

  useEffect(() => {
    if (filter) {
      setSearchScope(filter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (spotCheck && !textSearchResults.isLoading && spotCheckRef.current) {
      spotCheckRef.current.scrollIntoView({ block: 'center' })
    }
  }, [textSearchResults.isLoading, spotCheck, spotCheckRef])

  const handleFinish = useCallback(data => {
    if (data.endOfData) setEndOfModels(true)
  }, [])

  useEffect(() => {
    if (!spotCheck) {
      resetScroll()
      history.push(`?filter=${searchScope}`)
      dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
        searchTerm: decodeURIComponent(searchQuery),
        scope: searchScope,
        pageCount: 1, //savedPages || 1,
        isInitial: true,
        onFinish: handleFinish,
        spotCheck,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchScope])

  const onScroll = useCallback(() => {
    dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
      searchTerm: decodeURIComponent(searchQuery),
      scope: searchScope,
      onFinish: handleFinish,
    })
    track('Infinite Load - Search', { searchTerm: searchQuery, searchScope })
  }, [dispatch, handleFinish, searchQuery, searchScope])

  const handleLoadMore = useCallback(() => {
    dispatch(types.FETCH_TEXT_SEARCH_RESULTS, {
      searchTerm: decodeURIComponent(searchQuery),
      scope: searchScope,
      onFinish: handleFinish,
    })
    track('More Thangs - Search', { searchTerm: searchQuery, searchScope })
  }, [dispatch, handleFinish, searchQuery, searchScope])

  const { resetScroll, isMaxScrollReached } = useInfiniteScroll({
    initialCount: 1, //savedPages,
    isPaused: isScrollPaused,
    maxScrollCount,
    onScroll,
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
          isLoading={textSearchResults.isLoading}
          resultCount={models.length}
          endOfModels={endOfModels}
          searchQuery={searchQuery}
          setFilter={setSearchScope}
        />
      )}
      {searchQuery ? (
        <>
          <TextSearchResults
            isError={textSearchResults.isError}
            isLoaded={textSearchResults.isLoaded}
            isLoading={textSearchResults.isLoading}
            items={models}
            onThangsClick={onThangsClick}
            onFindRelated={onFindRelated}
            onReportModel={onReportModel}
            searchScope={searchScope}
            searchTerm={searchQuery}
            spotCheckIndex={spotCheck}
            spotCheckRef={spotCheckRef}
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
