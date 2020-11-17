import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  CardCollection,
  Layout,
  Spacer,
  Spinner,
  TitleSecondary,
  FilterDropdown,
  FilterDropdownMenu,
} from '@components'
import { useCurrentUser, usePageMeta, useQuery } from '@hooks'
import ModelCards from '@components/CardCollection/ModelCards'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { pageview, track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Landing: {},
    Landing_Hero: {
      display: 'flex',
      padding: '1.5rem 2rem',
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      background: theme.colors.purple[900],

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
      maxWidth: '42rem',
      minWidth: 0,
      marginTop: '1.5rem',

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
      top: '-6rem',
      right: 0,
    },
    Landing_Column: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    Landing_Title: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      justifyContent: 'flex-end',

      [md]: {
        justifyContent: 'space-between',
      },

      '& h2': {
        display: 'none',
        [md]: {
          display: 'block',
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
  const { isLoading } = modelPreviews

  useEffect(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy, isInitial: true })
  }, [dispatch, sortBy])

  useEffect(() => {
    const trackScrolling = () => {
      const wrappedElement = containerRef.current
      if (isBottom(wrappedElement) && !isLoading) {
        dispatch(types.FETCH_MODEL_PREVIEW, { sortBy })
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

      <CardCollection
        noResultsText='We have no models to display right now. Please try again later.'
        isLoading={isLoading}
      >
        <ModelCards items={modelPreviews.data} />
      </CardCollection>

      <Spacer size='1rem' />
      {isLoading && <Spinner />}
    </div>
  )
}

const Landing = ({ newSignUp }) => {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')
  const {
    atom: { data: user },
  } = useCurrentUser()

  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
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

  useEffect(() => {
    if (newSignUp) {
      pageview('Welcome')
    } else if (id) {
      pageview('Explore')
    } else {
      pageview('Home')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (sessionExpired || authFailed)
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signIn',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: false,
          sessionExpired,
          authFailed,
        },
      })
    if (showSignup) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signUp',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: true,
        },
      })
    } else if (showSignin) {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'signIn',
        overlayData: {
          animateIn: true,
          windowed: true,
          showPromo: false,
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
      <Page
        user={user}
        dispatch={dispatch}
        modelPreviews={modelPreviews}
        sortBy={sortBy || 'likes'}
      />
    </Layout>
  )
}

export default Landing
