import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Header } from '@components'
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg'
import { ReactComponent as MatchingIcon } from '../@svg/matching-icon.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Layout: {
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '2.5rem',
      paddingRight: '1rem',
      paddingBottom: '2rem',
      paddingLeft: '1rem',

      [md]: {
        paddingRight: '6.25rem',
        paddingLeft: '6.25rem',
      },
    },
    Layout_Hero: {
      background: theme.variables.colors.invertedHeaderBackground,
      height: '36rem',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
    },
    Layout_HeaderBackground: {
      background: theme.variables.colors.invertedHeaderBackground,
      height: '5rem',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
      overflow: 'hidden',
    },
    Layout_TextContainer: {
      margin: 'auto 1rem',
      [md]: {
        margin: 'auto 6.25rem',
      },
      maxWidth: theme.variables.maxWidth,
      width: '100%',
    },
    Layout_PromotionalText: {
      fontFamily: theme.variables.fonts.headerFont,
    },
    Layout_PromotionalPrimaryText: {
      ...theme.mixins.text.landingPageText,
    },
    Layout_PromotionalSecondaryText: {
      ...theme.mixins.text.landingPageSubtext,
      maxWidth: '42rem',
      minWidth: '27.125rem',
      marginTop: '1.5rem',
    },
    Layout_Background: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    Layout_SearchByModelUploadButton: { marginTop: '1.5rem' },
    Layout_SearchByModelUploadButton_MatchingIcon: { marginRight: '.5rem' },
    Layout_Spacer: { height: '6.25rem' },
  }
})

export const NewThemeLayout = ({ children, options = {} }) => {
  const c = useStyles()
  const { logoOnly } = options
  const headerVariant = logoOnly && 'logo-only'
  const layoutVariant = logoOnly && 'small-vertical-spacing'

  return (
    <>
      <Header variant={headerVariant} />
      <div className={c.Layout_HeaderBackground}>
        <BackgroundSvg className={c.Layout_Background} />
      </div>
      <div className={c.Layout} variant={layoutVariant}>
        {children}
      </div>
    </>
  )
}

export const NewInvertedHeaderLayout = ({ children }) => {
  const c = useStyles()
  const history = useHistory()
  return (
    <>
      <Header inverted />
      <div className={c.Layout_Hero}>
        <BackgroundSvg className={c.Layout_Background} />
        <div className={c.Layout_TextContainer}>
          <div className={c.Layout_PromotionalText}>
            <span className={c.Layout_PromotionalPrimaryText}>
              <u className={c.Layout_PromotionalPrimaryText}>Search.</u> Collaborate.
              Share.
            </span>
          </div>
          <div className={c.Layout_PromotionalSecondaryText}>
            Search for models in Thangs or upload your model and our powerful technology
            will find all geometrically similar models. Connect with the Thangs community
            to collaborate and share 3D models.
          </div>
          <div className={c.Layout_SearchByModelUploadButton}>
            <Button
              className={c.Layout_SearchByModelUploadButton_BrandButton}
              onClick={() => history.push('/matching')}
            >
              <MatchingIcon className={c.Layout_SearchByModelUploadButton_MatchingIcon} />
              <span>Search by Model Upload</span>
            </Button>
          </div>
        </div>
      </div>
      <div className={c.Layout} variant='small-vertical-spacing'>
        {children}
      </div>
    </>
  )
}

export const NewSignupThemeLayout = ({ children }) => {
  const c = useStyles()
  return (
    <>
      <Header />
      <div className={c.Layout_HeaderBackground}>
        <BackgroundSvg className={c.Layout_Background} />
      </div>
      <div className={c.Layout} variant='small-vertical-spacing'>
        {children}
      </div>
    </>
  )
}
