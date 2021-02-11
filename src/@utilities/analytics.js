import amplitude from 'amplitude-js'

export const initialize = () => {
  const amplitudeKey = process.env.REACT_APP_AMPLITUDE_ID
  amplitude.getInstance().init(amplitudeKey)
}

export const identify = ({ user, inviteCode, experiments }) => {
  const userId = user.id.padStart(5, '0')
  amplitude.getInstance().setUserId(userId)
  amplitude.getInstance().setUserProperties({ inviteCode, experiments })
}

export const track = (type, data) => {
  amplitude.getInstance().logEvent(type, data)
}

export const perfTrack = (type, seconds) => {
  if (seconds > 0) amplitude.getInstance().logEvent(type, { seconds })
}

export const pageview = (page, id) => {
  amplitude.getInstance().logEvent('pageview', { page, id })
}

export const locationChange = () => {
  const fullPath = window.location.pathname
  const shortPath = fullPath.split('/')[1] || 'home'
  amplitude.getInstance().logEvent('pagechange', { page: shortPath, fullPath })
}

export const overlayview = overlay => {
  amplitude.getInstance().logEvent('overlayview', { overlay })
}

export const updateUserExperiments = experiments => {
  amplitude.getInstance().setUserProperties({ experiments })
}
