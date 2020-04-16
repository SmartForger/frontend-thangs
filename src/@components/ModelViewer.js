import React, { useState } from 'react';
import styled from 'styled-components';

import { Viewer } from '@components/Viewer';
import { ColorPicker } from '@components/ColorPicker';
import { useLocalStorage } from '@customHooks/Storage';
import { ReactComponent as ColorIcon1 } from '@svg/icon-color-1.svg';
import { ReactComponent as ColorIcon2 } from '@svg/icon-color-2.svg';
import { ReactComponent as ShadedIcon } from '@svg/icon-shaded.svg';
import { ReactComponent as CompositeIcon } from '@svg/icon-composite.svg';
import { ReactComponent as WireframeIcon } from '@svg/icon-wireframe.svg';
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg';

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
    const [mode, setMode] = useState('wireframe');
    const [meshColor, setMeshColor] = useState('#014d7c');
    const [wireColor, setWireColor] = useState('#ffbc00');

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

const IconSpacing = styled.div`
    margin-left: 48px;
`;

const IconContainer = styled.div`
    display: flex;

    svg + svg {
        margin-left: 24px;
    }
`;

function HowToIcons() {
    return (
        <IconContainer>
            <div>
                <ShadedIcon />
                <WireframeIcon />
                <CompositeIcon />
            </div>

            <IconSpacing>
                <ColorIcon1 />
                <ColorIcon2 />
            </IconSpacing>
        </IconContainer>
    );
}

const ExitIconStyled = styled.div`
    cursor: pointer;
    position: absolute;
    right: 32px;
    top: 32px;

    svg {
        fill: ${props => props.theme.viewerExitColor};
        stroke: ${props => props.theme.viewerExitColor};
    }
`;

function HowTo({ className, setSeenHowTo }) {
    const handleClick = () => setSeenHowTo(true);
    return (
        <ViewerContainer className={className}>
            <ExitIconStyled onClick={handleClick}>
                <ExitIcon />
            </ExitIconStyled>
            <HowToContainer>
                <HowToTitle />
                <HowToText />
                <HowToIcons />
            </HowToContainer>
        </ViewerContainer>
    );
}

function ModelViewer({ model, className }) {
    const [seenHowTo, setSeenHowTo] = useLocalStorage('seenHowTo', false);

    return seenHowTo ? (
        <ModelViewerDisplay model={model} className={className} />
    ) : (
        <HowTo className={className} setSeenHowTo={setSeenHowTo} />
    );
}

export { ModelViewer };
