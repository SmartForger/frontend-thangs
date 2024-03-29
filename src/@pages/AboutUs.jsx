import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { Helmet } from 'react-helmet'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import { Layout, Spacer } from '@components'
import { usePageMeta, useTranslations } from '@hooks'
import { pageview } from '@utilities/analytics'

import { ReactComponent as SearchAboutUsIcon } from '@svg/aboutUs-search.svg'
import { ReactComponent as StorageAboutUsIcon } from '@svg/aboutUs-storage.svg'
import { ReactComponent as CollaborationAboutUsIcon } from '@svg/aboutUs-collaboration.svg'
import { ReactComponent as BackgroundLeft } from '@svg/aboutUs-leftSide-tinkers.svg'
import { ReactComponent as BackgroundRight } from '@svg/aboutUs-rightSide-tinkers.svg'
import loader from '@media/loader.gif'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    AboutUs: {
      display: 'flex',
      flexDirection: 'column',
    },
    AboutUs_BackgroundLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    AboutUs_BackgroundRight: {
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'none',
      [md]: {
        display: 'block',
      },
    },
    AboutUs_ValueProp: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',

      [md]: {
        flexDirection: 'row',
      },
    },
    AboutUs_ValueProp__flipped: {
      flexDirection: 'column',

      [md]: {
        flexDirection: 'row-reverse',
      },

      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      },

      '& span': {
        textAlign: 'right',
      },
    },
    AboutUs_ValuePropText: {
      width: '100%',
      [md]: {
        width: '40%',
      },
    },
    AboutUs_Video: {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.16)',
      borderRadius: '1rem',
      width: '100%',
      [md]: {
        width: '26.25rem',
      },
    },
    AboutUs_ModelText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      bottom: '5rem',
      width: '100%',
      background: theme.colors.purple[900],
      '& > h1, & > span': {
        color: theme.colors.white[400],
        zIndex: '1',
        textAlign: 'center',
      },
      '& > div': {
        display: 'none',

        [md]: {
          display: 'block',
        },
      },
    },
  }
})
const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const AboutUs = () => {
  const { modelsStats } = useStoreon('modelsStats')
  const c = useStyles({})
  const t = useTranslations({})
  const { title, description } = usePageMeta('aboutUs')

  useEffect(() => {
    pageview('AboutUs')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modelsIngested =
    modelsStats &&
    modelsStats.data &&
    modelsStats.data.modelsIngested &&
    numberWithCommas(modelsStats.data.modelsIngested)

  const valueProps = useMemo(
    () => [
      {
        Icon: SearchAboutUsIcon,
        title: t('aboutUs.valueProps.search.title'),
        body: t('aboutUs.valueProps.search.summary'),
        video:
          'https://storage.googleapis.com/thangs-pubic/instructionGeometricSearch.mp4',
      },
      {
        Icon: StorageAboutUsIcon,
        title: t('aboutUs.valueProps.storage.title'),
        body: t('aboutUs.valueProps.storage.summary'),
        video: 'https://storage.googleapis.com/thangs-pubic/instructionStorage.mp4',
      },
      {
        Icon: CollaborationAboutUsIcon,
        title: t('aboutUs.valueProps.collaboration.title'),
        body: t('aboutUs.valueProps.collaboration.summary'),
        video: 'https://storage.googleapis.com/thangs-pubic/instructionCollab.mp4',
      },
    ],
    [t]
  )

  return (
    <Layout showAboutHero={true}>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Helmet>
      <div className={c.AboutUs}>
        <div>
          <Spacer size={'2rem'} />
          {valueProps.map((valueProp, ind) => {
            const { Icon, title, body, video } = valueProp
            return (
              <div key={`values_${ind}`}>
                <div
                  className={classnames(c.AboutUs_ValueProp, {
                    [c.AboutUs_ValueProp__flipped]: ind % 2 !== 0,
                  })}
                >
                  <div className={c.AboutUs_ValuePropText}>
                    <Icon />
                    <Spacer size='1rem' />
                    <Title headerLevel={HeaderLevel.secondary}>{title}</Title>
                    <Spacer size='1rem' />
                    <Body multiline>{body}</Body>
                  </div>
                  <Spacer size='4rem' />
                  <video
                    className={c.AboutUs_Video}
                    preload='meta'
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={loader}
                  >
                    <source src={video} type='video/mp4' />
                  </video>
                </div>
                <Spacer size='6rem' />
              </div>
            )
          })}
        </div>
        <Spacer size='16rem' />
        <div>
          <div className={c.AboutUs_ModelText}>
            <Spacer size='6rem' />
            <BackgroundLeft className={c.AboutUs_BackgroundLeft} />
            <Title headerLevel={HeaderLevel.primary}>
              {modelsIngested || '1,000,000'} models
            </Title>
            <Spacer size='1rem' />
            <Body multiline>...indexed and ready to be searched. And growing fast.</Body>
            <BackgroundRight className={c.AboutUs_BackgroundRight} />
            <Spacer size='6rem' />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs
