import React, { useState } from 'react';
import styled from 'styled-components';

import { Viewer } from '@components/Viewer';
import { ColorPicker } from '@components/ColorPicker';
import { useLocalStorage } from '@customHooks/Storage';
import { HowTo } from '@components/HowTo';
import { ReactComponent as ColorIcon1 } from '@svg/icon-color-1.svg';
import { ReactComponent as ColorIcon2 } from '@svg/icon-color-2.svg';
import { ReactComponent as ShadedIcon } from '@svg/icon-shaded.svg';
import { ReactComponent as CompositeIcon } from '@svg/icon-composite.svg';
import { ReactComponent as WireframeIcon } from '@svg/icon-wireframe.svg';

const ViewerContainer = styled.div`
    pointer-events: none;
    grid-area: viewer;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 8px;

    > div {
        pointer-events: all;
    }

    ${props => props.theme.shadow};
`;

const DisplayButton = styled.div`
    cursor: pointer;
`;

const ControlBar = styled.div`
    width: 100%;
    height: 80px;
    background-color: ${props => props.theme.cardBackground};
    border-radius: 0 0 8px 8px;
    border-top: 1px ${props => props.theme.viewerControlBorderColor} solid;
    display: flex;
    padding: 24px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
`;

const ControlText = styled.div`
    margin-right: 16px;
    font-weight: 500;
    font-size: 12px;
    color: ${props => props.theme.viewerControlText};
`;

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;

    > div + div {
        margin-left: 16px;
    }
`;

const Placeholder = styled.div`
    height: 18px;
    width: 88px;
    margin-left: 152px;
`;

function ModelViewerDisplay({ model, className }) {
    const [mode, setMode] = useState('composite');
    const [meshColor, setMeshColor] = useState('#ffbc00');
    const [wireColor, setWireColor] = useState('#014d7c');

    const changeMode = targetMode => {
        setMode(targetMode);
    };

    const changeMeshColor = (color, event) => {
        setMeshColor(color);
    };

    const changeWireColor = (color, event) => {
        setWireColor(color);
    };

    return (
        <ViewerContainer className={className}>
            <Viewer
                url={model.attachment && model.attachment.dataSrc}
                mode={mode}
                meshColor={meshColor}
                wireFrameColor={wireColor}
                boxShadow="none"
            />

            <ControlBar>
                <ButtonGroup>
                    <ControlText>MODEL VIEW</ControlText>
                    <DisplayButton
                        onClick={() => {
                            changeMode('shaded');
                        }}
                    >
                        <ShadedIcon />
                    </DisplayButton>
                    <DisplayButton
                        onClick={() => {
                            changeMode('wireframe');
                        }}
                    >
                        <WireframeIcon />
                    </DisplayButton>
                    <DisplayButton
                        onClick={() => {
                            changeMode('composite');
                        }}
                    >
                        <CompositeIcon />
                    </DisplayButton>
                </ButtonGroup>
                <ButtonGroup>
                    <ControlText>CHANGE COLOR</ControlText>
                    <ColorPicker color={meshColor} onChange={changeMeshColor}>
                        <ColorIcon1 />
                    </ColorPicker>
                    <ColorPicker color={wireColor} onChange={changeWireColor}>
                        <ColorIcon2 />
                    </ColorPicker>
                </ButtonGroup>
                <Placeholder />
            </ControlBar>
        </ViewerContainer>
    );
}

function ModelViewer({ model, className }) {
    const [seenHowTo, setSeenHowTo] = useLocalStorage('seenHowTo', false);

    return seenHowTo ? (
        <ModelViewerDisplay model={model} className={className} />
    ) : (
        <ViewerContainer className={className}>
            <HowTo setSeenHowTo={setSeenHowTo} />
        </ViewerContainer>
    );
}

export { ModelViewer };
