import React, { useState, useEffect, useRef } from 'react';
import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';

export function ModelViewer({ className }) {
    const [viewerInitialized, setViewerInitialized] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const viewerContainer = useRef();

    useEffect(() => {
        async function initViewer() {
            setViewerInitialized(true);
            await ensureScriptIsLoaded('vendors/hoops_web_viewer.js');
            setScriptLoaded(true);

            const inputParams = {
                container: viewerContainer.current,
                empty: true,
            };
            // eslint-disable-next-line no-undef
            const viewer = new Communicator.WebViewer(inputParams);
            viewer.start();
        }
        if (!viewerInitialized) {
            initViewer();
        }
    }, [viewerInitialized]);
    return <div className={className} ref={viewerContainer}></div>;
}
