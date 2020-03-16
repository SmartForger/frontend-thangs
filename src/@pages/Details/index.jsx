import React, { useState } from 'react';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import { Button, TagsBox, Viewer, ColorPicker } from '@components';
import { WithFullScreenLayout } from '@style';

const DisplayButton = styled(Button)`
    max-width: 100%;
    width: auto;
`;

const StyledDetails = styled.div`
    display: grid;
    height: 100%;
    position: relative;
    grid-template-columns: 85% 15%;
    grid-template-rows: 10% 75% 15%;
    grid-template-areas:
        'header  header'
        'viewer  sidebar'
        'footer  footer';
`;
const StyledInfo = styled.div`
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    width: 12vw;
    height: 13vw;
    background: white;
    z-index: 1;
    top: 13%;
    right: 16.5%;
    box-shadow: inset 0 0 0 3px black;

    > div {
        margin-left: 1vw;
    }
`;

const StyledInteractions = styled.div`
    position: absolute;
    display: flex;
    width: 12vw;
    height: 7vw;
    bottom: 17%;
    right: 16%;
    background: white;
    box-shadow: inset 0 0 0 3px black;
`;

const StyledHeader = styled.div`
    grid-area: header;
    display: flex;
    align-items: center;
    padding: 0 0 0 8%;

    > h1,
    h3 {
        margin: 0 30px;
    }
`;

const Vl = styled.div`
    height: 85%;
    border-left: 2px solid ${props => props.theme.black};
`;

const StyledViewer = styled.div`
    display: flex;
    box-shadow: inset 0 0 0 5px black;
    grid-area: viewer;
    pointer-events: none;

    > div {
        pointer-events: all;
    }
`;

const StyledMenu = styled.div`
    display: flex;
    flex-flow: column nowrap;
    grid-area: sidebar;
    padding: 5%;
    justify-content: flex-start;
    align-items: center;
`;

const StyledTags = styled.div`
    background: green;
    width: 90%;
    height: 50%;
    margin-top: 5%;
`;

const StyledDisplayOptions = styled.div`
    position: absolute;
    bottom: 17%;
    left: 1%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;

    > div {
        margin-right: 15px;
    }
`;

const Page = () => {
    const [mode, setMode] = useState('shaded');
    const [meshColor, setMeshColor] = useState('#FFFFFF');
    const [wireColor, setWireColor] = useState('#000000');

    const tags = [
        { name: 'Yormy' },
        { name: 'Grimgooorsh' },
        { name: 'AB' },
        { name: 'Longish' },
        { name: 'Real long Tag' },
        { name: 'Screw' },
        { name: 'Bolt' },
        { name: 'Automotive' },
        { name: 'Clasp' },
        { name: 'Physna' },
        { name: 'Thangs.com' },
        { name: 'Boat' },
        { name: 'Trucks' },
        { name: 'Civil Engineering' },
        { name: '3D Printing' },
        { name: 'Yormy' },
    ];

    const names = ['Download', 'Share', 'Match', 'Identify'];

    const changeMode = targetMode => {
        setMode(targetMode);
    };

    const changeMeshColor = (color, event) => {
        setMeshColor(color.hex);
    };

    const changeWireColor = (color, event) => {
        setWireColor(color.hex);
    };

    const config = { mass: 5, tension: 2000, friction: 200 };
    const trail = useTrail(names.length, {
        config,
        to: { opacity: 1, transform: 'translate(0,0)' },
        from: { opacity: -2, transform: 'translate(300%,0)' },
    });

    return (
        <StyledDetails>
            <StyledHeader>
                <h1>Model Name</h1>
                <Vl />
                <h3>Uploaded by</h3>
            </StyledHeader>
            <StyledViewer>
                <StyledInfo>
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
                    {/* <div>Material: <strong>MAT</strong></div>
          <div>Height: <strong>MAT</strong></div>
          <div>Length: <strong>MAT</strong></div>
          <div>Width: <strong>MAT</strong></div>
          <div>Weight: <strong>MAT</strong></div>
          <div>ANSI Compliant: <strong>MAT</strong></div> */}
                </StyledInfo>
                <StyledInteractions />
                <StyledDisplayOptions>
                    <ColorPicker color={meshColor} onChange={changeMeshColor} />
                    <ColorPicker color={wireColor} onChange={changeWireColor} />
                </StyledDisplayOptions>
                <Viewer
                    url="http://127.0.0.1:8000/model"
                    mode={mode}
                    style={{ 'grid-area': 'viewer' }}
                    meshColor={meshColor}
                    wireFrameColor={wireColor}
                />
            </StyledViewer>
            <StyledMenu>
                {trail.map((props, index) => {
                    return (
                        <Button
                            key={names[index]}
                            name={names[index]}
                            style={props}
                            maxwidth="90%"
                            height="10%"
                            fontSize="1.5rem"
                        />
                    );
                })}
                <StyledTags>
                    <TagsBox width="100%" height="100%" data={tags} />
                </StyledTags>
            </StyledMenu>
        </StyledDetails>
    );
};

const Details = WithFullScreenLayout(Page);

export { Details };
