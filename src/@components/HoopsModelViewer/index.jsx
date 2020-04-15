/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    background-color: #ffffff;
    box-shadow: none;
    border-radius: 8px;

    > div {
        pointer-events: all;
    }

    ${props => props.theme.shadow};
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
`;

const LoadingIndicator = ({ loading }) => {
    if (!loading) {
        return null;
    }
    return (
        <LoadingContainer>
            <Spinner />
            <p>Loading preview...</p>
        </LoadingContainer>
    );
};

function HoopsModelViewer({ className, model }) {
    const viewerContainer = useRef();
    const [viewerInitialized, setViewerInitialized] = useState(false);
    const [loadingScene, setLoadingScene] = useState(true);

    useEffect(() => {
        if (viewerInitialized) {
            return;
        }

        let isActive = true;
        ensureScriptIsLoaded('vendors/hoops_web_viewer.js').then(() => {
            if (isActive) {
                setViewerInitialized(true);
            }
        });
        return () => (isActive = false);
    }, [viewerInitialized]);

    useEffect(() => {
        if (!viewerInitialized || !viewerContainer.current) {
            return;
        }

        const viewer = new Communicator.WebViewer({
            container: viewerContainer.current,
            endpointUri: 'ws://localhost:11182/',
            model: 'microengine',
            rendererType: Communicator.RendererType.Client,
        });

        viewer.setCallbacks({
            sceneReady() {
                // passing "null" sets the background to transparent
                viewer.view.setBackgroundColor(null, null);
                setLoadingScene(false);
            },
        });

        viewer.start();

        return () => {
            viewer.shutdown();
        };
    }, [viewerInitialized]);

    return (
        <Container className={className}>
            <LoadingIndicator loading={loadingScene} />
            <div ref={viewerContainer} />
        </Container>
    );
}

export { HoopsModelViewer as ModelViewer };
