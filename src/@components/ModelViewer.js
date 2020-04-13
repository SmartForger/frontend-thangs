import React, { useState } from 'react';
import styled from 'styled-components';
import { useTrail } from 'react-spring';

import { Button, TagsBox, Viewer, ColorPicker, Likes } from '@components';
import { ColorPickerNew } from '@components/ColorPicker';

const Info = styled.div`
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    width: 12vw;
    height: 13vw;
    background: white;
    z-index: 1;
    top: 32px;
    right: 32px;
    box-shadow: inset 0 0 0 3px black;

    > div {
        margin-left: 1vw;
    }
`;

const InfoNew = styled(Info)`
    box-shadow: none;
    background: none;
    width: 100px;
`;

const ViewerContainer = styled.div`
    box-shadow: inset 0 0 0 5px black;
    pointer-events: none;
    grid-area: viewer;
    position: relative;
    display: flex;

    > div {
        pointer-events: all;
    }
`;

const ViewerContainerNew = styled(ViewerContainer)`
    height: 100%;
    box-shadow: none;
    border-radius: 8px;
    overflow: hidden;

    > div {
        pointer-events: all;
    }

    ${props => props.theme.shadow};
`;

const Interactions = styled.div`
    position: absolute;
    display: flex;
    z-index: 1;
    width: 12vw;
    height: 7vw;
    bottom: 32px;
    right: 32px;
    background: white;
    box-shadow: inset 0 0 0 3px black;
`;

const DisplayOptions = styled.div`
    position: absolute;
    bottom: 32px;
    left: 32px;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    z-index: 1;

    > div {
        margin-right: 15px;
    }
`;

const DisplayOptionsNew = styled.div`
    position: absolute;
    bottom: 16px;
    left: 64px;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    z-index: 1;

    > div {
        margin-right: 15px;
    }
`;

const DisplayButton = styled(Button)`
    max-width: 100%;
    width: auto;
`;

const DisplayButtonNew = styled.button`
    max-width: 100%;
    width: auto;
    border: none;
    padding: 4px;
    border-radius: 4px;
`;

const MenuStyled = styled.div`
    display: flex;
    flex-flow: column nowrap;
    grid-area: sidebar;
    padding: 0 5%;
    justify-content: space-between;
    align-items: center;
`;

const MenuButton = styled(Button)`
    margin: 0 0 8px;
    height: 100%;
    max-width: 100%;
`;

const MenuButtonGroup = styled.div`
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
`;

const Menu = ({ tags, model, user }) => {
    const names = ['Download', 'Share', 'Match', 'Identify'];
    const config = { mass: 5, tension: 2000, friction: 200 };
    const trail = useTrail(names.length, {
        config,
        to: { opacity: 1, transform: 'translate(0,0)' },
        from: { opacity: -2, transform: 'translate(300%,0)' },
    });

    return (
        <MenuStyled>
            <MenuButtonGroup>
                {trail.map((props, index) => {
                    return (
                        <MenuButton
                            key={names[index]}
                            name={names[index]}
                            style={props}
                            fontSize="1.5rem"
                        />
                    );
                })}
            </MenuButtonGroup>
            <Tags items={tags} />
            <Likes model={model} user={user} />
        </MenuStyled>
    );
};

const Tags = styled(TagsBox)`
    height: 50%;
`;

const ModelViewer = ({ model, user }) => {
    const [mode, setMode] = useState('shaded');
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
        <>
            <ViewerContainer>
                <Info>
                    <DisplayButton
                        onClick={() => {
                            changeMode('shaded');
                        }}
                        name="Shaded"
                    />
                    <DisplayButton
                        onClick={() => {
                            changeMode('wireframe');
                        }}
                        name="wireframe"
                    />
                    <DisplayButton
                        onClick={() => {
                            changeMode('composite');
                        }}
                        name="Composite"
                    />
                </Info>
                <Interactions />
                <DisplayOptions>
                    <ColorPicker color={meshColor} onChange={changeMeshColor} />
                    <ColorPicker color={wireColor} onChange={changeWireColor} />
                </DisplayOptions>
                <Viewer
                    url={model.url}
                    mode={mode}
                    meshColor={meshColor}
                    wireFrameColor={wireColor}
                />
            </ViewerContainer>
            <Menu tags={model.tags} model={model} user={user} />
        </>
    );
};

function NewModelViewer({ model, className }) {
    const [mode, setMode] = useState('shaded');
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
        <ViewerContainerNew className={className}>
            <InfoNew>
                <DisplayButtonNew
                    onClick={() => {
                        changeMode('shaded');
                    }}
                >
                    Shaded
                </DisplayButtonNew>
                <DisplayButtonNew
                    onClick={() => {
                        changeMode('wireframe');
                    }}
                >
                    Wireframe
                </DisplayButtonNew>
                <DisplayButtonNew
                    onClick={() => {
                        changeMode('composite');
                    }}
                >
                    Composite
                </DisplayButtonNew>
            </InfoNew>
            <DisplayOptionsNew>
                <ColorPickerNew color={meshColor} onChange={changeMeshColor} />
                <ColorPickerNew color={wireColor} onChange={changeWireColor} />
            </DisplayOptionsNew>
            <Viewer
                url={model.attachment && model.attachment.dataSrc}
                mode={mode}
                meshColor={meshColor}
                wireFrameColor={wireColor}
                boxShadow="none"
            />
        </ViewerContainerNew>
    );
}

export { ModelViewer, NewModelViewer };
