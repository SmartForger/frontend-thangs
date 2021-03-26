import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { SaveSearchButton, Spacer, SearchSourceFilterActionMenu } from '@components'
import { useLocalStorage } from '@hooks'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'

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
    SearchResults_Page: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    SearchResults_MainContent: {
      width: '100%',
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
const noop = () => null
const SearchHeader = ({
  filter,
  isLoading = true,
  endOfModels = true,
  modelId,
  resultCount,
  searchQuery,
  setFilter = noop,
}) => {
  const c = useStyles()
  const { dispatch, searchSubscriptions } = useStoreon('searchSubscriptions')
  const [currentUser] = useLocalStorage('currentUser', null)
  const { setOverlay } = useOverlay()

  const openSignupOverlay = useCallback(() => {
    setOverlay({
      isOpen: true,
      template: 'signUp',
      data: {
        animateIn: true,
        smallWidth: true,
        source: 'Save Search',
        titleMessage: 'Join to subscribe to new search results alerts.',
        windowed: true,
      },
    })
    track('SignUp Prompt Overlay', { source: 'Save Search' })
  }, [setOverlay])

  const handleFilterChange = useCallback(
    value => {
      setFilter(value)
      track('Search Filter Change', { filter: value })
    },
    [setFilter]
  )

  return (
    <div className={c.SearchResults_Header}>
      <div className={c.SearchResults_HeaderTextWrapper}>
        <h1 className={c.SearchResults_HeaderText}>
          {isLoading ? 'Loading' : resultCount}
          {!isLoading && !endOfModels ? '+' : ''} results for{' '}
          {decodeURIComponent(searchQuery)}
        </h1>
        <div className={c.SearchResult_ResultCountText}>
          <div className={c.SearchResults_FilterBar}>
            Results from
            <Spacer size='.5rem' />
            <SearchSourceFilterActionMenu
              selectedValue={filter}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
      <SaveSearchButton
        currentUser={currentUser}
        dispatch={dispatch}
        modelId={modelId}
        openSignupOverlay={openSignupOverlay}
        searchSubscriptions={searchSubscriptions}
        searchTerm={searchQuery}
      />
    </div>
  )
}

export default SearchHeader