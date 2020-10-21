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
  amplitude.getInstance().setUserId(user.id)
  amplitude.getInstance().setUserProperties({ inviteCode })
}

export const track = (type, data) => {
  pendo.track(type, data)
  amplitude.getInstance().logEvent(type, data)
}
