import React, { useState } from 'react';
import styled from 'styled-components';

import { Viewer } from '@components/Viewer';
import { ColorPicker } from '@components/ColorPicker';

const Info = styled.div`
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    height: 13vw;
    width: 100px;
    z-index: 1;
    top: 32px;
    right: 32px;

    > div {
        margin-left: 1vw;
    }
`;

const ViewerContainer = styled.div`
    pointer-events: none;
    grid-area: viewer;
    position: relative;
    height: 100%;
    display: flex;
    border-radius: 8px;

    > div {
        pointer-events: all;
    }

    ${props => props.theme.shadow};
`;

const DisplayOptions = styled.div`
    bottom: 32px;
    left: 64px;
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    z-index: 1;

    > div {
        margin-right: 15px;
    }
`;

const DisplayButton = styled.button`
    max-width: 100%;
    width: auto;
    border: none;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
`;

function ModelViewerDisplay({ model, className }) {
    const [mode, setMode] = useState('wireframe');
    const [meshColor, setMeshColor] = useState('#FFFFFF');
    const [wireColor, setWireColor] = useState('#000000');

    const changeMode = targetMode => {
        setMode(targetMode);
    };

    const changeMeshColor = (color, event) => {
        setMeshColor(color.hex);
    };

    const changeWireColor = (color, event) => {
        setWireColor(color.hex);
    };

    return (
        <ViewerContainer className={className}>
            <Info>
                <DisplayButton
                    onClick={() => {
                        changeMode('shaded');
                    }}
                >
                    Shaded
                </DisplayButton>
                <DisplayButton
                    onClick={() => {
                        changeMode('wireframe');
                    }}
                >
                    Wireframe
                </DisplayButton>
                <DisplayButton
                    onClick={() => {
                        changeMode('composite');
                    }}
                >
                    Composite
                </DisplayButton>
            </Info>
            <DisplayOptions>
                <ColorPicker color={meshColor} onChange={changeMeshColor} />
                <ColorPicker color={wireColor} onChange={changeWireColor} />
            </DisplayOptions>
            <Viewer
                url={model.attachment && model.attachment.dataSrc}
                mode={mode}
                meshColor={meshColor}
                wireFrameColor={wireColor}
                boxShadow="none"
            />
        </ViewerContainer>
    );
}

function ModelViewer({ model, className }) {
    return <ModelViewerDisplay model={model} className={className} />;
}

export { ModelViewer };
