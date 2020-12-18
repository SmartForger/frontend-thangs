import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useFeature } from '@optimizely/react-sdk'
import { authenticationService } from '@services'
import { initialize, identify, updateUserExperiments } from '@utilities/analytics'
import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'
import { usePageMeta, useQuery } from '@hooks'

const AppAnalytics = () => {
  const location = useLocation()
  const inviteCode = useQuery('inviteCode')
  const userIdentified = useRef(false)
  const analyticsInitialized = useRef(false)
  const { title, description } = usePageMeta('App')
  const user = authenticationService.getCurrentUser()
  // eslint-disable-next-line no-unused-vars
  const [isEnabled, variables] = useFeature('sortbydefault', { autoUpdate: true })

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID)
    if (!analyticsInitialized.current) {
      initialize()
      analyticsInitialized.current = true
    }
    if (user && !userIdentified.current) {
      identify({ user, inviteCode, experiments: { sortByVariation: variables.key } })
      userIdentified.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    updateUserExperiments({ sortByVariation: variables.key })
  }, [variables.key])

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
    ReactPixel.pageView()
  }, [location])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  )
}

export default AppAnalytics
