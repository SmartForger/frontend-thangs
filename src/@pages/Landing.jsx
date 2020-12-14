import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useFeature } from '@optimizely/react-sdk'
import {
  Layout,
  Spacer,
  Spinner,
  TitleSecondary,
  FilterDropdown,
  FilterDropdownMenu,
  ModelCardLanding,
  CardCollectionLanding,
} from '@components'

import { useCurrentUser, usePageMeta, usePerformanceMetrics, useQuery } from '@hooks'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { pageview, track, perfTrack } from '@utilities/analytics'

const MQS_VALUES = [1440, 964, 736, 490]

const Landing_Title_MQs = MQS_VALUES.reduce((acc, item) => {
  return { [`@media (min-width: ${item}px)`]: { width: item - 32 }, ...acc }
}, {})

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Landing: {},
    Landing_Hero: {
      background: theme.colors.purple[900],
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '1.5rem 2rem',
      position: 'relative',

      [md]: {
        padding: '5rem 6rem',
      },
    },
    Landing_TextContainer: {
      maxWidth: theme.variables.maxWidth,
      width: '100%',
      zIndex: 2,
    },
    Landing_PromotionalText: {
      fontFamily: theme.variables.fonts.headerFont,
    },
    Landing_PromotionalPrimaryText: {
      ...theme.text.landingPageText,
      fontSize: '2rem',

      [md]: {
        fontSize: '4rem',
      },
    },
    Landing_PromotionalSecondaryText: {
      ...theme.text.landingPageSubtext,
      marginTop: '1.5rem',
      maxWidth: '42rem',
      minWidth: 0,

      [md]: {
        minWidth: '27.125rem',
      },
    },
    Landing_SearchByModelUploadButton: {
      display: 'none',
      marginTop: '1.5rem',
      [md]: { display: 'block' },
    },
    Landing_SearchByModelUploadButton_UploadIcon: {
      marginRight: '.5rem',

      '& path': {
        fill: theme.colors.purple[900],
        stroke: theme.colors.purple[900],
      },
    },
    Landing_Background: {
      position: 'absolute',
      right: 0,
      top: '-6rem',
    },
    Landing_Column: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    Landing_Title: {
      ...Landing_Title_MQs,
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      width: '100%',

      '& h2': {
        fontSize: '1.25rem',
        [md]: {
          fontSize: '2.25rem',
        },
      },
    },
  }
})

const isBottom = el => el.getBoundingClientRect().bottom <= window.innerHeight
const sortTypes = {
  likes: 'likes',
  date: 'date',
  downloaded: 'downloaded',
  trending: 'trending',
}

const title = sortBy => {
  switch (sortBy) {
    case sortTypes.likes:
      return 'Popular Models'
    case sortTypes.trending:
      return 'Trending Models'
    case sortTypes.date:
      return 'New Models'
    case sortTypes.downloaded:
      return 'Most Downloaded'
    default:
      return 'Models'
  }
}

const label = sortBy => {
  switch (sortBy) {
    case sortTypes.likes:
      return 'Popular'
    case sortTypes.trending:
      return 'Trending'
    case sortTypes.date:
      return 'New'
    case sortTypes.downloaded:
      return 'Downloads'
    default:
      return 'Models'
  }
}

const Page = ({ user = {}, dispatch, modelPreviews = {}, sortBy }) => {
  const c = useStyles({})
  const containerRef = useRef(null)
  const history = useHistory()
  const [endOfModels, setEndOfModels] = useState(false)
  const { isLoading } = modelPreviews

  const handleOnFinish = useCallback(data => {
    if (!data.length) setEndOfModels(true)
  }, [])

  useEffect(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, {
      sortBy,
      isInitial: true,
      onFinish: handleOnFinish,
    })
  }, [dispatch, handleOnFinish, sortBy])

  useEffect(() => {
    const trackScrolling = () => {
      const wrappedElement = containerRef.current
      if (isBottom(wrappedElement) && !isLoading && !endOfModels) {
        dispatch(types.FETCH_MODEL_PREVIEW, { sortBy, onFinish: handleOnFinish })
      }
    }

    document.addEventListener('scroll', trackScrolling)
    trackScrolling()
    return () => {
      document.removeEventListener('scroll', trackScrolling)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoading, sortBy])

  const handleSortBy = useCallback(
    type => {
      history.push(`/?sort=${type}`)
      track('Sorted Models', { sortBy: type })
      setEndOfModels(false)
    },
    [history]
  )

  const sortOptions = useMemo(() => {
    return [
      {
        label: 'Popular',
        value: sortTypes.likes,
        selected: sortBy === sortTypes.likes,
        onClick: () => handleSortBy(sortTypes.likes),
      },
      {
        label: 'Trending',
        value: sortTypes.trending,
        selected: sortBy === sortTypes.trending,
        onClick: () => handleSortBy(sortTypes.trending),
      },
      {
        label: 'New',
        value: sortTypes.date,
        selected: sortBy === sortTypes.date,
        onClick: () => handleSortBy(sortTypes.date),
      },
      {
        label: 'Downloads',
        value: sortTypes.downloaded,
        selected: sortBy === sortTypes.downloaded,
        onClick: () => handleSortBy(sortTypes.downloaded),
      },
    ]
  }, [handleSortBy, sortBy])

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <div className={c.Landing_Column} ref={containerRef}>
      <>
        <div className={c.Landing_Title}>
          <TitleSecondary>{title(sortBy)}</TitleSecondary>
          <FilterDropdownMenu
            user={user}
            options={sortOptions}
            TargetComponent={FilterDropdown}
            dispatch={dispatch}
            label={label(sortBy)}
          />
        </div>

        <CardCollectionLanding
          noResultsText='We have no models to display right now. Please try again later.'
          isLoading={isLoading}
        >
          {Array.isArray(modelPreviews.data) &&
            modelPreviews.data.map((model, index) => (
              <ModelCardLanding key={`model-${model.id}:${index}`} model={model} />
            ))}
        </CardCollectionLanding>
      </>
    </div>
  )
}

const Landing = ({ newSignUp, isLoadingOptimizely }) => {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')
  const {
    atom: { data: user },
  } = useCurrentUser()
  const history = useHistory()
  const { startTimer, getTime } = usePerformanceMetrics()
  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
  const moreInfo = useQuery('moreInfo')
  const showSignin = useQuery('showSignin')
  const showSignup = useQuery('showSignup')
  const emailRedirect = useQuery('emailRedirect')
  const sortBy = useQuery('sort')
  const [hasLoaded, setHasLoaded] = useState(false)
  const pageMetaKey = useMemo(() => {
    if (sortBy) return sortBy
    if (showSignin) return 'showSignin'
    if (showSignup) return 'showSignup'
    return 'home'
  }, [showSignin, showSignup, sortBy])
  const { title, description } = usePageMeta(pageMetaKey)
  const { id } = useParams()
  // eslint-disable-next-line no-unused-vars
  const [isEnabled, variables] = useFeature('sortbydefault', { autoUpdate: true })
  const defaultSort = (variables && variables.key) || 'likes'
  useEffect(() => {
    if (newSignUp) {
      pageview('Welcome')
    } else if (id) {
      pageview('Explore')
    } else {
      pageview('Home')
    }
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (sessionExpired || authFailed) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signIn',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: false,
          sessionExpired,
          authFailed,
          smallWidth: true,
        },
      })
      history.push('/')
    }
    if (moreInfo) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'moreInfo',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: false,
        },
      })
    }
    if (showSignup) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signUp',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: true,
          smallWidth: true,
        },
      })
    } else if (showSignin) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signIn',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: false,
          smallWidth: true,
        },
      })
    }
    if (id) track('Explore', { referralChannel: id })
    if (emailRedirect) track('Email Redirect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasLoaded && modelPreviews.isLoaded) {
      setHasLoaded(true)
      perfTrack('Page Loaded - Home', getTime())
    }
  }, [getTime, hasLoaded, modelPreviews.isLoaded])

  return (
    <Layout showNewHero={true}>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Helmet>
      {!isLoadingOptimizely && (
        <Page
          user={user}
          dispatch={dispatch}
          modelPreviews={modelPreviews}
          sortBy={sortBy || defaultSort}
        />
      )}
      {isLoadingOptimizely && (
        <>
          <Spacer size={'2rem'} />
          <Spinner />
        </>
      )}
    </Layout>
  )
}

export default Landing
