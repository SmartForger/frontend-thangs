/* global Communicator */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ensureScriptIsLoaded } from './ensureScriptIsLoaded';
import { Spinner } from '@components/Spinner';
import { AnchorButton } from '@components/AnchorButton';

import { ReactComponent as WireMode } from '@svg/view-mode-wire.svg';
import { ReactComponent as ShadedMode } from '@svg/view-mode-shaded.svg';
import { ReactComponent as XRayMode } from '@svg/view-mode-xray.svg';
import { ReactComponent as EdgesColor } from '@svg/view-color-edges.svg';
import { ReactComponent as ShadeColor } from '@svg/view-color-shade.svg';

const HOOPS_WS_ENDPOINT_URI = 'ws://localhost:11182/';

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
    const webViewer = useRef();
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

        // TODO: handle window resize

        viewer.start();
        webViewer.current = viewer;

        return () => {
            viewer.shutdown();
        };
    }, [viewerInitialized]);

    const handleResetView = () => {
        if (webViewer.current) {
            webViewer.current.view.setViewOrientation(
                Communicator.ViewOrientation.Iso,
                400
            );
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
                <LoadingIndicator loading={loadingScene} />
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

const ToolbarContainer = styled.div`
    background-color: #ffffff;
    box-shadow: none;
    border-radius: 0 0 5px 5px;
    border-top: 1px solid #eeeeee;
    padding: 24px;

    display: flex;
    justify-content: space-between;

    color: rgb(152, 152, 152);
    font-size: 12px;
    font-weight: 500;
`;

const ToolGroup = styled.div`
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
`;

const ToolGroupTitle = styled.div`
    text-transform: uppercase;
    margin: 0;
    padding: 0;
`;

const ToolButton = styled.button`
    margin-left: 16px;
    padding: 0;
    border: none;
    background: none;
    text-decoration: none;
    cursor: pointer;
`;

const ResetButton = styled(AnchorButton)`
    font-weight: 500;
    font-size: 14px;
`;

function Toolbar({ onResetView, onDrawModeChange, onColorChange }) {
    const makeDrawModeHandler = modeName => () => {
        onDrawModeChange(modeName);
    };

    const makeColorHandler = (modeName, color) => () => {
        onColorChange(modeName, color);
    };

    return (
        <ToolbarContainer>
            <ToolGroup>
                <ToolGroupTitle>Model View</ToolGroupTitle>
                <ToolButton onClick={makeDrawModeHandler('shaded')}>
                    <ShadedMode />
                </ToolButton>
                <ToolButton onClick={makeDrawModeHandler('wire')}>
                    <WireMode />
                </ToolButton>
                <ToolButton onClick={makeDrawModeHandler('xray')}>
                    <XRayMode />
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolGroupTitle>Change Color</ToolGroupTitle>
                <ToolButton onClick={makeColorHandler('edges', 'red')}>
                    <EdgesColor />
                </ToolButton>
                <ToolButton onClick={makeColorHandler('shade', 'blue')}>
                    <ShadeColor />
                </ToolButton>
            </ToolGroup>
            <ResetButton onClick={onResetView}>Reset Image</ResetButton>
        </ToolbarContainer>
    );
}
