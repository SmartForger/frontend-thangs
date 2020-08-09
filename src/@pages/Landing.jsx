import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CardCollection, Layout, Button } from '@components'
import { useCurrentUser } from '@hooks'
import ModelCards from '@components/CardCollection/ModelCards'
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg'
import { ReactComponent as MatchingIcon } from '@svg/matching-icon.svg'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Landing: {},
    Landing_Hero: {
      display: 'flex',
      padding: '5rem 6rem',
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      background: theme.colors.purple[900],
    },
    Landing_HeaderBackground: {
      background: theme.variables.colors.invertedHeaderBackground,
      height: '5rem',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
      overflow: 'hidden',
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
    },
    Landing_PromotionalSecondaryText: {
      ...theme.mixins.text.landingPageSubtext,
      maxWidth: '42rem',
      minWidth: '27.125rem',
      marginTop: '1.5rem',
    },
    Landing_SearchByModelUploadButton: { marginTop: '1.5rem' },
    Landing_SearchByModelUploadButton_MatchingIcon: { marginRight: '.5rem' },
    Landing_Spacer: { height: '6.25rem' },
    Landing_BackgroundWrapper: {
      background: theme.variables.colors.invertedHeaderBackground,
      height: '6rem',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
      overflow: 'hidden',
    },
    Landing_Background: {
      position: 'absolute',
      top: '-6rem',
      right: 0,
    },
  }
})

function Page() {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')

  useEffect(() => {
    dispatch('fetch-model-previews')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <CardCollection
      noResultsText='We have no models to display right now. Please try again later.'
      loading={modelPreviews.isLoading}
    >
      <ModelCards models={modelPreviews.data} />
    </CardCollection>
  )
}

const LandingHero = () => {
  const history = useHistory()
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
            will find all geometrically similar models. Connect with the Thangs community
            to collaborate and share 3D models.
          </div>
          <div className={c.Landing_SearchByModelUploadButton}>
            <Button
              className={c.Landing_SearchByModelUploadButton_BrandButton}
              onClick={() => history.push('/matching')}
            >
              <MatchingIcon
                className={c.Landing_SearchByModelUploadButton_MatchingIcon}
              />
              <span>Search by Model Upload</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export const Landing = () => {
  const { user } = useCurrentUser()

  if (!user) {
    return (
      <Layout Hero={LandingHero}>
        <Page />
      </Layout>
    )
  }

  return (
    <Layout>
      <Page />
    </Layout>
  )
}
