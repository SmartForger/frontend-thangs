import React from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { createUseStyles } from '@style'
import { Button, MultiLineBodyText, LabelText, Spacer, TitlePrimary } from '@components'
import { useOverlay, useTranslations } from '@hooks'
import { Title, HeaderLevel } from '@physna/voxel-ui'

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
  const { setOverlay } = useOverlay()

  const handleSignUp = () => {
    setOverlay({
      isOpen: true,
      template: 'signUp',
      data: {
        animateIn: true,
        windowed: true,
        showPromo: false,
        smallWidth: true,
        source: 'Header',
      },
    })
  }

  const handleSignIn = () => {
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
  debugger
  return (
    <div>
      <Spacer size={'4rem'} />
      <div className={c.AboutHero}>
        <Title headerLevel={'h1'}>{t('aboutUs.title')}</Title>
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
