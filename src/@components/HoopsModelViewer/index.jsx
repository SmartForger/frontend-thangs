/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';
import { Toolbar } from './Toolbar';
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg';

const MODEL_PREP_TIMEOUT = 15000;
const MODEL_PREP_ENDPOINT_URI =
    process.env.REACT_APP_HOOPS_MODEL_PREP_ENDPOINT_URI;
const HOOPS_WS_ENDPOINT_URI = process.env.REACT_APP_HOOPS_WS_ENDPOINT_URI;

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
    padding-top: 128px;
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

const debug = message => {
    if (process.env.REACT_APP_DEBUG) {
        console.debug(message);
    }
};

function HoopsModelViewer({ className, model }) {
    const viewerContainer = useRef();
    const webViewer = useRef();
    const [meshColor, setMeshColor] = useState();
    const [wireColor, setWireColor] = useState();

    const [viewerInitStatus, setViewerInitStatus] = useState(
        ViewerInitStates.LoadingScript
    );

    const modelFilename = model.uploadedFile;
    useEffect(() => {
        debug('1. Initialize Effect');
        if (viewerInitStatus !== ViewerInitStates.LoadingScript) {
            debug('  * 1: Bailed');
            return;
        }

        let isActiveEffect = true;
        const prepCancelSource = axios.CancelToken.source();

        debug('  * 1: Loading Script');
        ensureScriptIsLoaded('vendors/hoops_web_viewer.js')
            .then(async () => {
                debug('  * 1: Preparing Model');
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
                    debug('  * 1: Done Prepping Model');
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
            debug('  * 1: Cleanup. Cancel Prep request.');
            isActiveEffect = false;
            clearTimeout(timeoutId);
            prepCancelSource.cancel(
                'Model preparation canceled by user. (Effect cleanup)'
            );
        };
    }, [viewerInitStatus, modelFilename]);

    useEffect(() => {
        debug('2. HWV Shutdown registering');
        return () => {
            if (webViewer.current) {
                debug('  ** 2: Cleanup!  HWV Shutdown! **');
                try {
                    webViewer.current.shutdown();
                } catch (e) {
                    console.error('HWV failed to shutdown:', e);
                } finally {
                    webViewer.current = null;
                }
                setViewerInitStatus(ViewerInitStates.LoadingScript);
            }
        };
    }, [modelFilename]);

    useEffect(() => {
        debug('3. HWV Creation');
        if (viewerInitStatus !== ViewerInitStates.LoadingModel) {
            debug('  * 3: Bailed');
            return;
        }

        debug('  * 3: Create HWV');
        const viewer = new Communicator.WebViewer({
            container: viewerContainer.current,
            endpointUri: HOOPS_WS_ENDPOINT_URI,
            model: `${modelFilename}.scz`,
            rendererType: Communicator.RendererType.Client,
        });

        viewer.setCallbacks({
            sceneReady() {
                // passing "null" sets the background to transparent
                debug('  * 3: HWV Model Load');
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
            debug('  * 3: Cleanup! remove resizer');
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

    const handleColorChange = (modeName, colorStr) => {
        if (!webViewer.current) {
            return;
        }
        const hColor = new Communicator.Color(
            ...colorStr
                .substring(1)
                .match(/.{1,2}/g)
                .map(tuple => parseInt(tuple, 16))
        );
        const model = webViewer.current.model;

        const gatherLeafNodeIds = nodes => {
            return nodes.flatMap(node => {
                const kids = model.getNodeChildren(node);
                if (kids.length === 0) {
                    return node;
                }
                return gatherLeafNodeIds(kids);
            });
        };

        const nodeIds = gatherLeafNodeIds(
            model.getNodeChildren(model.getAbsoluteRootNode())
        );

        try {
            if (modeName === 'wire') {
                model.setNodesLineColor(nodeIds, hColor);
                setWireColor(colorStr);
            } else if (modeName === 'mesh') {
                model.setNodesFaceColor(nodeIds, hColor);
                setMeshColor(colorStr);
            } else {
                console.error('Unsupported color mode:', modeName);
            }
        } catch (e) {
            console.error('Caught HOOPS error setting color:', e);
        }
    };

    return (
        <Container>
            <WebViewContainer className={className}>
                <StatusIndicator status={viewerInitStatus} />
                <div ref={viewerContainer} />
            </WebViewContainer>
            {viewerInitStatus === ViewerInitStates.ModelLoaded && (
                <Toolbar
                    onResetView={handleResetView}
                    onDrawModeChange={handleDrawModeChange}
                    onColorChange={handleColorChange}
                    meshColor={meshColor}
                    wireColor={wireColor}
                />
            )}
        </Container>
    );
}

export { HoopsModelViewer as ModelViewer };

const PlaceholderText = styled.div`
    font-weight: 500;
    font-size: 16px;
    margin-top: 24px;
`;

const StatusIndicator = ({ status }) => {
    if (status === ViewerInitStates.ModelLoaded) {
        return null;
    }
    return (
        <LoadingContainer>
            {isLoadingState(status) ? (
                <>
                    <Spinner />
                    <PlaceholderText>Loading preview...</PlaceholderText>
                </>
            ) : (
                status === ViewerInitStates.Error && (
                    <>
                        <ErrorIcon />
                        <PlaceholderText>Error Loading Preview</PlaceholderText>
                    </>
                )
            )}
        </LoadingContainer>
    );
};
