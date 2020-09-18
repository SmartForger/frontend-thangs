import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { useParams } from 'react-router-dom'
import { CardCollection, Layout, Button, Tabs } from '@components'
import { useCurrentUser, useQuery, useTranslations } from '@hooks'
import ModelCards from '@components/CardCollection/ModelCards'
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
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

const LandingHero = ({ newSignUp }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()

  return (
    <>
      <div className={c.Landing_Hero}>
        <BackgroundSvg className={c.Landing_Background} />
        <div className={c.Landing_TextContainer}>
          <div className={c.Landing_PromotionalText}>
            {newSignUp ? (
              <h1 className={c.Landing_PromotionalPrimaryText}>
                <u className={c.Landing_PromotionalPrimaryText}>Welcome to Thangs!</u>
              </h1>
            ) : (
              <h1 className={c.Landing_PromotionalPrimaryText}>
                <u className={c.Landing_PromotionalPrimaryText}>Search.</u> Collaborate.
                Share.
              </h1>
            )}
          </div>
          <div className={c.Landing_PromotionalSecondaryText}>
            Search for models in Thangs or upload your model and our powerful technology
            will find all geometrically related models. Connect with the Thangs community
            to collaborate and share 3D models.
          </div>
          <div className={c.Landing_SearchByModelUploadButton}>
            <Button
              onClick={() =>
                dispatch(types.OPEN_OVERLAY, { overlayName: 'searchByUpload' })
              }
            >
              <UploadIcon className={c.Landing_SearchByModelUploadButton_UploadIcon} />
              <span>Search by Model Upload</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const WelcomeHero = () => {
  return <LandingHero newSignUp />
}

const getHero = ({ loading, user, newSignUp }) => {
  if (!loading && R.isEmpty(user)) {
    return LandingHero
  } else if (newSignUp) {
    return WelcomeHero
  }
  return null
}

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Landing = ({ newSignUp }) => {
  const { dispatch, modelPreviews, modelsStats } = useStoreon(
    'modelPreviews',
    'modelsStats'
  )
  const {
    atom: { data: user, isLoading: loading },
  } = useCurrentUser()
  useEffect(() => {
    dispatch(types.FETCH_MODELS_STATS)
  }, [dispatch])
  const sessionExpired = useQuery('sessionExpired')
  const authFailed = useQuery('authFailed')
  const { id } = useParams()
  const HeroComponent = getHero({ loading, user, newSignUp })
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
    if (id) pendo.track('Explore', { referralChannel: id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout
      bannerText={
        modelsIngested ? `${modelsIngested} ${t('header.modelsIndexed')}` : null
      }
      Hero={HeroComponent}
      showSearchTextFlash={true}
    >
      <Page user={user} dispatch={dispatch} modelPreviews={modelPreviews} />
    </Layout>
  )
}

export default Landing
