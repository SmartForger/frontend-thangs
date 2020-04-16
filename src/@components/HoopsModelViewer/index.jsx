/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';

const HOOPS_WS_ENDPOINT_URI = 'ws://localhost:11182/';

const Container = styled.div`
    border-radius: 5px;
    ${props => props.theme.shadow};
`;

const ToolbarContainer = styled.div`
    background-color: #ffffff;
    box-shadow: none;
    border-radius: 0 0 5px 5px;
    border-top: 1px solid #eeeeee;
    padding: 8px;
`;

const WebViewContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    background-color: #ffffff;
    border-radius: 5px 5px 0 0;

    > div {
        pointer-events: all;
    }
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
            endpointUri: HOOPS_WS_ENDPOINT_URI,
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
        <Container>
            <WebViewContainer className={className}>
                <LoadingIndicator loading={loadingScene} />
                <div ref={viewerContainer} />
            </WebViewContainer>
            <ToolbarContainer>Toolbar</ToolbarContainer>
        </Container>
    );
}

export { HoopsModelViewer as ModelViewer };
