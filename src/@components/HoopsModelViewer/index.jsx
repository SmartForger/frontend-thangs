/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';
import { Toolbar } from './Toolbar';

// TODO: Set these to reasonable values for live site
const MODEL_PREP_TIMEOUT = 5000;
const MODEL_PREP_ENDPOINT_URI = 'http://localhost:8080/api/prepare-model';
const HOOPS_WS_ENDPOINT_URI = 'ws://localhost:8081/';

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

    const modelFilename = model.uploadedFile;
    useEffect(() => {
        if (viewerInitStatus !== ViewerInitStates.LoadingScript) {
            return;
        }

        let isActiveEffect = true;
        const prepCancelSource = axios.CancelToken.source();

        ensureScriptIsLoaded('vendors/hoops_web_viewer.js')
            .then(async () => {
                const resp = await axios.get(
                    `${MODEL_PREP_ENDPOINT_URI}/${modelFilename}`,
                    {
                        cancelToken: prepCancelSource.token,
                    }
                );

                if (!resp.data.ok) {
                    throw new Error('Model preparation failed.');
                }

                if (isActiveEffect) {
                    setViewerInitStatus(ViewerInitStates.LoadingModel);
                }
            })
            .catch(err => {
                console.error('Failure initializing Viewer:', err);
                if (isActiveEffect) {
                    setViewerInitStatus(ViewerInitStates.Error);
                }
            });

        const timeoutId = setTimeout(() => {
            prepCancelSource.cancel('Model preparation exceeded timeout.');
        }, MODEL_PREP_TIMEOUT);

        return () => {
            isActiveEffect = false;
            clearTimeout(timeoutId);
            prepCancelSource.cancel(
                'Model preparation canceled by user. (Effect cleanup)'
            );
        };
    }, [viewerInitStatus, modelFilename]);

    useEffect(() => {
        return () => {
            if (webViewer.current) {
                webViewer.current.shutdown();
            }
        };
    }, [modelFilename]);

    useEffect(() => {
        if (viewerInitStatus !== ViewerInitStates.LoadingModel) {
            return;
        }

        const viewer = new Communicator.WebViewer({
            container: viewerContainer.current,
            endpointUri: HOOPS_WS_ENDPOINT_URI,
            model: `${modelFilename}.scz`,
            rendererType: Communicator.RendererType.Client,
        });

        viewer.setCallbacks({
            sceneReady() {
                // passing "null" sets the background to transparent
                viewer.view.setBackgroundColor(null, null);
                setViewerInitStatus(ViewerInitStates.ModelLoaded);
            },
            modelLoadFailure(name, reason, e) {
                console.error('HOOPS failed loading the model:', e);
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
    }, [viewerInitStatus, modelFilename]);

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
