import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import classnames from 'classnames'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import {
  Button,
  Layout,
  NoResults,
  SaveSearchButton,
  Snackbar,
  Spacer,
} from '@components'
import { useLocalStorage, useQuery } from '@hooks'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
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
  showReportModel,
}) => {
  const filteredModels =
    models && models.length
      ? models.filter(model => model.resultSource !== 'phyndexer' || model.attributionUrl)
      : []
  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
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
              showReportModel={showReportModel}
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
  showReportModel,
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
          {modelId ? 'Similar geometry on Thangs' : 'Models on Thangs'}
        </span>
      </div>
      {isLoading ? (
        <>{modelId && <NoResults>{searchingText}</NoResults>}</>
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
              showReportModel={showReportModel}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
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

const Page = () => {
  const c = useStyles()
  const [currentUser] = useLocalStorage('currentUser', null)
  const { searchQuery } = useParams()
  const modelId = useQuery('modelId')
  const phynId = useQuery('phynId')
  const related = useQuery('related')
  const { setOverlay, setOverlayOpen } = useOverlay()
  const { dispatch, searchResults, searchSubscriptions } = useStoreon(
    'searchResults',
    'searchSubscriptions'
  )
  const { phyndexer, thangs } = searchResults
  const [showReportModelButtons, setShowReportModelButtons] = useState(false)

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
    if (!modelId || !phynId) {
      dispatch(types.GET_TEXT_SEARCH_RESULTS, {
        searchTerm: decodeURIComponent(searchQuery),
      })
    }
    if ((modelId || phynId) && !phyndexer.isLoaded && !thangs.isLoaded) {
      dispatch(types.GET_RELATED_MODELS, {
        modelId: modelId,
        phyndexerId: phynId,
        geoRelated: !related,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, modelId])

  const handleReportModel = useCallback(
    ({ model }) => {
      setOverlay({
        isOpen: true,
        template: 'reportModel',
        data: {
          model: model,
          afterSend: () => {
            setShowReportModelButtons(false)
            setOverlayOpen(false)
          },
          onOverlayClose: () => {
            setShowReportModelButtons(false)
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
  const resultCount = phyndexerModels.length + thangsModels.length

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_MainContent}>
        {searchQuery && (
          <div className={c.SearchResults_Header}>
            <div className={c.SearchResults_HeaderTextWrapper}>
              <h1 className={c.SearchResults_HeaderText}>
                Search Results for {decodeURIComponent(searchQuery)}
              </h1>
              {resultCount && resultCount > 0 ? (
                <div className={c.SearchResult_ResultCountText}>
                  About {resultCount} results
                </div>
              ) : null}
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
            <ThangsSearchResult
              c={c}
              handleFindRelated={handleFindRelated}
              handleReportModel={handleReportModel}
              isError={thangs.isError}
              isLoading={thangs.isLoading}
              isOtherModelsLoaded={phyndexer.isLoaded}
              modelId={modelId}
              models={thangsModels}
              searchModelFileName={undefined}
              showReportModel={showReportModelButtons}
            />
            <SearchResult
              c={c}
              handleFindRelated={handleFindRelated}
              handleReportModel={handleReportModel}
              isError={phyndexer.isError}
              isLoading={phyndexer.isLoading}
              modelId={modelId}
              models={phyndexerModels}
              searchModelFileName={undefined}
              showReportModel={showReportModelButtons}
            />
          </>
        ) : (
          <NoResults>
            Begin typing to search models by name, description, owner, etc. Use search by
            model to find geometrically related matches to the model you upload.
          </NoResults>
        )}
        {resultCount && resultCount > 0 ? (
          <Button
            tertiary
            className={c.SearchResults_ReportModelButton}
            onClick={() => setShowReportModelButtons(!showReportModelButtons)}
          >
            <FlagIcon />
            <Spacer size='.5rem' />
            Report a Model
          </Button>
        ) : null}
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
