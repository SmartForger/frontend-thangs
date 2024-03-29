import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import {
  CardCollectionLanding,
  LandingSortActionMenu,
  Layout,
  ModelCardLanding,
  Pill,
  Spacer,
} from '@components'
import {
  useCurrentUser,
  usePageMeta,
  usePerformanceMetrics,
  useQuery,
  useInfiniteScroll,
} from '@hooks'
import * as types from '@constants/storeEventTypes'
import * as sortTypes from '@constants/sortTypes'
import { pageview, track, perfTrack } from '@utilities/analytics'
import { useOverlay, useSpotCheck } from '@hooks'

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
      zIndex: '2',
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
    Landing_LoadMore: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  }
})

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
const noop = () => null
const maxScrollCount = 10

const Page = ({ sortBy, getTime = noop }) => {
  const c = useStyles({})
  const history = useHistory()
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')
  const { isLoading, isLoaded } = modelPreviews
  const [endOfModels, setEndOfModels] = useState(false)
  const [loadedCount, setLoadedCount] = useState(isLoaded ? -1 : 0)
  const isScrollPaused = useMemo(() => isLoading || endOfModels, [endOfModels, isLoading])
  const { spotCheck, spotCheckRef, setSpotCheck } = useSpotCheck('landing_scroll', {
    sortBy,
  })

  useEffect(() => {
    if (spotCheck && !isLoading && isLoaded && spotCheckRef.current) {
      spotCheckRef.current.scrollIntoView({ block: 'center' })
    }
  }, [isLoaded, isLoading, spotCheck, spotCheckRef])

  useEffect(() => {
    if (loadedCount < 1 && isLoaded) {
      setLoadedCount(loadedCount + 1)
    }

    if (loadedCount > 0 && isLoaded) {
      perfTrack('Page Loaded - Home', getTime())
    }
  }, [getTime, loadedCount, isLoaded])

  const handleFinish = useCallback(
    data => {
      if (!data.length) setEndOfModels(true)
    },
    [setEndOfModels]
  )

  useEffect(() => {
    if (!spotCheck) {
      resetScroll()
      setEndOfModels(false)
      dispatch(types.FETCH_MODEL_PREVIEW, {
        isInitial: true,
        onFinish: handleFinish,
        sortBy,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, handleFinish, sortBy])

  const onScroll = useCallback(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy, onFinish: handleFinish })
  }, [dispatch, handleFinish, sortBy])

  const [cardHeight, setCardHeight] = useState()
  const firstCardRef = useCallback(element => {
    const height = element?.getBoundingClientRect()?.height
    setCardHeight(height ? 2 * height : undefined)
  }, [])
  const { resetScroll, isMaxScrollReached } = useInfiniteScroll({
    initialCount: 1, //savedPages,
    isPaused: isScrollPaused,
    maxScrollCount,
    onScroll,
    scrollBuffer: cardHeight,
  })

  const handleClick = useCallback(
    spot => {
      setSpotCheck(spot, { sortBy })
    },
    [setSpotCheck, sortBy]
  )

  const handleSortBy = useCallback(
    type => {
      history.push(`/?sort=${type}`)
      track('Sorted Models', { sortBy: type })
    },
    [history]
  )

  const handleLoadMore = useCallback(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy, onFinish: handleFinish })
    track('More Thangs - Landing')
  }, [dispatch, handleFinish, sortBy])

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <div className={c.Landing_Column}>
      <div className={c.Landing_Title}>
        <Title headerLevel={HeaderLevel.secondary}>{title(sortBy)}</Title>
        <LandingSortActionMenu selectedValue={sortBy} onChange={handleSortBy} />
      </div>

      <CardCollectionLanding
        noResultsText='We have no models to display right now. Please try again later.'
        isLoading={isLoading}
      >
        {Array.isArray(modelPreviews.data) &&
          modelPreviews.data.map((model, index) => {
            if (!model) return null
            return (
              <ModelCardLanding
                key={`model-${model.id}:${index}`}
                model={model}
                onClick={handleClick}
                spotCheckIndex={index}
                spotCheckRef={spotCheck === index ? spotCheckRef : undefined}
                firstCardRef={index === 0 ? firstCardRef : undefined}
              />
            )
          })}
      </CardCollectionLanding>
      {isMaxScrollReached && (
        <div className={c.Landing_LoadMore}>
          <Spacer size='2rem' />
          <Pill onClick={handleLoadMore}>More Thangs</Pill>
        </div>
      )}
    </div>
  )
}

const Landing = ({ newSignUp }) => {
  const { setOverlay } = useOverlay()
  const {
    atom: { data: user },
  } = useCurrentUser()
  const history = useHistory()
  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
  const moreInfo = useQuery('moreInfo')
  const showSignin = useQuery('showSignin')
  const showSignup = useQuery('showSignup')
  const emailRedirect = useQuery('emailRedirect')
  const sortBy = useQuery('sort')
  const pageMetaKey = useMemo(() => {
    if (sortBy) return sortBy
    if (showSignin) return 'showSignin'
    if (showSignup) return 'showSignup'
    return 'home'
  }, [showSignin, showSignup, sortBy])
  const { title, description } = usePageMeta(pageMetaKey)
  const { id } = useParams()
  const { startTimer, getTime } = usePerformanceMetrics()
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
      setOverlay({
        isOpen: true,
        template: 'signIn',
        data: {
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
      setOverlay({
        isOpen: true,
        template: 'moreInfo',
        data: {
          animateIn: true,
          windowed: true,
          showPromo: false,
        },
      })
    }
    if (showSignup) {
      setOverlay({
        isOpen: true,
        template: 'signUp',
        data: {
          animateIn: true,
          windowed: true,
          showPromo: true,
          smallWidth: true,
        },
      })
    } else if (showSignin) {
      setOverlay({
        isOpen: true,
        template: 'signIn',
        data: {
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

  return (
    <Layout showNewHero={true}>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Helmet>
      <Page getTime={getTime} user={user} sortBy={sortBy || 'trending'} />
    </Layout>
  )
}

export default Landing
