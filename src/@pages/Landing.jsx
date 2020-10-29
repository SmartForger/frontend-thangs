import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CardCollection,
  Layout,
  Spacer,
  Spinner,
  Tabs,
  TitleSecondary,
} from '@components'
import { useCurrentUser, useQuery } from '@hooks'
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
      justifyContent: 'space-between',
      marginBottom: '1rem',

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

const Page = ({ user = {}, dispatch, modelPreviews }) => {
  const c = useStyles({})
  const [selected, setSelected] = useState('likes')
  const containerRef = useRef(null)
  const isLoading = modelPreviews.isLoading

  useEffect(() => {
    pageview('Home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy: selected })
  }, [dispatch, selected])

  const trackScrolling = () => {
    const wrappedElement = containerRef.current
    if (isBottom(wrappedElement) && !isLoading) {
      dispatch(types.FETCH_MODEL_PREVIEW, { sortBy: selected })
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', trackScrolling)

    return () => {
      document.removeEventListener('scroll', trackScrolling)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortBy = useCallback(type => {
    setSelected(type)
    track('Sorted Models', { sortBy: type })
  }, [])

  const sortOptions = useMemo(() => {
    const likes = 'likes'
    const date = 'date'
    const downloaded = 'downloaded'
    return [
      {
        label: 'Popular',
        value: likes,
        selected: selected === likes,
        onClick: () => sortBy(likes),
      },
      {
        label: 'New',
        value: date,
        selected: selected === date,
        onClick: () => sortBy(date),
      },
      {
        label: 'Downloads',
        value: downloaded,
        selected: selected === downloaded,
        onClick: () => sortBy(downloaded),
      },
    ]
  }, [selected, sortBy])

  const title = useMemo(() => {
    switch (selected) {
      case 'likes':
        return 'Popular Models'
      case 'date':
        return 'New Models'
      case 'downloaded':
        return 'Most Downloaded'
      default:
        return 'Models'
    }
  }, [selected])

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
        <TitleSecondary>{title}</TitleSecondary>
        <Tabs options={sortOptions} />
      </div>

      <button
        onClick={() => {
          dispatch(types.FETCH_MODEL_PREVIEW, { sortBy: selected })
        }}
      >
        Gam-Gam!
      </button>

      <CardCollection
        noResultsText='We have no models to display right now. Please try again later.'
        isLoading={isLoading}
      >
        <ModelCards items={modelPreviews.data} user={user} />
      </CardCollection>
      <Spacer size='1rem' />
      {isLoading && <Spinner />}
    </div>
  )
}

const Landing = () => {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')
  const {
    atom: { data: user },
  } = useCurrentUser()

  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
  const showSignup = useQuery('showSignup')
  const { id } = useParams()

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
    }
    if (id) track('Explore', { referralChannel: id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout showNewHero={true}>
      <Page user={user} dispatch={dispatch} modelPreviews={modelPreviews} />
    </Layout>
  )
}

export default Landing
