import React, { useState, useRef } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body, Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'
import { LandingCarousel, LandingSearchBar, Spacer } from '@components'
import { useOverlay } from '@contexts/Overlay'
import { numberWithCommas } from '@utilities'

const useStyles = createUseStyles(theme => {
  return {
    Header_Landing: {
      color: theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'spaceAround',
      transition: 'all 400ms',
      opacity: '1',
    },
    Header_LandingTitle: {
      color: theme.colors.white[400],
      transition: 'all 400ms',
    },
    Header_LandingBody: {
      color: theme.colors.white[400],
      textAlign: 'center',
      transition: 'all 400ms',
      opacity: '1',
      display: 'inline-block !important',
      maxWidth: '35rem',

      '& span': {
        color: theme.colors.gold[500],
      },
    },
    Header_Carousel: {
      transition: 'all 400ms',
      opacity: '1',
    },
    Header_AboutThangs: {
      display: 'flex',
      justifyContent: 'center',

      '& a': {
        color: theme.colors.gold[500],
      },
    },
    Fade: {
      opacity: '1',
    },
  }
})

const LandingHero = ({ showSearchTextFlash, user }) => {
  const { modelsStats } = useStoreon('modelsStats')
  const { setOverlay } = useOverlay()
  const [searchMinimized, setMinimizeSearch] = useState(false)
  const c = useStyles({ searchMinimized })
  const searchBarRef = useRef(null)

  const modelsIngested =
    modelsStats &&
    modelsStats.data &&
    modelsStats.data.modelsIngested &&
    numberWithCommas(modelsStats.data.modelsIngested)

  return (
    <>
      <div className={c.Header_Landing}>
        <Spacer size={'1rem'} />
        <Title
          headerLevel={HeaderLevel.primary}
          light
          className={classnames(c.Header_LandingTitle, {
            [c.Fade]: searchMinimized,
          })}
        >
          Let&apos;s find Thangs.
        </Title>
        <Spacer size={'1rem'} />
        <Body
          multiline
          light
          className={classnames(c.Header_LandingBody, {
            [c.Fade]: searchMinimized,
          })}
        >
          Thangs is the fastest growing 3d community with over{' '}
          {modelsIngested || '1,000,000'} available models to search, store, and
          collaborate. <Link to={'/about-us'}>Learn more</Link>
        </Body>
        <Spacer size={'2rem'} />
        <LandingSearchBar
          showSearchTextFlash={showSearchTextFlash}
          searchMinimized={searchMinimized}
          setMinimizeSearch={setMinimizeSearch}
          searchBarRef={searchBarRef}
        />
        <Spacer size={'2.5rem'} />
      </div>
      <LandingCarousel
        className={classnames(c.Header_Carousel, {
          [c.Fade]: searchMinimized,
        })}
        setOverlay={setOverlay}
        user={user}
        searchBarRef={searchBarRef}
      />
      <Spacer size={'.5rem'} />
    </>
  )
}

export default LandingHero
