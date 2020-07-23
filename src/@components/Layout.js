import React from 'react'
import { Header } from '@components/Header'
import { ReactComponent as BackgroundSvg } from '@svg/landing-background.svg'
import { landingPageText, landingPageSubtext } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    Layout: {
      margin: 'auto',
      maxWidth: theme.variables.maxWidth,
      paddingTop: '7.5rem',
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
      height: '47.25rem',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
    },
    Layout_PromotionalText: {
      fontFamily: theme.variables.fonts.headerFont,

      '*': {
        ...landingPageText,
      },
    },
    Layout_TextContainer: {
      margin: 'auto 1rem',
      [md]: {
        margin: 'auto 6.25rem',
      },
      maxWidth: theme.variables.maxWidth,
      width: '100%',
    },
    Layout_PromotionalSecondaryText: {
      ...landingPageSubtext,
      maxWidth: '34.5rem',
      marginTop: '1.5rem',
    },
    Layout_Background: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  }
})

export const NewThemeLayout = ({ children, options = {} }) => {
  const c = useStyles()
  const { logoOnly } = options
  const headerVariant = logoOnly && 'logo-only'
  const layoutVariant = logoOnly && 'small-vertical-spacing'

  return (
    <React.Fragment>
      <Header variant={headerVariant} />
      <div className={c.Layout} variant={layoutVariant}>
        {children}
      </div>
    </React.Fragment>
  )
}

export const NewInvertedHeaderLayout = ({ children }) => {
  const c = useStyles()
  return (
    <React.Fragment>
      <Header inverted />
      <div>
        <BackgroundSvg />
        <div className={c.Layout_TextContainer}>
          <div className={c.Layout_PromotionalText}>
            <span>
              <u>Build</u> Thangs.
            </span>
          </div>
          <div className={c.PromotionalSecondaryText}>
            3D model community for designers, engineers and enthusiasts
          </div>
        </div>
      </div>
      <div className={c.Layout} variant='small-vertical-spacing'>
        {children}
      </div>
    </React.Fragment>
  )
}

export const NewSignupThemeLayout = ({ children }) => {
  const c = useStyles()
  return (
    <React.Fragment>
      <Header variant='logo-only' />
      <div className={c.Layout} variant='small-vertical-spacing'>
        {children}
      </div>
    </React.Fragment>
  )
}
