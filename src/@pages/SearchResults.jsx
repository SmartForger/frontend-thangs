import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import classnames from 'classnames'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import {
  Layout,
  NoResults,
  SaveSearchButton,
  Snackbar,
  Spacer,
  TextSearchResults,
  SearchSourceFilterActionMenu,
} from '@components'
import { useLocalStorage, useQuery } from '@hooks'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as FromThangsLogo } from '@svg/fromThangs.svg'
import { ReactComponent as GlobeIcon } from '@svg/icon-globe.svg'
import ModelSearchResults from '@components/CardCollection/ModelSearchResults'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { pageview, track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

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

const SearchResult = ({
  c,
  handleFindRelated,
  handleReportModel,
  isError,
  isLoading = true,
  modelId,
  models,
  searchModelFileName,
}) => {
  const filteredModels =
    models && models.length
      ? models.filter(model => model.resultSource !== 'phyndexer' || model.attributionUrl)
      : []
  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <GlobeIcon />
        <span className={c.SearchResults_ResultsHeaderText}>
          {modelId ? 'Similar geometry found elsewhere' : 'Models found elsewhere'}
        </span>
      </div>
      {isLoading ? (
        <NoResults>Searching 1,000,000+ models...</NoResults>
      ) : isError ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <>
          {filteredModels && filteredModels.length > 0 ? (
            <ModelSearchResults
              handleFindRelated={handleFindRelated}
              handleReportModel={handleReportModel}
              items={filteredModels}
              searchModelFileName={searchModelFileName}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
            />
          ) : null}
        </>
      )}
      {!isLoading && !isError && filteredModels.length === 0 ? (
        <NoResults>
          No results found. <b>Save your search</b> and we will notify you when there are
          matches.
        </NoResults>
      ) : null}
    </div>
  )
}

const ThangsSearchResult = ({
  c,
  handleFindRelated,
  handleReportModel,
  isError,
  isLoading = true,
  isOtherModelsLoaded,
  modelId,
  models,
  searchModelFileName,
}) => {
  const searchingText = useMemo(() => {
    return isOtherModelsLoaded
      ? `We are still searching the Thangs database, in the meantime - check out our
    public database search results below`
      : 'We are searching the Thangs database...'
  }, [isOtherModelsLoaded])
  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <UploadIcon className={classnames({ [c.Spinner]: isLoading })} />
        <span className={c.SearchResults_ResultsHeaderText}>
          {modelId ? 'Similar geometry' : 'Models'}
          <FromThangsLogo className={c.SearchResults_FromThangsLogo} />
        </span>
      </div>
      {isLoading ? (
        <NoResults>{searchingText}</NoResults>
      ) : isError ? (
        <>
          {modelId && (
            <NoResults>
              Error! We were not able to load results. Please try again later.
            </NoResults>
          )}
        </>
      ) : (
        <>
          {models && models.length > 0 ? (
            <ModelSearchResults
              handleFindRelated={handleFindRelated}
              handleReportModel={handleReportModel}
              items={models}
              searchModelFileName={searchModelFileName}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
              showLoadMore={true}
            />
          ) : null}
        </>
      )}
      {!isLoading && !isError && models.length === 0 ? (
        <NoResults>
          No results found. <b>Save your search</b> and we will notify you when there are
          matches.
        </NoResults>
      ) : null}
    </div>
  )
}
const finiteScrollCount = 8
const isBottom = el => el.getBoundingClientRect().bottom <= window.innerHeight
const Page = () => {
  const FILTER_DEFAULT = 'all'
  const containerRef = useRef(null)
  const c = useStyles()
  const [numOfPage, setNumOfPage] = useState(0)
  const [endOfModels, setEndOfModels] = useState(false)
  const [currentUser] = useLocalStorage('currentUser', null)
  const history = useHistory()
  const filter = useQuery('filter')
  const { searchQuery } = useParams()
  const modelId = useQuery('modelId')
  const phynId = useQuery('phynId')
  const related = useQuery('related')
  const { setOverlay, setOverlayOpen } = useOverlay()
  const { dispatch, searchResults, searchSubscriptions, modelsStats } = useStoreon(
    'searchResults',
    'searchSubscriptions',
    'modelsStats'
  )
  const { phyndexer, text, thangs } = searchResults
  const [searchScope, setSearchScope] = useState(FILTER_DEFAULT)

  useEffect(() => {
    if (filter) {
      setSearchScope(filter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnFinish = useCallback(data => {
    if (!data.length) setEndOfModels(true)
  }, [])

  useEffect(() => {
    if (related) {
      pageview('SearchResults Related')
    } else if (modelId) {
      pageview('SearchResults Model')
    } else {
      pageview('SearchResults Text')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!modelId && !phynId) {
      history.push(`?filter=${searchScope}`)
      dispatch(types.GET_TEXT_SEARCH_RESULTS, {
        searchTerm: decodeURIComponent(searchQuery),
        scope: searchScope,
      })

      const trackScrolling = () => {
        const wrappedElement = containerRef.current
        if (
          isBottom(wrappedElement) &&
          !isLoading &&
          !endOfModels &&
          numOfPage < finiteScrollCount
        ) {
          dispatch(types.GET_TEXT_SEARCH_RESULTS, {
            searchTerm: decodeURIComponent(searchQuery),
            scope: searchScope,
            onFinish: handleOnFinish,
          })
          setNumOfPage(numOfPage + 1)
        }
      }

      document.addEventListener('scroll', trackScrolling)
      trackScrolling()
      return () => {
        document.removeEventListener('scroll', trackScrolling)
      }
    }
    if (modelId || phynId) {
      dispatch(types.GET_RELATED_MODELS, {
        modelId: modelId,
        phyndexerId: phynId,
        geoRelated: !related,
        scope: searchScope,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, modelId, searchScope])

  const handleReportModel = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'reportModel',
        data: {
          model: model,
          afterSend: () => {
            setOverlayOpen(false)
          },
        },
      })
    },
    [setOverlay, setOverlayOpen]
  )

  const handleFindRelated = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'searchByUpload',
        data: {
          model,
        },
      })
    },
    [setOverlay]
  )

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

  const thangsModels = R.path(['data'], thangs) || []
  const phyndexerModels = R.path(['data'], phyndexer) || []
  const textModels = R.path(['data'], text) || []
  const resultCount = phyndexerModels.length + thangsModels.length + textModels.length
  const isLoading = thangs.isLoading || phyndexer.isLoading || text.isLoading

  const handleFilterChange = useCallback(value => {
    setSearchScope(value)
    track('Search Filter Change', { filter: value })
  }, [])

  return (
    <div className={c.SearchResults_Page} ref={containerRef}>
      <div className={c.SearchResults_MainContent}>
        {searchQuery && (
          <div className={c.SearchResults_Header}>
            <div className={c.SearchResults_HeaderTextWrapper}>
              <h1 className={c.SearchResults_HeaderText}>
                {isLoading ? 'Loading' : resultCount} results for{' '}
                {decodeURIComponent(searchQuery)}
              </h1>
              <div className={c.SearchResult_ResultCountText}>
                <div className={c.SearchResults_FilterBar}>
                  Results from
                  <Spacer size='.5rem' />
                  <SearchSourceFilterActionMenu
                    selectedValue={searchScope}
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
        )}
        {searchQuery ? (
          <>
            {!modelId && (phyndexer.isLoaded || thangs.isLoaded) && <Snackbar />}
            {!modelId && !phynId ? (
              <TextSearchResults
                isError={text.isError}
                isLoaded={text.isLoaded}
                isLoading={text.isLoading}
                items={textModels}
                onFindRelated={handleFindRelated}
                onReportModel={handleReportModel}
                searchScope={searchScope}
                searchTerm={searchQuery}
                totalModelCount={
                  modelsStats && modelsStats.data && modelsStats.data.modelsIngested
                }
              />
            ) : (
              <>
                {modelId || (phynId && searchScope !== 'phyn') ? (
                  <ThangsSearchResult
                    c={c}
                    handleFindRelated={handleFindRelated}
                    onReportModel={handleReportModel}
                    isError={thangs.isError}
                    isLoading={thangs.isLoading}
                    isOtherModelsLoaded={phyndexer.isLoaded}
                    modelId={modelId}
                    models={thangsModels}
                    searchModelFileName={undefined}
                  />
                ) : null}
                {phynId && searchScope !== 'thangs' ? (
                  <SearchResult
                    c={c}
                    handleFindRelated={handleFindRelated}
                    onReportModel={handleReportModel}
                    isError={phyndexer.isError}
                    isLoading={phyndexer.isLoading}
                    modelId={modelId}
                    models={phyndexerModels}
                    searchModelFileName={undefined}
                  />
                ) : null}
              </>
            )}
          </>
        ) : (
          <NoResults>
            Begin typing to search models by name, description, owner, etc. Use search by
            model to find geometrically related matches to the model you upload.
          </NoResults>
        )}
      </div>
    </div>
  )
}

const SearchResults = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default SearchResults
