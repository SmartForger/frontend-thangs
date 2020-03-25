import React from 'react';
import { initializeAnonymous } from '@vendors/pendo';

const shouldTrack = () => true;

// This doesn't seem to be a secret because it is included in all the request
// urls.
const apiKey = '47d674c1-ab92-4edf-5c76-eb419cc0be5e';

const Pendo = () => {
    if (shouldTrack()) {
        initializeAnonymous(apiKey);
    }
    return null;
};

export { Pendo };
