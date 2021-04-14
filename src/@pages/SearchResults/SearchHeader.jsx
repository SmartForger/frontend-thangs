import React, { useCallback, useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import {
  ContainerRow,
  SaveSearchButton,
  Spacer,
  SearchSourceFilterActionMenu,
} from '@components'
import { useLocalStorage } from '@hooks'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { createUseStyles } from '@physna/voxel-ui/@style'
import Skeleton from '@material-ui/lab/Skeleton'

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
      color: theme.colors.purple[900],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      [md]: {
        alignItems: 'center',
        flexDirection: 'row',
      },
    },
    SearchResults_HeaderTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    SearchResults_HeaderText: {
      ...theme.text.searchResultsHeader,
      display: 'flex',
      flexWrap: 'wrap',
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
      flexWrap: 'wrap',
    },
    SearchResults_FilterButton: {
      width: '100%',
    },
    SearchResults_SearchTerm: {
      color: theme.colors.black[900],
    },
    SearchResults_SearchText: {
      textDecoration: 'underline',
    },
    SearchHeader_TabFilter: {
      marginTop: '1rem',

      [md]: {
        marginTop: 0,
      },
    },
    SearchResults_Button_Skeleton: {
      width: '12rem',
      height: '3rem !important',
      flexDirection: 'column',
      borderRadius: '.5rem',
    },
    SearchResults_Text_Skeleton: {
      width: '12rem',
      height: '2rem !important',
      marginTop: '.25rem',
      borderRadius: '.5rem',
      flexDirection: 'column',
    },
  }
})
const noop = () => null

const ParsedSearchQuery = ({ searchQuery, className }) => {
  const decodedQuery = decodeURIComponent(searchQuery)

  return <ContainerRow className={className}>&quot;{decodedQuery}&quot;</ContainerRow>
}

const ControlSearchHeader = ({
  disabled,
  filter,
  onFilterChange = noop,
  isLoading = true,
  endOfModels = true,
  modelId,
  resultCount,
  searchQuery,
  currentUser,
  openSignupOverlay = noop,
}) => {
  const c = useStyles()
  const { dispatch, searchSubscriptions } = useStoreon('searchSubscriptions')

  return (
    <div className={c.SearchResults_Header}>
      <div className={c.SearchResults_HeaderTextWrapper}>
        <h1 className={c.SearchResults_HeaderText}>
          {isLoading ? 'Loading' : resultCount}
          {!isLoading && !endOfModels ? '+' : ''} results for
          <Spacer size='0.25rem' />
          <ParsedSearchQuery
            searchQuery={searchQuery}
            className={c.SearchResults_SearchTerm}
          />
        </h1>
        <Spacer size='0.25rem' />
        <div className={c.SearchResult_ResultCountText}>
          <div className={c.SearchResults_FilterBar}>
            Results from
            <Spacer size='.25rem' />
            <SearchSourceFilterActionMenu
              disabled={disabled}
              selectedValue={filter}
              onChange={onFilterChange}
              thin
            />
          </div>
        </div>
      </div>
      <Spacer size='0' mobileSize='1rem' />
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

const TabSearchHeader = ({
  disabled,
  filter,
  onFilterChange = noop,
  isLoading = true,
  modelId,
  resultCount,
  searchQuery,
  currentUser,
  openSignupOverlay = noop,
}) => {
  const c = useStyles()
  const { dispatch, searchSubscriptions } = useStoreon('searchSubscriptions')
  return (
    <div className={c.SearchResults_Header}>
      <div className={c.SearchResults_HeaderTextWrapper}>
        <h1 className={c.SearchResults_HeaderText}>Search results</h1>

        <div className={c.SearchResult_ResultCountText}>
          <div className={c.SearchResults_FilterBar}>
            {isLoading ? 'Loading' : `At least ${resultCount}`} results for{' '}
            <Spacer size='0.25rem' />
            <ParsedSearchQuery
              searchQuery={searchQuery}
              className={c.SearchResults_SearchTerm}
            />
            <Spacer size={'.5rem'} />
            <SaveSearchButton
              currentUser={currentUser}
              dispatch={dispatch}
              modelId={modelId}
              openSignupOverlay={openSignupOverlay}
              searchSubscriptions={searchSubscriptions}
              searchTerm={searchQuery}
              iconOnly={true}
            />
          </div>
        </div>
      </div>
      <Spacer size='0' mobileSize='0.25rem' />
      <ContainerRow className={c.SearchHeader_TabFilter}>
        <SearchSourceFilterActionMenu
          selectedValue={filter}
          onChange={onFilterChange}
          disabled={disabled}
          className={c.SearchResults_FilterButton}
        />
      </ContainerRow>
    </div>
  )
}

const SearchHeaderSkeleton = () => {
  const c = useStyles()
  return (
    <div className={c.SearchResults_Header}>
      <div className={c.SearchResults_HeaderTextWrapper}>
        <Skeleton variant='rect' className={c.SearchResults_Text_Skeleton} />
        <div className={c.SearchResult_ResultCountText}>
          <Skeleton variant='rect' className={c.SearchResults_Text_Skeleton} />
        </div>
      </div>
      <Skeleton variant='rect' className={c.SearchResults_Button_Skeleton} />
    </div>
  )
}

const SearchHeader = ({
  filter,
  isLoading = true,
  endOfModels = true,
  modelId,
  resultCount,
  searchQuery,
  setFilters = noop,
}) => {
  const [filterExperimentType, setFilterExperimentType] = useState('control')
  const { experiments } = useStoreon('experiments')
  const [currentUser] = useLocalStorage('currentUser', null)
  const { setOverlay } = useOverlay()

  useEffect(() => {
    if (experiments?.data?.search_header_filter === 'tab') setFilterExperimentType('tab')
  }, [experiments])

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
      setFilters({ scopeFilter: value })
      track('Search Filter Change', { filter: value })
    },
    [setFilters]
  )

  return (
    <>
      {experiments?.isLoading ? (
        <SearchHeaderSkeleton />
      ) : filterExperimentType === 'control' ? (
        <ControlSearchHeader
          disabled={isLoading}
          filter={filter}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          endOfModels={endOfModels}
          modelId={modelId}
          resultCount={resultCount}
          searchQuery={searchQuery}
          currentUser={currentUser}
          openSignupOverlay={openSignupOverlay}
        />
      ) : (
        <TabSearchHeader
          disabled={isLoading}
          filter={filter}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          endOfModels={endOfModels}
          modelId={modelId}
          resultCount={resultCount}
          searchQuery={searchQuery}
          currentUser={currentUser}
          openSignupOverlay={openSignupOverlay}
        />
      )}
    </>
  )
}

export default SearchHeader
