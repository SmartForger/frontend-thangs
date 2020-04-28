import React, { useState } from 'react';
import styled from 'styled-components';

import { Spinner } from '@components/Spinner';
import { Toolbar } from './Toolbar';
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg';
import { viewerLoadingText } from '@style/text';

import { useHoopsViewer } from '@customHooks';

const WebViewContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    background-color: #ffffff;

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

function HoopsModelViewer({ className, model }) {
    const [meshColor, setMeshColor] = useState();
    const [wireColor, setWireColor] = useState();

    const { containerRef, hoops } = useHoopsViewer(model.uploadedFile);

    const handleResetView = () => {
        const [newWireColor, newMeshColor] = hoops.resetImage();
        setWireColor(newWireColor);
        setMeshColor(newMeshColor);
    };

    const handleDrawModeChange = modeName => {
        hoops.changeDrawMode(modeName);
    };

    const handleColorChange = (modeName, colorStr) => {
        hoops.changeColor(modeName, colorStr);
        if (modeName === 'wire') {
            setWireColor(colorStr);
        } else if (modeName === 'mesh') {
            setMeshColor(colorStr);
        }
    };

    return (
        <div>
            <WebViewContainer className={className}>
                <StatusIndicator status={hoops.status} />
                <div ref={containerRef} />
            </WebViewContainer>
            {hoops.status.isReady && (
                <Toolbar
                    onResetView={handleResetView}
                    onDrawModeChange={handleDrawModeChange}
                    onColorChange={handleColorChange}
                    meshColor={meshColor}
                    wireColor={wireColor}
                />
            )}
        </div>
    );
}

export { HoopsModelViewer as ModelViewer };

const PlaceholderText = styled.div`
    ${viewerLoadingText};
    margin-top: 24px;
`;

const StatusIndicator = ({ status }) => {
    if (status.isReady) {
        return null;
    }
    return (
        <LoadingContainer>
            {status.isPending ? (
                <>
                    <Spinner />
                    <PlaceholderText>Loading preview...</PlaceholderText>
                </>
            ) : (
                status.isError && (
                    <>
                        <ErrorIcon />
                        <PlaceholderText>Error Loading Preview</PlaceholderText>
                    </>
                )
            )}
        </LoadingContainer>
    );
};
