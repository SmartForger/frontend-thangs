import * as pendo from '@vendors/pendo'
import amplitude from 'amplitude-js'
import { logger } from '@utilities/logging'

export const initialize = () => {
  const amplitudeKey = process.env.REACT_APP_AMPLITUDE_ID
  if (amplitudeKey === undefined) {
    logger.warn('Missing Amplitude API key')
  }
  amplitude.getInstance().init(amplitudeKey)
  pendo.initialize()
}

export const identify = ({ user, inviteCode }) => {
  pendo.identify(user, { inviteCode })
  const userId = user.id.padStart(5, '0')
  amplitude.getInstance().setUserId(userId)
  amplitude.getInstance().setUserProperties({ inviteCode })
}

export const track = (type, data) => {
  pendo.track(type, data)
  amplitude.getInstance().logEvent(type, data)
}

export const pageview = (page, id) => {
  amplitude.getInstance().logEvent('pageview', { page, id })
}

export const overlayview = overlay => {
  amplitude.getInstance().logEvent('overlayview', { overlay })
}
