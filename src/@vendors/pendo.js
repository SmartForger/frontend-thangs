import { logger } from '@utilities/logging'

const apiKey = process.env.REACT_APP_PENDO_API_KEY
if (apiKey === undefined) {
  logger.warn('Missing Pendo API key')
}

const shouldTrack = () => apiKey !== undefined

const initialize = () => {
  if (shouldTrack()) {
    (function(p, e, n, d, o) {
      var v, w, x, y, z
      o = p[d] = p[d] || {}
      o._q = []
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad']
      for (w = 0, x = v.length; w < x; ++w)
        (function(m) {
          o[m] =
            o[m] ||
            function() {
              o._q[m === v[0] ? 'unshift' : 'push'](
                [m].concat([].slice.call(arguments, 0))
              )
            }
        })(v[w])
      y = e.createElement(n)
      y.async = !0
      y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js'
      z = e.getElementsByTagName(n)[0]
      z.parentNode.insertBefore(y, z)
    })(window, document, 'script', 'pendo')

    window.pendo.initialize({
      visitor: {
        id: 'VISITOR-UNIQUE-ID',
      },
    })
  }
}

const identify = (user, options = {}) => {
  if (!shouldTrack()) {
    return
  }

  const userDetails = user
    ? {
      visitor: {
        id: user.id,
        name: user.username,
        email: user.email,
        inviteCode: options.inviteCode || undefined,
      },
      // Accounts are a separate concept in Pendo's system, which group many
      // users. Currently we don't have a concept for this, so we can just
      // reuse user details.
      account: {
        id: user.id,
        name: user.username,
        inviteCode: options.inviteCode || undefined,
      },
    }
    : {}
  window.pendo.identify(userDetails)
}

const track = (type, data) => {
  if (shouldTrack()) {
    const { pendo } = window

    if (pendo && pendo.isReady && pendo.isReady()) {
      return pendo.track(type, data)
    }

    setTimeout(() => {
      track(type, data)
    }, 500)
  }
}

export { initialize, identify, track }
