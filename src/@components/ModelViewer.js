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

const HowToTextStyled = styled.div`
    max-width: 474px;
    color: ${props => props.theme.viewerText};
    margin-bottom: 72px;
`;

function HowToText() {
    return (
        <HowToTextStyled>
            Model can be viewed as Wireframe, Shaded or Composite and changed
            via the icons in the viewer. Wireframe color and shading color can
            be changed using the paint icons in the viewer. Model can be zoomed
            in and out and rotated 360 degrees.
        </HowToTextStyled>
    );
}

const HowToContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const HowToTitleStyled = styled.h4`
    font-size: 24px;
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.viewerTitle};
    margin-bottom: 24px;
`;

function HowToTitle() {
    return <HowToTitleStyled>How to Use:</HowToTitleStyled>;
}

function HowTo({ className }) {
    return (
        <ViewerContainer className={className}>
            <HowToContainer>
                <HowToTitle />
                <HowToText />
            </HowToContainer>
        </ViewerContainer>
    );
}

function ModelViewer({ model, className }) {
    const showHowTo = true;
    return showHowTo ? (
        <HowTo className={className} />
    ) : (
        <ModelViewerDisplay model={model} className={className} />
    );
}

export { ModelViewer };
