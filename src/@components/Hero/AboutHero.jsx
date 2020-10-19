import React from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { Button, Spacer, TitlePrimary, MultiLineBodyText, LabelText } from '@components'
import { useTranslations } from '@hooks'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    AboutHero: {
      maxWidth: '48.5rem',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      textAlign: 'center',

      '& > h1, & > span': {
        color: theme.colors.white[400],
      },

      '& > h1': {
        lineHeight: '5.25rem',
      },
    },
    AboutHero_ButtonWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    AboutHero_SignUpButton: {
      color: theme.colors.gold[500],
    },
    AboutHero_Link: {
      display: 'flex',
      justifyContent: 'center',

      '& a': {
        color: theme.colors.gold[500],
      },
    },
  }
})

const AboutHero = ({ user }) => {
  const c = useStyles({})
  const t = useTranslations({})
  const { dispatch } = useStoreon()

  const handleSignUp = () => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'signUp',
      overlayData: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        source: 'Header',
      },
    })
  }

  const handleSignIn = () => {
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'signIn',
      overlayData: {
        animateIn: true,
        windowed: true,
        showPromo: false,
      },
    })
  }

  return (
    <div>
      <Spacer size={'4rem'} />
      <div className={c.AboutHero}>
        <TitlePrimary>{t('aboutUs.title')}</TitlePrimary>
        <Spacer size={'1rem'} />
        <MultiLineBodyText>{t('aboutUs.body')}</MultiLineBodyText>
        <Spacer size={'2rem'} />
        {R.isEmpty(user) ? (
          <div className={c.AboutHero_ButtonWrapper}>
            <Button tertiary className={c.AboutHero_SignUpButton} onClick={handleSignUp}>
              {t('aboutUs.signUpButtonText')}
            </Button>
            <Button className={c.UserNav_Button} onClick={handleSignIn}>
              {t('aboutUs.signInButtonText')}
            </Button>
          </div>
        ) : (
          <div className={c.AboutHero_Link}>
            <Link to={'/'}>
              <LabelText>Start finding Thangs</LabelText>
            </Link>
          </div>
        )}
      </div>
      <Spacer size={'2.5rem'} />
    </div>
  )
}

export default AboutHero
