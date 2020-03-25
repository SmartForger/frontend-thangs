import { authenticationService } from '@services';

const apiKey = process.env.REACT_APP_PENDO_API_KEY;

const shouldTrack = () => true;

const initialize = history => {
    if (shouldTrack()) {
        (function(p, e, n, d, o) {
            var v, w, x, y, z;
            o = p[d] = p[d] || {};
            o._q = [];
            v = ['initialize', 'identify', 'updateOptions', 'pageLoad'];
            for (w = 0, x = v.length; w < x; ++w)
                (function(m) {
                    o[m] =
                        o[m] ||
                        function() {
                            o._q[m === v[0] ? 'unshift' : 'push'](
                                [m].concat([].slice.call(arguments, 0)),
                            );
                        };
                })(v[w]);
            y = e.createElement(n);
            y.async = !0;
            y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
            z = e.getElementsByTagName(n)[0];
            z.parentNode.insertBefore(y, z);
        })(window, document, 'script', 'pendo');

        identify();

        window.pendo.initialize({
            events: {
                ready() {
                    trackPageview(history.location);
                },
            },
        });

        history.listen(trackPageview);
    }
};

const identify = () => {
    if (!shouldTrack()) {
        return;
    }

    const user = authenticationService.currentUserValue;
    const userDetails = user
        ? {
              visitor: {
                  id: user.id,
                  name: user.username,
                  email: user.email,
              },
              // Accounts are a separate concept in Pendo's system, which group many
              // users. Currently we don't have a concept for this, so we can just
              // reuse user details.
              account: {
                  id: user.id,
                  name: user.username,
              },
          }
        : {};
    window.pendo.identify(userDetails);
};

const track = (type, data) => {
    if (shouldTrack()) {
        window.pendo.track(type, data);
    }
};

const trackPageview = location => {
    const pageName = location.pathname;
    const query = location.search;
    track('Viewed page', { pageName, query });
};

export { initialize, identify, track };
