import * as pendo from '@vendors/pendo'
import amplitude from 'amplitude-js'

export const initialize = () => {
  amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_ID)
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
