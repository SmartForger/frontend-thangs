import React, { useEffect, useState } from 'react'
import * as R from 'ramda'
import { useParams } from 'react-router-dom'
import { CardCollection, Layout, Button } from '@components'
import { useCurrentUser } from '@hooks'
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
      ...theme.mixins.text.landingPageText,
      fontSize: '2rem',

      [md]: {
        fontSize: '4rem',
      },
    },
    Landing_PromotionalSecondaryText: {
      ...theme.mixins.text.landingPageSubtext,
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
    Landing_TabNavigationWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '1rem',
    },
    Landing_TabNavigation: {
      display: 'flex',
      marginBottom: '1rem',
      justifyContent: 'flex-end',
      padding: '.25rem',
      backgroundColor: theme.colors.white[400],
      borderRadius: '.5rem',
    },
  }
})

const Page = ({ user = {}, dispatch, modelPreviews }) => {
  const c = useStyles({})
  const [selected, setSelected] = useState('likes')
  useEffect(() => {
    dispatch(types.FETCH_MODEL_PREVIEW, { sortBy: selected })
  }, [dispatch, selected])

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <div className={c.Landing_Column}>
      <div className={c.Landing_TabNavigationWrapper}>
        <div className={c.Landing_TabNavigation}>
          <div>
            <Button tertiary={selected !== 'likes'} onClick={() => setSelected('likes')}>
              Popular
            </Button>
          </div>
          <div>
            <Button tertiary={selected !== 'date'} onClick={() => setSelected('date')}>
              New
            </Button>
          </div>
          <div>
            <Button
              tertiary={selected !== 'downloaded'}
              onClick={() => setSelected('downloaded')}
            >
              Downloads
            </Button>
          </div>
        </div>
      </div>
      <CardCollection
        noResultsText='We have no models to display right now. Please try again later.'
        loading={modelPreviews.isLoading}
      >
        <ModelCards items={modelPreviews.data} user={user} />
      </CardCollection>
    </div>
  )
}

const LandingHero = () => {
  const { dispatch } = useStoreon()
  const c = useStyles()

  return (
    <>
      <div className={c.Landing_Hero}>
        <BackgroundSvg className={c.Landing_Background} />
        <div className={c.Landing_TextContainer}>
          <div className={c.Landing_PromotionalText}>
            <span className={c.Landing_PromotionalPrimaryText}>
              <u className={c.Landing_PromotionalPrimaryText}>Search.</u> Collaborate.
              Share.
            </span>
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

const NewSignUpLandingHero = () => {
  const { dispatch } = useStoreon()
  const c = useStyles()

  return (
    <>
      <div className={c.Landing_Hero}>
        <BackgroundSvg className={c.Landing_Background} />
        <div className={c.Landing_TextContainer}>
          <div className={c.Landing_PromotionalText}>
            <span className={c.Landing_PromotionalPrimaryText}>
              <u className={c.Landing_PromotionalPrimaryText}>Welcome to Thangs!</u>
            </span>
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

const getHero = ({ loading, user, newSignUp }) => {
  if (!loading && R.isEmpty(user)) {
    return LandingHero
  } else if (newSignUp) {
    return NewSignUpLandingHero
  }
  return null
}

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Landing = ({ newSignUp }) => {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')
  const { modelsStats } = useStoreon('modelsStats')
  useEffect(() => {
    dispatch(types.FETCH_MODELS_STATS)
  }, [dispatch])
  const { id } = useParams()
  if (id) pendo.track('Explore', { referralChannel: id })
  const {
    atom: { data: user, isLoading: loading },
  } = useCurrentUser()
  const HeroComponent = getHero({ loading, user, newSignUp })
  const modelsIngested =
    modelsStats &&
    modelsStats.data &&
    modelsStats.data.modelsIngested &&
    numberWithCommas(modelsStats.data.modelsIngested)

  return (
    <Layout
      bannerText={modelsIngested ? `${modelsIngested} models ingested` : null}
      Hero={HeroComponent}
      showSearchTextFlash={true}
    >
      <Page user={user} dispatch={dispatch} modelPreviews={modelPreviews} />
    </Layout>
  )
}

export default Landing
