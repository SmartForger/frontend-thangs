/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';
import { Toolbar } from './Toolbar';

const HOOPS_WS_ENDPOINT_URI = 'ws://localhost:8080/';
const MODEL_PREP_ENDPOINT_URI = 'http://localhost:8080/api/prepare-model';

const Container = styled.div`
    border-radius: 5px;
    ${props => props.theme.shadow};
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

const ViewerInitStates = {
    LoadingScript: 'loading-script',
    Error: 'error',
    LoadingModel: 'loading-model',
    ModelLoaded: 'model-loaded',
};

const isLoadingState = status =>
    status === ViewerInitStates.LoadingScript ||
    status === ViewerInitStates.LoadingModel;

const StatusIndicator = ({ status }) => {
    if (status === ViewerInitStates.ModelLoaded) {
        return null;
    }
    return (
        <LoadingContainer>
            {isLoadingState(status) && (
                <>
                    <Spinner />
                    <p>Loading preview...</p>
                </>
            )}
            {status === ViewerInitStates.Error && (
                <div>Failed to load preview.</div>
            )}
        </LoadingContainer>
    );
};

function HoopsModelViewer({ className, model }) {
    const viewerContainer = useRef();
    const webViewer = useRef();
    const [viewerInitStatus, setViewerInitStatus] = useState(
        ViewerInitStates.LoadingScript
    );

    useEffect(() => {
        if (viewerInitStatus !== ViewerInitStates.LoadingScript) {
            return;
        }

        let isActive = true;
        ensureScriptIsLoaded('vendors/hoops_web_viewer.js')
            .then(() => {
                // TODO: replace this with the model-prepare API call below.
                if (isActive) {
                    setViewerInitStatus(ViewerInitStates.LoadingModel);
                }
                // return fetch(
                //     `${MODEL_PREP_ENDPOINT_URI}/${model.uploadedFile}`
                // )
                //     .then(response => response.json())
                //     .then(({ ok, step }) => {
                //         if (!ok || step !== 6) {
                //             throw new Error('Model preparation failed.');
                //         }

                //         if (isActive) {
                //             setViewerInitStatus(ViewerInitStates.LoadingModel);
                //         }
                //     });
            })
            .catch(() => {
                if (isActive) {
                    setViewerInitStatus(ViewerInitStates.Error);
                }
            });
        return () => (isActive = false);
    }, [viewerInitStatus]);

    useEffect(() => () => webViewer?.current?.shutdown?.(), []);

    useEffect(() => {
        if (viewerInitStatus !== ViewerInitStates.LoadingModel) {
            return;
        }

        const viewer = new Communicator.WebViewer({
            container: viewerContainer.current,
            endpointUri: HOOPS_WS_ENDPOINT_URI,
            model: `${model.uploadedFile}.scz`,
            rendererType: Communicator.RendererType.Client,
        });

        viewer.setCallbacks({
            sceneReady() {
                // passing "null" sets the background to transparent
                viewer.view.setBackgroundColor(null, null);
                setViewerInitStatus(ViewerInitStates.ModelLoaded);
            },
            modelLoadFailure(name, reason, e) {
                setViewerInitStatus(ViewerInitStates.Error);
            },
        });

        viewer.start();

        const handleResize = () => {
            viewer.resizeCanvas();
        };
        window.addEventListener('resize', handleResize);

        webViewer.current = viewer;
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [viewerInitStatus]);

    const handleResetView = () => {
        if (webViewer.current) {
            webViewer.current.reset();
        }
    };

    const handleDrawModeChange = modeName => {
        if (webViewer.current) {
            switch (modeName) {
                case 'shaded':
                    webViewer.current.view.setDrawMode(
                        Communicator.DrawMode.WireframeOnShaded
                    );
                    break;
                case 'wire':
                    webViewer.current.view.setDrawMode(
                        Communicator.DrawMode.Wireframe
                    );
                    break;
                case 'xray':
                    webViewer.current.view.setDrawMode(
                        Communicator.DrawMode.XRay
                    );
                    break;
                default:
                    console.error('Unsupported draw mode!', modeName);
            }
        }
    };

    const handleColorChange = (modeName, color) => {
        console.log('EVENT: change color: ', modeName, ' ', color);
        // TODO: implement these
    };

    return (
        <Container>
            <WebViewContainer className={className}>
                <StatusIndicator status={viewerInitStatus} />
                <div ref={viewerContainer} />
            </WebViewContainer>
            <Toolbar
                onResetView={handleResetView}
                onDrawModeChange={handleDrawModeChange}
                onColorChange={handleColorChange}
            />
        </Container>
    );
}

export { HoopsModelViewer as ModelViewer };
