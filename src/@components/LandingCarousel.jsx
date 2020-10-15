import React, { useMemo } from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { Carousel } from '@components'

import { ReactComponent as PromoGeoSearch } from '@svg/promo-geosearch.svg'
import { ReactComponent as PromoStorage } from '@svg/promo-storage.svg'
import { ReactComponent as PromoCollab } from '@svg/promo-collab.svg'

import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(_theme => {
  return {
    LandingCarousel: {},
  }
})

const LandingCarousel = ({ searchMinimized, searchBarRef, dispatch, user }) => {
  const c = useStyles({})
  const PromoCards = useMemo(
    () => [
      {
        IconComponent: PromoGeoSearch,
        title: 'Geometric Search',
        linkText: 'Use your model',
        text: 'to find geometrically related models.',
        hoverVideo:
          'https://storage.googleapis.com/thangs-pubic/instructionGeometricSearch.mp4',
        callback: () => {
          searchBarRef.current.focus()
          track('Value Prop Clicked', {
            source: 'Geometric Search',
            isRegistered: !!user,
          })
        },
      },
      {
        IconComponent: PromoStorage,
        title: 'Unlimited Storage',
        linkText: 'Upload',
        text: 'as many models as your heart desires.',
        hoverVideo: 'https://storage.googleapis.com/thangs-pubic/instructionStorage.mp4',
        callback: () => {
          if (user && user.id) {
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'multiUpload',
              overlayData: {
                animateIn: true,
                windowed: true,
                dialogue: true,
              },
            })
            track('Value Prop Clicked', { source: 'Unlimited Storage' })
          } else {
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'signUp',
              overlayData: {
                animateIn: true,
                windowed: true,
                source: 'Unlimited Storage',
              },
            })
            track('SignUp Prompt Overlay', { source: 'Unlimited Storage' })
          }
        },
      },
      {
        IconComponent: PromoCollab,
        title: 'Collaboration',
        linkText: 'Invite',
        text: 'your friends and work together on projects.',
        hoverVideo: 'https://storage.googleapis.com/thangs-pubic/instructionCollab.mp4',
        callback: () => {
          if (user && user.id) {
            dispatch(types.OPEN_OVERLAY, { overlayName: 'createFolder' })
            track('Value Prop Clicked', { source: 'Collaboration' })
          } else {
            dispatch(types.OPEN_OVERLAY, {
              overlayName: 'signUp',
              overlayData: {
                animateIn: true,
                windowed: true,
                source: 'Collaboration',
              },
            })
            track('SignUp Prompt Overlay', { source: 'Collaboration' })
          }
        },
      },
    ],
    [dispatch, searchBarRef, user]
  )
  return (
    <Carousel
      cards={PromoCards}
      className={classnames(c.Header_Carousel, {
        [c.Fade]: searchMinimized,
      })}
    />
  )
}

export default LandingCarousel
