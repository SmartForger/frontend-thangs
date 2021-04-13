import React from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel, Label } from '@physna/voxel-ui/@atoms/Typography'

import { Button, MultiLineBodyText, Spacer } from '@components'
import { useOverlay, useTranslations } from '@hooks'

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

  return (
    <div>
      <Spacer size={'4rem'} />
      <div className={c.AboutHero}>
        <Title headerLevel={HeaderLevel.primary}>{t('aboutUs.title')}</Title>
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
              <Label>Start finding Thangs</Label>
            </Link>
          </div>
        )}
      </div>
      <Spacer size={'2.5rem'} />
    </div>
  )
}

export default AboutHero
