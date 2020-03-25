const apiKey = '47d674c1-ab92-4edf-5c76-eb419cc0be5e';

const shouldTrack = () => true;

const initializeAnonymous = history => {
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

export { initializeAnonymous };
