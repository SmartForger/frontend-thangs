import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import {
  LandingCarousel,
  Spacer,
  TitlePrimary,
  MultiLineBodyText,
  LabelText,
  LandingSearchBar,
} from '@components'

const useStyles = createUseStyles(theme => {
  return {
    Header_Landing: {
      color: theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'spaceAround',
      transition: 'all 400ms',
      opacity: 1,
    },
    Header_LandingTitle: {
      color: theme.colors.white[400],
      transition: 'all 400ms',
    },
    Header_LandingBody: {
      color: theme.colors.white[400],
      textAlign: 'center',
      transition: 'all 400ms',
      opacity: 1,
      display: 'inline-block !important',
      maxWidth: '35rem',

      '& span': {
        color: theme.colors.gold[500],
      },
    },
    Header_Carousel: {
      transition: 'all 400ms',
      opacity: 1,
    },
    Header_AboutThangs: {
      display: 'flex',
      justifyContent: 'center',

      '& a': {
        color: theme.colors.gold[500],
      },
    },
    Fade: {
      opacity: 0,
    },
  }
})

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const LandingHero = ({ showSearchTextFlash, user }) => {
  const { dispatch, modelsStats } = useStoreon('modelsStats')
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
        <TitlePrimary
          light
          className={classnames(c.Header_LandingTitle, {
            [c.Fade]: searchMinimized,
          })}
        >
          Let&apos;s find Thangs.
        </TitlePrimary>
        <Spacer size={'1rem'} />
        <MultiLineBodyText
          light
          className={classnames(c.Header_LandingBody, {
            [c.Fade]: searchMinimized,
          })}
        >
          Thangs is the fastest growing 3d community with over{' '}
          {modelsIngested || '1,000,000'} available models to search, store, and
          collaborate.
        </MultiLineBodyText>
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
        dispatch={dispatch}
        user={user}
        searchBarRef={searchBarRef}
      />
      <Spacer size={'1rem'} />
      <div className={c.Header_AboutThangs}>
        <Link to={'/about-us'}>
          <LabelText>More About Thang</LabelText>
        </Link>
      </div>
      <Spacer size={'.5rem'} />
    </>
  )
}

export default LandingHero
