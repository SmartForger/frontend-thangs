import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardCollection, Layout, Tabs } from '@components'
import { useCurrentUser, useQuery, useTranslations } from '@hooks'
import ModelCards from '@components/CardCollection/ModelCards'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import * as pendo from '@vendors/pendo'

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
  }
})

const Page = ({ user = {}, dispatch, modelPreviews }) => {
  const c = useStyles({})
  const [selected, setSelected] = useState('likes')
  useEffect(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy: selected })
  }, [dispatch, selected])

  const sortBy = useCallback(type => {
    setSelected(type)
    pendo.track('Sorted Models', { sortBy: type })
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

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <div className={c.Landing_Column}>
      <Tabs options={sortOptions} />
      <CardCollection
        noResultsText='We have no models to display right now. Please try again later.'
        loading={modelPreviews.isLoading}
      >
        <ModelCards items={modelPreviews.data} user={user} />
      </CardCollection>
    </div>
  )
}

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Landing = () => {
  const { dispatch, modelPreviews, modelsStats } = useStoreon(
    'modelPreviews',
    'modelsStats'
  )
  const {
    atom: { data: user },
  } = useCurrentUser()
  useEffect(() => {
    dispatch(types.FETCH_MODELS_STATS)
  }, [dispatch])
  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
  const showSignup = useQuery('showSignup')
  const { id } = useParams()
  const t = useTranslations({})

  const modelsIngested =
    modelsStats &&
    modelsStats.data &&
    modelsStats.data.modelsIngested &&
    numberWithCommas(modelsStats.data.modelsIngested)

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
    if (id) pendo.track('Explore', { referralChannel: id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      bannerText={
        modelsIngested ? `${modelsIngested} ${t('header.modelsIndexed')}` : null
      }
      showNewHero={true}
    >
      <Page user={user} dispatch={dispatch} modelPreviews={modelPreviews} />
    </Layout>
  )
}

export default Landing
