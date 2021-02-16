import amplitude from 'amplitude-js'

// This does not include profile and model because
// those are now both vanity-urls and need to be
// detected by the process of elimination. See locationChange() - BE
const pages = [
  '404',
  'about-us',
  'authenticate',
  'explore',
  'home',
  'login',
  'mythangs',
  'password_reset_confirm',
  'privacy-policy',
  'privacy_policy',
  'search',
  'terms-and-conditions',
  'terms_and_conditions',
  'upload',
  'welcome',
]

const redirects = ['model', 'profile', 'm', 'u']

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
  // These paths are redirects and we want to avoid duplicate analytics calls. - BE
  if (redirects.includes(shortPath)) return
  const idPath = fullPath.split('/')[2] || undefined
  if (pages.includes(shortPath)) {
    amplitude.getInstance().logEvent('pagechange', { page: shortPath, fullPath, idPath })
  } else {
    if (idPath) {
      amplitude.getInstance().logEvent('pagechange', { page: 'model', fullPath, idPath })
    } else {
      amplitude.getInstance().logEvent('pagechange', { page: 'profile', fullPath })
    }
  }
}

export const overlayview = overlay => {
  amplitude.getInstance().logEvent('overlayview', { overlay })
}

export const updateUserExperiments = experiments => {
  amplitude.getInstance().setUserProperties({ experiments })
}
